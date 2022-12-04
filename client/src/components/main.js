import { useState, useEffect, useCallback } from "react"
import { Flex, Box, Text, Image } from "rebass"
import {
    Label,
    Input,
    Select
} from '@rebass/forms'
import { ethers } from "ethers"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { Plus, ArrowRight, ArrowDown } from "react-feather" 
import InfoModal from "../modals/infoModal"
import { Button } from "rebass"
import { shortAddress } from "../helper"
import useContract from "../hooks/useContract"
import PNG from "../assets/side.png"

const Panel = styled.div` 
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 60px 20px;
    border: 1px solid black; 
    color: black; 
    margin-top: 60px;
`

const Main = () => {

    const [source, setSource] = useState("TEST")
    const [amount, setAmount] = useState("1")
    const [amountOut, setAmountOut] = useState("1")
    const [outstandingTest, setOutstandingTest] = useState("0")
    const [outstandingWeth, setOutstandingWeth] = useState("0")

    const { checkRates, swap, approve } = useContract()

    const onCheck = useCallback(async () => {

        const { rate, outstandingTest, outstandingWeth } = await checkRates(amount, source === "TEST" ? true : false)

        console.log("outstandingTest / outstandingWeth --> ", outstandingTest, outstandingWeth,)

        setAmountOut(rate)
        setOutstandingTest(outstandingTest)
        setOutstandingWeth(outstandingWeth)

    }, [checkRates, amount, source])

    const onSwap = useCallback(async () => {

        await swap(amount, source === "TEST" ? true : false)

    }, [swap, amount, source])

    const onApprove = useCallback(async () => {

        await approve(source === "TEST" ? true : false)

    }, [approve, source])


    return (
        <div style={{ display: "flex", width: "100%", marginTop: "20px" }}>
            <div style={{ marginLeft: "auto", marginRight: "auto", width: "1200px" }}>
                <Flex>
                    <Box p={2} width={[1 / 2]}>
                        <img src={PNG} width="80%" />
                    </Box>
                    <Box p={2} width={[1 / 2]}>
                        <Panel>
                            {/* <Flex>
                                <Box p={2} width={[2 / 5]}>
                                    <Select
                                        id='category'
                                        sx={{ color: "black", cursor: "pointer" }}
                                        name='category'
                                    // value={category}
                                    // disabled={loading}
                                    // onChange={(e) => {
                                    //     const value = e.target.value
                                    //     dispatch({ category: value })
                                    // }}
                                    >
                                        <option
                                            style={{ color: "black" }}
                                            value={"All"}
                                        >
                                            Goerli
                                        </option>
                                        <option
                                            style={{ color: "black" }}
                                            value={"Architecture"}
                                        >
                                            Mumbai
                                        </option>
                                    </Select>
                                </Box>
                                <Box p={2} width={[1 / 5]} style={{ display: "flex" }}>
                                    <div style={{ margin: "auto" }}>
                                        <ArrowRight />
                                    </div>
                                </Box>
                                <Box p={2} width={[2 / 5]}>
                                    <Select
                                        id='category'
                                        sx={{ color: "black", cursor: "pointer" }}
                                        name='category'
                                    // value={category}
                                    // disabled={loading}
                                    // onChange={(e) => {
                                    //     const value = e.target.value
                                    //     dispatch({ category: value })
                                    // }}
                                    >
                                        <option
                                            style={{ color: "black" }}
                                            value={"All"}
                                        >
                                            Mumbai
                                        </option>
                                        <option
                                            style={{ color: "black" }}
                                            value={"Architecture"}
                                        >
                                            Goerli
                                        </option>
                                    </Select>
                                </Box>
                            </Flex> */}

                            <Flex>
                                <Box p={2} width={[1 / 2]}>
                                    <Text
                                        fontSize={[3, 4]}
                                        fontWeight='bold'
                                        color='primary'>
                                        From
                                    </Text>
                                </Box>
                                <Box p={2} width={[1 / 2]}>
                                    <Select
                                        id='category'
                                        sx={{ color: "black", cursor: "pointer" }}
                                        name='category'
                                    // value={category}
                                    // disabled={loading}
                                    // onChange={(e) => {
                                    //     const value = e.target.value
                                    //     dispatch({ category: value })
                                    // }}
                                    >
                                        <option
                                            style={{ color: "black" }}
                                            value={"All"}
                                        >
                                            Goerli
                                        </option>
                                        <option
                                            style={{ color: "black" }}
                                            value={"Architecture"}
                                        >
                                            Mumbai
                                        </option>
                                    </Select>
                                </Box>
                            </Flex>

                            <Flex pt={2}>
                                <Box p={2} width={[1 / 3]}>
                                    <Select
                                        id='category'
                                        sx={{ color: "black", cursor: "pointer" }}
                                        name='category'
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                    >
                                        <option
                                            style={{ color: "black" }}
                                            value={"TEST"}
                                        >
                                            TEST
                                        </option>
                                        <option
                                            style={{ color: "black" }}
                                            value={"WETH"}
                                        >
                                            WETH
                                        </option>
                                    </Select>
                                </Box>
                                <Box p={2} width={[2 / 3]}>
                                    <Input
                                        value={amount}
                                        id='newPrice'
                                        name='newPrice'
                                        type='number'
                                        step={"0.1"}
                                        // style={{ borderColor: errors['title'] && "red" }}
                                        // placeholder={t("titlePlaceHolder")}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </Box>
                            </Flex>
                            <div style={{ display: "flex", padding: "20px" }}>
                                <div style={{ margin: "auto" }}>
                                    <ArrowDown />
                                </div>
                            </div>
                            <Flex>
                                <Box p={2} width={[1 / 2]}>
                                    <Text
                                        fontSize={[3, 4]}
                                        fontWeight='bold'
                                        color='primary'>
                                        To
                                    </Text>
                                </Box>
                                <Box p={2} width={[1 / 2]}>
                                    <Select
                                        id='category'
                                        sx={{ color: "black", cursor: "pointer" }}
                                        name='category'
                                    // value={category}
                                    // disabled={loading}
                                    // onChange={(e) => {
                                    //     const value = e.target.value
                                    //     dispatch({ category: value })
                                    // }}
                                    >
                                        <option
                                            style={{ color: "black" }}
                                            value={"All"}
                                        >
                                            Mumbai
                                        </option>
                                        <option
                                            style={{ color: "black" }}
                                            value={"Architecture"}
                                        >
                                            Goerli
                                        </option>
                                    </Select>
                                </Box>
                            </Flex>

                            <Flex pt={2}>

                                <Box p={2} width={[1 / 3]}>
                                    <Select
                                        id='category'
                                        sx={{ color: "black", cursor: "pointer" }}
                                        name='category'

                                    >
                                        <option
                                            style={{ color: "black" }}
                                            value={"All"}
                                        >
                                            {source === "TEST" ? "WETH" : "TEST"}
                                        </option>
                                    </Select>
                                </Box>
                                <Box p={2} width={[2 / 3]}>
                                    <Input
                                        //  value={newPrice}
                                        value={amountOut}
                                        id='newPrice'
                                        name='newPrice'
                                        type='number'
                                        step={"0.1"}
                                        disabled
                                    // style={{ borderColor: errors['title'] && "red" }}
                                    // placeholder={t("titlePlaceHolder")}
                                    //  onChange={(e) => setNewPrice(e.target.value)}
                                    />
                                </Box>
                            </Flex>
                            <br />
                            <hr />
                            <div style={{ textAlign: "center", padding: "10px" }}>
                                <Button onClick={onCheck} style={{ background: "blue", cursor: "pointer", marginRight: "5px" }}>
                                    Check
                                </Button>
                                {` `}
                                <Button onClick={onApprove} style={{ background: "blue", cursor: "pointer", marginRight: "5px" }}>
                                    Approve
                                </Button>
                                {` `}
                                <Button onClick={onSwap} style={{ background: "blue", cursor: "pointer" }}>
                                    Swap
                                </Button>
                            </div>
                            <div style={{ textAlign: "center", marginTop: "10px" }}>
                                Outstandings
                            </div>
                            <Flex p={2}  >
                                <Box style={{ textAlign: "center" }} width={[1 / 2]}>
                                    TEST
                                </Box>
                                <Box width={[1 / 2]}>
                                    {outstandingTest}
                                </Box>
                            </Flex>
                            <Flex p={2} >
                                <Box style={{ textAlign: "center" }} width={[1 / 2]}>
                                    WETH
                                </Box>
                                <Box width={[1 / 2]}>
                                    {outstandingWeth}
                                </Box>
                            </Flex>
                        </Panel>
                    </Box>
                </Flex>
            </div>
        </div>
    )
}

export default Main