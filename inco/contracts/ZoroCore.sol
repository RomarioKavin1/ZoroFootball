// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./hyperlane/Structs.sol";
import "./hyperlane/IMailbox.sol";
import "fhevm/gateway/GatewayCaller.sol";

error GameDoesNotExist(uint256 threadId, address caller);
error NotYourGame(uint256 threadId, address caller);
error NotYourTurn(uint256 threadId, address player);  
error NotMailbox();
error NotAuthorizedSender(bytes32 sender, uint32 _origin);
error NotOwner();
error NotAiAgent();
error DeckFull(uint256 threadId, address player);
error CardSlotEmpty(uint256 threadId, uint8 cardIndex, bool isPlayer);
error IsWaitingForDefence(uint256 threadId);

contract ZoroCore is IZoroCore, GatewayCaller {

    mapping(uint256 => GameState) public gameStates;
    mapping (uint256=> EncryptedGameState) public encryptedGameStates;
    mapping(uint256=>mapping(uint8=>euint8)) playerGameCards;
    mapping(uint256=>mapping(uint8=>euint8)) aiGameCards;
    mapping(uint32 => bytes32) public crosschainClients;

    mapping(uint8 => Character) public characters; 
    mapping(address => Team) public teams;
    mapping(uint256 => uint256) public requestToGameId;
    mapping(uint256 => mapping(uint8 => bool)) public isPlayerCardSlotEmpty;
    mapping(uint256 => mapping(uint8 => bool)) public isAiCardSlotEmpty;
    
    uint256 public gameCount;
    uint256 public charactersCount;
    address public owner;
    IMailbox public mailbox;
    bytes32 public baseAiClient;
    address public aiAgent;

    // Constants
    uint8 constant TURN_TIMEOUT = 30 seconds;
    uint8 constant MAX_TURNS = 20;
    uint8 constant STRIKES_FOR_GOAL = 3;
    uint8 constant HAND_SIZE = 7;
    uint32 public constant BASE_DOMAIN = 84532;

    // Events remain the same
    event GameCreated(uint256 threadId, address player, uint32 origin, uint256 betAmount);
    event MoveMade(uint256 threadId, uint8 cardIndex, bool isPlayerTurn);
    event CardDrawn(uint256 threadId, uint256 randomNumber, bool isPlayerTurn);
    event TurnCompleted(uint256 threadId, uint8 player1Card, uint8 aiCard);
    event Strike(uint256 threadId, bool isPlayerWinner);
    event Goal(uint256 threadId, bool isPlayerScorer);
    event Tie(uint256 threadId);
    event GameEnded(uint256 threadId, uint8 winner);

    constructor(address _mailbox, address _aiAgent, Character[] memory _characters, Team[] memory _teams) {    
        mailbox = IMailbox(_mailbox);
        owner = msg.sender;
        aiAgent = _aiAgent;
        _initTeams(_teams);
        _initCharacters(_characters);
    }

    modifier onlyMailbox() {
        if(msg.sender != address(mailbox)) revert NotMailbox();
        _;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) revert NotOwner();
        _;
    }
    
    function _createGame(address player, uint256 betAmount, uint256 threadId) public  {
        
        GameState storage state = gameStates[threadId];
        EncryptedGameState storage encryptedState = encryptedGameStates[threadId];
        state.lastMoveTimestamp = block.timestamp;
        state.player = player;
        state.betAmount = betAmount;
        state.isActive = true;
        state.isPlayerTurn = true;
        state.playerCardCount = HAND_SIZE;
        state.aiCardCount = HAND_SIZE;
        encryptedState.playerSeed = TFHE.randEuint32();
        encryptedState.aiSeed = TFHE.randEuint32();

        TFHE.allow(encryptedState.playerSeed, player);
        TFHE.allow(encryptedState.aiSeed, aiAgent);

        for (uint8 i = 0; i < HAND_SIZE; i++) {
            playerGameCards[threadId][i] = TFHE.randEuint8(); 
            TFHE.allow(playerGameCards[threadId][i], player);
            aiGameCards[threadId][i] = TFHE.randEuint8();
            TFHE.allow(aiGameCards[threadId][i], aiAgent);
        }
        gameCount++;
    }

    function _makeMove(uint256 threadId, uint8 cardIndex, bool isPlayer) public {
        GameState storage state = gameStates[threadId];
        EncryptedGameState storage encryptedState = encryptedGameStates[threadId];

        
        if(isPlayer) {
            if(!state.isPlayerTurn) revert NotYourTurn(threadId, state.player);
            if(isPlayerCardSlotEmpty[threadId][cardIndex]) revert CardSlotEmpty(threadId, cardIndex, true);
            encryptedState.playerMove = playerGameCards[threadId][cardIndex];
            TFHE.allow(encryptedState.playerMove, address(this));
        } else {
            if(state.isPlayerTurn) revert NotYourTurn(threadId, aiAgent);
            if(isAiCardSlotEmpty[threadId][cardIndex]) revert CardSlotEmpty(threadId, cardIndex, false);
            encryptedState.aiMove = aiGameCards[threadId][cardIndex];
            TFHE.allow(encryptedState.aiMove, address(this));
        }

        if(state.isWaitingForDefence) {
            uint256[] memory cts = new uint256[](2);
            cts[0] = Gateway.toUint256(encryptedState.playerMove);
            cts[1] = Gateway.toUint256(encryptedState.aiMove);
            requestToGameId[Gateway.requestDecryption(cts, this.processTurnCallback.selector, 0, block.timestamp + 100, false)] = threadId;
        } else {
            state.isPlayerTurn = !state.isPlayerTurn;
            state.isWaitingForDefence = true;
        }
    }

    function _drawCard(uint256 threadId, uint256 randomNumber, bool isPlayer) public {
        GameState storage state = gameStates[threadId];
        EncryptedGameState storage encryptedState = encryptedGameStates[threadId];

        if(state.isWaitingForDefence) revert IsWaitingForDefence(threadId);
        
        if(isPlayer) {
            if(!state.isPlayerTurn) revert NotYourTurn(threadId, state.player);
            if(state.playerCardCount >= HAND_SIZE) revert DeckFull(threadId, state.player);
            
            euint32 wrappedRandomNumber = TFHE.asEuint32(randomNumber);
            euint8 card = TFHE.asEuint8(TFHE.rem(TFHE.xor(wrappedRandomNumber, encryptedState.playerSeed), uint32(HAND_SIZE)));
            
            TFHE.allow(card, state.player);
            for(uint8 i = 0; i < HAND_SIZE; i++) {
                if(isPlayerCardSlotEmpty[threadId][i]) {
                    playerGameCards[threadId][i] = card;
                    isPlayerCardSlotEmpty[threadId][i] = false;
                    break;
                }
            }
            state.playerCardCount++;
        } else {
            if(state.isPlayerTurn) revert NotYourTurn(threadId, aiAgent);
            if(state.aiCardCount >= HAND_SIZE) revert DeckFull(threadId, aiAgent);
            
            euint64 wrappedRandomNumber = TFHE.asEuint64(randomNumber);
            euint8 card = TFHE.asEuint8(TFHE.rem(TFHE.xor(wrappedRandomNumber, encryptedState.aiSeed), uint64(HAND_SIZE)));
            
            TFHE.allow(card, aiAgent);
            for(uint8 i = 0; i < HAND_SIZE; i++) {
                if(isAiCardSlotEmpty[threadId][i]) {
                    aiGameCards[threadId][i] = card;
                    isAiCardSlotEmpty[threadId][i] = false;
                    break;
                }
            }
            state.aiCardCount++;
        }
    }

    function processTurnCallback(uint256 _requestId, uint8 playerMove, uint8 aiMove) external onlyGateway {
        uint256 threadId = requestToGameId[_requestId];
        GameState storage state = gameStates[threadId];
        
        bool isPlayerTurn = state.isPlayerTurn;
        uint8 winner = _computeWinner(isPlayerTurn ? aiMove : playerMove, isPlayerTurn ? playerMove : aiMove);

        if (winner != 2) {
            bool isAiStrike = (winner == 1) == isPlayerTurn;
            if (isAiStrike) {
                state.aiStrikes++;
                emit Strike(threadId, true);
            } else {
                state.playerStrikes++;
                emit Strike(threadId, false);
            }
        } else {
            emit Tie(threadId);
        }

        isPlayerCardSlotEmpty[threadId][playerMove] = true;
        isAiCardSlotEmpty[threadId][aiMove] = true;
        state.isWaitingForDefence = false;
        state.playerCardCount--;
        state.aiCardCount--;

        emit TurnCompleted(threadId, playerMove, aiMove);
    
        if(state.currentTurn == MAX_TURNS || state.playerStrikes == 3 || state.aiStrikes == 3) {
            state.isActive = false;
            emit GameEnded(threadId, state.playerStrikes > state.aiStrikes ? 1: state.aiStrikes > state.playerStrikes? 0: 2);
        }
    }

    // Helper functions
    function _initGameSeed() internal returns (euint32, euint32) {
        return (TFHE.randEuint32(), TFHE.randEuint32());
    }

    // Rest of the functions remain the same
    function _computeWinner(uint8 _attacker, uint8 _defender) internal view returns (uint8) {
        Character memory attacker = characters[_attacker];
        Character memory defender = characters[_defender];

        if (attacker.attack > defender.defence) return 0;
        if (attacker.attack < defender.defence) return 1;
        if (attacker.pace > defender.passing) return 0;
        if (attacker.pace < defender.passing) return 1;

        return 2;
    }

    function handle(uint32 _origin, bytes32 _sender, bytes calldata _data) external payable onlyMailbox {
        bool isPlayer = _validateCaller(_sender, _origin);
        (uint8 action, bytes memory payload) = abi.decode(_data, (uint8, bytes));
        
        if(action == 0) {
            (address _player, uint256 _betAmount, uint256 _threadId) = abi.decode(payload, (address, uint256, uint256));
            _createGame(_player, _betAmount, _threadId);
            emit GameCreated(_threadId, _player, _origin, _betAmount);
            gameStates[_threadId].lastMoveTimestamp = block.timestamp;
            gameStates[_threadId].currentTurn += 1;
        } else if (action == 1) {
            (address player, uint256 threadId, uint256 randomNumber) = abi.decode(payload, (address, uint256, uint256));
            if(isPlayer && gameStates[threadId].player != player) revert NotYourGame(threadId, player);
            _drawCard(threadId, randomNumber, isPlayer);
            gameStates[threadId].isPlayerTurn = !isPlayer;
            emit CardDrawn(threadId, randomNumber, isPlayer);
            gameStates[threadId].lastMoveTimestamp = block.timestamp;
            gameStates[threadId].currentTurn += 1;
        } else {
            (address player, uint256 threadId, uint8 cardIndex) = abi.decode(payload, (address, uint256, uint8));
            if(isPlayer && gameStates[threadId].player != player) revert NotYourGame(threadId, player);
            _makeMove(threadId, cardIndex, isPlayer);
            emit MoveMade(threadId, cardIndex, isPlayer);
            gameStates[threadId].lastMoveTimestamp = block.timestamp;
            gameStates[threadId].currentTurn += 1;
        }
    }

    // Remaining utility functions
    function _validateCaller(bytes32 _sender, uint32 _origin) internal view returns (bool) {
        if(crosschainClients[_origin] == _sender) return true;
        else if(_origin == BASE_DOMAIN && _sender == baseAiClient) return false;
        else revert NotAuthorizedSender(_sender, _origin);
    }

    function _initCharacters(Character[] memory _characters) internal {
        for (uint8 i = 0; i < _characters.length; i++) {
            characters[i+1] = _characters[i];
        }
        charactersCount = _characters.length;
    }

    function _initTeams(Team[] memory _teams) internal {
        for (uint8 i = 0; i < _teams.length; i++) {
            teams[_teams[i].teamFanTokenAddress] = _teams[i];
        }
    }


    function getPlayerDeck(uint256 threadId) external view returns (euint8[] memory) {
        euint8[] memory playerCards = new euint8[](HAND_SIZE);
        for(uint8 i = 0; i < HAND_SIZE; i++) {
            playerCards[i] = playerGameCards[threadId][i];
        }
        return playerCards;
    }

    function getAiDeck(uint256 threadId) external view returns (euint8[] memory) {
        euint8[] memory aiCards = new euint8[](HAND_SIZE);
        for(uint8 i = 0; i < HAND_SIZE; i++) {
            aiCards[i] = aiGameCards[threadId][i];
        }
        return aiCards;
    }

    function getPlayerGameSeed(uint256 threadId) external view returns (euint32) {
        return encryptedGameStates[threadId].playerSeed;
    }

    function getAiGameSeed(uint256 threadId) external view returns (euint32) {
        return encryptedGameStates[threadId].aiSeed;
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _bytes32) internal pure returns (address) {
        return address(uint160(uint256(_bytes32)));
    }
}
