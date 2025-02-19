import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useNFTdata } from "../Context/NFTdata";
import { TfiMenuAlt } from "react-icons/tfi";
import Offers from "./Offers";
import DetailName from "./NFTDetailPage/DetailName";
import DetailOwner from "./NFTDetailPage/DetailOwner";
import DetailDesc from "./NFTDetailPage/DetailDesc";
import DetailButtons from "./NFTDetailPage/DetailButtons";
import DetailEdit from "./NFTDetailPage/DetailEdit";

function NFTDetail() {
    const { state, address } = useNFTdata();

    const loginAddress = address?.toLowerCase() ?? "";
    const dataAddress = state.oneNFT?.owner?.toLowerCase() ?? "";

    const [dropDown, setDropDown] = useState(false);

    return (
        <div className="col-span-3 xl:col-span-3  2xl:col-span-3 w-full place-self-start flex flex-col gap-5">
            <div className="text-xl space-y-4 text-white h-fit p-5 w-full  shadow  shadow-[black] relative rounded-lg flex flex-col ">
                <DetailName data={state.oneNFT.name} />

                <DetailOwner data={state} />

                <DetailDesc data={state.oneNFT.description} />

                <DetailButtons />

                <DetailEdit />
            </div>
            <div className={`flex flex-col`}>
                <div
                    className={`bg-[#fff] h-16 flex items-center text-[#727272] justify-between p-7 border-b rounded-lg cursor-pointer ${
                        dropDown == true ? "rounded-b-none" : ""
                    }`}
                    onClick={() => setDropDown((e) => !e)}
                >
                    <div className="flex gap-3  font-extrabold text-xl">
                        <TfiMenuAlt size={25} />
                        <h1 className="select-none"> Offers</h1>
                    </div>
                    <div>
                        {dropDown ? (
                            <RiArrowDropUpLine size={40} />
                        ) : (
                            <RiArrowDropDownLine size={40} />
                        )}
                    </div>
                </div>
                <div
                    className={`bg-white mb-8 rounded-b-lg ${
                        dropDown == true ? "visible " : "invisible"
                    }`}
                >
                    <div className="grid grid-cols-5 border-b gap-5 justify-items-center p-1 text-[#9e9d9d] text-lg drop-shadow select-none">
                        <h1>Price</h1>
                        <h1>Floor Difference</h1>
                        <h1>Quantity</h1>
                        <h1>id</h1>
                        {loginAddress !== dataAddress ? (
                            <h1>From</h1>
                        ) : (
                            <h1>Accept Request</h1>
                        )}
                    </div>

                    <div className="h-64 overflow-scroll overflow-x-hidden rounded-b-lg">
                        {state.AllOffer.map((i) => {
                            return <Offers Offerdata={i} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NFTDetail;
