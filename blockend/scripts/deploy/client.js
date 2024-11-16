const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../../networks");

require("dotenv").config();

const {
  abi: zoroClientAbi,
  bytecode: zoroClientBytecode,
} = require("../../build/artifacts/contracts/ZoroClient.sol/ZoroClient.json");

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.baseSepolia.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  const zoroClientContractFactory = new ContractFactory(
    zoroClientAbi,
    zoroClientBytecode,
    signer
  );

  console.log("Deploying Zoro AI Client...");
  const pythTesting = await zoroClientContractFactory.deploy(
    networks.baseSepolia.mailbox,
    networks.incoTestnet.core
  );
  const deployedTx = pythTesting.deploymentTransaction().hash;

  console.log("Tx: ", networks.baseSepolia.blockExplorer + "/tx/" + deployedTx);
  console.log("Zoro AI Client deployed at:", await pythTesting.getAddress());
}

main();
