import { useNFTdata } from "../Context/NFTdata";

function MainDiv({ children, gap = 0 }) {
    const { state } = useNFTdata();

    return (
        <div
            className={`flex flex-col px-4 py-1 h-screen ${`gap-${gap.toString()}`}  ${
                state.popUpSide ||
                state.isLoading ||
                state.popUpSale ||
                state.popUpEdit ||
                state.popUpOffer
                    ? "blur-sm opacity-50 pointer-events-none"
                    : ""
            }`}
        >
            {children}
        </div>
    );
}

export default MainDiv;
