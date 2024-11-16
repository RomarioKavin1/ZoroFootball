import {
  PaymasterMode,
  createSmartAccountClient,
  createSession,
  Policy,
  createSessionKeyEOA,
  BiconomySmartAccountV2,
  createSessionSmartAccountClient,
  getSingleSessionTxParams,
  createBundler,
} from "@biconomy/account";
import { encodeFunctionData, Address, parseAbi } from "viem";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { chilizSpicy } from "./Providers";

const ENTRY_POINT = "0x00000061FEfce24A79343c27127435286BB7A4E1";
let smartAccount: BiconomySmartAccountV2 | null = null;
let smartAccountAddress: Address | null = null;

const chainConfig = {
  chainId: chilizSpicy.id,
  providerUrl: chilizSpicy.rpcUrls.default.http[0],
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/88882/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/88882/As_4qvsmr.74ce235a-c6b0-4552-bf17-e75b423a2d1a",
};

export const initializeBiconomy = async (wallet: any) => {
  try {
    const bundler = await createBundler({
      bundlerUrl: chainConfig.bundlerUrl,
      userOpReceiptMaxDurationIntervals: { [chainConfig.chainId]: 120000 },
      userOpReceiptIntervals: { [chainConfig.chainId]: 3000 },
      entryPointAddress: ENTRY_POINT,
    });

    const signer = await getSigner(wallet);
    smartAccount = await createSmartAccountClient({
      signer,
      biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY!,
      bundler,
      rpcUrl: chainConfig.providerUrl,
      chainId: chainConfig.chainId,
      bundlerUrl: chainConfig.bundlerUrl,
      entryPointAddress: ENTRY_POINT,
    });

    smartAccountAddress = (await smartAccount.getAddress()) as Address;
    return smartAccountAddress;
  } catch (error) {
    console.error("Biconomy initialization error:", error);
    throw error;
  }
};

// utils/biconomyHelpers.ts

// Define token ABI constant
const TOKEN_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const mintToken = async (
  contractAddress: Address,
  amount: bigint = BigInt("1000000000000000000") // 1 token with 18 decimals
) => {
  if (!smartAccountAddress) {
    throw new Error("Smart account not initialized");
  }

  try {
    // Create session for mint function if not exists
    await createBiconomySession(contractAddress, "mint(address,uint256)");

    return await sendBiconomyTransaction(contractAddress, TOKEN_ABI, "mint", [
      smartAccountAddress,
      amount,
    ]);
  } catch (error) {
    console.error("Mint token error:", error);
    throw error;
  }
};
export const createBiconomySession = async (
  contractAddress: Address,
  functionSignature: string
) => {
  if (!smartAccount) throw new Error("Smart account not initialized");

  try {
    const { sessionKeyAddress, sessionStorageClient } =
      await createSessionKeyEOA(smartAccount, chilizSpicy);

    const policy: Policy[] = [
      {
        sessionKeyAddress,
        contractAddress,
        functionSelector: functionSignature,
        rules: [],
        interval: {
          validUntil: 0,
          validAfter: 0,
        },
        valueLimit: BigInt(0),
      },
    ];

    const { wait } = await createSession(
      smartAccount,
      policy,
      sessionStorageClient,
      { paymasterServiceData: { mode: PaymasterMode.SPONSORED } }
    );

    const {
      receipt: { transactionHash },
    } = await wait();
    return transactionHash;
  } catch (error) {
    console.error("Session creation error:", error);
    throw error;
  }
};

export const sendBiconomyTransaction = async (
  contractAddress: Address,
  abi: any,
  functionName: string,
  args: any[] = []
) => {
  if (!smartAccount || !smartAccountAddress) {
    throw new Error("Smart account not initialized");
  }

  try {
    const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
      {
        accountAddress: smartAccountAddress,
        bundlerUrl: chainConfig.bundlerUrl,
        paymasterUrl: chainConfig.paymasterUrl,
        chainId: chainConfig.chainId,
        entryPointAddress: ENTRY_POINT,
      },
      smartAccountAddress
    );

    const data = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const transaction = {
      to: contractAddress,
      data,
    };

    const params = await getSingleSessionTxParams(
      smartAccountAddress,
      chilizSpicy,
      0
    );

    const { wait } = await emulatedUsersSmartAccount.sendTransaction(
      transaction,
      {
        ...params,
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      }
    );

    const {
      receipt: { transactionHash },
    } = await wait();
    return transactionHash;
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
};
