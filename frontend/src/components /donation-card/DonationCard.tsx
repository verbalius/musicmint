import CoinsIcon from "../../assets/icons/svg/coins.svg";
import PolygonIcon from "../../assets/icons/svg/polygon.svg";
import Button from "../ui/button/Button.tsx";
import { toast } from "react-toastify";
import { useAccount, useBalance, useContractWrite } from "wagmi";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { aby } from "../../../aby/aby.ts";
import { useState } from "react";
import CounterInput from "../ui/counter-input/CounterInput.tsx";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";

const DonationCard = () => {
  const [donation, setDonation] = useState(0);
  const { address, isConnected } = useAccount();
  const [currentStream] = useAtom(currentStreamAtom);

  const { writeAsync } = useContractWrite({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "donate",
  });

  const { data: balance } = useBalance({
    address: address,
    token: "0x0000000000000000000000000000000000001010",
  });

  return (
    <div className={"flex flex-col"}>
      <div
        className={
          "flex flex-col bg-white p-10 pb-16 rounded-2.5xl border border-outline shadow-black-e3"
        }
      >
        <h2 className={"text-2xl font-bold text-center mb-14"}>
          SUPPORT STREAMER
        </h2>
        <div className={"flex gap-4 mb-1"}>
          <img src={CoinsIcon} alt={"coin icon"} />
          <h4 className={"text-information-400 text-3xl font-semibold"}>
            Donation
          </h4>
        </div>
        <p className={"mb-6 text-highlight-500"}>
          These NFTs, created on the blockchain, hold unique value and can
          represent digital artwork, collectibles, and more.
        </p>
        <p className={"text-xs text-dark-gray-400"}>Pool Name</p>
        <div className={"flex gap-2 mb-16"}>
          <img src={PolygonIcon} alt={"polygon_icon"} />
          <h5 className={"text-lg font-semibold"}>POLYGON (MATIC)</h5>
        </div>
        <div>
          {!currentStream ? (
            <div>No active streams, please, come back later</div>
          ) : isConnected && currentStream ? (
            <div className={"flex gap-4 h-full"}>
              <div className={"flex h-full w-[50%]"}>
                <CounterInput
                  value={donation}
                  setValue={setDonation}
                  maxValue={balance?.formatted}
                />
              </div>
              <div className={"w-[50%]"}>
                <Button
                  variant={"primary"}
                  disabled={!donation}
                  size={"md"}
                  widthFull
                  onClick={async () => {
                    try {
                      const res = await writeAsync({
                        // @ts-ignore
                        from: address,
                        args: [currentStream.name],
                        value: BigInt(donation * 10 ** 18),
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
                  Donate
                </Button>
              </div>
            </div>
          ) : (
            <div>Connect your wallet to donate</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
