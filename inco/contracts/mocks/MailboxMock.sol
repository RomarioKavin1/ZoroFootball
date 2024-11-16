// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MailboxMock {
    function dispatch(
        uint32 _destinationDomain,
        bytes32 _recipientAddress,
        bytes calldata _messageBody
    ) external payable returns (bytes32) {
        return bytes32(0);
    }

    function process(bytes calldata _metadata, bytes calldata _message)
        external
        returns (bool success)
    {
        return true;
    }
}