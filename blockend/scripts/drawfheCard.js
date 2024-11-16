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
          internalType: "uint256",
          name: "randomNumber",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isPlayer",
          type: "bool",
        },
      ],
      name: "_drawCard",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const coreContract = new ethers.Contract(
    "0x7130f3cAD26E8e8B4189138685482c7ca65968f5",
    abi,
    signer
  );
  console.log("Draw FHE Card ...");
  const tx = await coreContract._drawCard(0, 1, true);

  console.log("Tx: ", networks.incoTestnet.blockExplorer + "/tx/" + tx.hash);
}

main();
