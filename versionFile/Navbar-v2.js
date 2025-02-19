import fullLogo from "../data/images/NFTDivinity.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router";

import {
    createWeb3Modal,
    defaultConfig,
    useWeb3Modal,
    useWeb3ModalAccount,
    useWeb3ModalState,
} from "@web3modal/ethers/react";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "17bf86727f5389ce321c4acaf68adec8";

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://mainnet.infura.io/v3/1c00b83ee16046a99e96b3592a56d3cf",
};

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
    url: "http://localhost:3000.com",
    icons: [fullLogo],
};

// createWeb3Modal({
//     ethersConfig: defaultConfig({ metadata }),
//     defaultChain: [mumbai],
//     projectId,
// });

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
    const { selectedNetworkId } = useWeb3ModalState();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();

    const location = useLocation();

    function updateButton() {
        const ethereumButton = document.querySelector(".enableEthereumButton");
        ethereumButton.textContent = "Connected";
        ethereumButton.classList.remove("hover:bg-blue-70");
        ethereumButton.classList.remove("bg-blue-500");
        ethereumButton.classList.add("hover:bg-green-70");
        ethereumButton.classList.add("bg-green-500");
    }

    async function getOpen() {
        open({ view: "Networks" });
    }

    useEffect(() => {
        if (isConnected === true) {
            updateButton();
        }
    }, [isConnected]);

    return (
        <div className="">
            <nav className="w-screen">
                <ul className="flex items-end justify-between py-3 bg-transparent text-white pr-5">
                    <li className="flex items-end ml-5 pb-2">
                        <Link to="/">
                            <img
                                src={fullLogo}
                                alt=""
                                width={180}
                                height={140}
                                className="inline-block -mt-2"
                            />
                            {/* <div className="inline-block font-bold text-xl ml-2">
                                NFT Marketplace
                            </div> */}
                        </Link>
                    </li>
                    <li className="w-2/6">
                        <ul className="lg:flex justify-between font-bold mr-10 text-lg">
                            {location.pathname === "/" ? (
                                <li className="border-b-2 hover:pb-0 p-2">
                                    <Link to="/">Marketplace</Link>
                                </li>
                            ) : (
                                <li className="hover:border-b-2 hover:pb-0 p-2">
                                    <Link to="/">Marketplace</Link>
                                </li>
                            )}
                            {location.pathname === "/sellNFT" ? (
                                <li className="border-b-2 hover:pb-0 p-2">
                                    <Link to="/sellNFT">List My NFT</Link>
                                </li>
                            ) : (
                                <li className="hover:border-b-2 hover:pb-0 p-2">
                                    <Link to="/sellNFT">List My NFT</Link>
                                </li>
                            )}
                            {location.pathname === "/profile" ? (
                                <li className="border-b-2 hover:pb-0 p-2">
                                    <Link to="/profile">Profile</Link>
                                </li>
                            ) : (
                                <li className="hover:border-b-2 hover:pb-0 p-2">
                                    <Link to="/profile">Profile</Link>
                                </li>
                            )}
                            <li>
                                <button
                                    className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                    onClick={() =>  open()}
                                >
                                    {isConnected
                                        ? "Connected"
                                        : "Connect Wallet"}
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div className="text-white text-bold text-right mr-10 text-sm">
                {isConnected ? (
                    <p>Connected to</p>
                ) : (
                    <p>Not Connected. Please login to view NFTs</p>
                )}
                {isConnected ? address.substring(0, 15) + "..." : " "}
            </div>
        </div>
    );
}

export default Navbar;
