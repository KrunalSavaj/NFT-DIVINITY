import { MdOutlineLocalOffer } from "react-icons/md";
import { useNFTdata } from "../Context/NFTdata";

function OfferButton() {
    const { state, dispatch } = useNFTdata();

    return (
        <div className="w-1/2">
            <button
                className="bg-[#34495E] rounded-xl hover:bg-[#2e445a] p-4 w-full  text-[#FFFFFF]"
                onClick={() =>
                    dispatch({
                        type: "setOfferPopup",
                        payload: state.oneNFT.tokenId,
                    })
                }
                disabled={state.isLoading || state.isMinLoading}
            >
                <div className="flex gap-5 justify-center text-lg font-bold">
                    <div>
                        <h1 className="tracking-wider flex justify-center items-center gap-3">
                            <MdOutlineLocalOffer size={25} /> Make offer
                        </h1>
                    </div>
                </div>
            </button>
        </div>
    );
}

export default OfferButton;
