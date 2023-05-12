import RootLayout from "./components /root-layout /RootLayout.tsx";
import MainPage from "./pages/main-page/MainPage.tsx";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { polygonMumbai } from "@wagmi/core/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    infuraProvider({ apiKey: "9346979f8d1f4b298a3ac4f71806fd30" }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      <RootLayout>
        <MainPage />
      </RootLayout>
    </WagmiConfig>
  );
}

export default App;
