import { DonationItemT } from "../../types/types.ts";
import { useContractRead } from "wagmi";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { aby } from "../../../aby/aby.ts";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

const TopDonationsCard = () => {
  const [currentStream] = useAtom(currentStreamAtom);
  const [secondsLeft, setSecondsLeft] = useState(60 - new Date().getSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(60 - new Date().getSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { data } = useContractRead({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "getLastDonations",
    args: [currentStream?.name && currentStream.name],
    watch: true,
  });

  const renderList = useMemo(
    () =>
      data &&
      currentStream &&
      (data as any)
        .sort(
          (a: DonationItemT, b: DonationItemT) =>
            +b.amount.toString() - +a.amount.toString()
        )
        .filter((item: DonationItemT) => {
          const date1 = dayjs(+item.timestamp.toString() * 1000);
          const date2 = dayjs().set("seconds", 0);
          return date1 > date2;
        }),
    [secondsLeft, data]
  );

  return (
    <div className={"flex flex-col h-full "}>
      <div
        className={
          "flex flex-col bg-white p-10 pb-16 rounded-2.5xl border border-outline shadow-black-e3 h-full"
        }
      >
        <h2 className={"text-2xl font-bold text-center mb-14"}>CURRENT TOP</h2>
        <div className={"flex flex-col gap-6"}>
          {!currentStream && (
            <div>No active streams, please, come back later</div>
          )}
          {!renderList?.length && currentStream && (
            <div>No donations per this minute</div>
          )}
          {renderList &&
            renderList.map((item: DonationItemT, index: number) => (
              <div
                key={index}
                className={
                  "flex flex-col py-6 px-4 border border-[#598CF4] rounded-md"
                }
              >
                <h4 className={"text-xs font-semibold"}>
                  {(+item.amount.toString() / 10 ** 18).toString()} Matic
                </h4>
                <p className={"text-[10px] text-[#49536E]"}>{item.donor}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopDonationsCard;
