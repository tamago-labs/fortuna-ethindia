
const { expect } = require("chai")
const { ethers } = require("hardhat")

const { BigNumber } = ethers

const { fromEther, toEther, MINIMUM_LIQUIDITY } = require("./utils")

// UNISWAP
let factory
let weth
let router
let pair

let admin
let alice
let bob

let tokenA
let tokenB

let contractX
let contractY
let contractZ

describe("Fortuna XYZ", () => {

    beforeEach(async () => {
        [admin, alice, bob] = await ethers.getSigners()

        const Factory = await ethers.getContractFactory("UniswapV2Factory");
        const Token = await ethers.getContractFactory("ERC20");
        const Weth = await ethers.getContractFactory("WETH9");
        const Router = await ethers.getContractFactory("UniswapV2Router");

        // deploy tokens on chan X
        tokenA = await Token.deploy(toEther(10000));
        tokenB = await Token.deploy(toEther(10000));
        weth = await Weth.deploy();

        factory = await Factory.deploy(admin.address)

        // deploy routers 
        router = await Router.deploy(factory.address);

        // initialize V2
        await factory.createPair(tokenA.address, tokenB.address);

        // setup Fortunate contracts
        const FortunaX = await ethers.getContractFactory("FortunaX");
        const FortunaY = await ethers.getContractFactory("FortunaY");

        contractX = await FortunaX.deploy(ethers.constants.AddressZero, 1)
        contractY = await FortunaY.deploy(router.address, ethers.constants.AddressZero, 2)
    })

    it("X Contract", async () => {

        await tokenA.approve(contractX.address, ethers.constants.MaxUint256)

        await contractX.registerToken(
            ethers.utils.formatBytes32String("TOKEN_A"),
            tokenA.address
        )

        await contractX.registerToken(
            ethers.utils.formatBytes32String("TOKEN_B"),
            tokenB.address
        )

        await contractX.pushTest(
            ethers.utils.formatBytes32String("TOKEN_A"),
            ethers.utils.formatBytes32String("TOKEN_B"),
            toEther(100)
        )

        expect(
            await tokenA.balanceOf(contractX.address)
        ).to.equal(toEther(100))

    })

    it("Y Contract", async () => {

        // Add Liquidity
        const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
        const pair = await ethers.getContractAt('UniswapV2Pair', pairAddress)

        const token0Address = await pair.token0()
        const token1Address = await pair.token1()

        const token0 = await ethers.getContractAt('ERC20', token0Address)
        const token1 = await ethers.getContractAt('ERC20', token1Address)

        const token0Amount = toEther(100)
        const token1Amount = toEther(200)

        await token0.approve(router.address, ethers.constants.MaxUint256);
        await token1.approve(router.address, ethers.constants.MaxUint256);

        await router.addLiquidity(
            token0.address,
            token1.address,
            token0Amount,
            token1Amount,
            0,
            0,
            admin.address,
            ethers.constants.MaxUint256
        )

        // Check Rates
        const rates = (await router.getAmountsOut(toEther(1), [token0.address, token1.address]))
        expect(Number(rates[0])).to.equal(1000000000000000000)
        expect(Number(rates[1])).to.equal(1974316068794122597)

        // Test Swaps
        await contractY.registerToken(
            ethers.utils.formatBytes32String("TOKEN_A"),
            token0.address
        )

        await contractY.registerToken(
            ethers.utils.formatBytes32String("TOKEN_B"),
            token1.address
        )

        await token0.approve(contractY.address, ethers.constants.MaxUint256)

        await contractY.testSwap(
            ethers.utils.formatBytes32String("TOKEN_A"),
            ethers.utils.formatBytes32String("TOKEN_B"),
            toEther(1),
            admin.address
        )

        expect(Number(await contractY.outstandings(admin.address, token1.address))).to.equal(1974316068794122597)

        await contractY.testSwap(
            ethers.utils.formatBytes32String("TOKEN_A"),
            ethers.utils.formatBytes32String("TOKEN_B"),
            toEther(1),
            admin.address
        )

    })

})