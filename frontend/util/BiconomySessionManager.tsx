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
  ENTRYPOINT_ADDRESSES,
  Bundler,
} from "@biconomy/account";
import { encodeFunctionData } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount, usePublicClient } from "wagmi";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { chilizSpicy } from "./Providers";

const TOKEN_ABI = [
  {
    inputs: [
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
const ENTRY_POINT = "0x00000061FEfce24A79343c27127435286BB7A4E1";

const withSponsorship = {
  paymasterServiceData: {
    mode: PaymasterMode.SPONSORED,
  },
};
const TOKEN_ADDRESS =
  "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9" as `0x${string}`;

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
  const [bundlerr, setBundlerr] = useState<Bundler | null>();
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

      const signer = await getSigner(primaryWallet!);
      const bundler = await createBundler({
        bundlerUrl: chainConfig.bundlerUrl,
        userOpReceiptMaxDurationIntervals: { [chainConfig.chainId]: 120000 },
        userOpReceiptIntervals: { [chainConfig.chainId]: 3000 },
        entryPointAddress: ENTRY_POINT,
      });
      setBundlerr(bundler);
      const smartWallet = await createSmartAccountClient({
        signer,
        biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY!,
        bundler: bundler,
        rpcUrl: chainConfig.providerUrl,
        chainId: chainConfig.chainId,
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
    if (!smartAccount) return;
    try {
      setLoading("Creating session...");
      const { sessionKeyAddress, sessionStorageClient } =
        await createSessionKeyEOA(smartAccount, chilizSpicy);

      // This matches the working example's simpler format
      const policy: Policy[] = [
        {
          sessionKeyAddress,
          contractAddress: TOKEN_ADDRESS,
          functionSelector: "mint(address,uint256)", // keccak256(mint(address,uint256))
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
      setTxnHash(transactionHash);
      setLoading("");
    } catch (error) {
      console.error("Error creating session:", error);
      setLoading("Failed to create session");
    }
  };

  const mintTokens = async () => {
    if (!smartAccount || !smartAccountAddress) return;
    try {
      setLoading("Minting tokens...");

      const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
        {
          accountAddress: smartAccountAddress,
          bundler: bundlerr!,
          bundlerUrl: chainConfig.bundlerUrl,
          paymasterUrl: chainConfig.paymasterUrl,
          chainId: chainConfig.chainId,
          entryPointAddress: ENTRY_POINT,
        },

        smartAccountAddress
      );
      console.log("smartacc address", smartAccountAddress);
      console.log("emulatedUsersSmartAccount", emulatedUsersSmartAccount);
      const minTx = {
        to: TOKEN_ADDRESS,
        data: encodeFunctionData({
          abi: TOKEN_ABI,
          functionName: "mint",
          args: [smartAccountAddress, BigInt("1")],
        }),
      };
      console.log("minTx", minTx);
      const params = await getSingleSessionTxParams(
        smartAccountAddress,
        chilizSpicy
      );
      console.log("params", params);
      const { wait } = await emulatedUsersSmartAccount.sendTransaction(minTx, {
        ...params,
        ...withSponsorship,
      });
      console.log("wait", wait);
      const {
        receipt: { transactionHash },
      } = await wait();
      setTxnHash(transactionHash);
      setLoading("");
    } catch (error) {
      console.error("Error minting tokens:", error);
      setLoading("Transaction failed");
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
        <div className="text-white bg-red-500 px-4 py-2 rounded mb-4">
          {error}
          <button
            className="ml-2 underline text-white"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {!smartAccount && primaryWallet && (
        <div>Initializing Smart Account...</div>
      )}

      {smartAccount && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center p-4 x` rounded-lg">
            <div className="font-bold text-gray-300 mb-2">
              Smart Account Address:
            </div>
            <div className="font-mono text-white break-all">
              {smartAccountAddress}
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-bold mb-2">
                Step 1: Create Session
              </h3>
              <button
                className="w-full py-3 bg-orange-300 text-black font-bold rounded-lg disabled:opacity-50 hover:bg-orange-400 transition-colors"
                onClick={createMintSession}
                disabled={!!loading}
              >
                Create Mint Session
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-bold mb-2">Step 2: Mint Token</h3>
              <button
                className="w-full py-3 bg-orange-300 text-black font-bold rounded-lg disabled:opacity-50 hover:bg-orange-400 transition-colors"
                onClick={mintTokens}
                disabled={!!loading}
              >
                Mint 1 Token
              </button>
            </div>
          </div>

          {txnHash && (
            <div className="text-center p-4 rounded-lg">
              <div className="text-gray-300 mb-2">Latest Transaction:</div>
              <a
                target="_blank"
                href={`${chilizSpicy.blockExplorers.default.url}/tx/${txnHash}`}
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 underline font-mono break-all"
              >
                {txnHash}
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
