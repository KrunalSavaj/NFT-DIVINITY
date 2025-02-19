function DetailOwner({ data }) {
    return (
        <div className="shadow shadow-black w-fit p-5 rounded-xl font-mono text-sm text-indigo-100">
            <div>Owned by</div>
            <div className="text-[#3498DB]">{`${data.oneNFT?.owner?.slice(
                0,
                9
            )}....${data.oneNFT?.owner?.slice(-10)}`}</div>
        </div>
    );
}

export default DetailOwner;
