import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Marketplace from "./components/Marketplace";
import Profile from "./components/Profile";
import SellNFT from "./components/SellNFT";
import NFTPage from "./components/NFTpage";

function App() {
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/sellNFT" element={<SellNFT />} />
                <Route path="/nftPage/:tokenId" element={<NFTPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>

            <Toaster
                position="top-right"
                gutter={12}
                containerStyle={{ margin: "8px" }}
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 5000,
                    },
                    style: {
                        fontSize: "16px",
                        maxWidth: "500px",
                        padding: "16px 24px",
                        backgroundColor: "#fff",
                        color: "black",
                    },
                }}
            />
        </div>
    );
}

export default App;
