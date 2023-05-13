import DonationCard from "../../components /donation-card/DonationCard.tsx";
import TopDonationsCard from "../../components /top-donations-card/TopDonationsCard.tsx";

const MainPage = () => {
  return (
    <div className={"grid grid-cols-3 gap-14 pt-14"}>
      <DonationCard />
      <TopDonationsCard />
    </div>
  );
};

export default MainPage;
