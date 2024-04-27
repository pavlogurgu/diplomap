'use client'
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';

export default function Chat() {
  const { user } = useUser();

  // Визначаємо значення userId
  const userId = String(user?.username) || 'defaultUserId';

  return (
    <div className="h-screen">
      <h2>Chat Page</h2>
  
      <div style={{ width:'100vw', height:'100vh' }}>
        <SendbirdApp
          appId='589CC202-EAD8-40CD-AABE-29ACA280FC24'
          userId={userId}
          nickname={`${user?.firstName} ${user?.lastName}`}
          profileUrl={user?.imageUrl}
        />
      </div>
    </div>
  );
}
