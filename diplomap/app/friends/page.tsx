// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { useUser } from "@clerk/clerk-react";
// import React from 'react';
// import Supabase from '../supabase/page';

// interface People {
//   id: number;
//   username: string;
//   firstName: string;
//   lastName: string;
//   imageURL: string;
//   clerk_id: string;
//   email: string;
// }
// export const supabase = createClient(
//   `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
//   `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
// );

// const Friends = () => {
//   const { user } = useUser();
//   const userId = user?.id;
//   const [people, setPeople] = useState<People[]>([]);



//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         // Запит до Supabase для отримання списку подорожей для певного user_id
//         const { data, error } = await supabase
//           .from("diplomap-users")
//           .select("*")
//           .neq("clerk_id", userId);
//         if (error) {
//           throw error;
//         }
//         setPeople(data);
//       } catch (error) {
//         console.error("Error fetching trips:", error);
//       }
//     };

//     if (userId) {
//       fetchTrips();
//     }

    
//   }, [userId]);

//   return (
//     <>
//     <div>

//       <span className="font-bold text-4xl">People</span>
//       <ol>
       
//         {people.map((person) => (
        
//           <li key={person.id}> <Link
//             href={`/friends/friend-page?username=${person.username}`}
//             key={person.username}
//           >
//             id {person.id} {person.firstName} - {person.lastName}- {person.username}
//           </Link></li>
//         ))}
//       </ol> 
//     </div>
//      <div>
//    </div>
//    </>
//   );
// };

// export default Friends;

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";
import Search from '../../components/ui/search';

interface People {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  imageURL: string;
  clerk_id: string;
  email: string;
}

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);

export default function Friends({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || '';
  const [people, setPeople] = useState<People[]>([]);
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        let fetchedPeople;
        if (query.length > 0) {
          fetchedPeople = await supabase
            .from("diplomap-users")
            .select("*")
            .neq("clerk_id", userId)
            .ilike("username", `%${query}%`);
           
        } else {
          fetchedPeople = await supabase
            .from("diplomap-users")
            .select("*")
            .neq("clerk_id", userId);
        }
        setPeople(fetchedPeople?.data || []);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    if (userId !== undefined) {
      fetchPeople();
    }
  }, [userId, query]);

  return (
    <>
      <div>
        <h1 className="font-bold text-4xl">Community</h1>
        <Search placeholder="Search friends..." />
        <ol>
          {people.map((person) => (
            <li key={person.id}>
              <Link href={`/friends/friend-page?username=${person.username}`}>
                {person.username} - {person.firstName} {person.lastName}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
