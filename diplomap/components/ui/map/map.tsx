import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

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
    });

    map.addControl(directions, "top-left");
    directions.on("route", (e: { route: any }) => {
      console.log("Route data:", e.route);
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
    });

    return () => {
      map.remove(); // Прибираємо карту при відмонтовуванні компонента
    };
  }, [user?.id]);

  const postData = async () => {
    const { data, error } = await supabase.from(tableName).upsert([
      insertdataRef.current,
    ]);

    if (error) {
      console.error("Error posting data:", error);
      return;
    }

    console.log("Data posted successfully:", data);
  };

  return (
    <>
      <div id="map" style={{ height: "500px", width: "500px" }}></div>
      <Button onClick={postData}>Save Trip</Button>
    </>
  );
}
