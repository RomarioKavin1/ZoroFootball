const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../../networks");
const {
  abi,
} = require("../../build/artifacts/contracts/fan-tokens/ACMilan.sol/ACMilan.json");

require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.chilizSpicy.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);
  const coreContract = new ethers.Contract(
    networks.chilizSpicy.tokens.acm,
    abi,
    signer
  );
  console.log("Mint tokens ...");
  const tx = await coreContract.mint(
    "0xeE5C50573A8AF1B8Ee2D89CB9eB27dc298c5f75D",
    100000
  );

  console.log("Tx: ", networks.chilizSpicy.blockExplorer + "/tx/" + tx.hash);
}

main();
