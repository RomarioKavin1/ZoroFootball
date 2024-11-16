// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

interface IZoroCore {
      struct Game {
        uint256 threadId;
        uint256 lastMoveTimestamp;
        uint256 betAmount;
        uint8 currentTurn;
        uint8 playerGoals;
        uint8 aiGoals;
        uint8 playerStrikes;
        uint8 aiStrikes;
        address player;
        uint8 playerCardCount;
        uint8 aiCardCount;
        euint8 playerSeed;
        euint8 aiSeed;
        euint8[] playerCards;
        euint8[] aiCards;
        euint8 playerMove;
        euint8 aiMove;
        bool isWaitingForDefence;
        bool isPlayerTurn;
        bool isActive;
    }

    struct Character {
        uint8 id;
        uint8 pace;
        uint8 attack;
        uint8 passing;
        uint8 defence;
        address teamFanTokenAddress;
        string metadata;
    }

    struct Team {
        address teamFanTokenAddress;
        string metadata;
    }
}