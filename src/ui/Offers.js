import { useNFTdata } from "../Context/NFTdata";
import OfferAcceptBtn from "./OfferAcceptBtn";
import OfferAdd from "./OfferAdd";
import OfferTranButton from "./OfferTranButton";

function Offers({ Offerdata }) {
    const { state,  address } = useNFTdata();

    const loginAddress = address?.toLowerCase() ?? "";
    const dataAddress = state.oneNFT?.owner?.toLowerCase() ?? "";

    return (
        <div>
            {Offerdata.tokenId == state.tokenId ? (
                <div
                    className={`grid grid-cols-5 gap-5 justify-items-center py-4 text-[#5c5c5c] bg-white text-lg font-medium border-b`}
                >
                    <h1>
                        {Offerdata.price}{" "}
                        <span className="font-bold">MATIC</span>
                    </h1>
                    <h1>-</h1>
                    <h1>1</h1>
                    <h1>{Offerdata.tokenId}</h1>
                    <div>
                        {loginAddress !== dataAddress ? (
                            <>
                                {address?.toLowerCase() ==
                                Offerdata.from.toLowerCase() ? (
                                    <OfferTranButton data={Offerdata} />
                                ) : (
                                    <OfferAdd data={Offerdata} />
                                )}
                            </>
                        ) : (
                            <OfferAcceptBtn data={Offerdata} />
                        )}
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default Offers;

