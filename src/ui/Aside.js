import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";
import { FiAlertCircle } from "react-icons/fi";

import { useNFTdata } from "../Context/NFTdata";
import { MdDeleteForever } from "react-icons/md";

import { PulseLoader } from "react-spinners";
import Loading from "./Loading";

function Aside() {
    const { state, dispatch, buyMultipleNFTs } = useNFTdata();

    // console.log(selectMulNFT);

    const Ref = useRef();

    useEffect(
        function () {
            function handleClick(e) {
                if (Ref.current && !Ref.current.contains(e.target)) {
                    dispatch({ type: "sidePopup" });
                }
            }

            document.addEventListener("click", handleClick, true);
            return () =>
                document.removeEventListener("click", handleClick, true);
        },
        [Ref]
    );

    return (
        <>
            {createPortal(
                <div
                    className={`h-screen  2xl:w-1/4 absolute top-0 right-0 grid justify-items-end p-8 text-[#333333] transition duration-700 ${
                        state.isMinLoading
                            ? "opacity-80 pointer-events-none"
                            : ""
                    }`}
                    ref={Ref}
                >
                    <div className="relative h-full w-full bg-[#ffffffe1] rounded-2xl !blur-none">
                        <div className="border-b-2 border-[#c5c5c5] flex justify-between h-20 items-center p-5">
                            <p className="font-sans text-2xl font-bold flex items-center gap-2">
                                Your cart{" "}
                                <span>
                                    <FiAlertCircle size={20} />
                                </span>
                            </p>
                            <button
                                onClick={() => dispatch({ type: "sidePopup" })}
                            >
                                <IoClose size={30} />
                            </button>
                        </div>

                        <div
                            className={`flex flex-col border-b-2 border-[#c5c5c5]  px-5 pb-5 gap-3 ${
                                state.selectMulNFT.length == 0
                                    ? "opacity-70"
                                    : ""
                            }`}
                        >
                            {state.selectMulNFT.length == 0 ? (
                                <div className="flex justify-center items-center h-40 space-x-9 p-5 font-medium text-gray-400">
                                    <p>Add items to get started</p>
                                </div>
                            ) : (
                                <div className="flex px-2 pt-4 pb-3 justify-between text-base font-semibold">
                                    <div>
                                        {state.selectMulNFT.length}{" "}
                                        {state.selectMulNFT.length > 1
                                            ? "items"
                                            : "item"}
                                    </div>
                                    <div
                                        className="hover:text-[#747474] cursor-pointer"
                                        onClick={() =>
                                            dispatch({ type: "clearMulNFT" })
                                        }
                                    >
                                        clear all
                                    </div>
                                </div>
                            )}
                            {state.selectMulNFT.map((nft) => {
                                return (
                                    <div className="p-2 flex rounded-lg gap-5 items-center group hover:bg-[#ffffff9f] hover:drop-shadow-sm shadow-[#000] transition duration-700">
                                        <div className="shadow-xl h-20 w-20 overflow-hidden rounded-xl">
                                            <img
                                                src={nft.image}
                                                alt=""
                                                className=" h-full scale-110"
                                            />
                                        </div>

                                        <div className="flex flex-col font-bold">
                                            <p className="">
                                                {nft.name.substr(0, 5) +
                                                    ".." +
                                                    nft.name.substr(-2)}
                                            </p>
                                            <p>
                                                {nft.description.substr(0, 12) +
                                                    "..."}
                                            </p>
                                        </div>
                                        <div className="ml-auto relative  grid justify-end">
                                            <div className="">
                                                <button
                                                    className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-x-0 bottom-0 flex justify-center items-end text-xl  font-semibold"
                                                    onClick={() =>
                                                        dispatch({
                                                            type: "setMulNFT",
                                                            payload: nft,
                                                        })
                                                    }
                                                >
                                                    <MdDeleteForever
                                                        size={25}
                                                    />
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold group-hover:invisible">
                                                    {nft?.price} MATIC
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            className={`flex flex-col gap-4 ${
                                state.selectMulNFT.length == 0
                                    ? "opacity-30"
                                    : ""
                            }`}
                        >
                            <div className="flex justify-between p-5 text-xl font-bold">
                                <div>Total price</div>
                                <div>
                                    <p>{state.selectValue} MATIC</p>
                                </div>
                            </div>
                            <div className="grid justify-center ">
                                <button
                                    className="bg-[#27AE60] rounded-2xl hover:bg-[#219151] p-4 px-20 w-full text-white border-r-2"
                                    onClick={buyMultipleNFTs}
                                    disabled={state.isMinLoading || state.selectMulNFT.length == 0}
                                >
                                    {state.isMinLoading ? (
                                        <div className="flex justify-center px-12 py-1">
                                            <PulseLoader color="#fff" />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center">
                                            <div>Complete purchase</div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <Loading />
        </>
    );
}

export default Aside;
