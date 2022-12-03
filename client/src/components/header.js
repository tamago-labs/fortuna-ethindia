
import { useState } from "react"
import { Flex, Box, Text, Image } from "rebass"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import LogoPNG from '../assets/logo.png'
import { Button } from "./base"
import { Connectors, SUPPORT_CHAINS } from "../constants";
import { shortAddress } from "../helper"

const Container = styled(Flex)`
     
    a {
        color: inherit;
        :not(:first-child) {
            margin-left: 15px;
        }
    }
`

const Header = () => {

    const context = useWeb3React()
    const { account, activate, deactivate, error, chainId } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()

    return (
        <div style={{ display: "flex", width: "100%" }}>
            <div style={{width : "1000px", margin : "auto"}}>
                <Container style={{ }} p={2}>
                    <Box p={2} width={[1 / 2]}>
                        <Text
                            fontSize={[3, 4, 5]}
                            fontWeight='bold'
                            color='primary'>
                            Fortuna
                        </Text>

                    </Box>

                    <Box p={2} style={{ display: "flex" }} width={[1 / 2]}>
                        <div style={{ margin: "auto", marginRight: "0px" }}>
                            {!account && Connectors && Connectors.map((item, i) => (
                                <Button
                                    onClick={() => {
                                        setActivatingConnector(item.connector)
                                        activate(item.connector)
                                    }}
                                    key={i} >
                                    Connect Wallet
                                </Button>
                            ))}
                            {
                                account &&
                                <div>
                                    {shortAddress(account)}{` `}(Chain : {chainId})
                                </div>
                            }
                        </div>
                    </Box>
                </Container>
            </div>
           
        </div>

    )
}

export default Header