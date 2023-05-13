import { DonationItemT } from "../../types/types.ts";
import { useAccount, useContractRead } from "wagmi";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { aby } from "../../../aby/aby.ts";
import { useMemo } from "react";
import { trimAddress } from "../../helpers.ts";

const TopDonationsCard = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "getTopArtistDonation",
    args: ["0x19e6232E41815f70e959d54C11CfC267003215E9"],
  });
  console.log(data, "SADASD");
  // const donationsData = useMemo(
  //   () =>
  //     data &&
  //     (data as DonationItemT[]).filter(
  //       (item) => item.artistAddress === address
  //     ),
  //   [data]
  // );

  return (
    <div className={"flex flex-col"}>
      <h2 className={"text-2xl font-bold text-center mb-14"}>CURRENT TOP</h2>
      <div
        className={
          "flex flex-col bg-white p-10 pb-16 rounded-2.5xl border border-outline shadow-black-e3"
        }
      >
        {/*{donationsData?.map((item: DonationItemT, index: number) => (*/}
        {/*  <div key={index}>*/}
        {/*    {trimAddress(item.donor)} -{" "}*/}
        {/*    {(+item.amount.toString() / 10 ** 18).toString()} Matic*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </div>
  );
};

export default TopDonationsCard;
