import Image from "next/image";
import React from "react";

function InterviewHeader() {
  return (
    <div className="p-4 shadow-sm bg-white">
      <Image
        src={"/logo.jpg"}
        alt="logo"
        width={200}
        height={100}
        className="w-[140px]"
      ></Image>
    </div>
  );
}

export default InterviewHeader;
