import { useNFTdata } from "../../Context/NFTdata";

function FormPrice() {
    const { dispatch, state } = useNFTdata();

    return (
        <div class="sm:col-span-2">
            <label
                for="postal-code"
                class="block text-sm font-medium leading-6 text-gray-900"
            >
                Price
            </label>
            <div class="mt-2">
                <input
                    type="Number"
                    name="postal-code"
                    id="postal-code"
                    class="block w-full rounded-md border-0 px-5  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#fff] sm:text-sm sm:leading-6"
                    onChange={(e) =>
                        dispatch({
                            type: "setForm",
                            payload: {
                                ...state.formParams,
                                price : e.target.value,
                            },
                        })
                    }
                    value={state.formParams.price}
                />
            </div>
        </div>
    );
}

export default FormPrice;
