// Load the Hardhat plugins
require('@nomiclabs/hardhat-waffle');
require('hardhat-abi-exporter');

module.exports = {
  solidity: '0.8.0',
  abiExporter: {
    path: './abi/',
    clear: true,
  },
};