





"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";
import React from 'react';
import Supabase from '../supabase/page';

interface Trip {
  id: number;
  destination: string;
  origin: string;
  user_id: string;
  distance: string;
  duration: string;
  transport_type: string;
  trip_id: string;
}
export const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

const Friends = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [trips, setTrips] = useState<Trip[]>([]);
  const [otherTrips, setOtherTrips] = useState<Trip[]>([]);


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Запит до Supabase для отримання списку подорожей для певного user_id
        const { data, error } = await supabase
          .from("diplomap")
          .select("*")
          .eq("user_id", userId);
        if (error) {
          throw error;
        }
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    if (userId) {
      fetchTrips();
    }

    
  }, [userId]);

  return (
    <>
    <div>

      <span className="font-bold text-4xl">People</span>
      <ol>
       
        {trips.map((trip) => (
        
          <li key={trip.id}> <Link
            href={`/my-trips/edit-trip?trip_id=${trip.trip_id}`}
            key={trip.trip_id}
          >
            id {trip.trip_id} {trip.origin} - {trip.destination}
          </Link></li>
        ))}
      </ol> 
    </div>
     <div>
   </div>
   </>
  );
};

export default Friends;


