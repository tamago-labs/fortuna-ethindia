import { useState, useCallback, useReducer, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { ethers } from "ethers";
import { getProviders } from "../helper"
import ROUTER_ABI from "../abi/Router.json"
import ERC20_ABI from "../abi/ERC20.json"
import FORTUNAX_ABI from "../abi/FortunaX.json"
import FORTUNAY_ABI from "../abi/FortunaY.json"

const useContract = () => {

    const context = useWeb3React()

    const { chainId, account, library } = context

    const checkRates = useCallback(async (amountIn, testToWeth = true) => {
        const providers = getProviders()


        const { provider } = providers.find(item => item.chainId === 80001)

        const contract = new ethers.Contract(
            "0xBC1dc03FfaB03A7C48c50cF9F668F78A291E7772",
            ROUTER_ABI,
            provider
        );

        const path = testToWeth ? ["0xeDb95D8037f769B72AAab41deeC92903A98C9E16", "0xFD2AB41e083c75085807c4A65C0A14FDD93d55A9"] : ["0xFD2AB41e083c75085807c4A65C0A14FDD93d55A9", "0xeDb95D8037f769B72AAab41deeC92903A98C9E16"]

        const result = await contract.getAmountsOut(
            ethers.utils.parseEther(amountIn),
            path
        )

        console.log("output rate -->", ethers.utils.formatEther(result[0]), ethers.utils.formatEther(result[1]))

        const y = new ethers.Contract(
            "0x88EdDF8955F81D76493C949204ebF3BdBb0985f2",
            FORTUNAY_ABI,
            provider
        );

        let outstandingTest = 0
        let outstandingWeth = 0

        if (account) {
            outstandingTest = ethers.utils.formatEther(await y.balances("0xeDb95D8037f769B72AAab41deeC92903A98C9E16"))
            outstandingWeth = ethers.utils.formatEther(await y.balances("0xFD2AB41e083c75085807c4A65C0A14FDD93d55A9"))
        }

        return {
            rate: ethers.utils.formatEther(result[1]),
            outstandingTest,
            outstandingWeth
        }

    }, [account])

    const approve = useCallback(async (testToWeth = true) => {

        const erc20address = testToWeth ? "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1" : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"

        const erc20 = new ethers.Contract(
            erc20address,
            ERC20_ABI,
            library.getSigner()
        );
        const fortunaContractAddress = "0x4AdC282FBa39b0d64Cdf561679fA4311b2Afe2Ec"
        const tx = await erc20.approve(fortunaContractAddress, ethers.constants.MaxUint256)
    }, [account, library])

    const swap = useCallback(async (amount, testToWeth = true) => {

        if (!account) {
            return
        }

        // const erc20address = testToWeth ? "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1" : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"

        const fortunaContractAddress = "0x4AdC282FBa39b0d64Cdf561679fA4311b2Afe2Ec"

        // const erc20 = new ethers.Contract(
        //     erc20address,
        //     ERC20_ABI,
        //     library.getSigner()
        // );

        // console.log((await erc20.allowance(account, fortunaContractAddress)))

        // if (Number(await erc20.allowance(account, fortunaContractAddress)) !== 0) {
        // const tx = await erc20.approve(fortunaContractAddress, ethers.constants.MaxUint256)
        // await tx.wait()
        //  }

        const contract = new ethers.Contract(
            fortunaContractAddress,
            FORTUNAX_ABI,
            library.getSigner()
        );

        const from = testToWeth ? ethers.utils.formatBytes32String("TEST") : ethers.utils.formatBytes32String("WETH")
        const to = testToWeth ? ethers.utils.formatBytes32String("WETH") : ethers.utils.formatBytes32String("TEST")

        await contract.push(
            9991,
            from,
            to,
            ethers.utils.parseEther(amount)
        )

    }, [account, library])

    return {
        checkRates,
        swap,
        approve
    }
}

export default useContract