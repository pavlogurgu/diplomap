"use client";

import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";
import { useTheme } from "next-themes";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const { theme } = useTheme();

  return (
    <div
      className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        "border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
        "border-b border-gray-200 bg-white": selectedLayout,
        "border-b border-gray-600 bg-black/75 backdrop-blur-lg":
          scrolled && theme === "dark",
        "border-b border-gray-600 bg-black": selectedLayout && theme === "dark",
      })}
    >
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn></SignedIn>
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="diplomap-logo text-4xl text-black-800 ">
              diplomap
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
              <span className="font-semibold text-sm">
                <UserButton />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
