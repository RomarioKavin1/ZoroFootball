import {
  Account,
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { spicy } from "viem/chains";

const ABI = [
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

export class GameService {
  private static generateRandomBytes32() {
    const hexChars = "0123456789abcdef";
    let randomHex = "0x";
    for (let i = 0; i < 64; i++) {
      randomHex += hexChars[Math.floor(Math.random() * 16)];
    }
    return randomHex;
  }

  static async createGame(threadId: number) {
    const account = privateKeyToAccount(
      (("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY) as `0x${string}`) || "0x"
    );

    const url = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace`;
    const response = await fetch(url);
    const data = await response.json();

    const publicClient = createPublicClient({
      chain: spicy,
      transport: http(),
    });

    const { request } = await publicClient.simulateContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: ABI,
      functionName: "createGame",
      args: [data.binary.data, threadId],
      account,
    });

    const walletClient = createWalletClient({
      chain: spicy,
      account,
      transport: http(),
    });

    return await walletClient.writeContract(request);
  }

  static async makeMove(threadId: number, cardIndex: number) {
    const account = privateKeyToAccount(
      (("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY) as `0x${string}`) || "0x"
    );

    const publicClient = createPublicClient({
      chain: spicy,
      transport: http(),
    });

    const { request } = await publicClient.simulateContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: ABI,
      functionName: "makeMove",
      args: [threadId, cardIndex],
      account,
    });

    const walletClient = createWalletClient({
      chain: spicy,
      account,
      transport: http(),
    });

    return await walletClient.writeContract(request);
  }

  static async drawCard(threadId: number) {
    const account = privateKeyToAccount(
      (("0x" + process.env.NEXT_PUBLIC_PRIVATE_KEY) as `0x${string}`) || "0x"
    );

    const publicClient = createPublicClient({
      chain: spicy,
      transport: http(),
    });

    const { request } = await publicClient.simulateContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: ABI,
      functionName: "drawCard",
      args: [threadId, this.generateRandomBytes32()],
      account,
    });

    const walletClient = createWalletClient({
      chain: spicy,
      account,
      transport: http(),
    });

    return await walletClient.writeContract(request);
  }
}
