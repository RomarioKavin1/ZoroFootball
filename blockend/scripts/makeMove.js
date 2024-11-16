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
          internalType: "uint256",
          name: "gameId",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "cardIndex",
          type: "uint8",
        },
        {
          internalType: "bool",
          name: "isPlayer",
          type: "bool",
        },
      ],
      name: "_makeMove",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const coreContract = new ethers.Contract(
    "0x197a5246bC00dDAEB2ed9D8D9F923Cdb0Cd281Af",
    abi,
    signer
  );
  console.log("MakeMove ...");
  const tx = await coreContract._makeMove(0, 5, true, { gasLimit: 5000000 });

  console.log("Tx: ", networks.incoTestnet.blockExplorer + "/tx/" + tx.hash);
}

main();
