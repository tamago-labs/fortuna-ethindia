// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  // On Goerli

  const FortunaX = await hre.ethers.getContractFactory("FortunaX");
  const FortunaZ = await hre.ethers.getContractFactory("FortunaZ");

  const FortunaXContract = await FortunaX.deploy(
    "0xb35937ce4fFB5f72E90eAD83c10D33097a4F18D2",
    1735353714
  );
  const FortunaZContract = await FortunaZ.deploy(
    "0xb35937ce4fFB5f72E90eAD83c10D33097a4F18D2"
  );

  await FortunaXContract.deployed();
  await FortunaZContract.deployed();

  console.log("FortunaXContract deployed to:", FortunaXContract.address);
  console.log("FortunaZContract deployed to:", FortunaZContract.address);

  
  // set params on Remix

}

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
