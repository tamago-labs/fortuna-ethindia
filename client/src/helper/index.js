
import { ethers } from "ethers";

export const shortAddress = (address, first = 6, last = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
}

export const getProviders = () => {

    const chainIds = [ 5, 80001]
  
    return chainIds.map(chainId => {
  
      let url
  
      if (chainId === 80001) {
        url = "https://polygon-mumbai.infura.io/v3/3aa2960d9ce549d6a539421c0a94fe52"
      }

      if (chainId === 5) {
        url = "https://rpc.ankr.com/eth_goerli"
      }
  
      if (!url) {
        return
      }
  
      const provider = new ethers.providers.JsonRpcProvider(url)
  
      return {
        chainId,
        provider
      }
    })
  }