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
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { chilizSpicy } from "./Providers";

// Main Component
const contractABI = [
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
export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();

  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | null
  >(null);
  const [count, setCount] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [loading, setLoading] = useState<string>("");

  const chainConfig = {
    chainId: chilizSpicy.id,
    name: "Chiliz Spicy",
    providerUrl: chilizSpicy.rpcUrls.default.http[0],
    incrementCountContractAdd:
      "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9" as `0x${string}`, // Replace with your contract address
    biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY!,
    explorerUrl: chilizSpicy.blockExplorers.default.url + "/tx/",
    chain: chilizSpicy,
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/88882/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    paymasterUrl: `https://paymaster.biconomy.io/api/v1/88882/As_4qvsmr.74ce235a-c6b0-4552-bf17-e75b423a2d1a`,
  };

  const withSponsorship = {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  };

  useEffect(() => {
    if (primaryWallet && userAddress) {
      initializeSmartAccount();
    }
  }, [primaryWallet, userAddress]);

  const initializeSmartAccount = async () => {
    try {
      setLoading("Initializing smart account...");
      const bundler = await createBundler({
        bundlerUrl: chainConfig.bundlerUrl,
        userOpReceiptMaxDurationIntervals: { [chainConfig.chainId]: 120000 },
        userOpReceiptIntervals: { [chainConfig.chainId]: 3000 },
        entryPointAddress: "0x00000061FEfce24A79343c27127435286BB7A4E1",
      });
      const signer = await getSigner(primaryWallet!);
      const smartWallet = await createSmartAccountClient({
        signer,
        biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY!,
        bundler: bundler,
        rpcUrl: chainConfig.providerUrl,
        chainId: chainConfig.chainId,
        bundlerUrl: chainConfig.bundlerUrl,
        entryPointAddress: "0x00000061FEfce24A79343c27127435286BB7A4E1",
      });

      setSmartAccount(smartWallet);
      const saAddress = (await smartWallet.getAddress()) as `0x${string}`;
      setSmartAccountAddress(saAddress);
      setLoading("");
    } catch (error) {
      console.error("Error initializing smart account:", error);
      setLoading("Failed to initialize smart account");
    }
  };

  const createSessionWithSponsorship = async () => {
    if (!smartAccount) return;
    try {
      setLoading("Creating session...");
      const { sessionKeyAddress, sessionStorageClient } =
        await createSessionKeyEOA(smartAccount, chainConfig.chain);

      const policy: Policy[] = [
        {
          sessionKeyAddress,
          contractAddress: chainConfig.incrementCountContractAdd,
          functionSelector: "increment()",
          rules: [],
          interval: {
            validUntil: 0,
            validAfter: 0,
          },
          valueLimit: BigInt(0),
        },
      ];

      const { wait, session } = await createSession(
        smartAccount,
        policy,
        sessionStorageClient,
        withSponsorship
      );

      const {
        receipt: { transactionHash },
        success,
      } = await wait();
      console.log("Session created:", success, transactionHash);
      setLoading("");
    } catch (error) {
      console.error("Error creating session:", error);
      setLoading("Failed to create session");
    }
  };

  const incrementCount = async () => {
    if (!smartAccount || !smartAccountAddress) return;
    try {
      setLoading("Incrementing count...");
      const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
        {
          accountAddress: smartAccountAddress,
          bundlerUrl: chainConfig.bundlerUrl,
          paymasterUrl: chainConfig.paymasterUrl,
          chainId: chainConfig.chainId,
          entryPointAddress: "0x00000061FEfce24A79343c27127435286BB7A4E1",
        },
        smartAccountAddress
      );

      const minTx = {
        to: chainConfig.incrementCountContractAdd,
        data: encodeFunctionData({
          abi: contractABI,
          functionName: "mint",
          args: ["0x89c27f76EEF3e09D798FB06a66Dd461d7d21f111", BigInt(1)],
        }),
      };

      const params = await getSingleSessionTxParams(
        smartAccountAddress,
        chainConfig.chain,
        0
      );

      const { wait } = await emulatedUsersSmartAccount.sendTransaction(minTx, {
        ...params,
        ...withSponsorship,
      });

      const {
        receipt: { transactionHash },
        success,
      } = await wait();
      setTxnHash(transactionHash);
      setLoading("");
    } catch (error) {
      console.error("Error incrementing count:", error);
      setLoading("Transaction failed");
    }
  };

  const getCount = async () => {
    try {
      setLoading("Getting count...");
      const data = await publicClient!.readContract({
        address: chainConfig.incrementCountContractAdd,
        abi: contractABI,
        functionName: "getCount",
      });
      // setCount(data?.toString() || null);
      setLoading("");
    } catch (error) {
      console.error("Error getting count:", error);
      setLoading("Failed to get count");
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start gap-8 p-24">
      <div className="text-[4rem] font-bold text-orange-400">
        Biconomy Chiliz
      </div>

      {loading && (
        <div className="text-white bg-orange-500 px-4 apy-2 rounded">
          {loading}
        </div>
      )}

      {!smartAccount && primaryWallet && (
        <div>Initializing Smart Account...</div>
      )}

      {smartAccount && (
        <>
          <span>Smart Account Address</span>
          <span>{smartAccountAddress}</span>
          <span>Network: {chainConfig.name}</span>

          <div className="flex flex-row justify-center items-start gap-4">
            <button
              className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
              onClick={createSessionWithSponsorship}
            >
              Create Session
            </button>

            <div className="flex flex-col justify-start items-center gap-2">
              <button
                className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
                onClick={incrementCount}
              >
                Increment Count
              </button>
              {txnHash && (
                <a
                  target="_blank"
                  href={`${chainConfig.explorerUrl}${txnHash}`}
                  rel="noopener noreferrer"
                >
                  <span className="text-white font-bold underline">
                    View Transaction
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-4">
            <button
              className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
              onClick={getCount}
            >
              Get Count Value
            </button>
            <span>{count}</span>
          </div>
        </>
      )}
    </main>
  );
}
