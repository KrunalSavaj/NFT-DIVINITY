import Navbar from "./Navbar";

import NFTTile from "./NFTTile";
import { FaAddressCard } from "react-icons/fa6";
import { useNFTdata } from "../Context/NFTdata";
import Loading from "../ui/Loading";
import Popup from "../ui/Popup";
import MainDiv from "../ui/MainDiv";

export default function Profile() {
    const { address, state, dispatch } = useNFTdata();

    return (
        <MainDiv>
            <div>
                <Navbar />
            </div>

            <div className="">
                <div className="flex justify-end p-4 text-lg">
                    <div className="flex gap-3 bg-slate-600 items-center justify-center p-4 rounded-xl text-[#ECF0F1]">
                        <h1 className="">
                            {" "}
                            <FaAddressCard />
                        </h1>
                        <h1>{address}</h1>
                    </div>
                </div>
                <div className="max-w-full p-10 pt-4">
                    <div className="grid grid-cols-4 min-[1320px]:grid-cols-4 min-[1450px]:grid-cols-5 2xl:grid-cols-6 gap-8 gap-y-9">
                        {state.ProfileNFT.map((value, index) => {
                            return (
                                <NFTTile
                                    data={value}
                                    key={index}
                                    forSale={value.isForSale}
                                    onClick={() =>
                                        dispatch({
                                            type: "setOneNFT",
                                            payload: value,
                                        })
                                    }
                                ></NFTTile>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Loading />
            {state.popUpSale && <Popup />}
        </MainDiv>
    );
}
