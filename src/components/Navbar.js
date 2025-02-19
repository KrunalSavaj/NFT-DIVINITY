import fullLogo from "../data/images/MicrosoftTeams-image.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { IoIosWallet } from "react-icons/io";
import { MdOutlineShoppingCart, MdWallet } from "react-icons/md";
import { LiaNetworkWiredSolid } from "react-icons/lia";
import { useLocation } from "react-router";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { useNFTdata } from "../Context/NFTdata";
import Aside from "./../ui/Aside";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "17bf86727f5389ce321c4acaf68adec8";

// 2. Set chains
const mumbai = {
    chainId: 80001,
    name: "mumbai",
    currency: "MATIC",
    explorerUrl: "https://mumbai.polygonscan.com",
    rpcUrl: "https://polygon-mumbai.infura.io/v3/1c00b83ee16046a99e96b3592a56d3cf",
};

// 3. Create modal
const metadata = {
    name: "NFT Divinity",
    description: "NFT Marketplace",
    url: "http://localhost:3000",
    icons: [
        "https://lili.co/wp-content/uploads/2022/03/blog_nft_-1-1024x683.jpg",
    ],
};

createWeb3Modal({
    ethersConfig: defaultConfig({
        metadata,
        defaultChainId: 80001,
        enableEIP6963: true,
        enableInjected: true,
        enableCoinbase: true,
        rpcUrl: "https://polygon-mumbai.infura.io/v3/1c00b83ee16046a99e96b3592a56d3cf", // used for the Coinbase SDK
    }),
    chains: [mumbai],
    projectId,
});

function Navbar() {
    const {
        state,
        dispatch,
        chainId,
        selectedNetworkId,
        isConnected,
        open,
        close,
    } = useNFTdata();

    const location = useLocation();

    useEffect(() => {
        if (chainId === selectedNetworkId) {
            close();
        }
    }, [chainId, selectedNetworkId]);

    return (
        <>
            <div className="">
                <div className="">
                    <div
                        className={`flex justify-between items-center mt-5 opacity-90 bg-[#34495E] px-3 py-1 rounded-2xl shadow font-roboto`}
                    >
                        <div className="">
                            <Link to="/">
                                <img
                                    src={fullLogo}
                                    alt=""
                                    width={200}
                                    height={170}
                                    className="inline-block -m-1"
                                />
                            </Link>
                        </div>

                        <div
                            className={`flex font-semibold text-[#ECF0F1] gap-10`}
                        >
                            <div className={`text-2xl grid items-center`}>
                                <ul className="flex gap-12 ">
                                    {location.pathname === "/" ? (
                                        <li className="text-[#5DADE2]">
                                            <Link>Marketplace</Link>
                                        </li>
                                    ) : (
                                        <li className="hover:text-[#5DADE2] ">
                                            <Link to="/">Marketplace</Link>
                                        </li>
                                    )}
                                    {location.pathname === "/sellNFT" ? (
                                        <li className="text-[#5DADE2]">
                                            <Link>List New NFT</Link>
                                        </li>
                                    ) : (
                                        <li className="hover:text-[#5DADE2] ">
                                            <Link to="/sellNFT">
                                                List New NFT
                                            </Link>
                                        </li>
                                    )}
                                    {location.pathname === "/profile" ? (
                                        <li className=" text-[#5DADE2]">
                                            <Link>Profile</Link>
                                        </li>
                                    ) : (
                                        <li className="hover:text-[#5DADE2] ">
                                            <Link to="/profile">Profile</Link>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="font-bold text-[#ECF0F1] text-lg flex gap-5">
                                <button
                                    className="bg-[#F39C12] rounded-2xl hover:bg-[#D35400] p-4"
                                    onClick={() =>
                                        isConnected
                                            ? selectedNetworkId !== chainId
                                                ? open({ view: "Networks" })
                                                : open()
                                            : open()
                                    }
                                >
                                    {!isConnected ? (
                                        <div className="flex gap-2">
                                            <div>
                                                <IoIosWallet size={30} />
                                            </div>
                                            <div>Wallet login</div>
                                        </div>
                                    ) : selectedNetworkId !== chainId ? (
                                        <div className="flex gap-2">
                                            <div>
                                                <LiaNetworkWiredSolid
                                                    size={30}
                                                />
                                            </div>
                                            <div>Switch Networks</div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <div>
                                                <MdWallet size={30} />{" "}
                                            </div>
                                            <div>Wallet Connected</div>
                                        </div>
                                    )}
                                </button>

                                <button
                                    onClick={() =>
                                        dispatch({ type: "sidePopup" })
                                    }
                                    className={`${
                                        state.selectMulNFT.length > 0
                                            ? "bg-[#27ae5f]"
                                            : "bg-[#27AE60]"
                                    } rounded-2xl hover:bg-[#1E8449] h-12 w-12  flex justify-center items-center`}
                                >
                                    <div className="relative">
                                        {state.selectMulNFT.length > 0 ? (
                                            <div className="absolute -top-2 -right-1 bg-blue-600 rounded-full text-center p-1 text-sm leading-3">
                                                {state.selectMulNFT.length}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <MdOutlineShoppingCart size={30} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {state.popUpSide && <Aside />}
            </div>
        </>
    );
}

export default Navbar;
