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
        all_query: e.route[0],
      };

      console.log("insertdata:", { insertdataRef });
    });

    return () => {
      map.remove(); // Прибираємо карту при відмонтовуванні компонента
    };
  }, [tripDetail, user?.id]);
//----------------------------------------------
  // const updateData = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from(tableName)
  //       .update(insertdataRef.current)
  //       .eq("trip_id", tripDetail?.trip_id);
  
  //     if (error) {
  //       console.error("Error updating data:", error);
  //       return;
  //     }
  
  //     console.log("Data updated successfully:", data);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //   }
  // };
//----------------------------------------------
const updateData = async () => {
  try {
    // Отримуємо поточний запис з бази даних за trip_id
    const currentTrip = await supabase
      .from(tableName)
      .select("*")
      .eq("trip_id", tripDetail?.trip_id)
      .single();

    if (!currentTrip.data) {
      console.error("Trip not found");
      return;
    }

    // Якщо user_id не змінився
    if (currentTrip.data.user_id === user?.id) {
      // Оновлюємо існуючий запис в таблиці (все окрім user_id та trip_id)
      const { data, error } = await supabase
        .from(tableName)
        .update({ 
          // Оновлюємо всі поля, крім user_id та trip_id
          ...insertdataRef.current, 
          // За винятком user_id та trip_id
          user_id: undefined, 
          trip_id: undefined 
        })
        .eq("trip_id", tripDetail?.trip_id);

      if (error) {
        console.error("Error updating data:", error);
        return;
      }

      console.log("Data updated successfully:", data);
    } else {
      // Якщо user_id змінився
      // Створюємо копію поточного запису з новим user_id
      const newData = { ...currentTrip.data, user_id: user?.id, id: undefined };
      // Вставляємо новий запис в таблицю з тим самим trip_id, але з новим user_id
      const { data: newTripData, error: newTripError } = await supabase
        .from(tableName)
        .insert(newData);

      if (newTripError) {
        console.error("Error creating new trip data:", newTripError);
        return;
      }

      console.log("New trip created:", newTripData);

      // Оновлюємо поточний запис в таблиці (все окрім user_id та trip_id)
      const { data: updatedTripData, error: updateError } = await supabase
        .from(tableName)
        .update({ 
          // Оновлюємо всі поля, крім user_id та trip_id
          ...insertdataRef.current, 
          // За винятком user_id та trip_id
          user_id: undefined, 
          trip_id: undefined 
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





  // const updateData = async () => {
  //   try {
  //     // Отримуємо поточне значення user_id для подорожі
  //     const currentTrip = await supabase
  //       .from(tableName)
  //       .select("user_id")
  //       .eq("trip_id", tripDetail?.trip_id)
  //       .single();
  
  //     if (!currentTrip.data) {
  //       console.error("Trip not found");
  //       return;
  //     }
  
  //     // Розбиваємо рядок user_id на масив
  //     const currentUserIdArray = currentTrip.data.user_id.split(',');
      
  //     // Додаємо новий user_id до масиву
  //     currentUserIdArray.push(user?.id);
  
  //     // Оновлюємо дані в базі даних з оновленим масивом user_id
  //     const { data, error } = await supabase
  //       .from(tableName)
  //       .update({ user_id: currentUserIdArray }, insertdataRef.current)
  //       .eq("trip_id", tripDetail?.trip_id);
  
  //     if (error) {
  //       console.error("Error updating data:", error);
  //       return;
  //     }
  
  //     console.log("Data updated successfully:", data);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //   }
  // };







  return (
    <>
      <div id="map" style={{ height: "500px", width: "500px" }}></div>
      <Button onClick={updateData}>Update Trip</Button>
    </>
  );
}