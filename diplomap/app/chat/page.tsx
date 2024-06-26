"use client";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { App as SendbirdApp } from "@sendbird/uikit-react";
import "@sendbird/uikit-react/dist/index.css";

export default function Chat() {
  const { user } = useUser();
  const userId = String(user?.username) || "defaultUserId";

  return (
    <div style={{ width: "100%", height: "93vh" }}>
      <SendbirdApp
        appId="589CC202-EAD8-40CD-AABE-29ACA280FC24"
        userId={userId}
        nickname={`${user?.firstName} ${user?.lastName}`}
        profileUrl={user?.imageUrl}
      />
    </div>
  );
}
