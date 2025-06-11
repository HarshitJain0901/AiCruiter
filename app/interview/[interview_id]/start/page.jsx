"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useInterviewData } from "@/app/context/InterviewDataContext";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Timer, MicOff, Mic, PhoneOff } from "lucide-react";
import Image from "next/image";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function StartInterviewPage() {
  const { interviewInfo } = useInterviewData();
  const router = useRouter();
  const params = useParams();
  const interview_id = params?.interview_id?.toString();
  const vapiRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState("connecting");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef(null);

  const GenerateFeedback = useCallback(
    async ({ conversation }) => {
      if (!conversation || !interviewInfo || !interview_id) {
        console.warn("Missing data: ", {
          conversation,
          interviewInfo,
          interview_id,
        });
        return;
      }

      try {
        const result = await axios.post("/api/ai-model/ai-feedback", {
          conversation,
        });
        let content = result.data.content;

        // Clean JSON block
        const cleaned = content.replace(/```json|```/g, "");
        let feedbackJSON;
        try {
          feedbackJSON = JSON.parse(cleaned);
        } catch (err) {
          console.error("JSON parse error:", err, cleaned);
          toast.error("Invalid feedback format");
          return;
        }

        const {
          technicalSkills = 0,
          communication = 0,
          problemSolving = 0,
          experience = 0,
        } = feedbackJSON.rating || {};

        const avg =
          (technicalSkills + communication + problemSolving + experience) / 4;
        const isRecommended = avg >= 5.5;

        feedbackJSON.Recommendation = isRecommended
          ? "Recommended"
          : "Not Recommended";
        feedbackJSON.RecommendationMsg = isRecommended
          ? "The candidate has shown satisfactory skills and is recommended for the role."
          : "The candidate needs improvement in key areas and is not recommended at this time.";

        console.table({
          Name: interviewInfo.candidateName,
          Email: interviewInfo.userEmail,
          InterviewID: interview_id,
          Recommended: isRecommended,
        });

        const { data, error } = await supabase
          .from("interview-feedback")
          .insert([
            {
              name: interviewInfo.candidateName,
              userEmail: interviewInfo.userEmail,
              interview_id,
              feedback: feedbackJSON,
              recommended: isRecommended,
            },
          ]);

        if (error) {
          console.error("Supabase insert error:", error);
          toast.error("Failed to save feedback to Supabase.");
          return;
        }

        console.log("🎉 Feedback saved successfully:", data);
        router.push(`/interview/${interview_id}/completed`);
      } catch (error) {
        console.error(
          "❌ Feedback generation failed:",
          error?.response?.data || error.message
        );
        toast.error("Failed to generate feedback.");
      }
    },
    [interviewInfo, interview_id, router]
  );

  useEffect(() => {
    if (!interviewInfo) {
      toast.error("No interview data found. Redirecting...");
      router.push("/");
    }
  }, [interviewInfo, router]);

  useEffect(() => {
    if (interviewInfo && !vapiRef.current) {
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      const userName = interviewInfo.candidateName || "Candidate";
      const jobPosition = interviewInfo.jobPosition || "a role";
      const questionList = interviewInfo?.interviewData?.questionList
        ?.map((q) => q?.question)
        .join(", ");

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${userName}, how are you? Ready for your interview on ${jobPosition}?`,
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `
You are an AI voice assistant conducting interviews.
Ask the following questions one by one:
${questionList}

Give hints if the candidate struggles. Be friendly and concise. Wrap up after 5-7 questions and give brief summary feedback.
              `.trim(),
            },
          ],
        },
      };

      const handleCallEnd = async () => {
        setCallStatus("idle");
        clearInterval(timerRef.current);
        if (conversation) await GenerateFeedback({ conversation });
        else router.push(`/interview/${interview_id}/completed`);
      };

      const handleError = (err) => {
        console.error("Vapi error:", err);
        toast.error("Interview ended due to an error.");
        setCallStatus("idle");
        clearInterval(timerRef.current);
        router.push(`/interview/${interview_id}/completed`);
      };

      vapi.on("call-end", handleCallEnd);
      vapi.on("error", handleError);
      vapi.on("transcript", () => {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 1000);
      });
      vapi.on("message", (message) => {
        setConversation(message?.conversation);
      });

      vapi
        .start(assistantOptions)
        .then(() => {
          setCallStatus("active");
          vapi.setMuted(false);
          setIsMuted(false);
          timerRef.current = setInterval(
            () => setSecondsElapsed((s) => s + 1),
            1000
          );
        })
        .catch((err) => {
          console.error("Call start failed:", err);
          toast.error("Failed to start interview.");
          setCallStatus("idle");
        });

      return () => {
        vapi.off("call-end", handleCallEnd);
        vapi.off("error", handleError);
        clearInterval(timerRef.current);
        try {
          vapi.stop();
        } catch (e) {
          console.warn("Vapi stop failed:", e);
        }
      };
    }
  }, [interviewInfo, interview_id, GenerateFeedback, conversation, router]);

  const toggleMute = () => {
    const vapi = vapiRef.current;
    if (!vapi || callStatus !== "active") return toast.error("Call not active");
    const muted = !isMuted;
    vapi.setMuted(muted);
    setIsMuted(muted);
    toast(muted ? "Muted" : "Unmuted");
  };

  const stopInterview = async () => {
    const vapi = vapiRef.current;
    if (!vapi || callStatus !== "active")
      return toast.error("No active call to stop");

    try {
      vapi.stop();
      clearInterval(timerRef.current);
      toast.success("Interview ended and saved");
      if (conversation) await GenerateFeedback({ conversation });
      else router.push(`/interview/${interview_id}/completed`);
    } catch (err) {
      toast.error("Failed to end interview");
    }
  };

  if (!interviewInfo) return null;

  const firstLetter = interviewInfo.candidateName?.charAt(0).toUpperCase();
  const formatTime = (t) =>
    `${String(Math.floor(t / 3600)).padStart(2, "0")}:${String(
      Math.floor((t % 3600) / 60)
    ).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className="p-4 md:p-20 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between items-center">
        AI Interview Session
        <span className="flex gap-2 items-center text-gray-600">
          <Timer /> {formatTime(secondsElapsed)}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6">
        <div className="bg-white h-[400px] rounded-lg border flex flex-col items-center justify-center">
          <div
            className={`relative w-[80px] h-[80px] rounded-full ${
              isSpeaking ? "ring-4 ring-blue-400 animate-pulse" : ""
            }`}
          >
            <Image
              src="/logo.jpg"
              alt="AI Interviewer"
              width={80}
              height={80}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <h3 className="mt-4 font-semibold text-gray-800 text-lg">
            AI Recruiter
          </h3>
        </div>

        <div className="bg-white h-[400px] rounded-lg border flex flex-col items-center justify-center">
          <div className="w-[80px] h-[80px] rounded-full bg-primary text-2xl font-bold text-white flex items-center justify-center">
            {firstLetter}
          </div>
          <h3 className="mt-4 font-semibold text-gray-800 text-lg">
            {interviewInfo.candidateName}
          </h3>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-10">
        {callStatus === "connecting" ? (
          <p className="text-gray-500">Connecting...</p>
        ) : callStatus === "active" ? (
          <>
            <button
              onClick={toggleMute}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded-full shadow cursor-pointer"
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            <AlertConfirmation stopInterview={stopInterview}>
              <div
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="End interview call"
              >
                <PhoneOff className="w-6 h-6" />
              </div>
            </AlertConfirmation>
          </>
        ) : callStatus === "ended" ? (
          <p className="text-green-600 font-medium">
            ✅ Interview ended and saved!
          </p>
        ) : (
          <p className="text-gray-500">No interview active</p>
        )}
      </div>

      <h2 className="text-sm text-gray-400 text-center mt-4">
        {callStatus === "connecting" && "Connecting to interview..."}
        {callStatus === "active" && "Interview in Progress..."}
        {callStatus === "idle" && "Ready to start"}
      </h2>
    </div>
  );
}

export default StartInterviewPage;
