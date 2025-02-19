function DetailDesc({ data }) {
    return (
        <div className="flex">
            <div className="shadow shadow-black   p-5 rounded-2xl  text-base text-[#AAB7B8]">
                <div className="text-xs text-indigo-100 ">
                    <h5>Description</h5>
                </div>
                <div>
                    <p>
                        {data} It is a long established fact that a reader will
                        be distracted by the readable content of a page when
                        looking at its layout. The point of using Lorem Ipsum is
                        that it has a more-or-less normal distribution of
                        letters, as opposed to using 'Content here, content
                        here', making it look like readable English. Many
                        desktop publishing packages and web page editors now use
                        Lorem Ipsum as their default model text, and a search
                        for
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DetailDesc;
