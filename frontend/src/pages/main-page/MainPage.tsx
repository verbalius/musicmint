import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { aby } from "../../../aby/aby.ts";
import { DonationItemT } from "../../types/types.ts";

import Button from "../../components /ui/button/Button.tsx";
import { toast } from "react-toastify";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { useMemo, useState } from "react";

const MainPage = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    token: "0x0000000000000000000000000000000000001010",
  });
  const [donateValue, setDonateValue] = useState(0);

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "donate",
  });

  const { data: readData, refetch } = useContractRead({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "getLastDonations",
  });

  console.log(balance, "BALANCE");
  const donationsData = useMemo(
    () =>
      (readData as DonationItemT[]).filter(
        (item) => item.artistAddress === address
      ),
    [readData]
  );

  return (
    <div>
      Main page
      {isConnected && (
        <>
          <div>
            <input
              type={"number"}
              value={donateValue}
              onChange={(e) => setDonateValue(+e.target.value)}
            />
            <Button
              size={"md"}
              variant={"bordered"}
              onClick={() => {
                if (balance?.value) {
                  setDonateValue(balance.value.toString());
                }
              }}
            >
              Max
            </Button>
          </div>

          <Button
            variant={"primary"}
            size={"md"}
            onClick={async () => {
              try {
                const res = await writeAsync({
                  // @ts-ignore
                  from: address,
                  args: [address],
                  value: BigInt(donateValue * 10 ** 18),
                });
                if (res.hash) {
                  toast.success(`Success ${res.hash}`);
                }

                console.log(res);
              } catch (e: any) {
                toast.error(e.details);
              }
            }}
          >
            Stake
          </Button>
        </>
      )}
      <div>
        {donationsData.map((item: DonationItemT, index: number) => (
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
