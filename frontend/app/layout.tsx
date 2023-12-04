"use client";
import { configureChains, WagmiConfig, createConfig, } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark">
          <body>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "105vh" }}>
              <Navbar />
              <div style={{flexGrow: 1}}>{children}</div>
              <Footer />
            </div>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
