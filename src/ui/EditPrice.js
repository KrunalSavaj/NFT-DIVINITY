import { useNFTdata } from "../Context/NFTdata";

function EditPrice() {
    const { state, dispatch } = useNFTdata();

    return (
        <div class="sm:col-span-2">
            <label
                for="postal-code"
                class="block text-lg font-medium leading-6 text-gray-900"
            >
                set New Price
            </label>
            <div class="mt-2">
                <input
                    type="Number"
                    name="postal-code"
                    id="postal-code"
                    class="block w-full rounded-md border-0 px-5  py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#fff] sm:text-sm sm:leading-6 shadow shadow-black"
                    onChange={(e) =>
                        dispatch({
                            type: "setSalePrice",
                            payload: e.target.value,
                        })
                    }
                    value={state.salePrice}
                />
            </div>
        </div>
    );
}

export default EditPrice;
