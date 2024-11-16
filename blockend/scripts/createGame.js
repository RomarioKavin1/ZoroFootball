const aiAgent = "0xaab3FeEce86D7Ae8998Ed852C21b094C777d3bcF";

const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../networks");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.incoTestnet.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);
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
      name: "_createGame",
      outputs: [
        {
          internalType: "uint256",
          name: "gameId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const coreContract = new ethers.Contract(
    "0x7130f3cAD26E8e8B4189138685482c7ca65968f5",
    abi,
    signer
  );
  console.log("Create Game ...");
  const tx = await coreContract._createGame(
    "0x7130f3cAD26E8e8B4189138685482c7ca65968f5",
    1,
    2
  );

  console.log("Tx: ", networks.incoTestnet.blockExplorer + "/tx/" + tx.hash);
}

main();
