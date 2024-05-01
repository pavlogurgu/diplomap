"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);
const tableName = "diplomap-users";

export default function AboutMe() {
  const { user } = useUser();
  const [myDescription, setMyDescription] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        if (!user) return;
        const { data, error } = await supabase
          .from(tableName)
          .select("description")
          .eq("clerk_id", user.id);
        if (error) {
          throw error;
        }
        if (data && data.length > 0) {
          setMyDescription(data[0].description);
        } else {
          setMyDescription(null);
        }
      } catch (error) {
        console.error("Error fetching description:", error);
      }
    };
    fetchDescription();
  }, [user]);

  const updateData = async () => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ description: newDescription })
        .eq("clerk_id", user?.id);
      if (error) {
        throw error;
      }
      setMyDescription(newDescription);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  return (
    <>
      {isEditing ? (
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          ref={descriptionRef}
        />
      ) : (
        <p className="font-semibold text-l">{myDescription}</p>
      )}
      {isEditing ? (
        <Button onClick={updateData}>Зберегти</Button>
      ) : (
        <Button onClick={() => setIsEditing(true)}>Редагувати опис</Button>
      )}
    </>
  );
}
