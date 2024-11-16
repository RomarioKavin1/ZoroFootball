const { ethers, parseEther, formatEther } = require("ethers");
const { networks } = require("../../networks");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.incoTestnet.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  console.log("Getting the game...");

  const abi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "gameId",
          type: "uint256",
        },
      ],
      name: "getDeck",
      outputs: [
        {
          internalType: "euint8[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "euint8[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "games",
      outputs: [
        {
          internalType: "uint256",
          name: "threadId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "lastMoveTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "betAmount",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "currentTurn",
          type: "uint8",
        },
        {
          internalType: "uint8",
          name: "playerGoals",
          type: "uint8",
        },
        {
          internalType: "uint8",
          name: "aiGoals",
          type: "uint8",
        },
        {
          internalType: "uint8",
          name: "playerStrikes",
          type: "uint8",
        },
        {
          internalType: "uint8",
          name: "aiStrikes",
          type: "uint8",
        },
        {
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          internalType: "euint8",
          name: "playerSeed",
          type: "uint256",
        },
        {
          internalType: "euint8",
          name: "aiSeed",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const coreContract = new ethers.Contract(
    networks.incoTestnet.core,
    abi,
    signer
  );

  const response = await coreContract.getGame(0);
  console.log(response);
}

main();
