// Load the Hardhat plugins
require('@nomiclabs/hardhat-waffle');
require('hardhat-abi-exporter');
require("@nomiclabs/hardhat-ethers");

const MNEMONIC = process.env.MNEMONIC;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.0",
    abiExporter: {
      path: './abi/',
      clear: true,
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};