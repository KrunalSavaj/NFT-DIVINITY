require("dotenv").config();

//const pinataSDK = require("@pinata/sdk");
const axios = require("axios");

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

export const uploadFileToIPFS = async (file) => {
    if (file) {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: `${key}`,
                    pinata_secret_api_key: `${secret}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("image uploaded", resFile.data.IpfsHash);
            return {
                success: true,
                pinataURL:
                    "https://gateway.pinata.cloud/ipfs/" +
                    resFile.data.IpfsHash,
            };
        } catch (error) {
            console.log("Error sending File to IPFS: ");
            console.log(error);
        }
    }
};

const FormData = require("form-data");

export const uploadJSONToIPFS = async (JSONBody) => {
    console.log(JSONBody);

    if (JSONBody) {
        try {
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: JSONBody,
                headers: {
                    pinata_api_key: `${key}`,
                    pinata_secret_api_key: `${secret}`,
                    // "Content-Type": "multipart/form-data",
                },
            });

            console.log("JSON uploaded", resFile.data.IpfsHash);
            return {
                success: true,
                pinataURL:
                    "https://gateway.pinata.cloud/ipfs/" +
                    resFile.data.IpfsHash,
            };
        } catch (error) {
            console.log("Error sending File to IPFS: ");
            console.log(error);
        }
    }
};

