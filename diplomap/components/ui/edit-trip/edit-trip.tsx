import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
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

// Initialize the client with your Supabase project URL and API key
const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

// Define the table where you want to post data
const tableName = "diplomap";

export default function EditTrip() {
  const { user } = useUser();
  const insertdataRef = useRef({});
  const router = useSearchParams();
  const tripId = router.get("trip_id");

  // Створюємо стан для зберігання деталей подорожі
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        if (!tripId) return; // Перевіряємо, чи tripId не є null або undefined
        // Запит до Supabase для отримання деталей конкретної подорожі за trip_id
        const { data, error } = await supabase
          .from("diplomap")
          .select("*")
          .eq("trip_id", tripId.toString());
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          // Якщо є дані, встановлюємо перший елемент масиву даних як tripDetail
          setTripDetail(data[0]);
        } else {
          // Якщо немає даних, встановлюємо null для tripDetail
          setTripDetail(null);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetail();
  }, [tripId]);

  useEffect(() => {
    if (!tripDetail) return; // Перевіряємо, чи tripDetail не є null

    mapboxgl.accessToken = `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.4376, 37.7577], // Початкові координати довготи і широти
      zoom: 8, // Початковий зум
    });

    const nav = new mapboxgl.NavigationControl();
    const directions = new MapboxDirections({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
     //  profile: `mapbox/${tripDetail?.transport_type}`, // профіль маршруту
    origin: `${tripDetail.origin}`,
    destination: `${tripDetail.destination}`,

    });

    map.addControl(directions, "top-left");
    map.on('load',  function() {
        directions.setOrigin(`${tripDetail.origin}`); // can be address in form setOrigin("12, Elm Street, NY")
        directions.setDestination(`${tripDetail.destination}`); // can be address
        // const transportTypeSelect = document.querySelector(
        //     '.mapboxgl-ctrl-directions-profile select'
        //   ) as HTMLSelectElement;
        
    })
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
  }, [tripDetail, user?.id]);

  const updateData = async () => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(insertdataRef.current)
        .eq("trip_id", tripDetail?.trip_id);
  
      if (error) {
        console.error("Error updating data:", error);
        return;
      }
  
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  
  return (
    <>
      <div id="map" style={{ height: "500px", width: "500px" }}></div>
      <Button onClick={updateData}>Update Trip</Button>
    </>
  );
}