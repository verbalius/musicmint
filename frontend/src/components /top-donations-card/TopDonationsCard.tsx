import { DonationItemT } from "../../types/types.ts";
import { useContractRead } from "wagmi";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { aby } from "../../../aby/aby.ts";
import { trimAddress } from "../../helpers.ts";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";
import { useEffect } from "react";

const TopDonationsCard = () => {
  const [currentStream] = useAtom(currentStreamAtom);

  const { data } = useContractRead({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "getLastDonations",
    args: [currentStream?.name && currentStream.name],
    watch: true,
  });

  useEffect(() => {}, [currentStream?.name]);

  return (
    <div className={"flex flex-col"}>
      <h2 className={"text-2xl font-bold text-center mb-14"}>CURRENT TOP</h2>
      <div
        className={
          "flex flex-col bg-white p-10 pb-16 rounded-2.5xl border border-outline shadow-black-e3"
        }
      >
        {!currentStream && (
          <div>No active streams, please, come back later</div>
        )}
        {data &&
          currentStream &&
          (data as any).map((item: DonationItemT, index: number) => (
            <div key={index}>
              {trimAddress(item.donor)} -{" "}
              {(+item.amount.toString() / 10 ** 18).toString()} Matic
            </div>
          ))}
      </div>
    </div>
  );
};

export default TopDonationsCard;
