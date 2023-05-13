import React from "react";
import Header from "./header/Header.tsx";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"flex flex-col h-screen bg-[#D3E5FE]"}>
      <Header />
      <div className={"flex-1 px-3 relative flex flex-col w-full"}>
        <div className={"h-full w-full"}>{children}</div>
      </div>
      <div>Footer</div>
    </div>
  );
};

export default RootLayout;
