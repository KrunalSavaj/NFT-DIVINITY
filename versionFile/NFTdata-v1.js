import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract, formatEther, parseUnits } from "ethers";
import axios from "axios";
import {
    useWeb3Modal,
    useWeb3ModalAccount,
    useWeb3ModalProvider,
    useWeb3ModalState,
} from "@web3modal/ethers/react";

import { GetIpfsUrlFromPinata } from "../src/FetchData/utils";
import MarketplaceJSON from "../src/FetchData/Marketplace.json";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../src/FetchData/pinata";
import toast from "react-hot-toast";

const nftContext = createContext();

// const initialState = { name: 'Taylor', age: 42 };

export const NFTdataApi = ({ children }) => {
    // const [state, dispatch] = useReducer(reducer, initialState);

    // Wallet connect hook
    const { isConnected, chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { selectedNetworkId } = useWeb3ModalState();
    const { open, close } = useWeb3Modal();

    const navigate = useNavigate();

    // useState Hook

    // Global Loading
    const [loading, setLoading] = useState(false);
    const [minLoading, setMinLoading] = useState(false);

    // MarketPlace All NFT
    const [AllNft, setAllNft] = useState([]);
    const [oneNFTdata, setOneNFTdata] = useState({});

    // list NFT prosess
    const [fileURL, setFileURL] = useState(null);
    const [formParams, setFormParams] = useState({
        name: "",
        description: "",
        price: "",
    });
    // connected Address All NFT
    const [userNFT, setUserNFT] = useState([]);

    //  Listing logic
    const [listSale, setListSale] = useState(false);
    const [listPrice, setListPrice] = useState("");
    const [wait, setWait] = useState(false);
    const [tokenId, setTokenId] = useState("");

    // Multiple NFT login
    const [selectMulNFT, setselectMulNFT] = useState([]);
    const [sideOpen, setSideOpen] = useState(false);
    const [selectValue, setSelectValue] = useState();

    // Edit LISTINg logic
    const [editPopup, setEditPopup] = useState(false);

    async function MarketPlaceContract() {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();

        const contract = new Contract(
            MarketplaceJSON.address,
            MarketplaceJSON.abi,
            signer
        );

        return contract;
    }

    async function getAllNFTs() {
        try {
            setLoading(true);
            const contract = await MarketPlaceContract();

            // create an NFT Token
            let transaction = await contract.getAllNFTs();
            console.log(transaction);

            //Fetch all the details of every NFT from the contract and display
            const items = await Promise.all(
                transaction.map(async (i) => {
                    let tokenURI = await contract.tokenURI(i.tokenId);

                    tokenURI = GetIpfsUrlFromPinata(tokenURI);
                    let meta = await axios.get(tokenURI);
                    meta = meta.data;

                    let price = formatEther(i.price.toString(), "ether");
                    let item = {
                        price: price,
                        tokenId: i.tokenId,
                        seller: i.seller,
                        owner: i.owner,
                        image: meta.image,
                        name: meta.name,
                        description: meta.description,
                        isForSale: i.currentlyListed,
                    };
                    // console.log(item);
                    return item;
                })
            );

            setAllNft(items);

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function buyNFT(price, _tokenId) {
        try {
            setMinLoading(true);
            const contract = await MarketPlaceContract();

            const salePrice = parseUnits(price.toString(), "ether");

            console.log(tokenId, salePrice, contract);

            //run the executeSale function
            let transaction = await contract.executeSale(_tokenId, {
                value: salePrice,
                gasLimit: 20000000,
            });

            setMinLoading(false);
            setLoading(true);
            await transaction.wait();

            toast.success("You successfully bought the NFT!");
            setLoading(false);

            // const abc = await getAllNFTs();
            // const aaa = await userNFTdata();
            await getAllNFTs();
            await userNFTdata();

            // if (abc && aaa) {
            navigate("/profile");
            // }
        } catch (error) {
            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
                setListPrice("");
                setMinLoading(false);
                setLoading(false);
            } else {
                console.log(error);
                toast.error(`Error message ${error.reason}`);
            }
        }
    }

    async function onChangeFile(e) {
        let file = e.target.files[0];
        setWait(true);

        try {
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                console.log("Uploaded image to pinata:", response.pinataURL);
                setFileURL(response.pinataURL);
                setWait(false);
            }
        } catch (e) {
            console.log("Error during file upload", e);
            toast.error(`Upload Image error ${e.message}`);
            setFormParams({
                name: "",
                description: "",
                price: "",
            });
            setWait(false);
            setMinLoading(false);
        }
    }

    async function uploadMetadataToIPFS() {
        const { name, description, price } = formParams;

        if (!name || !description || !price || !fileURL) return;

        const nftJSON = {
            name,
            description,
            price,
            image: fileURL,
        };

        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Upload JSON to PinataP: ", response);
                return response.pinataURL;
            }
        } catch (e) {
            console.log("error uploading JSON metadata: ", e);
        }
    }

    async function listNFT(e) {
        e.preventDefault();
        setMinLoading(true);

        try {
            const metadataURL = await uploadMetadataToIPFS();

            const contract = await MarketPlaceContract();

            const price = parseUnits(formParams.price, 18);
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            let transaction = await contract.createToken(metadataURL, price, {
                value: listingPrice,
            });
            setMinLoading(false);
            setLoading(true);
            await transaction.wait();

            toast.success("Successfully listed your NFT!");

            setLoading(false);
            setFormParams({ name: "", description: "", price: "" });
            setFileURL(null);
            await userNFTdata();
            await getAllNFTs();

            navigate("/profile");
        } catch (error) {
            setFileURL(null);
            console.log(error);
            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
                setListPrice("");
                setWait(false);
            } else {
                toast.error("Error on Uploading NFT Please try later..");

                userNFTdata();
                getAllNFTs();
                setLoading(false);
                setMinLoading(false);
                navigate("/Profile");
            }
        }
    }

    async function userNFTdata() {
        try {
            setLoading(true);
            const contract = await MarketPlaceContract();
            //create an NFT Token
            let transaction = await contract.getMyNFTs();
            /*
             * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
             * and creates an object of information that is to be displayed
             */

            const items = await Promise.all(
                transaction.map(async (i) => {
                    const tokenURI = await contract.tokenURI(i.tokenId);
                    let meta = await axios.get(tokenURI);
                    meta = meta.data;

                    let price = formatEther(i.price.toString());
                    let item = {
                        price,
                        isForSale: i.currentlyListed,
                        tokenId: i.tokenId,
                        seller: i.seller,
                        owner: i.owner,
                        image: meta.image,
                        name: meta.name,
                        description: meta.description,
                    };
                    return item;
                })
            );

            setUserNFT(items);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function handleListForSale() {
        if (!listPrice) return;

        try {
            setWait(true);

            console.log("token Id", tokenId);

            const contract = await MarketPlaceContract();

            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            const price = parseUnits(listPrice, 18);
            console.log(contract, tokenId, price, listingPrice);

            let transaction = await contract.ListingToSale(tokenId, price, {
                value: listingPrice,
            });
            setMinLoading(false);
            setLoading(true);
            setListSale(false);
            await transaction.wait();

            toast.success("Successfully listed your NFT!");
            setWait(false);
            setLoading(false);
            setListPrice("");
            await userNFTdata();
            await getAllNFTs();

            navigate("/profile");
            //    window.location.reload("/profile");
        } catch (error) {
            console.log(error);
            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
                setListPrice("");
                setWait(false);
            } else {
                toast.success("something went wrong please try later..");
            }
        }
    }

    async function unlistNFT(_tokenId) {
        try {
            setMinLoading(true);

            const contract = await MarketPlaceContract();
            console.log(_tokenId);
            //create an NFT Token
            let transaction = await contract.unlistNFT(_tokenId);

            setLoading(true);
            setEditPopup(false);
            await transaction.wait();
            toast.success("succesfully unlist NFT");

            setTokenId(0);
            await getAllNFTs();
            await userNFTdata();
            setLoading(false);
            setMinLoading(false);

            navigate("/profile");
        } catch (error) {
            console.log(error);
            setLoading(false);
            setMinLoading(false);
            setTokenId(0);
            toast.error("something went wrong");
        }
    }

    async function buyMultipleNFTs() {
        if (selectMulNFT.length == 0) return;

        try {
            setMinLoading(true);
            const contract = await MarketPlaceContract();

            console.log(selectValue);

            let AllId = [];
            selectMulNFT.map((nft) => AllId.push(nft.tokenId));

            // console.log(TotalValue);

            const salePrice = parseUnits(selectValue.toString(), 18);
            console.log(salePrice);

            // console.log(salePrice);
            // // //run the executeSale function
            let transaction = await contract.buyMultipleNFTs(AllId, {
                value: salePrice,
            });

            setSideOpen(false);
            setMinLoading(false);
            setLoading(true);
            await transaction.wait();

            toast.success("You successfully bought the NFT!");
            setselectMulNFT([]);
            setSelectValue(0);
            setLoading(false);
            setMinLoading(false);
            setSideOpen(false);
            await getAllNFTs();
            await userNFTdata();

            navigate("/profile");
        } catch (error) {
            setselectMulNFT([]);
            setListPrice("");
            setMinLoading(false);
            setLoading(false);

            toast.error(`Error message ${error.reason}`);

            console.log(error);
        }
    }

    useEffect(() => {
        if (isConnected) {
            getAllNFTs();
            userNFTdata();
        }
    }, [isConnected, selectedNetworkId, chainId]);

    useEffect(() => {
        setSelectValue(0);
        selectMulNFT.map((nft) =>
            setSelectValue((e) => (e += Number(nft.price)))
        );
    }, [selectMulNFT]);

    return (
        <nftContext.Provider
            value={{
                // Functions
                listNFT,
                onChangeFile,
                MarketPlaceContract,
                handleListForSale,
                getAllNFTs,
                userNFTdata,
                buyMultipleNFTs,
                buyNFT,
                unlistNFT,
                // State Data
                AllNft,
                userNFT,
                formParams,
                loading,
                minLoading,
                navigate,
                oneNFTdata,
                listSale,
                wait,
                tokenId,
                selectMulNFT,
                sideOpen,
                selectValue,
                fileURL,
                editPopup,
                // setState data
                setFormParams,
                setLoading,
                setMinLoading,
                setOneNFTdata,
                setListSale,
                setListPrice,
                setTokenId,
                setselectMulNFT,
                setSideOpen,
                setEditPopup,
                // Wallet connect hooks
                isConnected,
                chainId,
                selectedNetworkId,
                open,
                close,
                address,
            }}
        >
            {children}
        </nftContext.Provider>
    );
};

export function useNFTdata() {
    const data = useContext(nftContext);

    return data;
}
