// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import { IEntropyConsumer } from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import { IEntropy } from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "./hyperlane/Structs.sol";
import "./hyperlane/IMailbox.sol";

error InsufficientBetAmount(uint256 betAmount, uint256 requiredAmount);
error NotOwner(address owner, address caller);

contract ZoroClient is IEntropyConsumer{

    struct GameBet {
        address player;
        uint256 betAmount;
        bool initialized;
    }

    mapping(uint256 => GameBet) public gameBets;
    uint256 public gameCount;

    IPyth public priceOracle;
    IEntropy public entropy;
    IMailbox public mailbox;
    uint256 public betAmountInUSD = 5000000000000000000; // $5

    uint32 public INCO_NETWORK_DOMAIN_ID = 21097;
    bytes32 public nativeToUsdPriceFeedId;
    address public owner;
    address public zoroCore;
    mapping(uint64=>uint256) public sequenceNumberToThreadId;

    event CreateGameDisapatched(uint256 threadId, bytes32 messageId, address player, uint256 betAmount);
    event RandomNumberRequested(uint256 threadId, uint64 sequenceNumber);
    event MoveDispatched(uint256 threadId, bytes32 messageId, address player, uint8 cardIndex);
    event DrawCardDispatched(uint256 threadId, uint64 sequenceNumber, bytes32 messageId, address player, uint256 randomNumber);

    constructor(IPyth _priceOracle, IEntropy _entropy, bytes32 _nativeToUsdPriceFeedId, IMailbox _mailbox, address _zoroCore) {
        priceOracle = _priceOracle;
        nativeToUsdPriceFeedId = _nativeToUsdPriceFeedId;
        mailbox = _mailbox;
        entropy = _entropy;
        owner = msg.sender;
        zoroCore = _zoroCore;
    }


    modifier onlyOwner() {
        if(msg.sender != owner) revert NotOwner(owner, msg.sender);
        _;
    }

    function createGame(bytes[] calldata priceUpdate, uint256 threadId) external payable {
        uint fee = priceOracle.getUpdateFee(priceUpdate);
        priceOracle.updatePriceFeeds{ value: fee }(priceUpdate);

        PythStructs.Price memory priceData = priceOracle.getPriceNoOlderThan(nativeToUsdPriceFeedId, 60);
        uint256 betAmount = getBetAmount(priceData);
        
        if(msg.value - fee < betAmount) revert InsufficientBetAmount(msg.value - fee, betAmount);
        gameBets[threadId] = GameBet(msg.sender, msg.value - fee, true); 

        bytes memory payload = abi.encode(msg.sender, msg.value - fee, threadId);

        bytes32 messageId = mailbox.dispatch{value: 0}(INCO_NETWORK_DOMAIN_ID, addressToBytes32(zoroCore), abi.encode(uint8(0), payload));
        emit CreateGameDisapatched(threadId, messageId, msg.sender, msg.value - fee);
        gameCount++;
    }

    function makeMove(uint256 threadId, uint8 cardIndex) external {
        bytes memory payload = abi.encode(msg.sender, threadId, cardIndex);
        bytes32 messageId = mailbox.dispatch{value: 0}(INCO_NETWORK_DOMAIN_ID, addressToBytes32(zoroCore), abi.encode(uint8(1), payload));
        emit MoveDispatched(threadId, messageId, msg.sender, cardIndex);
    }

    function drawCard(uint256 threadId, bytes32 randomNumber) external payable {
        address provider = entropy.getDefaultProvider();
        uint256 fee = entropy.getFee(provider);
        if(address(entropy) == address(0)) {
            bytes memory payload = abi.encode(msg.sender, threadId, uint256(randomNumber));
            bytes32 messageId = mailbox.dispatch{value: 0}(INCO_NETWORK_DOMAIN_ID, addressToBytes32(zoroCore), abi.encode(uint8(1), payload));
            emit DrawCardDispatched(threadId, 0, messageId, msg.sender, uint256(randomNumber));
        }else{
            uint64 sequenceNumber = entropy.requestWithCallback{ value: fee }(
                provider,
                randomNumber
            );
            sequenceNumberToThreadId[sequenceNumber] = threadId;
            emit RandomNumberRequested(threadId, sequenceNumber);
        }
    }

    function entropyCallback(uint64 sequenceNumber, address , bytes32 randomNumber) internal override {
        uint256 threadId = sequenceNumberToThreadId[sequenceNumber];
        GameBet memory info = gameBets[threadId];
        bytes memory payload = abi.encode(info.player, threadId, uint256(randomNumber));
        bytes32 messageId = mailbox.dispatch{value: 0}(INCO_NETWORK_DOMAIN_ID, addressToBytes32(zoroCore), abi.encode(uint8(1), payload));
        emit DrawCardDispatched(threadId, sequenceNumber, messageId, info.player, uint256(randomNumber));
    }

    function getBetAmount(PythStructs.Price memory priceData) public view returns (uint256) {
        uint256 absPrice = uint256(int256(priceData.price < 0 ? -priceData.price : priceData.price));
        uint256 priceInWei = absPrice * 10 ** 18;

        uint256 absExpo = uint256(int256(priceData.expo < 0 ? -priceData.expo : priceData.expo));
        uint256 scaledPrice = uint256(priceInWei / 10 ** absExpo);

        uint256 betAmount = (betAmountInUSD * 10 ** 18) / scaledPrice;

        return betAmount;
    }

    function updatePrice(bytes[] memory priceUpdate) external payable {
        uint fee = priceOracle.getUpdateFee(priceUpdate);
        priceOracle.updatePriceFeeds{ value: fee }(priceUpdate);
    }

    function getPrice(uint256 notOlderThan) external view returns (PythStructs.Price memory ) {
        return priceOracle.getPriceNoOlderThan(nativeToUsdPriceFeedId, notOlderThan);
    }   

    function bytes32ToAddress(bytes32 _bytes32) public pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }

    function addressToBytes32(address _address) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_address)));
    }

    function withdrawValue() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }
}