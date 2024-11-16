// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";

interface IZoroCore {
    struct GameState {
        bool isActive;
        bool isPlayerTurn;
        bool isWaitingForDefence;
        uint8 playerStrikes;
        uint8 aiStrikes;
        uint8 playerCardCount;
        uint8 aiCardCount;
        uint8 currentTurn;
        uint256 lastMoveTimestamp;
        uint256 betAmount;
        address player;
    }

    struct EncryptedGameState {
        euint8 playerMove;
        euint8 aiMove;
        euint32 playerSeed;
        euint32 aiSeed;
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