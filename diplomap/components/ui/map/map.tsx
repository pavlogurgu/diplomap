import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from "react";
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

// Initialize the client with your Supabase project URL and API key
const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

// Define the table where you want to post data
const tableName = "diplomap";

export default function Map() {
  const { user } = useUser();
  const insertdataRef = useRef({});
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [route, setRoute] = useState<any>(null); // Додали стан для маршруту
  useEffect(() => {
    mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.4376, 37.7577], // Початкові координати довготи і широти
      zoom: 8, // Початковий зум
    });

    const nav = new mapboxgl.NavigationControl();
    var directions = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      unit: 'metric'
    });

    map.addControl(directions, "top-left");
    map.addControl(
      new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true
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

      console.log("insertdata:", { insertdataRef });
      console.log(route.distance)
    });

    return () => {
      map.remove(); // Прибираємо карту при відмонтовуванні компонента
    };
  }, [user?.id]);

  const postData = async () => {
    const { data, error } = await supabase.from(tableName).upsert([
      { ...insertdataRef.current, private: isPrivate },
    ]);

    if (error) {
      console.error("Error posting data:", error);
      return;
    }

    console.log("Data posted successfully:", data);
  };
let tripLength = Number((route?.distance/ 1000).toFixed(2))
  const handlePrivate = () => setIsPrivate(!isPrivate);
  const options = [
    { value: 'car', label: 'Машина', emissions: 0.028 },
    { value: 'bus', label: 'Автобус', emissions: 0.004 },
    { value: 'train', label: 'Поїзд', emissions: 0.002 },
    { value: 'plane', label: 'Літак', emissions: 0.25 },
    { value: 'motorcycle', label: 'Мотоцикл', emissions: 0.035 }
  ];
  return (
    <>
      <div id="map" style={{ height: "500px", width: "500px" }}></div>
      <div className="flex items-center space-x-2">
        <Switch id="private"onClick={handlePrivate} />
        <label htmlFor="private">Private</label>
      </div>
      <p>Кілометраж: {route && (route.distance/ 1000).toFixed(2)} км</p>
      
      {route && (
      route.weight_name === "auto" ? (
        <>
        <CustomSelect options={options} tripLength={tripLength} />
      </>
      

      ) : (
        <p>Ви не робитимете викидів впродовж подорожі. Дякуємо, що турбуєтесь про довкілля!</p>
      )
    )}
        <Link href="/my-trips"><Button onClick={postData}>Save Trip</Button></Link>
    </>
  );
}
