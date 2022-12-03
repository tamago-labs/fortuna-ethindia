// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const SourceGreeting = await hre.ethers.getContractFactory('SourceGreeting');
  const sourceGreetingContract = await SourceGreeting.deploy("0xb35937ce4fFB5f72E90eAD83c10D33097a4F18D2");
  await sourceGreetingContract.deployed();
  console.log("Contract deployed to:", sourceGreetingContract.address);

  // const DGreeting = await hre.ethers.getContractFactory('DestinationGreeting');
  // const DGreetingContract = await DGreeting.deploy();
  // await DGreetingContract.deployed();
  // console.log("Contract deployed to:", DGreetingContract.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
