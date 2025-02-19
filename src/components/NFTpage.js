import Navbar from "./Navbar";
import { GetIpfsUrlFromPinata } from "../FetchData/utils";
import { useNFTdata } from "../Context/NFTdata";
import Loading from "../ui/Loading";
import Popup from "../ui/Popup";
import MainDiv from "../ui/MainDiv";
import EditPage from "../ui/EditPage";
import PopupOffer from "../ui/PopupOffer";
import NftImage from "../ui/NftImage";
import NFTDetail from "../ui/NFTDetail";
export default function NFTPage() {
    const { state } = useNFTdata();

    if (typeof state.oneNFT.image == "string")
        state.oneNFT.image = GetIpfsUrlFromPinata(state.oneNFT.image);

    return (
        <MainDiv gap={12}>
            <div className="">
                <Navbar />
            </div>
            <div className="">
                <Loading />
                <div className="grid grid-cols-6 2xl:grid-cols-5 px-12 gap-7">
                    <NftImage data={state.oneNFT.image} />
                    <NFTDetail />
                </div>

                {state.popUpEdit && <EditPage />}

                {state.popUpOffer && <PopupOffer />}

                {state.popUpSale && <Popup />}
            </div>
        </MainDiv>
    );
}
