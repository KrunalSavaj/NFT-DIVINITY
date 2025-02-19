import { Link } from "react-router-dom";

import { MdSell } from "react-icons/md";

import { GetIpfsUrlFromPinata } from "../FetchData/utils";
import { IoMdClose } from "react-icons/io";
import { PulseLoader } from "react-spinners";
import { useNFTdata } from "../Context/NFTdata";
import Dumy from "../data/images/dummy-prod-1.jpg";

function NFTTile({ data, forSale = true, onClick }) {
    const {
        minLoading,
        handleListForSale,
        setListSale,
        listSale,
        setListPrice,
        listPrice,
        setTokenId,
        tokenId,
        wait,
    } = useNFTdata();

    const newTo = {
        pathname: "/nftPage/" + data.tokenId,
    };

    const IPFSUrl = GetIpfsUrlFromPinata(data.image);

    return (
        <div>
            <Link to={newTo} onClick={() => onClick?.()}>
                <div className="border-2 mt-5 mb-3 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
                    <img
                        src={IPFSUrl ? IPFSUrl : Dumy}
                        alt=""
                        className="w-72 h-80 rounded-lg object-cover"
                    />
                    <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20 ">
                        <strong className="text-xl">{data.name}</strong>
                        <p className="display-inline">{data.description}</p>
                    </div>
                </div>
            </Link>
            {!forSale && (
                <button
                    className="w-72 rounded-lg p-3 bg-blue-500 hover:bg-blue-600 inline-flex gap-16"
                    onClick={() => (
                        setListSale((list) => !list), setTokenId(data.tokenId)
                    )}
                    disabled={minLoading}
                >
                    <MdSell />{" "}
                    {wait && data.tokenId == tokenId ? (
                        <div className="text-xl text-semibold text-center">
                            <PulseLoader className="ml-5" color="#fff" />
                        </div>
                    ) : (
                        <div className="text-xl text-semibold text-center">
                            Sale now
                        </div>
                    )}
                </button>
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

export default NFTTile;
