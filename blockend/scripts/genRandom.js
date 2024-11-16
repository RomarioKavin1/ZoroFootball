const aiAgent = "0xaab3FeEce86D7Ae8998Ed852C21b094C777d3bcF";

const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../networks");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.incoTestnet.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);
  const abi = [
    {
      inputs: [],
      name: "genRandom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const coreContract = new ethers.Contract(
    "0xB1966C35c9F129Ad1465d23EBA4f8Dbe041793E9",
    abi,
    signer
  );
  console.log("Gen random ...");
  const args = [];
  console.log(args);
  const tx = await coreContract.genRandom();

  console.log("Tx: ", networks.incoTestnet.blockExplorer + "/tx/" + tx.hash);
}

main();
