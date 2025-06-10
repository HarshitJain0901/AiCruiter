"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/app/services/supabaseClient";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

function ScheduledInterview() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    const GetInterviewList = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select(
          "jobPosition, duration, interview_id, interview-feedback(userEmail)"
        )
        .eq("userEmail", user?.email)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching interviews:", error.message);
        return;
      }

      console.log("Fetched interviews:", data);
      setInterviewList(data || []);
    };

    if (user) {
      GetInterviewList();
    }
  }, [user]);

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl">
        Interview List with Candidate Feedback
      </h2>

      {interviewList.length === 0 ? (
        <div className="p-5 flex flex-col gap-3 items-center mt-5 bg-white ">
          <Video className="h-10 w-10 text-primary" />
          <h2>You don't have any interview created</h2>

          <NextLink href="/dashboard/create-interview" passHref>
            <Button asChild>+ Create New Interview</Button>
          </NextLink>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewCard
              interview={interview}
              key={index}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
