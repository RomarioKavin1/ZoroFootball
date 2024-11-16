// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount, usePublicClient } from "wagmi";
import {
  initializeBiconomy,
  createBiconomySession,
  sendBiconomyTransaction,
  getBiconomySmartAccountAddress,
  mintToken,
} from "./biconomyHelpers";

const TOKEN_CONTRACT =
  "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9" as `0x${string}`;

export default function AcToken() {
  const { primaryWallet } = useDynamicContext();
  const { address: userAddress } = useAccount();
  const [loading, setLoading] = useState<string>("");
  const [txnHash, setTxnHash] = useState<string | null>(null);

  useEffect(() => {
    if (primaryWallet && userAddress) {
      handleInitialize();
    }
  }, [primaryWallet, userAddress]);

  const handleInitialize = async () => {
    try {
      setLoading("Initializing...");
      await initializeBiconomy(primaryWallet);
      setLoading("");
    } catch (error) {
      setLoading("Initialization failed");
      console.error(error);
    }
  };

  const handleCreateSession = async () => {
    try {
      setLoading("Creating session...");
      const hash = await createBiconomySession(TOKEN_CONTRACT);
      setTxnHash(hash);
      setLoading("");
    } catch (error) {
      setLoading("Session creation failed");
      console.error(error);
    }
  };

  const handleMint = async () => {
    try {
      setLoading("Minting token...");
      const hash = await mintToken(TOKEN_CONTRACT);
      setTxnHash(hash);
      setLoading("");
    } catch (error) {
      setLoading("Minting failed");
      console.error(error);
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

      <div className="flex flex-col gap-4">
        <button
          className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
          onClick={handleCreateSession}
        >
          Create Session
        </button>

        <button
          className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
          onClick={handleMint}
        >
          Mint Token
        </button>

        {txnHash && (
          <a
            target="_blank"
            href={`https://testnet.chiliscan.com/tx/${txnHash}`}
            rel="noopener noreferrer"
            className="text-white font-bold underline"
          >
            View Transaction
          </a>
        )}
      </div>
    </main>
  );
}
