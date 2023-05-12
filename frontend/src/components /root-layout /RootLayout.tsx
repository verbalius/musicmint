import React, { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../ui/button/Button.tsx";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (chain?.id !== 80001 && switchNetwork) {
      switchNetwork(80001);
    }
  }, [chain]);

  const [metamaskConnector] = connectors;

  // @ts-ignore
  const isMetamaskInstalled = !!window?.ethereum;

  return (
    <div
      className={
        "min-h-screen px-3 relative flex flex-col w-full max-w-[1440px] mx-auto"
      }
    >
      <div className={"flex justify-between items-center pt-12"}>
        <div className={"text-xl"}>
          <img src={logo} alt={"logo"} />{" "}
        </div>
        <div className={"flex gap-2"}>
          {isConnected && address && (
            <div>
              {`${address.slice(0, 4)}....${address.slice(address.length - 4)}`}
            </div>
          )}
          {!isMetamaskInstalled ? (
            <Link to={"https://metamask.io/download/"}>Metamask link</Link>
          ) : isConnected ? (
            <Button
              variant={"bordered"}
              size={"md"}
              onClick={() => disconnect()}
              disabled={isLoading}
            >
              - Disconnect
            </Button>
          ) : (
            <Button
              variant={"primary"}
              size={"md"}
              onClick={() => connect({ connector: metamaskConnector })}
              disabled={isLoading}
            >
              + Connect to metamask
            </Button>
          )}
        </div>
      </div>
      <div className={"flex-1"}>{children}</div>
      <div>Footer</div>
    </div>
  );
};

export default RootLayout;
