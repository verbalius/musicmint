import playIcon from "../../assets/icons/svg/play-icon.svg";
import pauseIcon from "../../assets/icons/svg/pause-icon.svg";
import clockIcon from "../../assets/icons/svg/clockAfternoon.svg";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { currentStreamAtom } from "../../App.tsx";
import { getImageUrl } from "../../helpers.ts";

const StreamCard = () => {
  const [streamLink, setStreamLink] = useState("");
  const [currentStream] = useAtom(currentStreamAtom);
  const playerRef = useRef<any | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(60 - new Date().getSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(60 - new Date().getSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStream) {
      setStreamLink(
        `${import.meta.env.VITE_STREAM_URL}/${currentStream.app}/${
          currentStream.name
        }.mp3`
      );
    }
  }, [currentStream]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.load();
    }
  }, [streamLink]);

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
    <div className={"flex gap-5"}>
      <div
        className={
          "flex gap-4 h-full bg-information-500 rounded-2.5xl pt-4 px-8 pb-7 text-white"
        }
      >
        <div className={"flex flex-col text-2xl"}>
          <h1 className={"mb-2 font-light"}>Current stream:</h1>
          <p className={"font-semibold"}>{currentStream?.app}</p>
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
      <div
        className={
          "rounded-2.5xl border border-[#CACDD5] py-6 pr-8 pl-10 flex gap-4 shadow-black-e3"
        }
      >
        <div className={"flex w-full flex-col"}>
          <div className={"text-2xl font-semibold mb-4"}>Next NFT</div>
          <div className={"bg-[#F9F8FF] rounded flex justify-between"}>
            <img src={clockIcon} alt={"clock"} />
            <p>{secondsLeft}s</p>
          </div>
        </div>
        <div className={"h-[111px] w-[126px]"}>
          <img
            height={111}
            width={126}
            className={"object-cover"}
            src={getImageUrl(currentStream?.app)}
            alt={"artist_image"}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
