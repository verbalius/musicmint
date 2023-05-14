import { NftItemT } from "../../types/types.ts";
import { useContractRead } from "wagmi";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { aby } from "../../../aby/aby.ts";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";
import { useEffect } from "react";
import NftListItem from "./NftListItem.tsx";

const TopDonationsCard = () => {
  const [currentStream] = useAtom(currentStreamAtom);

  const { data, refetch } = useContractRead({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "getNFTs",
    args: [currentStream?.name && currentStream.name],
  });

  useEffect(() => {
    // function getTimeLeftInCurrentMinute(): number {
    //   const now = dayjs();
    //   const endOfMinute = now.endOf("minute");
    //   const diff = endOfMinute.diff(now, "millisecond");
    //   return diff;
    // }

    function setEndOfMinuteInterval(callback: () => void): NodeJS.Timeout {
      // const timeLeft = getTimeLeftInCurrentMinute();
      return setTimeout(() => {
        callback();
        setEndOfMinuteInterval(callback);
      }, 10000);
    }
    setEndOfMinuteInterval(() => {
      refetch();
    });
  }, [data]);

  return (
    <div className={"flex flex-col h-full "}>
      <div
        className={
          "flex flex-col bg-white p-10 pb-16 rounded-2.5xl border border-outline shadow-black-e3 h-full"
        }
      >
        <h2 className={"text-2xl font-bold text-center mb-14"}>
          PREVIOUS WINNERS
        </h2>
        <div className={"flex flex-col gap-6"}>
          {!currentStream && currentStream && (
            <div>No active streams, please, come back later</div>
          )}
          {!(data as any)?.length && <div>No minted nft yet</div>}
          {data &&
            (data as any)
              .slice()
              .sort(
                (a: NftItemT, b: NftItemT) =>
                  new Date(+b.timestamp.toString()).getTime() -
                  new Date(+a.timestamp.toString()).getTime()
              )
              .slice(0, 3)
              .map((item: NftItemT) => {
                return (
                  <NftListItem
                    address={item.artistAddress}
                    link={item?.metadataURI.toString()}
                    key={item.metadataURI}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default TopDonationsCard;
