//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace_New is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;

    Counters.Counter private OfferIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;

   // The structure to store info about a offer on NFTs.
    struct OfferInfo {
        uint256 index;
        uint256 nftId;
        address buyer;
        uint256 price;
        bool isAccept;
    }

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    event TokenCreate(uint256 indexed tokenId, address owner);


    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) public idToListedToken;

     //This mapping maps OfferIds to offer info and is helpful when retrieving details about a offerIds
    mapping(uint256 => OfferInfo) public idToOfferInfo;


    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }
   
     // owner can change listing price use of this function
    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }
    
    // show listPrice
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }
   
    // This function return the NFT data who currently listed
    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    // The function give NFT data of tokenId
    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }
    
    // current Token
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(newTokenId, price);

        emit TokenCreate(newTokenId, msg.sender);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        //Make sure the sender sent enough ETH to pay for listing
        // require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(price > 0, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            msg.sender,
            address(this),
            price,
            true
        );
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        //at the moment currentlyListed is true for all, if it becomes false in the future we will
        //filter out currentlyListed == false over here
        for( uint i = 0; i < nftCount; i++ )
        {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }

    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i = 0; i<totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i = 0 ; i < totalItemCount ; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
    
    // This function use for buying NFT 
    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address preOwner = idToListedToken[tokenId].owner;

        // data validation
        require(idToListedToken[tokenId].currentlyListed, "This NFT is not for sale");
        require(msg.value >= price, "Please submit the asking price in order to complete the purchase");
 
        // Transfer ownership of NFT
        _transfer(address(this), msg.sender, tokenId);

        // Transfer fund to pre owner 
        payable(preOwner).transfer(msg.value);

        // Update List data
        idToListedToken[tokenId] = ListedToken({
            tokenId : tokenId,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });
        
        // Update Offering data
          for (uint i; i <= OfferIds.current(); i++)
        {
            if(idToOfferInfo[i].nftId == tokenId) {
               delete idToOfferInfo[i];
            }
        }
    }
 
     
    function ListingToSale(uint _tokenId, uint _price) external payable {
       require(_tokenId <= _tokenIds.current(), "Please ender valid tokenId");
       require(ownerOf(_tokenId) == msg.sender, "you are not owner of this Token");
         createListedToken(_tokenId, _price);
    }

    function buyMultipleNFTs(uint256[] memory _MultitokenIds) external payable {
        uint256 TotalValue;

        for (uint i = 0; i < _MultitokenIds.length; i++) {
            require(idToListedToken[_MultitokenIds[i]].currentlyListed == true, "Please check tokenIds valid or not.");
            TotalValue += idToListedToken[_MultitokenIds[i]].price;
        }

        require(msg.value >= TotalValue, "value is not enough to buy NFT.");

         for (uint i = 0; i < _MultitokenIds.length; i++) {

            uint Token = _MultitokenIds[i];

             _transfer(address(this), msg.sender, Token);

             uint price = idToListedToken[Token].price;
             address preOwner = idToListedToken[Token].owner;

             payable(preOwner).transfer(price);

            idToListedToken[Token] = ListedToken({
            tokenId : Token,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });

        for (uint j; j <= OfferIds.current(); j++)
        {
            if(idToOfferInfo[j].nftId == Token) {
               delete idToOfferInfo[j];
            }
        }

        }
         
        
    }

    function unlistNFT(uint256 tokenId) external {

        ListedToken memory listToken = idToListedToken[tokenId];

         require(listToken.currentlyListed, "This NFT is not for sale");
         require(msg.sender == listToken.owner, "only owner can call this function");

         _transfer(address(this), msg.sender, tokenId);


        idToListedToken[tokenId] = ListedToken({
            tokenId : tokenId,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });

    }

    function EditPrice(uint256 tokenId, uint256 _NewPrice) external {

         ListedToken storage listToken = idToListedToken[tokenId];

         require(listToken.currentlyListed, "This NFT is not for sale");
         require(msg.sender == listToken.owner, "only owner can call this function");

         listToken.price = _NewPrice;
    }

    function withDraw() external {
        require(msg.sender == owner, "only marketplace owner can call this function.");

        payable(owner).transfer(address(this).balance);
    }

    function AllOffer() external view returns (OfferInfo[] memory){
         uint OffreCount;

         for( uint i = 0; i <= OfferIds.current(); i++ )
        {
             OfferInfo memory Info = idToOfferInfo[i];

             if(Info.nftId != 0) {
               OffreCount += 1;
             }
        }


        OfferInfo[] memory offers = new OfferInfo[](OffreCount);
        uint currentIndex = 0;
    
        for( uint i = 0; i <= OfferIds.current(); i++ )
        {
            // currentId = i + 1;
             OfferInfo memory offerInfo = idToOfferInfo[i + 1];

             if(offerInfo.nftId != 0) {
              offers[currentIndex] = offerInfo;
              currentIndex += 1;
             }

        }
        //the array 'offers' has the list of all NFTs in the marketplace
        return offers;
    }

    function Makeoffer(uint256 tokenId,uint256 _price) external {

        require(_tokenIds.current() >= tokenId && _price > 0, "Invalid offer Data.");
        require(idToListedToken[tokenId].owner != msg.sender, "NFT owner is not able to offer ther NFT !");

        OfferIds.increment();

        idToOfferInfo[OfferIds.current()] = OfferInfo({
            index: OfferIds.current(),
            nftId: tokenId,
            buyer: msg.sender,
            price: _price,
            isAccept: false
        });
    }

    function AcceptOffer(uint256 _index) external {

        OfferInfo memory Info = idToOfferInfo[_index];

        require(idToListedToken[Info.nftId].owner == msg.sender, "only owner can Accept offer.");

         if(ownerOf(Info.nftId) != address(this)) {
            approve(address(this),  Info.nftId);
         }

       idToOfferInfo[_index].isAccept = true;
    }

    function executeOfferSale(uint256 _index) external payable  {

        OfferInfo memory Info = idToOfferInfo[_index];
        require(Info.isAccept == true, "offer is not Accept at.");
        require(Info.buyer == msg.sender, "This offer is only for one buyer who make this offer.");

        require(msg.value >= Info.price, "Please submit the asking price in order to complete the purchase");

        if(ownerOf(Info.nftId) == address(this)) {
             _transfer(address(this), msg.sender, Info.nftId);
        } else {
            _transfer(ownerOf(Info.nftId), msg.sender, Info.nftId);
        }

        payable(idToListedToken[Info.nftId].owner).transfer(msg.value);

        idToListedToken[Info.nftId] = ListedToken({
            tokenId : Info.nftId,
            owner: payable(msg.sender),
            seller: payable(address(0)),
            price: 0,
            currentlyListed: false
        });

        for (uint i; i <= OfferIds.current(); i++)
        {
            if(idToOfferInfo[i].nftId == Info.nftId) {
               delete idToOfferInfo[i];
            }
        }

    }

}
