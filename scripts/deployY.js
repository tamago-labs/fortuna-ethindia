// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

    const wait = async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 5000)
        })
    }

    // On Mumbai

    const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const Router = await hre.ethers.getContractFactory("UniswapV2Router");

    const FortunaY = await hre.ethers.getContractFactory("FortunaY");

    const FactoryContract = await Factory.deploy(
        "0x72cA747342C37C63820121A49304C0632d83F1C4"
    );

    await FactoryContract.deployed();

    console.log("FactoryContract deployed to:", FactoryContract.address);

    await wait()

    const RouterContract = await Router.deploy(
        FactoryContract.address
    );

    await RouterContract.deployed();

    console.log("RouterContract deployed to:", RouterContract.address);

    await wait()

    const FortunaYContract = await FortunaY.deploy(
        RouterContract.address,
        "0xa2F2ed226d4569C8eC09c175DDEeF4d41Bab4627",
        9991
    )

    await FortunaYContract.deployed();

    console.log("FortunaYContract deployed to:", FortunaYContract.address);

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
