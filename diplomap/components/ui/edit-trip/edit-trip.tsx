import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CustomSelect from "../transport-select";
import Link from "next/link";
import { useTheme } from "next-themes";
interface Trip {
  weight_name: string;
  id: number;
  destination: string;
  origin: string;
  user_id: string;
  distance: string;
  duration: string;
  transport_type: string;
  trip_id: string;
  all_query: object;
  private: boolean;
}

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);
const tableName = "diplomap";

export default function EditTrip() {
  const { user } = useUser();
  const insertdataRef = useRef({});
  const router = useSearchParams();
  const tripId = router.get("trip_id");
  const { theme } = useTheme();
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [tripType, setTripType] = useState<string>("");
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
          setIsPrivate(data[0].private);
        } else {
          setTripDetail(null);
          setIsPrivate(false);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetail();
  }, [tripId]);

  useEffect(() => {
    if (!tripDetail) return;
    mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    const map = new mapboxgl.Map({
      container: "map",
      style: `${
        theme === "dark"
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/streets-v11"
      }`,
      center: [30.54413, 50.44956],
      zoom: 8,
    });

    const nav = new mapboxgl.NavigationControl();
    const directions = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      origin: `${tripDetail.origin}`,
      destination: `${tripDetail.destination}`,
    });

    map.addControl(directions, "top-left");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );
    map.on("load", function () {
      directions.setOrigin(`${tripDetail.origin}`);
      directions.setDestination(`${tripDetail.destination}`);
    });
    directions.on("route", (e: { route: any }) => {
      console.log("Route data:", e.route);
      const originInput = document.querySelector(
        ".mapboxgl-ctrl-geocoder input[type='text']"
      ) as HTMLInputElement;
      const destinationInput = document.querySelectorAll(
        ".mapboxgl-ctrl-geocoder input[type='text']"
      )[1] as HTMLInputElement;
      const transportTypeSelect = document.querySelector(
        ".mapboxgl-ctrl-directions-profile select"
      ) as HTMLSelectElement;
      const origin = originInput.value;
      const destination = destinationInput.value;
      const route = e.route[0];
      const { distance, duration, weight_name } = route;
      setTripType(route.weight_name);
      insertdataRef.current = {
        user_id: user?.id,
        origin: origin,
        destination: destination,
        distance: distance,
        duration: duration,
        transport_type: weight_name,
        all_query: e.route[0],
      };
    });

    return () => {
      map.remove();
    };
  }, [tripDetail, user?.id]);
  const deleteTrip = async () => {
    try {
      if (!tripDetail || !tripDetail.trip_id) {
        console.error("Trip detail or trip_id is missing.");
        return;
      }
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("trip_id", tripDetail.trip_id);
      if (error) {
        console.error("Error deleting trip:", error);
        return;
      }
      setTripDetail(null);
      setIsPrivate(false);
      setTripType("");
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };
  const updateData = async () => {
    try {
      const currentTrip = await supabase
        .from(tableName)
        .select("*")
        .eq("trip_id", tripDetail?.trip_id)
        .single();

      if (!currentTrip.data) {
        console.error("Trip not found");
        return;
      }
      if (currentTrip.data.user_id === user?.id) {
        const { data, error } = await supabase
          .from(tableName)
          .update({
            ...insertdataRef.current,
            user_id: undefined,
            trip_id: undefined,
            private: isPrivate,
          })
          .eq("trip_id", tripDetail?.trip_id);
        if (error) {
          console.error("Error updating data:", error);
          return;
        }
      } else {
        const newData = {
          ...currentTrip.data,
          user_id: user?.id,
          id: undefined,
        };
        const { data: newTripData, error: newTripError } = await supabase
          .from(tableName)
          .insert(newData);

        if (newTripError) {
          console.error("Error creating new trip data:", newTripError);
          return;
        }
        const { data: updatedTripData, error: updateError } = await supabase
          .from(tableName)
          .update({
            ...insertdataRef.current,
            user_id: undefined,
            trip_id: undefined,
            private: isPrivate,
          })
          .eq("trip_id", tripDetail?.trip_id);
        if (updateError) {
          console.error("Error updating current trip data:", updateError);
          return;
        }

        console.log("Data updated successfully:", updatedTripData);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  let tripLength = Number((Number(tripDetail?.distance) / 1000).toFixed(2));
  const handlePrivate = () => setIsPrivate(!isPrivate);
  const options = [
    { value: "car", label: "Машина", emissions: 0.028 },
    { value: "bus", label: "Автобус", emissions: 0.004 },
    { value: "train", label: "Поїзд", emissions: 0.002 },
    { value: "plane", label: "Літак", emissions: 0.25 },
    { value: "motorcycle", label: "Мотоцикл", emissions: 0.035 },
  ];
  return (
    <>
      <div id="map" style={{ height: "50vh", width: "100%" }}></div>
      <div className="flex items-center space-x-2">
        <Switch id="private" onClick={handlePrivate} checked={isPrivate} />
        <label htmlFor="private" className="font-semibold text-l">
          Private
        </label>
      </div>
      <p className="font-semibold text-l">
        Кілометраж:{" "}
        {tripDetail && (Number(tripDetail.distance) / 1000).toFixed(2)} км
      </p>

      {tripDetail &&
        (tripType === "auto" ? (
          <>
            <CustomSelect options={options} tripLength={tripLength} />
          </>
        ) : (
          <p className="font-semibold text-l">
            Ви не робитимете викидів впродовж подорожі. Дякуємо, що турбуєтесь
            про довкілля!
          </p>
        ))}
      <div className="flex divide-x-8">
        <Link href="/my-trips">
          <Button onClick={updateData}>Update Trip</Button>
        </Link>
        <Link href="/my-trips">
          <Button onClick={deleteTrip} variant="destructive">
            Delete Trip
          </Button>
        </Link>
      </div>
    </>
  );
}
