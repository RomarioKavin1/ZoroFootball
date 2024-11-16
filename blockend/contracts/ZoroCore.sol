// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ! This contract is a placeholder for the actual ZoroCore contract. It is implemented in the inco folder.
// import "./hyperlane/Structs.sol";
// import "./hyperlane/IMailbox.sol";
// import "fhevm/gateway/GatewayCaller.sol";

// error GameDoesNotExist(uint256 gameId, address caller);
// error NotYourGame(uint256 gameId, address caller);
// error NotYourTurn(uint256 gameId, address player);
// error NotMailbox();
// error NotAuthorizedSender(bytes32 sender, uint32 _origin);
// error NotOwner();
// error NotAiAgent();
// error DeckFull(uint256 gameId, address player);
// error CardSlotEmpty(uint256 gameId, uint8 cardIndex, bool isPlayer);

/* is IZoroCore, GatewayCaller */ contract ZoroCore {
    // struct GameState {
    //     bool isActive;
    //     bool isPlayerTurn;
    //     bool isWaitingForDefence;
    //     uint8 playerStrikes;
    //     uint8 aiStrikes;
    //     uint8 playerGoals;
    //     uint8 aiGoals;
    //     uint8 playerCardCount;
    //     uint8 aiCardCount;
    //     uint8 currentTurn;
    //     uint256 lastMoveTimestamp;
    //     uint256 betAmount;
    //     uint256 threadId;
    //     address player;
    // }
    // struct GameCards {
    //     euint8[] playerCards;
    //     euint8[] aiCards;
    //     euint8 playerMove;
    //     euint8 aiMove;
    //     euint8 playerSeed;
    //     euint8 aiSeed;
    // }
    // mapping(uint256 => GameState) public gameStates;
    // mapping(uint256 => GameCards) private gameCards;
    // mapping(uint32 => bytes32) public crosschainClients;
    // mapping(uint8 => Character) public characters;
    // mapping(address => Team) public teams;
    // mapping(uint256 => uint256) public requestToThreadId;
    // mapping(uint256 => mapping(uint8 => bool)) public isPlayerCardSlotEmpty;
    // mapping(uint256 => mapping(uint8 => bool)) public isAiCardSlotEmpty;
    // uint256 public gameCount;
    // uint256 public charactersCount;
    // address public owner;
    // IMailbox public mailbox;
    // bytes32 public baseAiClient;
    // address public aiAgent;
    // // Constants
    // uint8 constant TURN_TIMEOUT = 30 seconds;
    // uint8 constant MAX_TURNS = 20;
    // uint8 constant STRIKES_FOR_GOAL = 3;
    // uint8 constant HAND_SIZE = 7;
    // uint32 public constant BASE_DOMAIN = 84532;
    // // Events remain the same
    // event GameCreated(uint256 gameId, address player, uint256 threadId, uint32 origin, uint256 betAmount);
    // event MoveMade(uint256 gameId, uint8 cardIndex, bool isPlayerTurn);
    // event CardDrawn(uint256 gameId, uint256 randomNumber, bool isPlayerTurn);
    // event TurnCompleted(uint256 gameId, uint8 player1Card, uint8 aiCard);
    // event Strike(uint256 gameId, bool isPlayerWinner);
    // event Goal(uint256 gameId, bool isPlayerScorer);
    // event Tie(uint256 gameId);
    // event GameEnded(uint256 gameId, uint8 winner);
    // constructor(address _mailbox, address _aiAgent, Character[] memory _characters, Team[] memory _teams) {
    //     mailbox = IMailbox(_mailbox);
    //     owner = msg.sender;
    //     aiAgent = _aiAgent;
    //     _initTeams(_teams);
    //     _initCharacters(_characters);
    // }
    // modifier makeMoveChecks(uint256 gameId) {
    //     if(!gameStates[gameId].isActive) revert GameDoesNotExist(gameId, msg.sender);
    //     if(msg.sender != gameStates[gameId].player) revert NotYourGame(gameId, msg.sender);
    //    _;
    // }
    // modifier onlyMailbox() {
    //     if(msg.sender != address(mailbox)) revert NotMailbox();
    //     _;
    // }
    // modifier onlyOwner() {
    //     if(msg.sender != owner) revert NotOwner();
    //     _;
    // }
    // modifier onlyAiAgent() {
    //     if(msg.sender != aiAgent) revert NotAiAgent();
    //     _;
    // }
    // function _createGame(address player, uint256 betAmount, uint256 threadId) internal returns (uint256 gameId) {
    //     gameId = gameCount++;
    //     GameState storage state = gameStates[gameId];
    //     state.threadId = threadId;
    //     state.lastMoveTimestamp = block.timestamp;
    //     state.player = player;
    //     state.betAmount = betAmount;
    //     state.isActive = true;
    //     state.isPlayerTurn = true;
    //     state.playerCardCount = HAND_SIZE;
    //     state.aiCardCount = HAND_SIZE;
    //     GameCards storage cards = gameCards[gameId];
    //     (cards.playerSeed, cards.aiSeed) = _initGameSeed();
    //     TFHE.allow(cards.playerSeed, player);
    //     TFHE.allow(cards.aiSeed, aiAgent);
    //     (cards.playerCards, cards.aiCards) = _dealInitialCards(player);
    // }
    // function _makeMove(uint256 gameId, uint8 cardIndex, bool isPlayer) internal {
    //     GameState storage state = gameStates[gameId];
    //     GameCards storage cards = gameCards[gameId];
    //     if(isPlayer) {
    //         if(isPlayerCardSlotEmpty[gameId][cardIndex]) revert CardSlotEmpty(gameId, cardIndex, true);
    //         cards.playerMove = cards.playerCards[cardIndex];
    //     } else {
    //         if(isAiCardSlotEmpty[gameId][cardIndex]) revert CardSlotEmpty(gameId, cardIndex, false);
    //         cards.aiMove = cards.aiCards[cardIndex];
    //     }
    //     if(state.isWaitingForDefence) {
    //         _processTurn(gameId);
    //     } else {
    //         state.isPlayerTurn = !isPlayer;
    //         state.isWaitingForDefence = true;
    //     }
    // }
    // function _drawCard(uint256 gameId, uint256 randomNumber, bool isPlayer) internal {
    //     GameState storage state = gameStates[gameId];
    //     GameCards storage cards = gameCards[gameId];
    //     if(isPlayer) {
    //         if(!state.isPlayerTurn) revert NotYourTurn(gameId, state.player);
    //         if(state.playerCardCount >= HAND_SIZE) revert DeckFull(gameId, state.player);
    //         euint64 wrappedRandomNumber = TFHE.asEuint64(randomNumber);
    //         euint8 card = TFHE.asEuint8(TFHE.rem(TFHE.xor(wrappedRandomNumber, cards.playerSeed), uint64(HAND_SIZE)));
    //         TFHE.allow(card, state.player);
    //         for(uint8 i = 0; i < HAND_SIZE; i++) {
    //             if(isPlayerCardSlotEmpty[gameId][i]) {
    //                 cards.playerCards[i] = card;
    //                 isPlayerCardSlotEmpty[gameId][i] = false;
    //                 break;
    //             }
    //         }
    //         state.playerCardCount++;
    //     } else {
    //         if(state.isPlayerTurn) revert NotYourTurn(gameId, aiAgent);
    //         if(state.aiCardCount >= HAND_SIZE) revert DeckFull(gameId, aiAgent);
    //         euint64 wrappedRandomNumber = TFHE.asEuint64(randomNumber);
    //         euint8 card = TFHE.asEuint8(TFHE.rem(TFHE.xor(wrappedRandomNumber, cards.aiSeed), uint64(HAND_SIZE)));
    //         TFHE.allow(card, aiAgent);
    //         for(uint8 i = 0; i < HAND_SIZE; i++) {
    //             if(isAiCardSlotEmpty[gameId][i]) {
    //                 cards.aiCards[i] = card;
    //                 isAiCardSlotEmpty[gameId][i] = false;
    //                 break;
    //             }
    //         }
    //         state.aiCardCount++;
    //     }
    // }
    // function _processTurn(uint256 gameId) internal {
    //     GameCards storage cards = gameCards[gameId];
    //     TFHE.allowTransient(cards.playerMove, address(this));
    //     TFHE.allowTransient(cards.aiMove, address(this));
    //     uint256[] memory cts = new uint256[](2);
    //     cts[0] = Gateway.toUint256(cards.playerMove);
    //     cts[1] = Gateway.toUint256(cards.aiMove);
    //     requestToThreadId[Gateway.requestDecryption(cts, this.processTurnCallback.selector, 0, block.timestamp + 100, false)] = gameId;
    // }
    // function processTurnCallback(uint256 _requestId, uint8 playerMove, uint8 aiMove) external onlyGateway {
    //     uint256 gameId = requestToThreadId[_requestId];
    //     GameState storage state = gameStates[gameId];
    //     bool isPlayerTurn = state.isPlayerTurn;
    //     uint8 winner = _computeWinner(isPlayerTurn ? aiMove : playerMove, isPlayerTurn ? playerMove : aiMove);
    //     if (winner != 2) {
    //         bool isAiStrike = (winner == 1) == isPlayerTurn;
    //         if (isAiStrike) {
    //             state.aiStrikes++;
    //             emit Strike(gameId, true);
    //             if (state.aiStrikes == STRIKES_FOR_GOAL) {
    //                 state.aiGoals++;
    //                 state.aiStrikes = 0;
    //                 emit Goal(gameId, true);
    //             }
    //         } else {
    //             state.playerStrikes++;
    //             emit Strike(gameId, false);
    //             if (state.playerStrikes == STRIKES_FOR_GOAL) {
    //                 state.playerGoals++;
    //                 state.playerStrikes = 0;
    //                 emit Goal(gameId, false);
    //             }
    //         }
    //     } else {
    //         emit Tie(gameId);
    //     }
    //     isPlayerCardSlotEmpty[gameId][playerMove] = true;
    //     isAiCardSlotEmpty[gameId][aiMove] = true;
    //     state.isWaitingForDefence = false;
    //     state.playerCardCount--;
    //     state.aiCardCount--;
    //     emit TurnCompleted(gameId, playerMove, aiMove);
    //     if(state.currentTurn == MAX_TURNS || state.playerGoals == 3 || state.aiGoals == 3) {
    //         state.isActive = false;
    //         emit GameEnded(gameId, state.playerGoals > state.aiGoals ? 1: state.aiGoals > state.playerGoals? 0: 2);
    //     }
    // }
    // // Helper functions
    // function _initGameSeed() internal returns (euint8, euint8) {
    //     return (TFHE.randEuint8(), TFHE.randEuint8());
    // }
    // function _dealInitialCards(address player) internal returns (euint8[] memory, euint8[] memory) {
    //     euint8[] memory playerCards = new euint8[](HAND_SIZE);
    //     euint8[] memory aiCards = new euint8[](HAND_SIZE);
    //     for (uint256 i = 0; i < HAND_SIZE; i++) {
    //         playerCards[i] = TFHE.randEuint8();
    //         TFHE.allow(playerCards[i], player);
    //         aiCards[i] = TFHE.randEuint8();
    //         TFHE.allow(aiCards[i], aiAgent);
    //     }
    //     return (playerCards, aiCards);
    // }
    // // Rest of the functions remain the same
    // function _computeWinner(uint8 _attacker, uint8 _defender) internal view returns (uint8) {
    //     Character memory attacker = characters[_attacker];
    //     Character memory defender = characters[_defender];
    //     if (attacker.attack > defender.defence) return 0;
    //     if (attacker.attack < defender.defence) return 1;
    //     if (attacker.pace > defender.passing) return 0;
    //     if (attacker.pace < defender.passing) return 1;
    //     return 2;
    // }
    // function handle(uint32 _origin, bytes32 _sender, bytes calldata _data) external payable onlyMailbox {
    //     bool isPlayer = _validateCaller(_sender, _origin);
    //     (uint8 action, bytes memory payload) = abi.decode(_data, (uint8, bytes));
    //     if(action == 0) {
    //         (address _player, uint256 _betAmount, uint256 _threadId) = abi.decode(payload, (address, uint256, uint256));
    //         uint256 _gameId = _createGame(_player, _betAmount, _threadId);
    //         emit GameCreated(_gameId, _player, _threadId, _origin, _betAmount);
    //         gameStates[_gameId].lastMoveTimestamp = block.timestamp;
    //         gameStates[_gameId].currentTurn += 1;
    //     } else if (action == 1) {
    //         (address player, uint256 gameId, uint256 randomNumber) = abi.decode(payload, (address, uint256, uint256));
    //         _drawCard(gameId, randomNumber, isPlayer);
    //         gameStates[gameId].isPlayerTurn = !isPlayer;
    //         emit CardDrawn(gameId, randomNumber, isPlayer);
    //         gameStates[gameId].lastMoveTimestamp = block.timestamp;
    //         gameStates[gameId].currentTurn += 1;
    //     } else {
    //         (address player, uint256 gameId, uint8 cardIndex) = abi.decode(payload, (address, uint256, uint8));
    //         _makeMove(gameId, cardIndex, isPlayer);
    //         emit MoveMade(gameId, cardIndex, isPlayer);
    //         gameStates[gameId].lastMoveTimestamp = block.timestamp;
    //         gameStates[gameId].currentTurn += 1;
    //     }
    // }
    // // Remaining utility functions
    // function _validateCaller(bytes32 _sender, uint32 _origin) internal view returns (bool) {
    //     if(crosschainClients[_origin] == _sender) return true;
    //     else if(_origin == BASE_DOMAIN && _sender == baseAiClient) return false;
    //     else revert NotAuthorizedSender(_sender, _origin);
    // }
    // function _initCharacters(Character[] memory _characters) internal {
    //     for (uint8 i = 0; i < _characters.length; i++) {
    //         characters[i+1] = _characters[i];
    //     }
    //     charactersCount = _characters.length;
    // }
    // function _initTeams(Team[] memory _teams) internal {
    //     for (uint8 i = 0; i < _teams.length; i++) {
    //         teams[_teams[i].teamFanTokenAddress] = _teams[i];
    //     }
    // }
    // function getGameDeck(uint256 gameId) external view returns (euint8[] memory, euint8[] memory) {
    //     return (gameCards[gameId].playerCards, gameCards[gameId].aiCards);
    // }
    // function getPlayerDeck(uint256 gameId) external view returns (euint8[] memory) {
    //     return gameCards[gameId].playerCards;
    // }
    // function getAiDeck(uint256 gameId) external view returns (euint8[] memory) {
    //     return gameCards[gameId].aiCards;
    // }
    // function getAiGameSeed(uint256 gameId) external returns (uint256) {
    //     return uint256(keccak256(abi.encodePacked(gameId, block.timestamp)));
    // }
    // function addressToBytes32(address _addr) internal pure returns (bytes32) {
    //     return bytes32(uint256(uint160(_addr)));
    // }
    // function bytes32ToAddress(bytes32 _bytes32) internal pure returns (address) {
    //     return address(uint160(uint256(_bytes32)));
    // }
}
