const { ethers, parseEther, formatEther } = require("ethers");
const { networks } = require("../../networks");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.incoTestnet.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  console.log("Creating the game...");

  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "betAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "threadId",
          type: "uint256",
        },
      ],
      name: "createGame",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const coreContract = new ethers.Contract(
    networks.incoTestnet.core,
    abi,
    signer
  );

  const betAmount = "1000000000000000000"; // 1 ETH
  const threadId = 1;

  const createGameTx = await coreContract.createGame(
    "0x0429A2Da7884CA14E53142988D5845952fE4DF6a",
    betAmount,
    threadId
  );

  console.log(
    "Tx: ",
    networks.incoTestnet.blockExplorer + "/tx/" + createGameTx.hash
  );
}

main();
