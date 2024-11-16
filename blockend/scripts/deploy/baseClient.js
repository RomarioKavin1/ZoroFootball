const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../../networks");

require("dotenv").config();

const {
  abi: zoroAiClientAbi,
  bytecode: zoroAiClientBytecode,
} = require("../../build/artifacts/contracts/ZoroAiClient.sol/ZoroAiClient.json");

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.baseSepolia.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  const zoroAiClientContractFactory = new ContractFactory(
    zoroAiClientAbi,
    zoroAiClientBytecode,
    signer
  );

  console.log("Deploying Zoro AI Client...");
  const pythTesting = await zoroAiClientContractFactory.deploy(
    networks.baseSepolia.mailbox,
    networks.incoTestnet.core,
    networks.baseSepolia.pythEntropy
  );
  const deployedTx = pythTesting.deploymentTransaction().hash;

  console.log("Tx: ", networks.baseSepolia.blockExplorer + "/tx/" + deployedTx);
  console.log("Zoro AI Client deployed at:", await pythTesting.getAddress());
}

main();
