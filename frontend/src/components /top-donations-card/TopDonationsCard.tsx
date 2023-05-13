import { DonationItemT } from "../../types/types.ts";
import { useAccount, useContractRead } from "wagmi";
import { CONTACT_ADDRESS } from "../../constants /address.ts";
import { aby } from "../../../aby/aby.ts";
import { trimAddress } from "../../helpers.ts";

const TopDonationsCard = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    address: CONTACT_ADDRESS,
    abi: aby,
    functionName: "getLastDonations",
    args: ["0x19e6232E41815f70e959d54C11CfC267003215E9"],
  });
  console.log(data, "SADASD");

  return (
    <div className={"flex flex-col"}>
      <h2 className={"text-2xl font-bold text-center mb-14"}>CURRENT TOP</h2>
      <div
        className={
          "flex flex-col bg-white p-10 pb-16 rounded-2.5xl border border-outline shadow-black-e3"
        }
      >
        {data &&
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
