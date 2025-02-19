import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { MdOutlineShoppingCart, MdSell } from "react-icons/md";
import { parseUnits } from "ethers";
import toast from "react-hot-toast";

import { GetIpfsUrlFromPinata } from "../FetchData/utils";
import { BeatLoader, PulseLoader } from "react-spinners";
import { useNFTdata } from "../Context/NFTdata";
import { IoMdClose } from "react-icons/io";

export default function NFTPage() {
    const {
        MarketPlaceContract,
        address,
        setLoading,
        loading,
        minLoading,
        setMinLoading,
        navigate,
        handleListForSale,
        oneNFTdata: data,
        wait,
        listPrice,
        setListPrice,
        listSale,
        setListSale,
        setTokenId,
        userNFTdata,
        getAllNFTs,
    } = useNFTdata();

    const params = useParams();
    const tokenId = params.tokenId;

    async function buyNFT() {
        try {
            setMinLoading(true);
            const contract = await MarketPlaceContract();

            const salePrice = parseUnits(data.price, "ether");

            console.log(tokenId, salePrice, contract);

            //run the executeSale function
            let transaction = await contract.executeSale(tokenId, {
                value: salePrice,
                gasLimit: 20000000,
            });

            setLoading(true);
            await transaction.wait();

            toast.success("You successfully bought the NFT!");
            setLoading(false);
            setMinLoading(false);
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
                toast.success("transaction is too late...");
                setTimeout(() => {
                    userNFTdata();
                    getAllNFTs();
                    setLoading(false);
                    setMinLoading(false);
                    navigate("/Profile");
                    toast.success("You successfully bought the NFT!");
                    console.log("Delayed for 1 second.");
                }, 15000);
            }
        }
    }

    const loginAddress = address?.toLowerCase() ?? "";
    const dataAddress = data?.owner?.toLowerCase() ?? "";

    if (typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);

    return (
        <div className="overflow-hidden">
            <Navbar></Navbar>
            {!data || loading ? (
                <div className="flex flex-col place-items-center mt-40">
                    <BeatLoader color="#b943dd" margin={3} size={25} />
                </div>
            ) : (
                <div className="flex ml-20 mt-20 justify-center ">
                    <div>
                        <img
                            src={data.image}
                            alt=""
                            className="rounded-3xl h-[670px] w-[450px] shadow-2xl shadow-purple-950 r"
                        />
                    </div>

                    <div className="text-xl ml-20 space-y-4 text-white rounded-lg p-5">
                        <div className="flex">
                            <div className=" shadow shadow-purple-950 w-auto p-5 text-center rounded-2xl font-mono text-xl">
                                {data.name}
                            </div>
                        </div>

                        <div className="shadow shadow-purple-950 w-auto p-5 rounded-2xl font-mono">
                            Owned by <br />
                            <div className="text-indigo-200 ml-10">{`${data?.owner?.slice(
                                0,
                                9
                            )}....${data?.owner?.slice(-7)}`}</div>
                        </div>

                        <div className="flex">
                            <div className="shadow shadow-purple-950 w-auto p-5  rounded-2xl font-mono text-xl">
                                <div className="text-xs text-indigo-100 ">
                                    <h5>Description</h5>
                                </div>
                                {data.description}
                            </div>
                        </div>

                        <div className="mr-10 font-bold text-indigo-50 text-xl">
                            {loginAddress !== dataAddress ? (
                                data.isForSale ? (
                                    <div className="shadow shadow-purple-950 w-96 p-5 rounded-2xl font-mono mt-8">
                                        <div className="text-xs text-indigo-100 ml-2">
                                            <h5>Current price</h5>
                                        </div>
                                        <div className="font-semibold ml-2 font-sans h-10 text-4xl mb-2">
                                            <h1>{data.price} MATIC</h1>
                                        </div>
                                        <button
                                            className="bg-blue-500 rounded-xl hover:bg-blue-600 p-4 gap-3 w-72 "
                                            onClick={buyNFT}
                                            disabled={minLoading}
                                        >
                                            {minLoading ? (
                                                <div className="flex gap-5 justify-center">
                                                    <PulseLoader color="#fff" />
                                                </div>
                                            ) : (
                                                <div className="flex gap-5 justify-center">
                                                    <div>Buy now</div>
                                                    <div className="text-center">
                                                        <MdOutlineShoppingCart
                                                            size={35}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="shadow shadow-purple-950 w-96 p-5 rounded-2xl font-mono mt-8">
                                        <div className="text-white-700">
                                            This NFT is Not for Sell
                                        </div>
                                    </div>
                                )
                            ) : !data.isForSale ? (
                                <div className="shadow shadow-purple-950 w-96 p-5 rounded-2xl font-mono mt-8">
                                    <div className="text-white-700">
                                        You own this NFT
                                        <button
                                            className="bg-blue-500 rounded-xl hover:bg-blue-600 p-4  w-72 inline-flex gap-16"
                                            disabled={wait}
                                            onClick={() => (
                                                setListSale((list) => !list),
                                                setTokenId(data.tokenId)
                                            )}
                                        >
                                            <MdSell />
                                            {wait ? (
                                                <div className="text-xl text-semibold text-center">
                                                    <PulseLoader
                                                        className="ml-5"
                                                        color="#fff"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-xl text-semibold text-center">
                                                    Sale now
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="shadow shadow-purple-950 w-96 p-5 rounded-2xl font-mono mt-8">
                                    <div className="text-white-700">
                                        You own this NFT
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {listSale && (
                <>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-purple-400 w-96 h-auto rounded-xl">
                        <div className="text-right mt-3 mr-5">
                            <button
                                onClick={() => (
                                    setListSale((list) => !list),
                                    setListPrice("")
                                )}
                            >
                                <IoMdClose size={25} />
                            </button>
                        </div>
                        <div className="text-center text-xl ">
                            Price:{" "}
                            <input
                                type="number"
                                value={listPrice}
                                onChange={(e) => setListPrice(e.target.value)}
                                className="rounded-full text-black pl-4 bg-indigo-50"
                                required
                            />
                        </div>
                        <div className="text-center m-5">
                            <button
                                type="submit"
                                className="bg-purple-500 p-3 rounded-xl w-40 hover:bg-purple-600"
                                onClick={() => (
                                    handleListForSale(),
                                    setListSale((list) => !list)
                                )}
                            >
                                List on Sell
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
