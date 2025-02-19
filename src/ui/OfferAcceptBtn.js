import { useNFTdata } from "../Context/NFTdata";

function OfferAcceptBtn({data}) {

    const { AcceptOffer } = useNFTdata();



    return (
        <div>
            {data.isAccept == "true" ? (
                <button
                    disabled={true}
                    className="bg-[#2ecc704b]  cursor-default text-white  px-6 py-1 rounded"
                >
                    Accept
                </button>
            ) : (
                <button
                    onClick={() => AcceptOffer(data.index)}
                    className="bg-[#2ECC71]  hover:bg-[#27AE60] text-white font-bold px-6 py-1 rounded"
                >
                    Accept
                </button>
            )}
        </div>
    );
}

export default OfferAcceptBtn;
