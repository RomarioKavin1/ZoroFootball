// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
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
import { encodeFunctionData } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount, usePublicClient } from "wagmi";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { chilizSpicy } from "./Providers";

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

const TOKEN_ADDRESS =
  "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9" as `0x${string}`;
const ENTRY_POINT = "0x00000061FEfce24A79343c27127435286BB7A4E1";

export default function Hoome() {
  const { primaryWallet } = useDynamicContext();
  const { address: userAddress } = useAccount();

  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | null
  >(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const chainConfig = {
    chainId: chilizSpicy.id,
    providerUrl: chilizSpicy.rpcUrls.default.http[0],
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/88882/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/88882/As_4qvsmr.74ce235a-c6b0-4552-bf17-e75b423a2d1a",
  };

  useEffect(() => {
    if (primaryWallet && userAddress) {
      initializeSmartAccount();
    }
  }, [primaryWallet, userAddress]);

  const initializeSmartAccount = async () => {
    try {
      setLoading("Initializing smart account...");
      setError(null);

      const bundler = await createBundler({
        bundlerUrl: chainConfig.bundlerUrl,
        userOpReceiptMaxDurationIntervals: { [chainConfig.chainId]: 120000 },
        userOpReceiptIntervals: { [chainConfig.chainId]: 3000 },
        entryPointAddress: ENTRY_POINT,
      });

      const signer = await getSigner(primaryWallet!);
      const smartWallet = await createSmartAccountClient({
        signer,
        biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY!,
        bundler: bundler,
        rpcUrl: chainConfig.providerUrl,
        chainId: chainConfig.chainId,
        bundlerUrl: chainConfig.bundlerUrl,
        entryPointAddress: ENTRY_POINT,
      });

      setSmartAccount(smartWallet);
      const saAddress = (await smartWallet.getAddress()) as `0x${string}`;
      setSmartAccountAddress(saAddress);
      setLoading("");
    } catch (error) {
      console.error("Error initializing smart account:", error);
      setError("Failed to initialize smart account");
      setLoading("");
    }
  };

  const createMintSession = async () => {
    if (!smartAccount) {
      setError("Smart account not initialized");
      return;
    }

    try {
      setLoading("Creating session...");
      setError(null);

      const { sessionKeyAddress, sessionStorageClient } =
        await createSessionKeyEOA(smartAccount, chilizSpicy);

      const policy: Policy[] = [
        {
          sessionKeyAddress,
          contractAddress: TOKEN_ADDRESS,
          functionSelector: "mint(address,uint256)",
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
        success,
      } = await wait();
      console.log("Session created:", success, transactionHash);
      setTxnHash(transactionHash);
      setLoading("");
      return true;
    } catch (error) {
      console.error("Error creating session:", error);
      setError("Failed to create session");
      setLoading("");
      return false;
    }
  };

  const mintTokens = async () => {
    if (!smartAccount || !smartAccountAddress) {
      setError("Smart account not initialized");
      return;
    }

    try {
      setLoading("Creating session and minting tokens...");
      setError(null);

      // Create session first
      const sessionCreated = await createMintSession();
      if (!sessionCreated) {
        throw new Error("Failed to create session");
      }

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

      // Amount to mint (1 token = 1e18)
      const amount = BigInt("1000000000000000000");

      const transaction = {
        to: TOKEN_ADDRESS,
        data: encodeFunctionData({
          abi: TOKEN_ABI,
          functionName: "mint",
          args: [smartAccountAddress, amount],
        }),
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
        success,
      } = await wait();
      setTxnHash(transactionHash);
      setLoading("Tokens minted successfully!");
      setTimeout(() => setLoading(""), 2000);
    } catch (error) {
      console.error("Error minting tokens:", error);
      setError("Failed to mint tokens");
      setLoading("");
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start gap-8 p-24">
      <div className="text-[4rem] font-bold text-orange-400">
        ACMilan Token Minter
      </div>

      {loading && (
        <div className="text-white bg-orange-500 px-4 py-2 rounded">
          {loading}
        </div>
      )}

      {error && (
        <div className="text-white bg-red-500 px-4 py-2 rounded">{error}</div>
      )}

      {!smartAccount && primaryWallet && (
        <div>Initializing Smart Account...</div>
      )}

      {smartAccount && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <div className="font-bold">Smart Account Address:</div>
            <div className="font-mono">{smartAccountAddress}</div>
          </div>

          <button
            className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg disabled:opacity-50"
            onClick={mintTokens}
            disabled={!!loading}
          >
            Mint Tokens
          </button>

          {txnHash && (
            <a
              target="_blank"
              href={`${chilizSpicy.blockExplorers.default.url}/tx/${txnHash}`}
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 underline"
            >
              View Transaction
            </a>
          )}
        </div>
      )}
    </main>
  );
}
