// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./hyperlane/Structs.sol";
import "./hyperlane/IMailbox.sol";
import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";

error InsufficientBetAmount(uint256 betAmount, uint256 requiredAmount);
error NotAIAgent();
error NotOwner(address owner, address caller);

contract ZoroAiClient is IEntropyConsumer {
    struct Game {
        address player;
        uint256 betAmount;
        uint256 threadId;
        bool initialized;
    }

    IMailbox public mailbox;
    IEntropy public entropy;

    uint32 public INCO_NETWORK_DOMAIN_ID = 21097;
    address public owner;
    address public zoroCore;
    address public aiAgent;
    mapping(uint64 => uint256) public sequenceNumberToThreadId;

    event AiRandomNumberRequested(uint256 threadId, uint64 sequenceNumber);
    event AiMoveDispatched(
        uint256 threadId,
        bytes32 messageId,
        uint8 cardIndex
    );
    event AiDrawCardDispatched(
        uint256 threadId,
        uint64 sequenceNumber,
        bytes32 messageId,
        uint256 randomNumber
    );

    constructor(
        IMailbox _mailbox,
        address _zoroCore,
        IEntropy _entropy,
        address _aiAgent
    ) {
        mailbox = _mailbox;
        owner = msg.sender;
        entropy = _entropy;
        aiAgent = _aiAgent;
        zoroCore = _zoroCore;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(owner, msg.sender);
        _;
    }

    modifier onlyAiAgent() {
        if (msg.sender != aiAgent) revert NotAIAgent();
        _;
    }

    function setAiAgent(address _aiAgent) external onlyOwner {
        aiAgent = _aiAgent;
    }

    function makeMove(uint256 threadId, uint8 cardIndex) external onlyAiAgent {
        bytes memory payload = abi.encode(msg.sender, threadId, cardIndex);
        bytes32 messageId = mailbox.dispatch{value: 0}(
            INCO_NETWORK_DOMAIN_ID,
            addressToBytes32(zoroCore),
            abi.encode(uint8(2), payload)
        );
        emit AiMoveDispatched(threadId, messageId, cardIndex);
    }

    function drawCard(
        uint256 threadId,
        bytes32 randomNumber
    ) external payable onlyAiAgent {
        address provider = entropy.getDefaultProvider();
        uint256 fee = entropy.getFee(provider);
        if (address(entropy) == address(0)) {
            bytes memory payload = abi.encode(
                aiAgent,
                threadId,
                uint256((randomNumber))
            );
            bytes32 messageId = mailbox.dispatch{value: 0}(
                INCO_NETWORK_DOMAIN_ID,
                addressToBytes32(zoroCore),
                abi.encode(uint8(1), payload)
            );
            emit AiDrawCardDispatched(
                threadId,
                0,
                messageId,
                uint256(randomNumber)
            );
        } else {
            uint64 sequenceNumber = entropy.requestWithCallback{value: fee}(
                provider,
                randomNumber
            );
            sequenceNumberToThreadId[sequenceNumber] = threadId;
            emit AiRandomNumberRequested(threadId, sequenceNumber);
        }
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address,
        bytes32 randomNumber
    ) internal override {
        uint256 _threadId = sequenceNumberToThreadId[sequenceNumber];
        bytes memory payload = abi.encode(
            aiAgent,
            _threadId,
            uint256(randomNumber)
        );
        bytes32 messageId = mailbox.dispatch{value: 0}(
            INCO_NETWORK_DOMAIN_ID,
            addressToBytes32(zoroCore),
            abi.encode(uint8(1), payload)
        );
        emit AiDrawCardDispatched(
            _threadId,
            sequenceNumber,
            messageId,
            uint256(randomNumber)
        );
    }

    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }

    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function getFee() public view returns (uint256) {
        return entropy.getFee(entropy.getDefaultProvider());
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
}
