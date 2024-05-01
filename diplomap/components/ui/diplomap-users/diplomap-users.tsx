import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/clerk-react";

const supabase = createClient(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_KEY}`
);
export default function ClerkCheck() {
  const { user } = useUser();
  useEffect(() => {
    const addOrUpdateUser = async () => {
      try {
        const { data: existingUserData, error: existingUserError } =
          await supabase
            .from("diplomap-users")
            .select("*")
            .eq("clerk_id", user?.id);

        if (existingUserError) {
          throw existingUserError;
        }
        if (!existingUserData || existingUserData.length === 0) {
          const { data: newUser, error: insertError } = await supabase
            .from("diplomap-users")
            .insert([
              {
                clerk_id: user?.id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                username: user?.username,
                email: user?.primaryEmailAddress,
                imageURL: user?.imageUrl,
              },
            ]);

          if (insertError) {
            throw insertError;
          }
        } else {
        }
      } catch (error) {
        console.error("Error adding or updating user:", error);
      }
    };

    addOrUpdateUser();
  }, [user]);

  return <></>;
}
