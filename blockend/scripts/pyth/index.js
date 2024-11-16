const { ethers, parseEther, formatEther } = require("ethers");
const { networks } = require("../../networks");

require("dotenv").config();

const {
  abi: pythTestingAbi,
} = require("../../build/artifacts/contracts/PythTesting.sol/PythTesting.json");
const { PYTH_PRICE_FEED_ABI } = require("./constants");

async function main() {
  const provider = new ethers.JsonRpcProvider(networks.baseSepolia.url);
  const signer = new ethers.Wallet(process.env.TEST_PRIVATE_KEY, provider);

  console.log("Fetching Native USD price from Pyth API...");

  const url =
    "https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=" +
    networks.baseSepolia.nativeUsdFeedId;

  console.log("URL:", url);

  const res = await fetch(url);

  if (!res.ok) {
    console.log("Error fetching price from Pyth API");
    return;
  }
  const response = await res.json();

  console.log("Response:", response);

  const priceFeedData = ["0x" + response.binary.data[0]];
  const nativeUsdPrice =
    parseEther(response.parsed[0].price.price) /
    BigInt((10 ** -response.parsed[0].price.expo).toString());

  const betAmount =
    (BigInt("5000000000000000000") * BigInt(10 ** 18)) / nativeUsdPrice;

  console.log(
    "1 " + networks.baseSepolia.nativeCurrencySymbol + " = ",
    formatEther(nativeUsdPrice),
    " USD"
  );
  console.log(
    "Bet Amount: ",
    formatEther(betAmount),
    " ",
    networks.baseSepolia.nativeCurrencySymbol
  );

  const abi = [
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "priceUpdate",
          type: "bytes[]",
        },
      ],
      name: "placeBet",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "int64",
              name: "price",
              type: "int64",
            },
            {
              internalType: "uint64",
              name: "conf",
              type: "uint64",
            },
            {
              internalType: "int32",
              name: "expo",
              type: "int32",
            },
            {
              internalType: "uint256",
              name: "publishTime",
              type: "uint256",
            },
          ],
          internalType: "struct PythStructs.Price",
          name: "priceData",
          type: "tuple",
        },
      ],
      name: "getBetAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const pythTestingContract = new ethers.Contract(
    networks.baseSepolia.pythTesting,
    abi,
    signer
  );

  const fetchedBetAmount = await pythTestingContract.getBetAmount(
    Object.values(response.parsed[0].price)
  );

  console.log("Getting update fee...");

  const pythFeedAbi = [
    {
      inputs: [
        { internalType: "bytes[]", name: "updateData", type: "bytes[]" },
      ],
      name: "getUpdateFee",
      outputs: [
        { internalType: "uint256", name: "feeAmount", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const pythPriceFeedContract = new ethers.Contract(
    networks.baseSepolia.pythFeed,
    pythFeedAbi,
    signer
  );
  const updateFee = await pythPriceFeedContract.getUpdateFee(priceFeedData);

  console.log("Update Fee:", updateFee);

  console.log("Placing Bet...");

  const placeBetTx = await pythTestingContract.placeBet(priceFeedData, {
    value: updateFee + betAmount,
  });
  console.log(
    "Tx: ",
    networks.baseSepolia.blockExplorer + "/tx/" + placeBetTx.hash
  );
}

main();
