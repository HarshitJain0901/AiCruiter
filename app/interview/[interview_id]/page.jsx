"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, Info, Video, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/services/supabaseClient";
import { toast } from "sonner";
import { useInterviewData } from "@/app/context/InterviewDataContext";

function Interview() {
  const { interview_id } = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [name, setName] = useState("");
  const { setInterviewInfo } = useInterviewData();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_id", interview_id)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired interview link.");
        console.error("Supabase fetch error:", error?.message);
        setInterview(null);
      } else {
        setInterview(data);
      }
      setLoading(false);
    };

    if (interview_id) fetchInterview();
  }, [interview_id]);

  const handleJoinClick = async () => {
    if (!name.trim()) {
      toast.warning("Please enter your name before joining.");
      return;
    }

    setJoinLoading(true); // start loading spinner

    try {
      // Save to context
      setInterviewInfo({
        ...interview,
        candidateName: name,
        userEmail: userEmail,
      });

      // Simulate delay or do real-time validation if needed
      setTimeout(() => {
        toast.success("Interview Starting Soon...");
        router.push(`/interview/${interview_id}/start`);
      }, 1000);
    } catch (error) {
      toast.error("Failed to join interview.");
      console.error(error);
      setJoinLoading(false);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  if (!interview)
    return (
      <div className="text-center mt-20 text-red-500">Interview not found.</div>
    );

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-80 mt-12 ">
      <div className="flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52 mb-20">
        <Image
          src={"/logo.jpg"}
          alt="logo"
          width={200}
          height={100}
          className="w-[140px]"
        />
        <h2 className="mt-3">AI-Powered Interview Platform</h2>
        <Image
          src={"/ill2.jpg"}
          alt="interview"
          width={500}
          height={500}
          className="w-[280px] my-6"
        />
        <h2 className="font-bold text-xl">{interview.jobPosition} Interview</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock className="h-4 w-4" />
          {interview.duration}
        </h2>
        <div className="w-full mt-4">
          <label className="text-sm font-medium text-gray-700">
            Enter your full name
          </label>
          <Input
            placeholder="e.g. Harshit Jain"
            className="mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full mt-4">
          <label className="text-sm font-medium text-gray-700">
            Enter your Email
          </label>
          <Input
            placeholder="e.g. abc@gmail.com"
            className="mt-2"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="p-3 bg-blue-100 flex gap-4 rounded-lg mt-5 w-full">
          <Info className="text-primary mt-1" />
          <div>
            <h2 className="font-bold">Before you begin</h2>
            <ul>
              <li className="text-sm text-primary">
                - Ensure you have a stable internet connection
              </li>
              <li className="text-sm text-primary">
                - Test your camera and microphone
              </li>
              <li className="text-sm text-primary">
                - Find a quiet place for interview
              </li>
            </ul>
          </div>
        </div>
        <Button
          className={`mt-5 w-full font-bold flex items-center justify-center ${
            !name.trim() || joinLoading
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
          onClick={handleJoinClick}
          disabled={!name.trim() || joinLoading}
        >
          {joinLoading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <Video className="mr-2" />
          )}
          {joinLoading ? "Joining..." : "Join Interview"}
        </Button>
      </div>
    </div>
  );
}

export default Interview;
