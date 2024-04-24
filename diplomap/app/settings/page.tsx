import React from "react";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Settings() {
  const { userId } = auth();
  if (userId) {
    // Query DB for user specific information or display assets only to signed in users
  }
  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  return (
    <>
      <span className="font-bold text-4xl">Settings</span>
      <UserButton />
      <h2>Hello, {user?.firstName}!</h2>
      </>
  );
}
