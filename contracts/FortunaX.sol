// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.15;

//solhint-disable not-rely-on-time
//solhint-disable var-name-mixedcase
//solhint-disable reason-string

import {IConnext} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FortunaX {
    // Connext ID
    uint32 public domainId;
    IConnext public connext;

    // where we keep the Y address
    mapping(uint32 => address) private targetY;
    // registered tokens (SYMBOL -> address)
    mapping(bytes32 => address) public tokens;

    uint256 MAX_UINT = 1000000000000000000000000;

    constructor(IConnext _connext, uint32 _domainId) {
        connext = _connext;
        domainId = _domainId;
    }

    function registerToken(bytes32 _tokenSymbol, address _tokenAddress)
        external
    {
        tokens[_tokenSymbol] = _tokenAddress;

        IERC20(_tokenAddress).approve(address(connext), MAX_UINT);
    }

    function registerTarget(uint32 _destinationId, address _contractAddress)
        external
    {
        targetY[_destinationId] = _contractAddress;
    }

    function push(
        uint32 destination,
        bytes32 fromToken,
        bytes32 toToken,
        uint256 amount
    ) external {
        IERC20 fromTokenContract = IERC20(tokens[fromToken]);

        require(
            fromTokenContract.allowance(msg.sender, address(this)) >= amount,
            "User must approve amount"
        );

        address target = targetY[destination];

        // User sends funds to this contract
        fromTokenContract.transferFrom(msg.sender, address(this), amount);

        bytes memory callData = abi.encode(fromToken, toToken, msg.sender);

        uint256 relayerFee = 0;
        connext.xcall{value: relayerFee}(
            destination, // _destination: Domain ID of the destination chain
            target, // _to: address of the target contract
            address(fromTokenContract), // _asset: address of the token contract
            msg.sender, // _delegate: address that can revert or forceLocal on destination
            amount, // _amount: amount of tokens to transfer
            30, // _slippage: the max slippage the user will accept in BPS (0.3%)
            callData // _callData: the encoded calldata to send
        );
    }

    // for local testing
    function pushTest(
        bytes32 fromToken,
        bytes32 toToken,
        uint256 amount
    ) external {
        IERC20 fromTokenContract = IERC20(tokens[fromToken]);

        require(
            fromTokenContract.allowance(msg.sender, address(this)) >= amount,
            "User must approve amount"
        );

        // User sends funds to this contract
        fromTokenContract.transferFrom(msg.sender, address(this), amount);
    }
}
