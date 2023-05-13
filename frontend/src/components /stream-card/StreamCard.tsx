import mockedImage from "../../assets/mockStreamImage.jpg";
import playIcon from "../../assets/icons/svg/play-icon.svg";
import pauseIcon from "../../assets/icons/svg/pause-icon.svg";
import useSWR from "swr";
import axios from "axios";
import { LegacyRef, RefObject, useEffect, useRef, useState } from "react";

const StreamCard = () => {
  const [streamLink, setStreamLink] = useState("");
  const [currentStream, setCurrentStream] = useState({});
  const { data, error } = useSWR(["getStreamInfo"], () =>
    axios(`http://localhost:1985/api/v1/streams/`).then((r) => r?.data)
  );
  const playerRef = useRef<any | undefined>();

  useEffect(() => {
    if (data) {
      const curStream = data.streams?.[0];
      setCurrentStream(curStream);
      console.log(data);

      setStreamLink(
        `http://localhost:8082/${curStream.app}/${curStream.name}.mp3`
      );
    }
  }, [data]);

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

  if (!data) {
    return <div>no data</div>;
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
        <h1 className={"mb-2 font-semibold"}>{currentStream.name}</h1>
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
