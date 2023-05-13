import mockedImage from "../../assets/mockStreamImage.jpg";
import playIcon from "../../assets/icons/svg/play-icon.svg";

const StreamCard = () => {
  return (
    <div
      className={
        "flex gap-2.5 h-full w-full bg-information-500 rounded-tl-2.5xl rounded-tr-2.5xl rounded-br-2.5xl pt-4 pr-1.5 pb-7 pl-4 text-white"
      }
    >
      <div className={""}>
        <img
          src={mockedImage}
          alt={"stream_img"}
          className={"h-[108px] w-[171px] object-cover block rounded-md"}
        />
      </div>
      <div className={"flex flex-col w-full  text-xs"}>
        <h1 className={"mb-2 font-semibold"}>
          NETSKY | Saturday Night Live Stream
        </h1>
        <p className={"font-300"}>
          Support the stream: Streaming live from the indoor garden tonight...
          Playing unreleased tracks amongst all the classics.
        </p>
      </div>
      <div className={"flex items-center justify-center cursor-pointer"}>
        <img src={playIcon} height={64} width={64} />
      </div>
    </div>
  );
};

export default StreamCard;
