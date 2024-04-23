"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";

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

const MyTrips = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [trips, setTrips] = useState<Trip[]>([]);

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
    <div>
      <h2>Trips for User {userId}</h2>
      <ol>
        {/* {trip.id}{trip.destination}{trip.origin}{trip.distance}{trip.duration}{trip.transport_type}{trip.trip_id}{trip.user_id} */}
        {trips.map((trip) => (
          // <li key={trip.id}><Link href="/my-trips/edit-trip" key = {trip.trip_id}>id {trip.trip_id} {trip.origin} - {trip.destination}</Link></li>
          <li key={trip.id}> <Link
            href={`/my-trips/edit-trip?trip_id=${trip.trip_id}`}
            key={trip.trip_id}
          >
            id {trip.trip_id} {trip.origin} - {trip.destination}
          </Link></li>
        ))}
      </ol>
    </div>
  );
};

export default MyTrips;
