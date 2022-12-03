

const { expect } = require("chai")
const { ethers } = require("hardhat")

const { BigNumber } = ethers

const { fromEther, toEther, MINIMUM_LIQUIDITY } = require("./utils")

let factory
let tokenA
let tokenB
let weth
let router
let pair

// Test out common Uniswap functions

describe("UniswapV2 contract", () => {

    beforeEach(async () => {
        [admin, user] = await ethers.getSigners()

        const Factory = await ethers.getContractFactory("UniswapV2Factory");
        const Token = await ethers.getContractFactory("ERC20");
        const Weth = await ethers.getContractFactory("WETH9");
        const Router = await ethers.getContractFactory("UniswapV2Router");
        // const routerEmit = await ethers.getContractFactory("RouterEventEmitter");
        // const RouterEmit = await routerEmit.deploy();

        factory = await Factory.deploy(admin.address)
        // deploy tokens
        tokenA = await Token.deploy(toEther(10000));
        tokenB = await Token.deploy(toEther(10000));
        weth = await Weth.deploy();

        // deploy routers 
        router = await Router.deploy(factory.address, weth.address);

        // initialize V2
        await factory.createPair(tokenA.address, tokenB.address);
    })

    it("pairAddress", async () => {

        // const pairAddress = await factory.getPair(tokenA.address, tokenB.address);

        // pair = await ethers.getContractAt('UniswapV2Pair', pairAddress)

        // const token0Address = await pair.token0()
        // const token1Address = await pair.token1()

        // expect(tokenA.address).to.equal(token0Address)
        // expect(tokenB.address).to.equal(token1Address)
    })

    it("addLiquidity", async () => {

        const pairAddress = await factory.getPair(tokenA.address, tokenB.address);

        pair = await ethers.getContractAt('UniswapV2Pair', pairAddress)

        const token0Address = await pair.token0()
        const token1Address = await pair.token1()

        const token0 = await ethers.getContractAt('ERC20', token0Address)
        const token1 = await ethers.getContractAt('ERC20', token1Address)

        const token0Amount = toEther(1)
        const token1Amount = toEther(4)

        const expectedLiquidity = toEther(2);

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

        expect(await pair.balanceOf(admin.address)).to.eq(
            expectedLiquidity.sub(MINIMUM_LIQUIDITY)
        );

    })

    it("swap", async () => {

        const pairAddress = await factory.getPair(tokenA.address, tokenB.address);

        pair = await ethers.getContractAt('UniswapV2Pair', pairAddress)

        const token0Address = await pair.token0()
        const token1Address = await pair.token1()

        const token0 = await ethers.getContractAt('ERC20', token0Address)
        const token1 = await ethers.getContractAt('ERC20', token1Address)

        const token0Amount = toEther(5);
        const token1Amount = toEther(10);
        const swapAmount = toEther(1);
        const expectedOutputAmount = BigNumber.from("1662497915624478906");

        // before each
        await token0.transfer(pair.address, token0Amount);
        await token1.transfer(pair.address, token1Amount);
        await pair.mint(admin.address);

        await token0.approve(router.address, ethers.constants.MaxUint256);

        await expect(
            router.swapExactTokensForTokens(
                swapAmount,
                0,
                [token0.address, token1.address],
                admin.address,
                ethers.constants.MaxUint256
            )
        )
            .to.emit(token0, "Transfer")
            .withArgs(admin.address, pair.address, swapAmount)
            .to.emit(token1, "Transfer")
            .withArgs(pair.address, admin.address, expectedOutputAmount)
            .to.emit(pair, "Sync")
            .withArgs(
                token0Amount.add(swapAmount),
                token1Amount.sub(expectedOutputAmount)
            )
            .to.emit(pair, "Swap")
            .withArgs(
                router.address,
                swapAmount,
                0,
                0,
                expectedOutputAmount,
                admin.address
            );
    })


})