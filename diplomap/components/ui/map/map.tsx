import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import CustomSelect from "../transport-select";
import Link from "next/link";
import { useTheme } from "next-themes";

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);
const tableName = "diplomap";

export default function Map() {
  const { user } = useUser();
  const insertdataRef = useRef({});
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const { theme } = useTheme();
  const [route, setRoute] = useState<any>(null);
  useEffect(() => {
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
    var directions = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      unit: "metric",
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
    directions.on("route", (e: { route: any }) => {
      console.log("Route data:", e.route);
      setRoute(e.route[0]);
      const originInput = document.querySelector(
        ".mapboxgl-ctrl-geocoder input[type='text']"
      ) as HTMLInputElement;
      const destinationInput = document.querySelectorAll(
        ".mapboxgl-ctrl-geocoder input[type='text']"
      )[1] as HTMLInputElement;
      const origin = originInput.value;
      const destination = destinationInput.value;
      const route = e.route[0];
      const { distance, duration, weight_name } = route;
      insertdataRef.current = {
        user_id: user?.id,
        origin: origin,
        destination: destination,
        distance: distance,
        duration: duration,
        transport_type: weight_name,
        trip_id: uuidv4(),
        all_query: e.route[0],
      };
    });

    return () => {
      map.remove();
    };
  }, [user?.id]);

  const postData = async () => {
    const { data, error } = await supabase
      .from(tableName)
      .upsert([{ ...insertdataRef.current, private: isPrivate }]);
    if (error) {
      console.error("Error posting data:", error);
      return;
    }
  };
  let tripLength = Number((route?.distance / 1000).toFixed(2));
  const handlePrivate = () => setIsPrivate(!isPrivate);
  const options = [
    { value: "car", label: "Car", emissions: 0.028 },
    { value: "bus", label: "Bus", emissions: 0.004 },
    { value: "train", label: "Train", emissions: 0.002 },
    { value: "plane", label: "Plane", emissions: 0.25 },
    { value: "motorcycle", label: "Motorcycle", emissions: 0.035 },
  ];
  return (
    <>
      <div id="map" style={{ height: "65vh", width: "100%" }}></div>
      <div className="flex items-center space-x-2">
        <Switch id="private" onClick={handlePrivate} />
        <label htmlFor="private" className="font-semibold text-l">
          Private
        </label>
      </div>
      <p className="font-semibold text-l">
        Distance: {route && (route.distance / 1000).toFixed(2)} km
      </p>
      {route &&
        (route.weight_name === "auto" ? (
          <>
            <CustomSelect options={options} tripLength={tripLength} />
          </>
        ) : (
          <p className="font-semibold text-l">
         You will produce no emissions during the trip. Thank you for caring about the environment!
          </p>
        ))}
      <Link href="/my-trips">
        <Button onClick={postData}>Save Trip</Button>
      </Link>
    </>
  );
}
