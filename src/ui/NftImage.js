function NftImage({ data }) {
    return (
        <div className="col-span-3 xl:col-span-3 2xl:col-span-2 flex justify-center h-fit w-full">
            <img
                src={data}
                alt=""
                className="rounded-3xl shadow-2xl shadow-black r"
            />
        </div>
    );
}

export default NftImage;
