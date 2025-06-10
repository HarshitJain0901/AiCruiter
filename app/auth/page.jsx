"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/services/supabaseClient";

function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Error: ", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
        {/* Logo */}
        <Image
          src="/logo.jpg"
          alt="AiCruiter Logo"
          width={160}
          height={60}
          className="mx-auto mb-4"
        />

        {/* Illustration */}
        <Image
          src="/ill3.jpg"
          alt="Login Illustration"
          width={400}
          height={250}
          className="rounded-xl w-full object-contain mb-6"
        />

        {/* Headings */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Welcome to AiCruiter
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign In With Google Authentication
        </p>

        {/* Google Button */}
        <Button
          className="bg-gray-900 text-white w-full py-2 hover:bg-gray-800 transition rounded-lg"
          onClick={signInWithGoogle}
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
