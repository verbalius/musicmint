import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  const [metamaskConnector] = connectors;
  console.log(metamaskConnector, "CONNECTOR");
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
