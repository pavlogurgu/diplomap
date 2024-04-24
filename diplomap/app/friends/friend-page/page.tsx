"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface People {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  imageURL: string;
  clerk_id: string;
  email: string;
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
// Ініціалізуємо клієнт supabase
const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

const EditTripPage: React.FC = () => {
  // Отримуємо trip_id з параметрів запиту
  const router = useSearchParams();
  const friendUsername = router.get("username");

  // Створюємо стан для зберігання деталей подорожі
  const [personDetail, setPersonDetail] = useState<People | null>(null);
  //   const [personTrips, setPersonTrips] = useState<Trip | null>(null);
  const [personTrips, setPersonTrips] = useState<Trip[] | null>(null);

  // Ефект для отримання деталей конкретної подорожі
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        if (!friendUsername) return; // Перевіряємо, чи tripId не є null або undefined
        // Запит до Supabase для отримання деталей конкретної подорожі за trip_id
        const { data, error } = await supabase
          .from("diplomap-users")
          .select("*")
          .eq("username", friendUsername.toString());
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          // Якщо є дані, встановлюємо перший елемент масиву даних як tripDetail
          setPersonDetail(data[0]);
        } else {
          // Якщо немає даних, встановлюємо null для tripDetail
          setPersonDetail(null);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchUserDetail();
  }, [friendUsername]);
  console.log({ personDetail });

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        if (!personDetail?.clerk_id) return; // Перевіряємо, чи tripId не є null або undefined
        // Запит до Supabase для отримання деталей конкретної подорожі за trip_id
        const { data, error } = await supabase
          .from("diplomap")
          .select("*")
          .eq("user_id", personDetail?.clerk_id)
          .eq("private", false);

        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          // Якщо є дані, встановлюємо перший елемент масиву даних як tripDetail
          //   setPersonTrips(data);
          setPersonTrips(data as Trip[]);
        } else {
          // Якщо немає даних, встановлюємо null для tripDetail
          setPersonTrips(null);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchUserTrips();
  }, [personDetail?.clerk_id]);
  console.log({ personTrips });

  // Повертаємо компонент
  return (
    <>
      <h2>User Profile</h2>
      {/* Перевіряємо, чи tripDetail існує, і виводимо відповідну інформацію */}
      {[personDetail, personTrips] ? (
        <>
          <p>ID: {personDetail?.id}</p>
          <p>username: {personDetail?.username}</p>
          <p>firstName: {personDetail?.firstName}</p>
          <p>lastName: {personDetail?.lastName}</p>
          <p>imageURL: {personDetail?.imageURL}</p>
          <p>clerk_id: {personDetail?.clerk_id}</p>
          <p>email: {personDetail?.email}</p>
          <h3>Shared Trips</h3>
          <ol>
            {personTrips?.map((trip) => (
              <li key={trip.trip_id}>
                <Link
                  href={`/my-trips/edit-trip?trip_id=${trip.trip_id}`}
                  key={trip.trip_id}
                >
                  <p>
                    {trip.origin} - {trip.destination}
                  </p>

                  {/* <p>ID: {trip.id}</p>
              <p>destination: {trip.destination}</p>
              <p>origin: {trip.origin}</p>
              <p>user_id: {trip.user_id}</p>
              <p>distance: {trip.distance}</p>
              <p>duration: {trip.duration}</p>
              <p>transport_type: {trip.transport_type}</p>
              <p>trip_id: {trip.trip_id}</p> */}
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/friends">Back</Link>
        </>
      ) : (
        <>
          <p>Loading...</p>
          <Link href="/friends">Back</Link>
        </>
      )}
    </>
  );
};

export default EditTripPage;
