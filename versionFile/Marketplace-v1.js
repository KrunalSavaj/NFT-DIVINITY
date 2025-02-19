import { BeatLoader, PropagateLoader } from "react-spinners";
import Navbar from "./Navbar";
import NFTTile from "./NFTTile";

import { useNFTdata } from "../Context/NFTdata";

export default function Marketplace() {
    const { AllNft, isConnected, setOneNFTdata } = useNFTdata();

    return (
        <div>
            <Navbar />
            <div className="flex flex-col place-items-center mt-7 mx-6">
                <div className="flex mt-5 justify-between flex-wrap mx-4 text-center gap-8">
                    {AllNft.length === 0 ? (
                        isConnected ? (
                            <div className="mt-10">
                                <BeatLoader color="#b943dd" size={25} />
                            </div>
                        ) : (
                            <div className="mt-20">
                                <p className="mb-7 font-bold text-2xl text-indigo-100">
                                    Please Connect your Wallet
                                </p>

                                <PropagateLoader color="#fff" />
                            </div>
                        )
                    ) : (
                        <div className="flex gap-4 flex-wrap">
                            {AllNft.map((value, index) => {
                                return (
                                    <NFTTile
                                        data={value}
                                        key={index}
                                        onClick={() => setOneNFTdata(value)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
