'use client'
import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import ClerkCheck from "@/components/ui/diplomap-users/diplomap-users";
import { useUser } from "@clerk/clerk-react";

export default function Home() {

//     const { userId } = auth();
//     if (userId) {
  // const { userId } = auth();
//         // Query DB for user specific information or display assets only to signed in users
//       }
//       const user = await currentUser();
//       return user
// }
// const user = getUser()

const { user } = useUser();

  return (
    <div className="h-screen">
      <h1>Home Page</h1>
      <p>{user?.fullName}</p>
      {user && <ClerkCheck />}
    </div>
  )
}



