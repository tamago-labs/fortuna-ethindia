const { BigNumber, utils } = require("ethers")

exports.expandTo18Decimals = () => {
    return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

exports.getCreate2Address = (
    factoryAddress,
    [tokenA, tokenB],
    bytecode
) => {
    const [token0, token1] =
        tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
    return utils.getCreate2Address(
        factoryAddress,
        utils.keccak256(
            utils.solidityPack(["address", "address"], [token0, token1])
        ),
        utils.keccak256(bytecode)
    );
}

exports.encodePrice = (reserve0, reserve1) => {
    return [
        reserve1.mul(BigNumber.from(2).pow(112)).div(reserve0),
        reserve0.mul(BigNumber.from(2).pow(112)).div(reserve1),
    ];
}

exports.MINIMUM_LIQUIDITY = BigNumber.from(10).pow(3);

exports.UniswapVersion = "1";

exports.fromEther = (value) => {
    return ethers.utils.formatEther(value)
}

exports.fromUsdc = (value) => {
    return ethers.utils.formatUnits(value, 6)
}

exports.toEther = (value) => {
    return ethers.utils.parseEther(`${value}`)
}

exports.toUsdc = (value) => {
    return ethers.utils.parseUnits(`${value}`, 6)
}