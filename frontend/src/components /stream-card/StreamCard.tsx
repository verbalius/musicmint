import mockedImage from "../../assets/mockStreamImage.jpg";
import playIcon from "../../assets/icons/svg/play-icon.svg";
import pauseIcon from "../../assets/icons/svg/pause-icon.svg";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";

const StreamCard = () => {
  const [streamLink, setStreamLink] = useState("");
  const [currentStream] = useAtom(currentStreamAtom);
  const playerRef = useRef<any | undefined>();

  useEffect(() => {
    if (currentStream) {
      setStreamLink(
        `http://localhost:8082/${currentStream.app}/${currentStream.name}.mp3`
      );
    }
  }, [currentStream]);

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayerClick = () => {
    if (playerRef) {
      if (isPlaying) {
        playerRef.current.pause();
        setIsPlaying(false);
        return;
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  if (!currentStream && !streamLink) {
    return (
      <div
        className={
          "h-[158px] w-[314px] flex items-center justify-center rounded-xl border border-[#CACDD5] shadow-black-e3 font-semibold text-3xl"
        }
      >
        No active streams
      </div>
    );
  }

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
        <h1 className={"mb-2 font-semibold"}>{currentStream?.app}</h1>
        <p className={"font-300"}>
          Support the stream: Streaming live from the indoor garden tonight...
          Playing unreleased tracks amongst all the classics.
        </p>
      </div>
      <div
        className={"flex items-center justify-center cursor-pointer"}
        onClick={handlePlayerClick}
      >
        {isPlaying ? (
          <img src={pauseIcon} height={64} width={64} />
        ) : (
          <img src={playIcon} height={64} width={64} />
        )}
      </div>
      {streamLink && (
        <audio
          ref={playerRef}
          controls
          autoPlay={isPlaying}
          className={"hidden"}
        >
          <source src={streamLink} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
};

export default StreamCard;
