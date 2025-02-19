function OfferAdd({ data }) {
    return (
        <div className="text-[#335ac7d5]">
            <h1>{`${data.from.slice(0, 5)}....${data.from.slice(-4)}`}</h1>
        </div>
    );
}

export default OfferAdd;
