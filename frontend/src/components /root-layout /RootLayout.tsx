import React, { useEffect } from "react";
import Header from "./header/Header.tsx";
import { useAtom } from "jotai";
import useSWR from "swr";
import axios from "axios";
import { GET_STREAMS_URL } from "../../constants /api.ts";
import { currentStreamAtom } from "../../App.tsx";
import { StreamT } from "../../types/types.ts";
import logo from "../../assets/logo.png";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [currentStream, setCurrentStream] = useAtom(currentStreamAtom);

  const { data, isLoading } = useSWR(
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
    <>
      {isLoading && (
        <div
          className={
            "fixed top-0 left-0 right-0 bottom-0 bg-white flex items-center justify-center z-10"
          }
        >
          <div className={"flex flex-col"}>
            <img src={logo} alt={"logo"} />
            <p className={"text-center mt-2"}>Loading...</p>
          </div>
        </div>
      )}
      <div className={"flex flex-col min-h-screen bg-[#D3E5FE]"}>
        <Header />
        <div className={"flex-1 px-3 relative flex flex-col w-full"}>
          <div className={"h-full w-full"}>{children}</div>
        </div>
        <div className={"px-3 flex gap-2"}>
          {data &&
            data.streams.map((stream: StreamT) => (
              <div
                className={`py-8 px-10 bg-white rounded-xl border border-[#CACDD5] font-semibold ${
                  currentStream?.id === stream.id
                    ? "underline"
                    : "cursor-pointer bg-transparent"
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
        <div className={"pt-2 mt-4 px-3 border-t border-[#49536E] text-end"}>
          Musicmint 2023
        </div>
      </div>
    </>
  );
};

export default RootLayout;
