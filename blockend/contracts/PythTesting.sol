// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

error InsufficientBetAmount(uint256 betAmount, uint256 requiredAmount);

contract PythTesting {

    IPyth public priceOracle;
    uint256 public betAmountInUSD = 5000000000000000000; // $5
    bytes32 public nativeToUsdPriceFeedId;

    constructor(IPyth _priceOracle, bytes32 _nativeToUsdPriceFeedId) {
        priceOracle = _priceOracle;
        nativeToUsdPriceFeedId = _nativeToUsdPriceFeedId;
    }

    function placeBet(bytes[] calldata priceUpdate) public payable {
        uint fee = priceOracle.getUpdateFee(priceUpdate);
        priceOracle.updatePriceFeeds{ value: fee }(priceUpdate);

        PythStructs.Price memory priceData = priceOracle.getPriceNoOlderThan(nativeToUsdPriceFeedId, 60);
        uint256 betAmount = getBetAmount(priceData);
        
        if(msg.value - fee < betAmount) revert InsufficientBetAmount(msg.value-fee, betAmount);
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

    function withdraw() public  {
        require(address(this).balance > 0, "No balance to withdraw");
        payable(msg.sender).transfer(address(this).balance);
    }   

}