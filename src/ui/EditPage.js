import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNFTdata } from "../Context/NFTdata";
import EditPrice from "./EditPrice";
import MiniLoader from "./Miniloader";
import { IoMdClose } from "react-icons/io";

function EditPage() {
    const { unlistNFT, state, dispatch, setNewPrice } = useNFTdata();

    const Ref = useRef();

    useEffect(
        function () {
            function handleClick(e) {
                if (Ref.current && !Ref.current.contains(e.target)) {
                    dispatch({ type: "editPopup" });
                }
            }

            document.addEventListener("click", handleClick, true);

            return () =>
                document.removeEventListener("click", handleClick, true);
        },
        [Ref]
    );

    return (
        <div className="relative">
            {createPortal(
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white  h-fit w-1/4 flex flex-col gap-7 p-4 justify-between items-center rounded-lg"
                    ref={Ref}
                >
                    <div className="text-right absolute top-3 right-5">
                        <button onClick={() => dispatch({ type: "editPopup" })}>
                            <IoMdClose size={25} />
                        </button>
                    </div>
                    <div className="w-3/4 pt-5 text-lg flex flex-col ">
                        <EditPrice />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setNewPrice(state.tokenId)}
                                className="p-3 w-2/4 bg-slate-400 text-white rounded mt-2"
                            >
                                {state.wait ? <MiniLoader /> : "Edit Price"}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={state.isLoading || state.isMinLoading}
                        onClick={() => unlistNFT(state.tokenId)}
                        className="w-3/4 p-5 rounded-lg bg-[#E74C3C] hover:bg-[#C0392B] text-[#ffffffab] hover:text-[#ffff]  mb-7 text-xl"
                    >
                        {state.isMinLoading ? <MiniLoader /> : "Unlist NFT"}
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
}

export default EditPage;
