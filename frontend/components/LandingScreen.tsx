"use client";
import { useEffect, useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { getSigner } from "@dynamic-labs/ethers-v6";

import {
  BiconomySmartAccountV2,
  createSmartAccountClient,
  createSession,
  Policy,
  createSessionKeyEOA,
  PaymasterMode,
  createBundler,
} from "@biconomy/account";
import { chilizSpicy } from "@/util/Providers";

const ENTRY_POINT = "0x00000061FEfce24A79343c27127435286BB7A4E1";
const TOKEN_ADDRESS =
  "0x87dd08be032a03d937F2A8003dfa9C52821cbaB9" as `0x${string}`;

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hover, setHover] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { address: userAddress } = useAccount();
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<
    `0x${string}` | null
  >(null);
  const [loading, setLoading] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);

  const chainConfig = {
    chainId: chilizSpicy.id,
    providerUrl: chilizSpicy.rpcUrls.default.http[0],
    bundlerUrl:
      "https://bundler.biconomy.io/api/v2/88882/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/88882/As_4qvsmr.74ce235a-c6b0-4552-bf17-e75b423a2d1a",
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (primaryWallet && userAddress) {
      initializeSmartAccount();
    }
  }, [primaryWallet, userAddress]);

  const initializeSmartAccount = async () => {
    try {
      setLoading("Initializing smart account...");
      const signer = await getSigner(primaryWallet!);
      const bundler = await createBundler({
        bundlerUrl: chainConfig.bundlerUrl,
        userOpReceiptMaxDurationIntervals: { [chainConfig.chainId]: 120000 },
        userOpReceiptIntervals: { [chainConfig.chainId]: 3000 },
        entryPointAddress: ENTRY_POINT,
      });

      const smartWallet = await createSmartAccountClient({
        signer,
        biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY!,
        bundler,
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
      setLoading("Failed to initialize smart account");
    }
  };

  const createMintSession = async () => {
    if (!smartAccount) return;
    try {
      setLoading("Creating session...");
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
      } = await wait();
      setTxHash(transactionHash);
      setLoading("");
      onStart(); // Start game after session creation
    } catch (error) {
      console.error("Error creating session:", error);
      setLoading("Failed to create session");
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-purple-900/50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-none animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Glowing grid effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center gap-12">
        {/* Title Section with Glow Effect */}
        <div
          className={`
            transform transition-all duration-1000 ease-out 
            ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "-translate-y-20 opacity-0"
            }
          `}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-lg" />

            <div className="relative p-1">
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400"
                style={{
                  clipPath: `polygon(
                    0 4px, 4px 4px, 4px 0,
                    calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
                    100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
                    4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
                  )`,
                }}
              />
              <h1 className="relative px-16 py-8 text-7xl font-bold">
                <span className="block  bg-clip-text bg-gradient-to-r from-yellow-300 to-purple-400">
                  BLOCKS
                </span>
                <span className="block text-center  bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-300">
                  & BALLS
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Smart Account Card */}
        {smartAccountAddress && (
          <div
            className={`
              transform transition-all duration-700 ease-out
              ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }
              max-w-md w-full mx-auto
            `}
          >
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-purple-500/20 rounded-lg blur" />

              <div className="relative bg-black/40 backdrop-blur-md p-6 rounded-lg border border-purple-500/30">
                <div className="text-purple-300 font-medium mb-2">
                  Smart Account Connected
                </div>
                <div className="text-white/90 font-mono text-sm break-all">
                  {smartAccountAddress}
                </div>

                {/* Status indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading and Transaction Status */}
        <div className="space-y-4 text-center">
          {loading && (
            <div className="text-white bg-purple-600/40 backdrop-blur-sm px-6 py-3 rounded-lg border border-purple-500/30 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
              <span>{loading}</span>
            </div>
          )}

          {txHash && (
            <div className="text-sm animate-fade-in">
              <a
                href={`${chilizSpicy.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors bg-purple-500/10 px-4 py-2 rounded-lg"
              >
                <span>View Transaction</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-6">
          {!primaryWallet ? (
            <div className="transform hover:scale-105 transition-transform">
              <DynamicWidget />
            </div>
          ) : !smartAccountAddress ? (
            <div className="text-purple-300 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
              Initializing...
            </div>
          ) : (
            <button
              onClick={createMintSession}
              disabled={!!loading}
              className={`
                relative group px-16 py-5
                bg-gradient-to-r from-purple-600 to-purple-500
                hover:from-purple-500 hover:to-purple-400
                disabled:from-purple-800 disabled:to-purple-700
                disabled:cursor-not-allowed
                text-white font-bold text-2xl
                transition-all duration-200
                rounded-lg
                border-2 border-purple-400/50
                shadow-lg shadow-purple-500/20
                transform hover:scale-105 active:scale-95
              `}
            >
              <div className="absolute -inset-1 bg-purple-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <span className="relative">
                {loading ? "Creating Session..." : "START GAME"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
