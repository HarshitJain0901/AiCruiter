"use client";

import React, { useContext, useEffect, useState, createContext } from "react";
import { supabase } from "./services/supabaseClient";

// 1. Create context
const UserDetailContext = createContext();

// 2. Provider component
function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const createNewUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.error("Session error or no user:", sessionError?.message);
        return;
      }

      const user = session.user;

      const { data: Users, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user.email);

      if (error) {
        console.error("Supabase select error:", error.message);
        return;
      }

      if (!Users || Users.length === 0) {
        const { data: newUser, error: insertError } = await supabase
          .from("Users")
          .insert([
            {
              name:
                user.user_metadata?.name ||
                user.user_metadata?.full_name ||
                "Anonymous",
              email: user.email,
              picture: user.user_metadata?.picture || null,
            },
          ])
          .select();

        if (insertError) {
          console.error("Insert error:", insertError.message);
          return;
        }

        console.log("New user inserted:", newUser[0]);
        setUser(newUser[0]);
      } else {
        console.log("User found:", Users[0]);
        setUser(Users[0]);
      }
    };

    createNewUser();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

// 3. Custom Hook
export const useUser = () => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error("useUser must be used within a Provider");
  }
  return context;
};
