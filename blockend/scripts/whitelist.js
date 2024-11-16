const aiAgent = "0xaab3FeEce86D7Ae8998Ed852C21b094C777d3bcF";

const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../networks");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.baseSepolia.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_aiAgent",
          type: "address",
        },
      ],
      name: "setAiAgent",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const aiClientContract = new ethers.Contract(
    "0x09249908F451EAe8fF4612e3E2C4a0f574a114f4",
    abi,
    signer
  );
  console.log("Setting Ai agent...");
  const tx = await aiClientContract.setAiAgent(aiAgent);

  console.log("Tx: ", networks.baseSepolia.blockExplorer + "/tx/" + tx.hash);
}

main();
