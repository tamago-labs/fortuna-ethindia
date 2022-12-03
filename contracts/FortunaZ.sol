// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.15;

//solhint-disable not-rely-on-time
//solhint-disable var-name-mixedcase
//solhint-disable reason-string

import {IXReceiver} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IXReceiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IConnext} from "@connext/nxtp-contracts/contracts/core/connext/interfaces/IConnext.sol";

contract FortunaZ is IXReceiver {
    uint256 public domainId;
    IConnext public connext;

    // registered tokens (SYMBOL -> address)
    mapping(bytes32 => address) public tokens;

    constructor(IConnext _connext) {
        connext = _connext;
    }

    function registerToken(bytes32 _tokenSymbol, address _tokenAddress)
        external
    {
        tokens[_tokenSymbol] = _tokenAddress;
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
        (address recipient, bytes32 token) = abi.decode(
            _callData,
            (address, bytes32)
        );

        address tokenAddress = tokens[token];

        IERC20(tokenAddress).transfer(recipient, _amount);
    }
}
