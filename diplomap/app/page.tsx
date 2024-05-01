"use client";
import React from "react";
import ClerkCheck from "@/components/ui/diplomap-users/diplomap-users";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen relative">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        loop
        autoPlay
        muted
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-25 z-5"></div>
      <div className="absolute inset-0 z-10 min-h-screen flex flex-col justify-center items-center space-y-8">
        <h2 className="font-semibold text-4xl text-center text-white">
          Екологічні подорожі - це{" "}
          <span className="diplomap-logo font-light text-5xl text-white ">
            diplomap
          </span>
          !
        </h2>
        <h3 className="font-semibold text-4xl text-center text-white">
          Вітаю, {user?.username}!
        </h3>
        <div className="flex justify-center space-x-4">
          <Link href="/create">
            <Button>Створити подорож</Button>
          </Link>
          <Link
            href="https://noir-weather.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              Прогноз погоди<span className="icon-[mdi:external-link]"></span>
            </Button>
          </Link>
        </div>
        {user && <ClerkCheck />}
      </div>
    </div>
  );
}
