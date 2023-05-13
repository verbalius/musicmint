import { useEffect } from "react";
import Button from "../../ui/button/Button.tsx";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import StreamCard from "../../stream-card/StreamCard.tsx";
import { trimAddress } from "../../../helpers.ts";

const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [metamaskConnector] = connectors;
  // @ts-ignore
  const isMetamaskInstalled = !!window?.ethereum;

  useEffect(() => {
    if (chain?.id !== 80001 && switchNetwork) {
      switchNetwork(80001);
    }
  }, [chain]);

  return (
    <div
      className={
        "flex justify-between items-center bg-white pl-[33px] pr-[28px] py-[22px]"
      }
    >
      <div className={"w-1/5"}>
        <img src={logo} alt={"logo"} height={66} width={256} />
      </div>
      <div className={"w-3/5 flex justify-center"}>
        <StreamCard />
      </div>
      <div className={"w-1/5 flex justify-end"}>
        <div className={"flex gap-2"}>
          {!isMetamaskInstalled ? (
            <Link to={"https://metamask.io/download/"}>Metamask link</Link>
          ) : isConnected ? (
            <Button
              variant={"bordered"}
              size={"md"}
              onClick={() => disconnect()}
              disabled={isLoading}
            >
              Disconnect {trimAddress(address)}
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
    </div>
  );
};

export default Header;
