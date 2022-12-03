// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.15;

//solhint-disable not-rely-on-time
//solhint-disable var-name-mixedcase
//solhint-disable reason-string

import {IXReceiver} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IConnext} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";

import "./UniswapV2/interfaces/IUniswapV2Router.sol";

contract FortunaY is IXReceiver {
    IUniswapV2Router router;
    uint256 public domainId;
    IConnext public connext;

    // where we keep the Z address
    mapping(uint32 => address) private targetZ;
    // registered tokens (SYMBOL -> address)
    mapping(bytes32 => address) public tokens;
    // balances before receive the returned tokens from DEX
    mapping(address => uint256) public balances;

    // Outstanding
    mapping(address => mapping(address => uint256)) public outstandings;

    uint256 MAX_UINT = 1000000000000000000000000;

    constructor(
        address _router,
        IConnext _connext,
        uint256 _domainId
    ) {
        domainId = _domainId;
        connext = _connext;
        router = IUniswapV2Router(_router);
    }

    function registerTarget(uint32 _destinationId, address _contractAddress)
        external
    {
        targetZ[_destinationId] = _contractAddress;
    }

    function registerToken(bytes32 _tokenSymbol, address _tokenAddress)
        external
    {
        tokens[_tokenSymbol] = _tokenAddress;
        IERC20(_tokenAddress).approve(address(router), MAX_UINT);
        IERC20(_tokenAddress).approve(address(connext), MAX_UINT);
    }

    function xReceive(
        bytes32 _transferId,
        uint256 _amount,
        address _asset,
        address _originSender,
        uint32 _origin,
        bytes memory _callData
    ) external returns (bytes memory) {
        // Unpack the _callData
        (bytes32 fromToken, bytes32 toToken) = abi.decode(
            _callData,
            (bytes32, bytes32)
        );

        address[] memory addresses = new address[](2);
        addresses[0] = tokens[fromToken];
        addresses[1] = tokens[toToken];

        _swap(fromToken, toToken, _amount, _originSender);
    }

    function testSwap(
        bytes32 _fromToken,
        bytes32 _toToken,
        uint256 _amount,
        address _sender
    ) external {
        IERC20 fromTokenContract = IERC20(tokens[_fromToken]);

        require(
            fromTokenContract.allowance(msg.sender, address(this)) >= _amount,
            "User must approve amount"
        );

        fromTokenContract.transferFrom(msg.sender, address(this), _amount);

        _swap(_fromToken, _toToken, _amount, _sender);
    }

    function _swap(
        bytes32 _fromToken,
        bytes32 _toToken,
        uint256 _amount,
        address _sender
    ) internal {
        address[] memory addresses = new address[](2);
        addresses[0] = tokens[_fromToken];
        addresses[1] = tokens[_toToken];

        router.swapExactTokensForTokens(
            _amount,
            0,
            addresses,
            address(this),
            MAX_UINT
        );

        IERC20 toTokenContract = IERC20(tokens[_toToken]);

        uint256 current = toTokenContract.balanceOf(address(this));
        uint256 diff = current - balances[tokens[_toToken]];

        balances[tokens[_toToken]] = toTokenContract.balanceOf(address(this));

        outstandings[_sender][tokens[_toToken]] += diff;
    }

    function push(
        uint32 destination,
        address sender,
        bytes32 token
    ) external {
        address target = targetZ[destination];

        bytes memory callData = abi.encode(sender, token);

        uint256 amount = outstandings[sender][tokens[token]];

        uint256 relayerFee = 0;
        connext.xcall{value: relayerFee}(
            destination, // _destination: Domain ID of the destination chain
            target, // _to: address of the target contract
            address(tokens[token]), // _asset: address of the token contract
            msg.sender, // _delegate: address that can revert or forceLocal on destination
            amount, // _amount: amount of tokens to transfer
            30, // _slippage: the max slippage the user will accept in BPS (0.3%)
            callData // _callData: the encoded calldata to send
        );

        outstandings[sender][tokens[token]] = 0;
    }
}
