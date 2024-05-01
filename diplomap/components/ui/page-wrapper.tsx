"use client";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <div
      className={`${
        theme === "dark" ? "bg-gray-800" : "bg-zinc-100"
      } flex flex-col pt-2 px-4 space-y-2 flex-grow pb-4`}
    >
      {children}
    </div>
  ) : null;
}
