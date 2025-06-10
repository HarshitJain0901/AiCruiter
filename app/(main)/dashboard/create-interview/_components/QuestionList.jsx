"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/app/services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      console.log("formData received in QuestionList:", formData);
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    console.log("Calling API with:", formData);
    setLoading(true);

    try {
      const result = await axios.post("/api/ai-model", { ...formData });
      const content = result.data.content;

      let parsed;

      if (typeof content === "string") {
        const cleaned = content
          .replace(/^[\s\n]*```json[\s\n]*/i, "")
          .replace(/```[\s\n]*$/, "")
          .trim();

        console.log("Cleaned string:", cleaned);

        try {
          parsed = JSON.parse(cleaned);
        } catch (parseError) {
          console.warn(
            "Standard JSON parse failed. Trying to extract array..."
          );

          const match = cleaned.match(
            /interviewQuestions\s*=\s*(\[[\s\S]*?\])\s*;?/
          );
          if (match && match[1]) {
            try {
              parsed = { interviewQuestions: JSON.parse(match[1]) };
            } catch (e) {
              console.error("JSON parse error on extracted array:", e);
              toast.error("Failed to parse questions array.");
              parsed = { interviewQuestions: [] };
            }
          } else {
            console.error("Could not extract questions array from:", cleaned);
            toast.error("Failed to extract questions from response.");
            parsed = { interviewQuestions: [] };
          }
        }
      } else {
        parsed = content;
      }

      console.log("Parsed questions:", parsed);
      setQuestionList(parsed?.interviewQuestions || []);
    } catch (e) {
      console.error("Error fetching questions:", e);
      toast.error("Server Error, try Again!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();

    const { data, error } = await supabase
      .from("Interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id,
        },
      ])
      .select();

    //update credits

    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user?.credits) - 1 })
      .eq("email", user?.email)
      .select();

    setSaveLoading(false);

    if (error) {
      console.error("Error saving interview:", error);
      toast.error("Failed to save interview.");
      return;
    }

    toast.success("Interview created successfully!");
    onCreateLink(interview_id);
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2 className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions based on your job
              position.
            </p>
          </div>
        </div>
      )}

      {questionList?.length > 0 && (
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}

      <div className="flex justify-end mt-8">
        <Button onClick={onFinish} disabled={saveLoading}>
          {saveLoading && <Loader2 className="animate-spin mr-2" />}
          Create Interview Link
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
