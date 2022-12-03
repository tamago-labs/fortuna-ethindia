import { InjectedConnector } from "@web3-react/injected-connector"

export const injected = new InjectedConnector()

// export const SUPPORT_CHAINS = [31415]

export const Connectors = [
    {
        name: "MetaMask",
        connector: injected
    }
]

// export const CONTRACT_ADDRESS = "0x32df438De10D1Bc406a005bf7534750CE0bEEa7E"

// export const TOKEN_IDS = [1, 2]