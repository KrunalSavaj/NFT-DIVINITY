import { useNFTdata } from "../../Context/NFTdata";
import BuyButton from "../BuyButton";
import OfferButton from "../OfferButton";
import SellButton from "../SellButton";

function DetailButtons() {

    const { state, address } = useNFTdata();

    const loginAddress = address?.toLowerCase() ?? "";
    const dataAddress = state.oneNFT?.owner?.toLowerCase() ?? "";

    return (
        <div className=" font-bold text-indigo-50 text-xl ">
            {loginAddress !== dataAddress ? (
                state.oneNFT.isForSale ? (
                    <div className="shadow shadow-[#000000] w-full p-5 rounded-xl  mt-4 ">
                        <div className="text-xs text-indigo-100 ml-2 ">
                            <h1 className="font-normal">Current price</h1>
                        </div>
                        <div className="font-semibold ml-2 font-sans h-10 text-4xl mb-2">
                            <h1>{state.oneNFT.price} MATIC</h1>
                        </div>
                        <div className="flex gap-2">
                            <BuyButton />
                            <OfferButton />
                        </div>
                    </div>
                ) : (
                    <div className="shadow shadow-[#000000] w-full py-9 px-5 rounded-xl  mt-4 ">
                        <div className="flex gap-2">
                            <div className=" w-1/2 border shadow shadow-black rounded-lg grid items-center justify-center">
                                <h1>This NFT not for sell</h1>
                            </div>
                            <OfferButton />
                        </div>
                    </div>
                )
            ) : !state.oneNFT.isForSale ? (
                <div className="shadow shadow-black p-5 rounded-2xl font-mono mt-8  w-1/2 flex  flex-col items-center">
                    <div className="text-white-700 w-full">
                        <h1 className="m-3">You own this NFT</h1>
                        <SellButton />
                    </div>
                </div>
            ) : (
                <div className="shadow shadow-[#000] w-96 p-5 mt-8 rounded-2xl font-mono ">
                    <div className="text-white-700 text-center">
                        You own this NFT
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailButtons;
