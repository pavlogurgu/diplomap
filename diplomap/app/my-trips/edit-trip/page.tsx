"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditTrip from "@/components/ui/edit-trip/edit-trip";
import { Button } from "@/components/ui/button";
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
  const tripId = router.get("trip_id");
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        if (!tripId) return;
        const { data, error } = await supabase
          .from("diplomap")
          .select("*")
          .eq("trip_id", tripId.toString());
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          setTripDetail(data[0]);
        } else {
          setTripDetail(null);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetail();
  }, [tripId]);

  return (
    <>
      <h2 className="font-semibold text-4xl mb-4">Edit trip</h2>
      {tripDetail ? (
        <>
          <p className="font-semibold text-l">
            Route: {tripDetail.origin} - {tripDetail.destination}
          </p>
          <p className="font-semibold text-l">
            Trip ID: {tripDetail.trip_id}
          </p>
          <p className="font-semibold text-l">
            Distance: {Number(Number(tripDetail.distance) / 1000).toFixed(2)} km
          </p>
          <EditTrip />
          <Link href="/my-trips">
            <Button>Back</Button>
          </Link>
        </>
      ) : (
        <>
          <p className="font-semibold text-l">Loading...</p>
          <Link href="/my-trips">
            <Button>Back</Button>
          </Link>
        </>
      )}
    </>
  );
};

export default EditTripPage;
