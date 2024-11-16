"use client";
import {
  DynamicContextProvider,
  mergeNetworks,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { Chain, http } from "viem";
import { chiliz, flowTestnet } from "viem/chains";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

export const evmNetworks = [
  {
    blockExplorerUrls: ["https://testnet.chiliscan.com/"],
    chainId: 88882,
    chainName: "Chiliz Spicy Testnet",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/chiliz.svg"],
    name: "Chiliz Spicy",
    nativeCurrency: {
      decimals: 18,
      name: "Chiliz",
      symbol: "CHZ",
    },
    networkId: 88882,
    rpcUrls: ["https://spicy-rpc.chiliz.com/"],
    vanityName: "Spicy",
  },
];
export const chilizSpicy = {
  id: 88882,
  name: "Chiliz Spicy",
  nativeCurrency: {
    name: "Chiliz",
    symbol: "CHZ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://spicy-rpc.chiliz.com/"],
    },
    public: {
      http: ["https://spicy-rpc.chiliz.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: "ChilizScan Spicy",
      url: "https://testnet.chiliscan.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11907934,
    },
  },
  testnet: true,
} as const satisfies Chain;
export function Providers({ children }: { children: React.ReactNode }) {
  const config = createConfig({
    chains: [chilizSpicy, flowTestnet, chiliz],
    transports: {
      [chilizSpicy.id]: http(),
      [flowTestnet.id]: http(),
      [chiliz.id]: http(),
    },
  });
  const queryClient = new QueryClient();
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        overrides: {
          evmNetworks: (networks) => mergeNetworks(evmNetworks, networks),
        },
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
