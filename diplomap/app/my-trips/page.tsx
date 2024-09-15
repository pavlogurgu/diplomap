"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "next-themes";

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
const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

const MyTrips = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [trips, setTrips] = useState<Trip[]>([]);
  const { theme } = useTheme();
  useEffect(() => {
    const fetchTrips = async () => {
      try {
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
      <div className="mt-4">
        <h2 className="font-semibold text-4xl mb-4">Your trips:</h2>
        <ol className="grid gap-4">
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link
                href={`/my-trips/edit-trip?trip_id=${trip.trip_id}`}
                className={`${
                  theme === "dark" ? "bg-black" : "bg-white"
                } block border-green-500 border p-2 rounded-lg font-semibold text-lg hover:text-green-600`}
              >
                {trip.origin} - {trip.destination}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default MyTrips;
