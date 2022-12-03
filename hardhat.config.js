require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
require('dotenv').config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    goerli: {
      allowUnlimitedContractSize: true,
      url: "https://rpc.ankr.com/eth_goerli",
      // PRIVATE_KEY loaded from .env file
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    mumbai: {
      allowUnlimitedContractSize: true,
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
  }
};