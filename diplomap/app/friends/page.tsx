"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";
import Search from "../../components/ui/search";
import Image from "next/image";
import { useTheme } from "next-themes";

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

export default function Friends({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const [people, setPeople] = useState<People[]>([]);
  const { user } = useUser();
  const userId = user?.id;
  const { theme } = useTheme();

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
      <div className="mt-4">
        <h2 className="font-semibold text-4xl mb-4">Community</h2>
        <div className="mb-4">
          <Search placeholder="Search friends..." />
        </div>
        <ol className="grid gap-4">
          {people.map((person) => (
            <li
              key={person.id}
              className={`${
                theme === "dark" ? "bg-black" : "bg-white"
              } flex border-green-500 border p-2 rounded-lg font-semibold text-lg hover:text-green-600`}
            >
              <Image
                src={person.imageURL}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
              <Link
                href={`/friends/friend-page?username=${person.username}`}
                className="flex-grow"
              >
                {person.username}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
