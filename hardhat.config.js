require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // solidity: "0.8.17",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    goerli: {
      allowUnlimitedContractSize: true,
      url: "https://rpc.ankr.com/eth_goerli",
      // PRIVATE_KEY loaded from .env file
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      // gas: 1000000000
    },
    mumbai: {
      allowUnlimitedContractSize: true,
      url: "https://polygon-mumbai.infura.io/v3/3aa2960d9ce549d6a539421c0a94fe52",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gas: 8000000000
    },
  }
};