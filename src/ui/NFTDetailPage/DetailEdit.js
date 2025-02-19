import { useNFTdata } from "../../Context/NFTdata";

function DetailEdit() {

    const { state , dispatch , address } = useNFTdata();

    const loginAddress = address?.toLowerCase() ?? "";
    const dataAddress = state.oneNFT?.owner?.toLowerCase() ?? "";

    return (
        <div className="w-full absolute top-0 right-7">
            {state.oneNFT.isForSale && loginAddress == dataAddress && (
                <button
                    onClick={() =>
                        dispatch({
                            type: "setEditPopup",
                            payload: state.oneNFT.tokenId,
                        })
                    }
                    className="shadow shadow-[#000] w-60 p-5 absolute top-0 right-7 rounded-2xl text-center bg-[#1F618D] hover:bg-[#1f618d9c] font-mono"
                >
                    Edit Listing
                </button>
            )}
        </div>
    );
}

export default DetailEdit;
