require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, INFURA_API_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // For local testing
    },
    baseSepolia: {
      url: `https://sepolia.base.org/eth`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 Gwei
    },
    arbitrumSepolia: {
      url: `https://sepolia-rollup.arbitrum.io/rpc`,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 Gwei
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: ETHERSCAN_API_KEY,
      arbitrumSepolia: ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          api: "https://api-sepolia.basescan.org/api",
          browser: "https://sepolia.basescan.org"
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          api: "https://api-sepolia.arbiscan.io/api",
          browser: "https://sepolia.arbiscan.io/"
        }
      }
    ]
  }
};