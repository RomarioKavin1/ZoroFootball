"use client";
import { useState } from "react";
import {
  Account,
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  zeroHash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  baseSepolia,
  flowTestnet,
  polygonAmoy,
  scrollSepolia,
  spicy,
} from "viem/chains";

const abi = [
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "priceUpdate",
        type: "bytes[]",
      },
      {
        internalType: "uint256",
        name: "threadId",
        type: "uint256",
      },
    ],
    name: "createGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "threadId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "cardIndex",
        type: "uint8",
      },
    ],
    name: "makeMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "threadId",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "randomNumber",
        type: "bytes32",
      },
    ],
    name: "drawCard",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const addresses = {
  [baseSepolia.id]: "0x7B2C51d3b9e93480F28A330a0ee938C2182cD486",
  [spicy.id]: "0x8A3756bE7da6DFE95824A19340032BfB52f61319",
  [polygonAmoy.id]: "0x04B959704f5d6893eA6aAaeC3a3d294DE4b764A6",
  [flowTestnet.id]: "0x51b83a5Eb4786295F9F5B62c247287456C3E69e8",
  [scrollSepolia.id]: "0x1c89e2970889cA2eA64078c9A87eBEd03D68a541",
};

const publicClients = {
  [baseSepolia.id]: createPublicClient({
    chain: baseSepolia,
    transport: http(),
  }),
  [spicy.id]: createPublicClient({
    chain: spicy,
    transport: http(),
  }),
  [polygonAmoy.id]: createPublicClient({
    chain: polygonAmoy,
    transport: http(),
  }),
  [flowTestnet.id]: createPublicClient({
    chain: flowTestnet,
    transport: http(),
  }),
  [scrollSepolia.id]: createPublicClient({
    chain: scrollSepolia,
    transport: http(),
  }),
};

async function getWalletClient(chainId: number, account: Account) {
  return createWalletClient({
    chain:
      chainId == spicy.id
        ? spicy
        : baseSepolia.id
        ? baseSepolia
        : scrollSepolia.id
        ? scrollSepolia
        : flowTestnet.id
        ? flowTestnet
        : polygonAmoy,
    account: account,
    transport: http(),
  });
}

function generateRandomBytes32() {
  const hexChars = "0123456789abcdef";
  let randomHex = "0x";

  for (let i = 0; i < 64; i++) {
    randomHex += hexChars[Math.floor(Math.random() * 16)];
  }

  return randomHex;
}

export default function CallPage() {
  const [chainId, setChainId] = useState(spicy.id);
  const [txHash, setTxHash] = useState("");
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <p>Chain Id: {chainId}</p>
      <div className="flex space-x-4">
        <button
          onClick={async () => {
            console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY);
            const account = privateKeyToAccount(
              (("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY) as `0x${string}`) ||
                "0x"
            );

            const url = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace`;
            const response = await fetch(url);

            console.log("Fetching latest price...");
            const data = await response.json();

            const priceInWei =
              parseUnits(data.parsed[0].price.price, 18) /
              BigInt((10 ** (-1 * data.parsed[0].price.expo)).toString());

            console.log("Price in WEI");
            console.log(priceInWei);
            console.log("PRICES PROOF TO BE SEND ON CHAIN");
            console.log(data.binary.data);

            const publicClient = publicClients[chainId];
            const { request } = await publicClient.simulateContract({
              address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              abi: abi,
              functionName: "createGame",
              args: [data.binary.data, "12343"], // TODO: Thread id from AI
              account,
            });

            const walletClient = await getWalletClient(chainId, account);

            const tx = await walletClient.writeContract(request);
            setTxHash(tx);
          }}
        >
          Create Game
        </button>
        <button
          onClick={async () => {
            console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY);
            const account = privateKeyToAccount(
              (("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY) as `0x${string}`) ||
                "0x"
            );
            const publicClient = publicClients[chainId];
            const { request } = await publicClient.simulateContract({
              address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              abi: abi,
              functionName: "makeMove",
              args: ["12343", "2"], // TODO: Thread id from AI
              account,
            });

            const walletClient = await getWalletClient(chainId, account);

            const tx = await walletClient.writeContract(request);
            setTxHash(tx);
          }}
        >
          Make Move
        </button>
        <button
          onClick={async () => {
            console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY);
            const account = privateKeyToAccount(
              (("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY) as `0x${string}`) ||
                "0x"
            );
            const publicClient = publicClients[chainId];
            const { request } = await publicClient.simulateContract({
              address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              abi: abi,
              functionName: "drawCard",
              args: ["12343", generateRandomBytes32()], // TODO: Thread id from AI and ran
              account,
            });

            const walletClient = await getWalletClient(chainId, account);

            const tx = await walletClient.writeContract(request);
            setTxHash(tx);
          }}
        >
          Draw Card
        </button>
      </div>
      {txHash != "" && (
        <p onClick={() => {}} className="text-center">
          Tx Hash: {txHash}
        </p>
      )}
    </div>
  );
}
