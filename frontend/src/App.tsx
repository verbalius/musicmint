import RootLayout from "./components /root-layout /RootLayout.tsx";
import MainPage from "./pages/main-page/MainPage.tsx";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { polygonMumbai } from "@wagmi/core/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <>
      <ToastContainer />{" "}
      <WagmiConfig config={config}>
        <RootLayout>
          <MainPage />
        </RootLayout>
      </WagmiConfig>
    </>
  );
}

export default App;
