"use client";

import { useUser } from "@/app/provider";
import { supabase } from "@/app/services/supabaseClient";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidateList from "./_components/CandidateList";

function InterviewDetails() {
  const params = useParams();
  const interview_id = params.interview_id;
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState(null);

  useEffect(() => {
    const GetInterviewDetail = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select(
          `jobPosition, jobDescription, type, questionList, duration, interview_id, created_at, interview-feedback(userEmail, name, feedback, created_at)`
        )
        .eq("userEmail", user?.email)
        .eq("interview_id", interview_id);

      console.log("Fetched interview:", data);
      setInterviewDetail(data?.[0] || null);
    };

    if (user && interview_id) {
      GetInterviewDetail();
    }
  }, [user, interview_id]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Interview Details</h1>
      {interviewDetail ? (
        <InterviewDetailContainer interviewDetail={interviewDetail} />
      ) : (
        <p>Loading...</p>
      )}
      <CandidateList
        candidateList={interviewDetail?.["interview-feedback"] || []}
      ></CandidateList>
    </div>
  );
}

export default InterviewDetails;
