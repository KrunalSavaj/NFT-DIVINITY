import { useNFTdata } from "../../Context/NFTdata";

function FormName() {
    const { state, dispatch } = useNFTdata();

    return (
        <div class="sm:col-span-3 ">
            <label
                for="first-name"
                class="block text-sm font-medium leading-4 text-[#333333]"
            >
                Nft name
            </label>
            <div class="mt-2">
                <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autocomplete="given-name"
                    class="block w-full rounded-md border-0 px-5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#fff] sm:text-sm sm:leading-6"
                    onChange={(e) =>
                        dispatch({
                            type: "setForm",
                            payload: {
                                ...state.formParams,
                                name: e.target.value,
                            },
                        })
                    }
                    value={state.formParams.name}
                />
            </div>
        </div>
    );
}

export default FormName;
