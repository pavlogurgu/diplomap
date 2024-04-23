"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditTrip from "@/components/ui/edit-trip/edit-trip";
interface Trip {
  id: number;
  destination: string;
  origin: string;
  user_id: string;
  distance: string;
  duration: string;
  transport_type: string;
  trip_id: string;
  all_query: object,
}

// Ініціалізуємо клієнт supabase
const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

const EditTripPage: React.FC = () => {
  // Отримуємо trip_id з параметрів запиту
  const router = useSearchParams();
  const tripId = router.get("trip_id");

  // Створюємо стан для зберігання деталей подорожі
  const [tripDetail, setTripDetail] = useState<Trip | null>(null);

  // Ефект для отримання деталей конкретної подорожі
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
  console.log({tripDetail})

  // Повертаємо компонент
  return (
    <>
      <h2>Edit Trip</h2>
      {/* Перевіряємо, чи tripDetail існує, і виводимо відповідну інформацію */}
      {tripDetail ? (
        <>
          <p>Trip ID: {tripDetail.trip_id}</p>
          <p>Origin: {tripDetail.origin}</p>
          <p>Destination: {tripDetail.destination}</p>
          <p>id: {tripDetail.id}</p>
          <p>user_id: {tripDetail.user_id}</p>
          <p>distance: {tripDetail.distance}</p>
          <p>duration: {tripDetail.duration}</p>
          <p>transport_type: {tripDetail.transport_type}</p>
          {/* <p>transport_type: {tripDetail.all_query}</p> */}

          {/* Додайте інші поля для відображення деталей подорожі, якщо потрібно */}

        <EditTrip/>
          <Link href="/my-trips">Back</Link>
        </>
      ) : (
        <>
          <p>Loading...</p>
          <Link href="/my-trips">Back</Link>
        </>
      )}
    </>
  );
};

export default EditTripPage;
