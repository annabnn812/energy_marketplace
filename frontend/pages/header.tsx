"use client";
import React from "react";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import { configureChains, WagmiConfig, createConfig, } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

import { mainnet, avalanche, polygonZkEvm, polygonZkEvmTestnet, goerli, avalancheFuji } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public";


// Configure chains and get the public client
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, avalanche, polygonZkEvm, polygonZkEvmTestnet,  avalancheFuji, goerli],
  [publicProvider()],
)

// Create the configuration for Wagmi
const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    chains,
    webSocketPublicClient: webSocketPublicClient,
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: "demo",
    autoConnect: true,
    publicClient: publicClient,
  
    // Required
    appName: "Decentralize Energy Market",
  })
);

  
export default function Header() {
  return (
    <>
    <WagmiConfig config={config}>
    <ConnectKitProvider>
    <Navbar />
    </ConnectKitProvider>
    </WagmiConfig>
    
    </>
  );
}
