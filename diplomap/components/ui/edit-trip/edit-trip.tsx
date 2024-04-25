import { useSearchParams } from "next/navigation";
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

  // Створюємо стан для зберігання деталей подорожі та стану private
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [tripType, setTripType] = useState<string>('');
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
          // Встановлюємо стан isPrivate залежно від значення параметру private з бази даних
          setIsPrivate(data[0].private);
        } else {
          // Якщо немає даних, встановлюємо null для tripDetail
          setTripDetail(null);
          // Якщо немає даних, встановлюємо значення за замовчуванням для isPrivate (false)
          setIsPrivate(false);
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
      origin: `${tripDetail.origin}`,
      destination: `${tripDetail.destination}`,
    });

    map.addControl(directions, "top-left");
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
      setTripType(route.weight_name)
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
  const deleteTrip = async () => {
    try {
      // Перевіряємо, чи існує tripDetail і tripDetail.trip_id
      if (!tripDetail || !tripDetail.trip_id) {
        console.error("Trip detail or trip_id is missing.");
        return;
      }
  
      // Виконуємо запит до Supabase для видалення запису з вказаним trip_id
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("trip_id", tripDetail.trip_id);
  
      if (error) {
        console.error("Error deleting trip:", error);
        return;
      }
  
      console.log("Trip deleted successfully.");

      // Після видалення, можливо, захочете очистити дані про подорож у стані компонента
      setTripDetail(null);
      setIsPrivate(false);
      setTripType("");
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };
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
            trip_id: undefined,
            private: isPrivate,
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
        const newData = {
          ...currentTrip.data,
          user_id: user?.id,
          id: undefined,
        };
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
        <Switch id="private" onClick={handlePrivate} checked={isPrivate} />
        <label htmlFor="private">Private</label>
      </div>
      <p>
        Кілометраж:{" "}
        {tripDetail && (Number(tripDetail.distance) / 1000).toFixed(2)} км
      </p>

      {tripDetail  &&
        (tripType === "auto" ? (
          <>
            <CustomSelect options={options} tripLength={tripLength} />
          </>
        ) : (
          <p>
            Ви не робитимете викидів впродовж подорожі. Дякуємо, що турбуєтесь
            про довкілля!
          </p>
        ))}
      <Button onClick={updateData}>Update Trip</Button>
      <Link href="/my-trips"><Button onClick={deleteTrip}>Delete Trip</Button></Link>

    </>
  );
}
