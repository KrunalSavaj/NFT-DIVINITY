import fullLogo from "../data/images/NFTDivinity.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { IoIosWallet } from "react-icons/io";
import { MdWallet } from "react-icons/md";
import { LiaNetworkWiredSolid } from "react-icons/lia";
import { useLocation } from "react-router";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { useNFTdata } from "../Context/NFTdata";

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
    icons: ['https://lili.co/wp-content/uploads/2022/03/blog_nft_-1-1024x683.jpg'],
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
    const { chainId, selectedNetworkId, isConnected, open, close, minLoading, loading, setListSale } =
        useNFTdata();

    const location = useLocation();

    useEffect(() => {
        if (chainId === selectedNetworkId) {
            close();
        }
    }, [chainId, selectedNetworkId]);

    return (
        <>
            <div onClick={() => setListSale(false)} className={`flex justify-between items-center my-6 opacity-80 bg-purple-300 mx-4 rounded-2xl shadow-2xl ${loading || minLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="ml-6">
                    <Link to="/" onClick={() => setListSale(false)}>
                        <img
                            src={fullLogo}
                            alt=""
                            width={180}
                            height={140}
                            className="inline-block -mt-2"
                        />
                    </Link>
                </div>

                <div className={`flex gap-40 font-semibold text-indigo-50`}>
                    <div className={`text-2xl`}>
                        <ul className="flex gap-16 items-center" >
                            {location.pathname === "/" ? (
                                <li className="hover:text-purple-400 text-purple-400">
                                    <Link>Marketplace</Link>
                                </li>
                            ) : (
                                <li className="hover:text-purple-400 ">
                                    <Link to="/">Marketplace</Link>
                                </li>
                            )}
                            {location.pathname === "/sellNFT" ? (
                                <li className="hover:text-purple-400 text-purple-400">
                                    <Link>List New NFT</Link>
                                </li>
                            ) : (
                                <li className="hover:text-purple-400">
                                    <Link to="/sellNFT">List New NFT</Link>
                                </li>
                            )}
                            {location.pathname === "/profile" ? (
                                <li className="hover:text-purple-400 text-purple-400">
                                    <Link>Profile</Link>
                                </li>
                            ) : (
                                <li className="hover:text-purple-400">
                                    <Link to="/profile">Profile</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="mr-10 font-bold text-indigo-50 text-lg">
                    <button
                        className="bg-violet-500 rounded-2xl hover:bg-violet-700 p-4"
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
                                    <LiaNetworkWiredSolid size={30} />
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
                </div>
            </div>
        </>
    );
}

export default Navbar;
