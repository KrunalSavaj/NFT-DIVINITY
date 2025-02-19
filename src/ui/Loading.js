import { createPortal } from "react-dom";
import { BeatLoader } from "react-spinners";
import { useNFTdata } from "../Context/NFTdata";

function  Loading({isTrue = false}) {
    const { state  } = useNFTdata();

    return (
        <>
            {state.isLoading || isTrue ? (
                <div>
                    {createPortal(
                        <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <BeatLoader color="#ffff" size={25} />
                        </div>,
                        document.body
                    )}
                </div>
            ) : (
                ""
            )}
        </>
    );
}

export default Loading;
