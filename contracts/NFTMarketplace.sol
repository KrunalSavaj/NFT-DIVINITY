// SPDX-License-Identifier: MIT
// Version pragma for the Solidity compiler
pragma solidity ^0.8.20;

// Importing necessary libraries and contracts
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Main contract for the NFT Marketplace, inheriting from ERC721 with URI storage extension
contract NFTMarketplace_New is ERC721URIStorage {
    // Using Counters library for managing counters
    using Counters for Counters.Counter;

    // Counter for tracking the most recent minted tokenId
    Counters.Counter private _tokenIds;

    // Counter for tracking the number of offers made on NFTs
    Counters.Counter private OfferIds;

    // Counter for tracking the number of items sold on the marketplace
    Counters.Counter private _itemsSold;

    // Address of the contract owner
    address payable owner;

    // Fee charged by the marketplace to list an NFT
    uint256 listPrice = 0.01 ether;

    // Structure to store info about an offer on NFTs
    struct OfferInfo {
        uint256 index;
        uint256 nftId;
        address buyer;
        uint256 price;
        bool isAccept;
    }

    // Structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    // Event emitted when a token is successfully listed
    event TokenListed(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    // Mapping from tokenId to token info for easy retrieval
    mapping(uint256 => ListedToken) public idToListedToken;

    // Mapping from OfferIds to offer info for easy retrieval
    mapping(uint256 => OfferInfo) public idToOfferInfo;

    // Constructor initializing the contract with ERC721 details
    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    // Function to allow the contract owner to update the listing price of NFTs on the marketplace
        // Parameters:
        // - _listPrice: The new listing price in ether
    function updateListPrice(uint256 _listPrice) public payable {
        // Ensure that only the owner of the contract can update the listing price
        require(owner == msg.sender, "Only owner can update listing price");

        // Update the listing price to the provided value
        listPrice = _listPrice;
    }


    // Function to get the current listing price
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    // Function to get the details of the latest listed token
    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        // Get the current tokenId (most recently minted) from the counter
        uint256 currentTokenId = _tokenIds.current();

        // Retrieve and return details of the latest listed token using the current tokenId
        return idToListedToken[currentTokenId];
    }

    // Function to get the details of a specific listed token by tokenId
    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    // Function to get the current tokenId
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }


    // Function to create a new NFT and list it on the marketplace
    // Parameters:
    // - tokenURI: IPFS URL containing the metadata of the NFT
    // - price: The listing price of the NFT in ether
    // Returns:
    // - uint: The tokenId of the newly created NFT
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        // Increment the tokenId counter to get a new unique tokenId
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint the new NFT with the generated tokenId to the address calling the function
        _safeMint(msg.sender, newTokenId);

        // Set the metadata URI for the newly created NFT
        _setTokenURI(newTokenId, tokenURI);

        // Create a listing for the newly minted NFT on the marketplace
        createListedToken(newTokenId, price);

        // Return the tokenId of the newly created NFT
        return newTokenId;
    }

    // Function to create a new listed token on the marketplace
        // Parameters:
        // - tokenId: The unique identifier of the NFT being listed
        // - price: The listing price of the NFT in ether
    function createListedToken(uint256 tokenId, uint256 price) private {
        // Ensure that the listing price is greater than zero
        require(price > 0, "Make sure the price isn't negative");

        // Create a new entry in the idToListedToken mapping with details of the listed NFT
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            true
        );

        // Transfer ownership of the NFT from the creator to the marketplace contract
        _transfer(msg.sender, address(this), tokenId);

        // Emit an event indicating that the NFT has been successfully listed on the marketplace
        emit TokenListed(
            tokenId,
            msg.sender,
            address(this),
            price,
            true
        );
    }


    // Function to retrieve details of all NFTs currently listed on the marketplace
        // Returns:
        // - ListedToken[]: An array containing details of all currently listed NFTs
    function getAllNFTs() public view returns (ListedToken[] memory) {
        // Get the total count of minted NFTs from the tokenId counter
        uint nftCount = _tokenIds.current();

        // Create an array to store details of all listed NFTs
        ListedToken[] memory tokens = new ListedToken[](nftCount);

        // Initialize variables for array indexing
        uint currentIndex = 0;
        uint currentId;

        // Iterate through all minted NFTs to retrieve details
        for (uint i = 0; i < nftCount; i++)
        {
            // Calculate the current tokenId
            currentId = i + 1;

            // Retrieve details of the listed NFT using the current tokenId
            ListedToken storage currentItem = idToListedToken[currentId];

            // Store details in the array of listed NFTs
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        // Return the array containing details of all listed NFTs on the marketplace
        return tokens;
    }


    // Function to retrieve details of NFTs owned or listed by the current user
        // Returns:
        // - ListedToken[]: An array containing details of NFTs owned or listed by the current user
    function getMyNFTs() public view returns (ListedToken[] memory) {
        // Get the total count of minted NFTs from the tokenId counter
        uint totalItemCount = _tokenIds.current();

        // Initialize variables for counting and indexing
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;

        // Iterate through all minted NFTs to count those owned or listed by the current user
        for (uint i = 0; i < totalItemCount; i++)
        {
            // Check if the current NFT is owned or listed by the current user
            if (idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // Create an array to store details of relevant NFTs owned or listed by the current user
        ListedToken[] memory items = new ListedToken[](itemCount);

        // Iterate through all minted NFTs again to retrieve details of owned or listed NFTs
        for (uint i = 0; i < totalItemCount; i++)
        {
            // Check if the current NFT is owned or listed by the current user
            if (idToListedToken[i + 1].owner == msg.sender || idToListedToken[i + 1].seller == msg.sender) {
                // Calculate the current tokenId
                currentId = i + 1;

                // Retrieve details of the relevant NFT using the current tokenId
                ListedToken storage currentItem = idToListedToken[currentId];

                // Store details in the array of relevant NFTs
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        // Return the array containing details of NFTs owned or listed by the current user
        return items;
    }


    // Function for a buyer to execute the purchase of an NFT
        // Parameters:
        // - tokenId: The unique identifier of the NFT being purchased
    function executeSale(uint256 tokenId) public payable {
        // Retrieve price and previous owner of the NFT
        uint price = idToListedToken[tokenId].price;
        address preOwner = idToListedToken[tokenId].owner;

        // Data validation
        require(idToListedToken[tokenId].currentlyListed, "This NFT is not for sale");
        require(msg.value >= price, "Please submit the asking price in order to complete the purchase");

        // Transfer ownership of NFT from the marketplace to the buyer
        _transfer(address(this), msg.sender, tokenId);

        // Transfer funds to the previous owner of the NFT
        payable(preOwner).transfer(msg.value);

        // Update NFT listing data after successful sale
        idToListedToken[tokenId] = ListedToken({
            tokenId : tokenId,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });

        // Update Offering data by removing any associated offers for the purchased NFT
        for (uint i; i <= OfferIds.current(); i++)
        {
            if(idToOfferInfo[i].nftId == tokenId) {
                delete idToOfferInfo[i];
            }
        }
    }


    // Function to list a token for sale on the marketplace
        // Parameters:
        // - _tokenId: The unique identifier of the NFT to be listed for sale
        // - _price: The listing price of the NFT in ether
    function ListingToSale(uint _tokenId, uint _price) external payable {
        // Validate that the provided tokenId is within the range of minted NFTs
        require(_tokenId <= _tokenIds.current(), "Please enter a valid tokenId");

        // Validate that the caller is the owner of the NFT with the given tokenId
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this Token");

        // Create a listing for the NFT on the marketplace with the specified price
        createListedToken(_tokenId, _price);
    }


    // Function for a buyer to purchase multiple NFTs from the marketplace
        // Parameters:
        // - _MultitokenIds: An array of unique identifiers of NFTs to be purchased
    function buyMultipleNFTs(uint256[] memory _MultitokenIds) external payable {
        uint256 TotalValue;

        // Iterate through the array of NFT identifiers to calculate the total purchase value
        for (uint i = 0; i < _MultitokenIds.length; i++) {
            // Validate that each NFT is currently listed for sale
            require(idToListedToken[_MultitokenIds[i]].currentlyListed == true, "Please check tokenIds valid or not.");
            TotalValue += idToListedToken[_MultitokenIds[i]].price;
        }

        // Validate that the provided value is sufficient to buy all the NFTs
        require(msg.value >= TotalValue, "Value is not enough to buy NFT.");

        // Iterate through the array of NFT identifiers to execute the purchase for each NFT
        for (uint i = 0; i < _MultitokenIds.length; i++) {
            uint Token = _MultitokenIds[i];

            // Transfer ownership of each NFT from the marketplace to the buyer
            _transfer(address(this), msg.sender, Token);

            // Retrieve price and previous owner of each NFT
            uint price = idToListedToken[Token].price;
            address preOwner = idToListedToken[Token].owner;

            // Transfer funds to the previous owner of each NFT
            payable(preOwner).transfer(price);

            // Update NFT listing data after successful purchase
            idToListedToken[Token] = ListedToken({
                tokenId : Token,
                owner: payable(msg.sender),
                seller: payable(address(0)),
                price: 0,
                currentlyListed: false
            });

            // Remove any associated offers for the purchased NFT
            for (uint j; j <= OfferIds.current(); j++)
            {
                if(idToOfferInfo[j].nftId == Token) {
                    delete idToOfferInfo[j];
                }
            }
        }
    }


    // Function to unlist an NFT from the marketplace, removing it from sale
        // Parameters:
        // - tokenId: The unique identifier of the NFT to be unlisted
    function unlistNFT(uint256 tokenId) external {
        // Retrieve details of the listed NFT using the provided tokenId
        ListedToken memory listToken = idToListedToken[tokenId];

        // Validate that the NFT is currently listed for sale
        require(listToken.currentlyListed, "This NFT is not for sale");

        // Validate that the caller is the owner of the NFT
        require(msg.sender == listToken.owner, "Only the owner can call this function");

        // Transfer ownership of the NFT from the marketplace back to the owner
        _transfer(address(this), msg.sender, tokenId);

        // Update NFT listing data after successful unlisting
        idToListedToken[tokenId] = ListedToken({
            tokenId : tokenId,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });
    }


    // Function to edit the price of a listed NFT on the marketplace
        // Parameters:
        // - tokenId: The unique identifier of the NFT whose price is to be edited
        // - _NewPrice: The new listing price for the NFT in ether
    function EditPrice(uint256 tokenId, uint256 _NewPrice) external {
        // Retrieve details of the listed NFT using the provided tokenId
        ListedToken storage listToken = idToListedToken[tokenId];

        // Validate that the NFT is currently listed for sale
        require(listToken.currentlyListed, "This NFT is not for sale");

        // Validate that the caller is the owner of the NFT
        require(msg.sender == listToken.owner, "Only the owner can call this function");

        // Update the price of the listed NFT to the new specified price
        listToken.price = _NewPrice;
    }

    // Function for the contract owner to withdraw accumulated funds from NFT sales
    function withDraw() external {
        // Validate that the caller is the owner of the marketplace contract
        require(msg.sender == owner, "Only the marketplace owner can call this function.");

        // Transfer the accumulated funds from NFT sales to the owner's address
        payable(owner).transfer(address(this).balance);
    }

    // Function to retrieve information about all active offers on NFTs in the marketplace
      // Returns: An array of OfferInfo structs containing details of active offers
    function AllOffer() external view returns (OfferInfo[] memory){
        uint OffreCount;

        // Count the number of active offers by iterating through OfferIds
        for( uint i = 0; i <= OfferIds.current(); i++ )
        {
            OfferInfo memory Info = idToOfferInfo[i];

            // Check if the offer is associated with an NFT (non-zero nftId)
            if(Info.nftId != 0) {
                OffreCount += 1;
            }
        }

        // Initialize an array to store details of active offers
        OfferInfo[] memory offers = new OfferInfo[](OffreCount);
        uint currentIndex = 0;

        // Iterate through OfferIds again to populate the array with active offer details
        for( uint i = 0; i <= OfferIds.current(); i++ )
        {
            OfferInfo memory offerInfo = idToOfferInfo[i + 1];

            // Check if the offer is associated with an NFT (non-zero nftId)
            if(offerInfo.nftId != 0) {
                // Add the offer details to the array
                offers[currentIndex] = offerInfo;
                currentIndex += 1;
            }
        }

        // Return the array containing information about all active offers
        return offers;
    }


    // Function for a buyer to make an offer on a listed NFT in the marketplace
        // Parameters:
        // - tokenId: The unique identifier of the NFT for which the offer is made
        // - _price: The price at which the buyer is offering to purchase the NFT in ether
    function Makeoffer(uint256 tokenId, uint256 _price) external {
        // Validate that the provided tokenId is within the range of minted NFTs and the offer price is valid
        require(_tokenIds.current() >= tokenId && _price > 0, "Invalid offer data.");

        // Validate that the caller is not the owner of the NFT, as owners cannot make offers on their own NFTs
        require(idToListedToken[tokenId].owner != msg.sender, "NFT owner is not able to offer on their NFT!");

        // Increment OfferIds counter to generate a unique index for the new offer
        OfferIds.increment();

        // Create a new OfferInfo struct with details of the buyer's offer
        idToOfferInfo[OfferIds.current()] = OfferInfo({
            index: OfferIds.current(),
            nftId: tokenId,
            buyer: msg.sender,
            price: _price,
            isAccept: false
        });
    }


    // Function for the NFT owner to accept an offer on a listed NFT
        // Parameters:
        // - _index: The unique index of the offer to be accepted
    function AcceptOffer(uint256 _index) external {
        // Retrieve details of the offer using the provided index
        OfferInfo memory Info = idToOfferInfo[_index];

        // Validate that the caller is the owner of the NFT associated with the offer
        require(idToListedToken[Info.nftId].owner == msg.sender, "Only the owner can accept the offer.");

        // If the NFT is not in the marketplace contract, grant approval to the contract to transfer the NFT
        if (ownerOf(Info.nftId) != address(this)) {
            approve(address(this), Info.nftId);
        }

        // Mark the offer as accepted by updating the 'isAccept' flag
        idToOfferInfo[_index].isAccept = true;
    }


    // Function for the buyer to execute the purchase of an offered NFT in the marketplace
        // Parameters:
        // - _index: The unique index of the accepted offer to be executed
    function executeOfferSale(uint256 _index) external payable  {
        // Retrieve details of the accepted offer using the provided index
        OfferInfo memory Info = idToOfferInfo[_index];

        // Validate that the offer has been accepted
        require(Info.isAccept == true, "Offer is not accepted.");

        // Validate that the caller is the buyer who made the offer
        require(Info.buyer == msg.sender, "This offer is only for the buyer who made the offer.");

        // Validate that the provided funds are equal to or greater than the offer price
        require(msg.value >= Info.price, "Please submit the asking price to complete the purchase");

        // Transfer ownership of the NFT from the marketplace contract to the buyer
        if (ownerOf(Info.nftId) == address(this)) {
            _transfer(address(this), msg.sender, Info.nftId);
        } else {
            _transfer(ownerOf(Info.nftId), msg.sender, Info.nftId);
        }

        // Transfer the submitted funds to the previous owner of the NFT
        payable(idToListedToken[Info.nftId].owner).transfer(msg.value);

        // Update data for the purchased NFT, marking it as no longer listed on the marketplace
        idToListedToken[Info.nftId] = ListedToken({
            tokenId : Info.nftId,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });

        // Remove the accepted offer from the mapping of offer information
        for (uint i; i <= OfferIds.current(); i++)
        {
            if(idToOfferInfo[i].nftId == Info.nftId) {
                delete idToOfferInfo[i];
            }
        }
    }

}
