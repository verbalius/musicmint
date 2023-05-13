import axios from "axios";
import { useEffect, useState } from "react";
import { trimAddress } from "../../helpers.ts";

const NftListItem = ({ link, address }: { link: string; address: string }) => {
  const [imageLink, setImageLink] = useState<null | string>(null);

  useEffect(() => {
    const getImage = async () => {
      try {
        const { data } = await axios(link);
        if (data?.image) {
          setImageLink(`https://${data.image.slice(7)}.ipfs.nftstorage.link`);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getImage();
  }, []);

  return (
    <div
      className={
        "flex gap-4 border border-[#598CF4] rounded-md overflow-hidden"
      }
    >
      <div>
        {imageLink ? (
          <img
            height={90}
            width={90}
            className={"object-cover"}
            src={imageLink}
            alt={"nft_img"}
          />
        ) : (
          <div className={"h-[90px] w-[90px] bg-gray-100 block"} />
        )}
      </div>
      <div className={"flex items-center text-[10px]"}>
        {trimAddress(address)}
      </div>
    </div>
  );
};

export default NftListItem;
