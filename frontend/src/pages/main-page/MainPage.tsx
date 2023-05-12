import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { aby } from "../../../aby/aby.ts";
import { parseEther } from "viem";

const MainPage = () => {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0x3eA4876ccC7ba95aeaaaD68148aDE9C5D944fCb9",
    abi: aby,
    functionName: "donate",
  });

  const { data: readData } = useContractRead({
    address: "0x3eA4876ccC7ba95aeaaaD68148aDE9C5D944fCb9",
    abi: aby,
    functionName: "getLastDonations",
  });
  console.log(readData, "FFF");
  const { address, isConnected } = useAccount();

  if (!address) {
    return <div />;
  }
  return (
    <div>
      Main page
      <button
        onClick={() => {
          write({
            args: [0.5],
            from: address,
          });
        }}
      >
        Stake
      </button>
    </div>
  );
};

export default MainPage;
