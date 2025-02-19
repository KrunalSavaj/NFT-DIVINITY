import { useNFTdata } from "../../Context/NFTdata";

function FormDescription() {
    const { dispatch, state } = useNFTdata();

    return (
        <div class="col-span-full">
            <label
                for="street-address"
                class="block text-sm font-medium leading-6 text-gray-900"
            >
                Description
            </label>
            <div class="mt-2">
                <input
                    type="text"
                    name="street-address"
                    id="street-address"
                    class="block w-full rounded-md border-0 px-5  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#fff] sm:text-sm sm:leading-6"
                    onChange={(e) =>
                        dispatch({
                            type: "setForm",
                            payload: {
                                ...state.formParams,
                                description: e.target.value,
                            },
                        })
                    }
                    value={state.formParams.description}
                />
            </div>
        </div>
    );
}

export default FormDescription;
