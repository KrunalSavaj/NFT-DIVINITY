/* eslint-disable no-undef */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
const fs = require("fs");
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/8lEhBwFsV3jkC6nlRzSWDXdNOd4I4xVR",
            accounts: [
                "3b4063d1d1845738e96b44955d120e52b94a4addc56910b29ed12beedc1d8fa8",
            ],
        },
        mumbai: {
            url: "https://polygon-mumbai.g.alchemy.com/v2/G6NYBxPOQi_jAmhwsCqf0oB_0zptZtdI",
            accounts: [
                "e34f565805cd0318907a0e7a0c283cb374e6cb7866daef11a6f6591a827fc5bf",
            ],
        },
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    etherscan: {
        apiKey: "X2C8CZPRYY8KGE7EIPEXPZJQP89AHRW8IM",
    },
    sourcify: {
        // Disabled by default
        // Doesn't need an API key
        enabled: true,
    },
};
