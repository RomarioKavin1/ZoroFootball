const { ethers, ContractFactory } = require("ethers");
const { networks } = require("../../networks");

require("dotenv").config();

const {
  abi: pythTestingAbi,
  bytecode: pythTestingBytecode,
} = require("../../build/artifacts/contracts/PythTesting.sol/PythTesting.json");

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.baseSepolia.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  const pythTestingContractFactory = new ContractFactory(
    pythTestingAbi,
    pythTestingBytecode,
    signer
  );

  console.log("Deploying PythTesting...");
  const pythTesting = await pythTestingContractFactory.deploy(
    networks.baseSepolia.pythFeed,
    networks.baseSepolia.nativeUsdFeedId
  );
  const deployedTx = pythTesting.deploymentTransaction().hash;

  console.log("Tx: ", networks.baseSepolia.blockExplorer + "/tx/" + deployedTx);
  console.log("PythTesting deployed at:", await pythTesting.getAddress());
}

main();
