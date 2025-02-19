/* eslint-disable default-case */

export const initialState = {
    isLoading: false,
    isMinLoading: false,
    AllNft: [],
    oneNFT: {},
    fileURL: null,
    formParams: {
        name: "",
        description: "",
        price: "",
    },
    ProfileNFT: [],
    popUpSale: false,
    popUpSide: false,
    popUpEdit: false,
    popUpOffer: false,
    salePrice: "",
    wait: false,
    tokenId: "",
    selectMulNFT: [],
    selectValue: 0,
    offerPrice: "",
    AllOffer: [],
};

export function reducer(state, action) {
    switch (action.type) {
        case "Load": {
            return {
                ...state,
                isLoading: true,
            };
        }
        case "MiniLoad": {
            return {
                ...state,
                isMinLoading: true,
            };
        }
        case "LoadWait": {
            return {
                ...state,
                wait: true,
            };
        }
        case "transactionWait": {
            return {
                ...state,
                wait: false,
                isMinLoading: false,
                isLoading: true,
                popUpSale: false,
                popUpEdit: false,
                popUpSide: false,
                popUpOffer: false
            };
        }
        case "transactionSuccess": {
            return {
                ...state,
                formParams: {
                    name: "",
                    description: "",
                    price: "",
                },
                fileURL: null,
                salePrice: "",
                wait: false,
                isLoading: false,
                offerPrice: ""
            };
        }
        case "transactionFail": {
            return {
                ...state,
                isMinLoading: false,
                salePrice: "",
                wait: false,
                formParams: {
                    name: "",
                    description: "",
                    price: "",
                },
                fileURL: null,
                isLoading: false,
                offerPrice: ""
            };
        }
        case "popUpClose": {
            return {
                ...state,
                popUpSale: false,
                popUpEdit: false,
                popUpSide: false,
            };
        }
        case "sidePopup": {
            return {
                ...state,
                popUpSide: !state.popUpSide,
            };
        }
        case "sellPopup": {
            return {
                ...state,
                popUpSale: !state.popUpSale,
                salePrice: "",
            };
        }
        case "editPopup": {
            return {
                ...state,
                popUpEdit: !state.popUpEdit,
                salePrice: 0,
            };
        }
        case "LoadOff": {
            return {
                ...state,
                isLoading: false,
            };
        }
        case "dataReceived": {
            return {
                ...state,
                AllNft: action.payload,
                isLoading: false,
                isMinLoading: false,
            };
        }
        case "FileReceived": {
            return {
                ...state,
                wait: false,
                fileURL: action.payload,
            };
        }
        case "FileFailed": {
            return {
                ...state,
                wait: false,
                formParams: {
                    name: "",
                    description: "",
                    price: "",
                },
                isMinLoading: false,
            };
        }
        case "UserdataReceived": {
            return {
                ...state,
                isLoading: false,
                ProfileNFT: action.payload,
            };
        }
        case "handleListFailed": {
            return {
                ...state,
                salePrice: "",
                wait: false,
            };
        }
        case "unListTransaction": {
            return {
                ...state,
                isLoading: false,
                isMinLoading: false,
                wait: false,
                tokenId: "",
            };
        }
        case "MultiNFTTransaction": {
            return {
                ...state,
                selectMulNFT: [],
                selectValue: 0,
                isLoading: false,
                isMinLoading: false,
            };
        }
        case "setSelectValue": {
            return {
                ...state,
                // selectValue: state.selectValue += action.payload,
                selectValue: state.selectMulNFT.reduce((accumulator, item) => {
                    return (accumulator += Number(item.price));
                }, 0),
            };
        }
        case "setForm": {
            return {
                ...state,
                formParams: action.payload,
            };
        }
        case "setOneNFT": {
            return {
                ...state,
                oneNFT: action.payload,
                tokenId: action.payload.tokenId
            };
        }
        case "setSalePopup": {
            return {
                ...state,
                popUpSale: true,
                tokenId: action.payload,
            };
        }
        case "setEditPopup": {
            return {
                ...state,
                popUpEdit: true,
                tokenId: action.payload,
            };
        }
        case "setOfferPopup": {
            return {
                ...state,
                popUpOffer: !state.popUpOffer,
                tokenId: action.payload,
            };
        }
        case "setMulNFT": {
            return {
                ...state,
                selectMulNFT: state.selectMulNFT.filter(
                    (oneNft) => oneNft !== action.payload
                ),
            };
        }
        case "addMulNFT": {
            return {
                ...state,
                selectMulNFT: state.selectMulNFT.includes(action.payload)
                    ? state.selectMulNFT.filter(
                          (oneNft) => oneNft !== action.payload
                      )
                    : [...state.selectMulNFT, action.payload],
            };
        }
        case "clearMulNFT": {
            return {
                ...state,
                selectMulNFT: [],
            };
        }
        case "setSalePrice": {
            return {
                ...state,
                salePrice: action.payload,
            };
        }
        case "setOfferPrice": {
            return {
                ...state,
                offerPrice: action.payload,
            };
        }
        case "setOfferData": {
            return {
                ...state,
                AllOffer: action.payload,
            }
        }
    }
    throw Error("Unknown action: " + action.type);
}
