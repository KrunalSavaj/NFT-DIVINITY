import {
    MdOutlineRemoveShoppingCart,
    MdOutlineShoppingCart,
} from "react-icons/md";
import { useNFTdata } from "../Context/NFTdata";
import MiniLoader from "./Miniloader";

function BuyButton() {
    const { buyNFT, state, dispatch } = useNFTdata();

    return (
        <div className="flex w-1/2">
            <button
                className="bg-[#27AE60] rounded-xl hover:bg-[#219151] p-4 w-11/12 rounded-r-none border-r-2 text-[#FFFFFF]"
                onClick={() => buyNFT(state.oneNFT.price, state.oneNFT.tokenId)}
                disabled={state.isLoading || state.isMinLoading}
            >
                {state.isMinLoading ? (
                    <div className="flex gap-5 justify-center">
                        <MiniLoader />
                    </div>
                ) : (
                    <div className="flex gap-5 justify-center text-lg font-bold">
                        <div>
                            <h1 className="tracking-wider">Buy now</h1>
                        </div>
                    </div>
                )}
            </button>
            <button
                onClick={() =>
                    dispatch({ type: "addMulNFT", payload: state.oneNFT })
                }
                className={`bg-[#27AE60] rounded-2xl hover:bg-[#219151]  p-4  rounded-l-none text-[#FFFFFF]`}
                disabled={state.isLoading || state.isMinLoading}
            >
                {state.selectMulNFT.includes(state.oneNFT) ? (
                    <MdOutlineRemoveShoppingCart size={30} />
                ) : (
                    <MdOutlineShoppingCart size={30} />
                )}
            </button>
        </div>
    );
}

export default BuyButton;
