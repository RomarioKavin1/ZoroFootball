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
    <div className="absolute inset-0 bg-slate-900 overflow-hidden">
      {/* Your existing background animation code */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-none animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center gap-8">
        {/* Title */}
        <div
          className={`transform transition-all duration-1000 ease-out ${
            isLoaded ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
          }`}
        >
          <div className="relative p-1">
            <div
              className="absolute inset-0 bg-purple-600"
              style={{
                clipPath: `polygon(
                  0 4px, 4px 4px, 4px 0,
                  calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
                  100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
                  4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
                )`,
              }}
            />
            <h1 className="relative px-16 py-8 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100">
              BLOCKS &<span className="block text-center">BALLS</span>
            </h1>
          </div>
        </div>

        {/* Smart Account Info */}
        {smartAccountAddress && (
          <div
            className={`transform transition-all duration-700 ease-out ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >
            <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-lg border-2 border-purple-500/30">
              <div className="text-purple-300 text-sm mb-1">Smart Account:</div>
              <div className="text-white/90 font-mono text-sm">
                {smartAccountAddress}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-white bg-purple-600/80 px-4 py-2 rounded">
            {loading}
          </div>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <div className="text-sm">
            <a
              href={`${chilizSpicy.blockExplorers.default.url}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              View Transaction
            </a>
          </div>
        )}

        {/* Connect/Start Button */}
        <div className="flex flex-col items-center gap-4">
          {!primaryWallet ? (
            <DynamicWidget />
          ) : !smartAccountAddress ? (
            <div className="text-purple-300">Initializing...</div>
          ) : (
            <button
              onClick={createMintSession}
              disabled={!!loading}
              className={`
                relative group px-12 py-4
                bg-purple-600 hover:bg-purple-500 active:bg-purple-700
                disabled:bg-purple-800 disabled:cursor-not-allowed
                text-white font-bold text-xl
                transition-all duration-200
                rounded-lg
                border-2 border-purple-400
              `}
            >
              {loading ? "Creating Session..." : "START GAME"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
