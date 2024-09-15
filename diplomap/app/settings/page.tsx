import React from "react";
import { UserButton } from "@clerk/nextjs";
import AboutMe from "./description/page";

export default async function Settings() {
  return (
    <>
      <h2 className="font-semibold text-4xl mt-4 mb-4">Settings</h2>
      <h3 className="font-semibold text-2xl">
        Account management:{" "}
        <span className="inline-flex items-center">
          <UserButton />
        </span>
      </h3>

      <h3 className="font-semibold text-2xl">Tell us about you!</h3>
      <AboutMe />
    </>
  );
}
