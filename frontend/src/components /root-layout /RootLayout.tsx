import React, { useEffect } from "react";
import Header from "./header/Header.tsx";
import { useAtom } from "jotai";
import useSWR from "swr";
import axios from "axios";
import { GET_STREAMS_URL } from "../../constants /api.ts";
import { currentStreamAtom } from "../../App.tsx";
import { StreamT } from "../../types/types.ts";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [currentStream, setCurrentStream] = useAtom(currentStreamAtom);

  const { data } = useSWR(
    ["getStreamInfo"],
    () => axios(GET_STREAMS_URL).then((r) => r?.data),
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    if (data && data.streams.length && !currentStream) {
      setCurrentStream(data.streams[0]);
    }
  }, [data]);

  return (
    <div className={"flex flex-col min-h-screen bg-[#D3E5FE]"}>
      <Header />
      <div className={"flex-1 px-3 relative flex flex-col w-full"}>
        <div className={"h-full w-full"}>{children}</div>
      </div>
      <div className={"px-3 flex gap-2"}>
        {data &&
          data.streams.map((stream: StreamT) => (
            <div
              className={`py-8 px-10 bg-white rounded-xl border border-[#CACDD5] ${
                currentStream?.id !== stream.id ? "cursor-pointer" : ""
              }`}
              key={stream.id}
              onClick={() => {
                if (currentStream?.id === stream.id) {
                  return;
                }
                setCurrentStream(
                  data.streams.find((item: StreamT) => item.id === stream.id)
                );
              }}
            >
              {stream.app}
            </div>
          ))}
      </div>
      <div className={"px-3"}>Footer</div>
    </div>
  );
};

export default RootLayout;
