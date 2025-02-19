import { IoMdClose } from "react-icons/io";
import { useNFTdata } from "../Context/NFTdata";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import SellButton from "./SellButton";

function Popup() {
    const { state, dispatch } = useNFTdata();

    const Ref = useRef();

    useEffect(
        function () {
            function handleClick(e) {
                if (Ref.current && !Ref.current.contains(e.target)) {
                    dispatch({ type: "sellPopup" });
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
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-10 px-16 bg-white h-auto rounded-sm"
                    ref={Ref}
                >
                    <div className="text-right absolute top-5 right-5">
                        <button disabled={state.wait} onClick={() => dispatch({ type: "sellPopup" })}>
                            <IoMdClose size={25} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="text-center text-xl flex gap-4 justify-center">
                            <label
                                htmlFor="price"
                                className="text-center flex items-center font-bold text-[#8b7e7e]"
                            >
                                Price :{" "}
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={state.salePrice}
                                onChange={(e) =>
                                    dispatch({
                                        type: "setSalePrice",
                                        payload: e.target.value,
                                    })
                                }
                                className="rounded-xl text-black py-3 px-4 bg-indigo-50"
                                required
                            />
                        </div>
                        <div className="text-center m-5">
                            <SellButton />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Popup;
