import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { aby } from "../../../aby/aby.ts";
import { DonationItemT } from "../../types/types.ts";
import { useEffect } from "react";
import Button from "../../components /ui/button/Button.tsx";

const MainPage = () => {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0x671Cf11827845eFCED7b3eE9a43cfabFCa12C582",
    abi: aby,
    functionName: "donate",
  });

  const { data: readData, refetch } = useContractRead({
    address: "0x671Cf11827845eFCED7b3eE9a43cfabFCa12C582",
    abi: aby,
    functionName: "getLastDonations",
  });
  console.log(readData, "FFF");
  const { address, isConnected } = useAccount();

  if (!address) {
    return <div />;
  }

  useEffect(() => {}, []);
  return (
    <div>
      Main page
      <Button
        variant={"primary"}
        size={"md"}
        onClick={() => {
          write({
            value: BigInt(0.05 * 10 ** 18),
            from: address,
          });
        }}
      >
        Stake
      </Button>
      <div>
        {" "}
        {readData &&
          readData.map((item: DonationItemT, index: number) => (
            <div key={index}>
              {item.donor} -{(+item.amount.toString() / 10 ** 18).toString()}{" "}
              Matic
            </div>
          ))}
      </div>
    </div>
  );
};

export default MainPage;
