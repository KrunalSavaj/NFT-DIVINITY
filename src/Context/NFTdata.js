/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract, formatEther, parseUnits } from "ethers";
import axios from "axios";
import toast from "react-hot-toast";
import {
    useWeb3Modal,
    useWeb3ModalAccount,
    useWeb3ModalProvider,
    useWeb3ModalState,
} from "@web3modal/ethers/react";

import { reducer, initialState } from "../Hooks/reducerHook";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../FetchData/pinata";
import { GetIpfsUrlFromPinata } from "../FetchData/utils";
import MarketplaceJSON from "../FetchData/Marketplace.json";

const nftContext = createContext();

export const NFTdataApi = ({ children }) => {
    // useReducer hook for state manegment
    const [state, dispatch] = useReducer(reducer, initialState);

    // Wallet connect hook
    const { isConnected, chainId, address } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const { selectedNetworkId } = useWeb3ModalState();
    const { open, close } = useWeb3Modal();

    const navigate = useNavigate();

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
            dispatch({ type: "Load" });
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

            dispatch({ type: "dataReceived", payload: items });
        } catch (error) {
            console.log(error);
            dispatch({ type: "LoadOff" });
        }
    }

    async function buyNFT(price, _tokenId) {
        try {
            dispatch({ type: "MiniLoad" });
            const contract = await MarketPlaceContract();

            const salePrice = parseUnits(price.toString(), "ether");

            //run the executeSale function
            let transaction = await contract.executeSale(_tokenId, {
                value: salePrice,
                gasLimit: 20000000,
            });

            dispatch({ type: "transactionWait" });
            await transaction.wait();

            await getAllNFTs();
            await userNFTdata();

            dispatch({ type: "transactionSuccess" });
            toast.success("You successfully bought the NFT!");

            navigate("/profile");
        } catch (error) {
            dispatch({ type: "transactionFail" });

            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
            } else {
                console.log(error);
                toast.error(`Error message ${error.reason}`);
            }
        }
    }

    async function onChangeFile(e) {
        let file = e.target.files[0];

        dispatch({ type: "LoadWait" });

        try {
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                console.log("Uploaded image to pinata:", response.pinataURL);

                dispatch({ type: "FileReceived", payload: response.pinataURL });
            }
        } catch (e) {
            console.log("Error during file upload", e);
            toast.error(`Upload Image error ${e.message}`);

            dispatch({ type: "FileFailed" });
        }
    }

    async function uploadMetadataToIPFS() {
        const { name, description, price } = state.formParams;

        if (!name || !description || !price || !state.fileURL) return;

        const nftJSON = {
            name,
            description,
            price,
            image: state.fileURL,
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
        dispatch({ type: "MiniLoad" });

        try {
            const metadataURL = await uploadMetadataToIPFS();

            const contract = await MarketPlaceContract();

            const price = parseUnits(state.formParams.price, 18);
            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            let transaction = await contract.createToken(metadataURL, price, {
                value: listingPrice,
            });

            dispatch({ type: "transactionWait" });

            await transaction.wait();

            await getAllNFTs();
            await userNFTdata();

            toast.success("Successfully listed your NFT!");
            dispatch({ type: "transactionSuccess" });
            navigate("/profile");
        } catch (error) {
            dispatch({ type: "transactionFail" });
            navigate("/Profile");

            console.log(error);
            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
            } else {
                toast.error("Error on Uploading NFT Please try later..");
            }
        }
    }

    async function userNFTdata() {
        try {
            dispatch({ type: "Load" });
            const contract = await MarketPlaceContract();

            let transaction = await contract.getMyNFTs();

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

            dispatch({ type: "UserdataReceived", payload: items });
        } catch (error) {
            console.log(error);
            dispatch({ type: "LoadOff" });
        }
    }

    async function handleListForSale() {
        if (!state.salePrice) return;

        try {
            dispatch({ type: "LoadWait" });

            console.log("token Id", state.tokenId);

            const contract = await MarketPlaceContract();

            let listingPrice = await contract.getListPrice();
            listingPrice = listingPrice.toString();

            const price = parseUnits(state.salePrice, 18);

            let transaction = await contract.ListingToSale(
                state.tokenId,
                price,
                {
                    value: listingPrice,
                }
            );

            dispatch({ type: "transactionWait" });

            await transaction.wait();

            await userNFTdata();
            await getAllNFTs();

            toast.success("Successfully listed your NFT!");

            dispatch({ type: "transactionSuccess" });

            navigate("/profile");
        } catch (error) {
            console.log(error);
            dispatch({ type: "handleListFailed" });
            // setListPrice("");
            // setWait(false);
            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
            } else {
                toast.error("something went wrong please try later..");
            }
        }
    }

    async function unlistNFT(_tokenId) {
        try {
            dispatch({ type: "MiniLoad" });

            const contract = await MarketPlaceContract();
            console.log(_tokenId);
            //create an NFT Token
            let transaction = await contract.unlistNFT(_tokenId);

            dispatch({ type: "transactionWait" });

            await transaction.wait();

            await getAllNFTs();
            await userNFTdata();
            await AllOffer();
            toast.success("succesfully unlist NFT");

            dispatch({ type: "unListTransaction" });

            navigate("/profile");
        } catch (error) {
            console.log(error);
            dispatch({ type: "unListTransaction" });
            toast.error("something went wrong");
        }
    }

    async function buyMultipleNFTs() {
        if (state.selectMulNFT.length == 0) return;

        try {
            dispatch({ type: "MiniLoad" });
            const contract = await MarketPlaceContract();

            let AllId = [];
            state.selectMulNFT.map((nft) => AllId.push(nft.tokenId));

            const salePrice = parseUnits(state.selectValue.toString(), 18);
            console.log(salePrice);

            let transaction = await contract.buyMultipleNFTs(AllId, {
                value: salePrice,
            });

            dispatch({ type: "transactionWait" });

            await transaction.wait();

            await getAllNFTs();
            await userNFTdata();
            await AllOffer();

            toast.success("You successfully bought the NFT!");

            dispatch({ type: "MultiNFTTransaction" });

            navigate("/profile");
        } catch (error) {
            dispatch({ type: "MultiNFTTransaction" });

            toast.error(`Error message ${error.reason}`);

            console.log(error);
        }
    }

    async function setNewPrice(_tokenId) {
        if (!state.salePrice) return;

        try {
            dispatch({ type: "LoadWait" });

            const contract = await MarketPlaceContract();

            const price = parseUnits(state.salePrice, 18);

            let transaction = await contract.EditPrice(_tokenId, price);

            dispatch({ type: "transactionWait" });

            await transaction.wait();

            await getAllNFTs();
            await userNFTdata();
            toast.success("succesfully Edit Price");

            dispatch({ type: "unListTransaction" });

            navigate("/profile");
        } catch (error) {
            console.log(error);
            dispatch({ type: "unListTransaction" });
            toast.error("something went wrong");
        }
    }

    async function MakeOffer() {
        if (!state.offerPrice) return;
        try {
            console.log(state.tokenId);

            dispatch({ type: "LoadWait" });
            const contract = await MarketPlaceContract();

            const salePrice = parseUnits(state.offerPrice.toString(), "ether");
            console.log(salePrice);
            //run the executeSale function
            let transaction = await contract.Makeoffer(
                state.tokenId,
                salePrice
            );

            dispatch({ type: "transactionWait" });
            await transaction.wait();

            await AllOffer();

            dispatch({ type: "transactionSuccess" });
            toast.success("successfully make offer");
        } catch (error) {
            dispatch({ type: "transactionFail" });

            toast.error("something wrong try later");

            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
            } else {
                console.log(error);
                toast.error(`Error message ${error.reason}`);
            }
        }
    }

    async function AllOffer() {
        try {
            dispatch({ type: "Load" });
            const contract = await MarketPlaceContract();

            let transaction = await contract.AllOffer();
            console.log(transaction);

            const items = transaction.map((i) => {
                let price = formatEther(i.price.toString(), "ether");
                let item = {
                    index: i.index.toString(),
                    price: price,
                    isAccept: i.isAccept.toString(),
                    from: i.buyer,
                    tokenId: i.nftId.toString(),
                };
                console.log(item);
                return item;
            });

            console.log(items);

            dispatch({ type: "setOfferData", payload: items });

            dispatch({ type: "LoadOff" });
        } catch (error) {
            console.log(error);
            dispatch({ type: "LoadOff" });
        }
    }

    async function AcceptOffer(_index) {
        try {
            dispatch({ type: "Load" });
            const contract = await MarketPlaceContract();

            let transaction = await contract.AcceptOffer(_index);

            await transaction.wait();

            await AllOffer();
            dispatch({ type: "LoadOff" });
        } catch (error) {
            console.log(error);
            toast.error("somthing went wrong please try later.");
            dispatch({ type: "LoadOff" });
        }
    }

    async function executeOfferSale(_index, _price) {
        try {
            dispatch({ type: "Load" });
            const contract = await MarketPlaceContract();

            const salePrice = parseUnits(_price.toString(), "ether");

            //run the executeSale function
            let transaction = await contract.executeOfferSale(_index, {
                value: salePrice,
                gasLimit: 20000000,
            });

            dispatch({ type: "transactionWait" });
            await transaction.wait();

            await getAllNFTs();
            await userNFTdata();
            await AllOffer();

            dispatch({ type: "transactionSuccess" });
            toast.success("You successfully bought the NFT!");

            navigate("/profile");
        } catch (error) {
            dispatch({ type: "transactionFail" });

            if (error.reason == "rejected") {
                toast.error(`Error message ${error.reason}`);
            } else {
                console.log(error);
                toast.error(`Error message ${error.reason}`);
            }
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        scrollToTop();
    }, [state.oneNFT]);

    useEffect(() => {
        if (isConnected) {
            getAllNFTs();
            userNFTdata();
            AllOffer();
            dispatch({ type: "clearMulNFT" });
        }
    }, [isConnected, selectedNetworkId, chainId, address]);

    useEffect(() => {
        dispatch({ type: "setSelectValue" });
    }, [state.selectMulNFT]);

    return (
        <nftContext.Provider
            value={{
                state,
                dispatch,
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
                setNewPrice,
                MakeOffer,
                AcceptOffer,
                executeOfferSale,
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
