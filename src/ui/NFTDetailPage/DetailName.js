function DetailName({ data }) {
    return (
        <div className="flex">
            <div className="shadow-md  shadow-black w-auto p-4 text-center text-[#ffffff] text-xl rounded-2xl font-mono font-semibold">
                # {data}
            </div>
        </div>
    );
}

export default DetailName;
