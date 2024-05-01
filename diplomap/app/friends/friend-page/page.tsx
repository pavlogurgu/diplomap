"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

interface People {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  imageURL: string;
  clerk_id: string;
  email: string;
  description: string;
}
interface Trip {
  id: number;
  destination: string;
  origin: string;
  user_id: string;
  distance: string;
  duration: string;
  transport_type: string;
  trip_id: string;
  all_query: object;
}

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

const EditTripPage: React.FC = () => {
  const router = useSearchParams();
  const friendUsername = router.get("username");
  const { theme } = useTheme();
  const [personDetail, setPersonDetail] = useState<People | null>(null);
  const [personTrips, setPersonTrips] = useState<Trip[] | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        if (!friendUsername) return;

        const { data, error } = await supabase
          .from("diplomap-users")
          .select("*")
          .eq("username", friendUsername.toString());
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          setPersonDetail(data[0]);
        } else {
          setPersonDetail(null);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchUserDetail();
  }, [friendUsername]);

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        if (!personDetail?.clerk_id) return;
        const { data, error } = await supabase
          .from("diplomap")
          .select("*")
          .eq("user_id", personDetail?.clerk_id)
          .eq("private", false);

        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          setPersonTrips(data as Trip[]);
        } else {
          setPersonTrips(null);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchUserTrips();
  }, [personDetail?.clerk_id]);
  return (
    <>
      <h2 className="font-semibold text-4xl mt-4 mb-4">
        Профіль {friendUsername}
      </h2>
      {[personDetail, personTrips] ? (
        <>
          <div className="flex items-center mt-4 mb-4"></div>
          {personDetail && (
            <>
              <Image
                src={personDetail?.imageURL}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full mr-4"
              />
              <h3 className="font-semibold text-4xl">
                {personDetail.firstName} {personDetail.lastName}
              </h3>
              <h3 className="font-semibold text-xl mt-4 mb-2">Про мене: </h3>
              <p className="font-semibold text-l">{personDetail.description}</p>
            </>
          )}
          <h3 className="font-semibold text-2xl mt-4 mb-2">Shared Trips</h3>
          <ol className="grid gap-4">
            {personTrips?.map((trip) => (
              <li key={trip.trip_id}>
                <Link
                  href={`/my-trips/edit-trip?trip_id=${trip.trip_id}`}
                  className={`${
                    theme === "dark" ? "bg-black" : "bg-white"
                  } block border-green-500 border p-2 rounded-lg font-semibold text-lg hover:text-green-600`}
                >
                  <p>
                    {trip.origin} - {trip.destination}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
          <Link
            href="/friends"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            <Button>Back</Button>
          </Link>
        </>
      ) : (
        <>
          <p>Loading...</p>
          <Link href="/friends">
            <Button>Back</Button>
          </Link>
        </>
      )}
    </>
  );
};

export default EditTripPage;
