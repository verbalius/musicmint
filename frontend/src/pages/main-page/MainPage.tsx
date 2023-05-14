import DonationCard from "../../components /donation-card/DonationCard.tsx";
import TopDonationsCard from "../../components /top-donations-card/TopDonationsCard.tsx";
import MintedNftList from "../../components /minted-nft-list/MintedNftList.tsx";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";

const MainPage = () => {
  const [currentStream] = useAtom(currentStreamAtom);
  return (
    <div className={"grid grid-cols-3 gap-14 pt-14"}>
      <DonationCard />
      {currentStream && <TopDonationsCard />}
      {currentStream && <MintedNftList />}
    </div>
  );
};

export default MainPage;
