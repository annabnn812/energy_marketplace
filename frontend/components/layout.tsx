// Import necessary modules and components
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";
import Footer from "@/components/instructionsComponent/navigation/footer";
import { mainnet, avalanche, polygonZkEvm, polygonZkEvmTestnet, polygon, optimism, arbitrum, optimismGoerli, polygonMumbai, arbitrumGoerli, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";


// Configure chains and get the public client
const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, avalanche, polygonZkEvm, polygonZkEvmTestnet, polygon, optimism, arbitrum, optimismGoerli, polygonMumbai, arbitrumGoerli, goerli],
  [publicProvider()],
)

// Create the configuration for Wagmi
const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    webSocketPublicClient: webSocketPublicClient,
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: "demo",
    autoConnect: true,
    publicClient: publicClient,
    chains: [mainnet, avalanche, polygonZkEvm, polygonZkEvmTestnet, polygon, optimism, arbitrum, optimismGoerli, polygonMumbai, arbitrumGoerli, goerli],
    // Required
    appName: "Decentralize Energy Market",
  })
);

// Define the RootLayout component
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
            
              <div style={{ flexGrow: 1 }}>{children}</div>
             
            </div>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
