import { useNFTdata } from "../Context/NFTdata";

function OfferTranButton({ data }) {

    const { executeOfferSale } = useNFTdata();

    return (
        <div>
            {data.isAccept == "true" ? (
                <button onClick={() => executeOfferSale(data.index, data.price)} className="bg-[#008080] hover:bg-[#006666] px-4 py-1 rounded text-white">
                    Complete
                </button>
            ) : (
                <button disabled={true} className="bg-[#0080803f]  px-4 py-1 rounded text-white">
                    Pending..
                </button>
            )}
        </div>
    );
}

export default OfferTranButton;
