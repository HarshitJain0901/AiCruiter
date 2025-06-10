"use client";
import React from "react";
import { useUser } from "@/app/provider";
import Image from "next/image";
function WelcomeContainer() {
  const { user } = useUser();
  console.log("User in WelcomeContainer:", user);

  return (
    <div className="bg-white p-5 rounded-xl flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">
          Welcome Back, {user?.name ? user.name : "Loading..."}
        </h2>
        <h2 className="text-gary-500">
          AI-Driven Interviews, Hassel-Free Hiring
        </h2>
      </div>
      {user?.picture && (
        <Image
          src={user.picture}
          alt="UserAvatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
    </div>
  );
}

export default WelcomeContainer;
