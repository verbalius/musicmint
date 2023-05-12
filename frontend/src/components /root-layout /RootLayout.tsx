import React, { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();

  console.log(chains, chain, "CHAINSS");
  useEffect(() => {
    if (chain?.id !== 80001 && switchNetwork) {
      switchNetwork(80001);
    }
  }, [chain]);

  const [metamaskConnector] = connectors;

  return (
    <div className={"flex flex-col h-screen"}>
      <div className={"flex justify-between items-center"}>
        <div>Logo</div>
        <div className={"flex gap-2"}>
          <div>{address}</div>
          {isConnected ? (
            <button onClick={() => disconnect()} disabled={isLoading}>
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => connect({ connector: metamaskConnector })}
              disabled={isLoading}
            >
              Connect to metamask
            </button>
          )}
        </div>
      </div>
      <div className={"flex-1"}>{children}</div>
      <div>Footer</div>
    </div>
  );
};

export default RootLayout;
