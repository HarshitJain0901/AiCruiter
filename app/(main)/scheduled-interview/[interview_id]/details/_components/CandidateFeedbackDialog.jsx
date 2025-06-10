"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function CandidateFeedbackDialog({ candidate, triggerElement }) {
  if (!candidate?.feedback) return null;

  const parsedFeedback =
    typeof candidate.feedback === "string"
      ? JSON.parse(candidate.feedback)
      : candidate.feedback;

  const feedback = parsedFeedback.feedback || {};
  const rating = feedback.rating || {};
  const summary = feedback.summary || [];
  const recommendation = feedback.Recommendation;
  const recommendationMsg = feedback.RecommendationMsg;

  const avgScore =
    ((rating.technicalSkills || 0) +
      (rating.communication || 0) +
      (rating.problemSolving || 0) +
      (rating.experience || 0)) /
    4;

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Interview Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white font-bold h-12 w-12 rounded-full flex items-center justify-center text-lg">
              {candidate?.name?.[0]}
            </div>
            <div>
              <h2 className="font-semibold text-lg">{candidate?.name}</h2>
              <p className="text-sm text-gray-500">{candidate?.userEmail}</p>
            </div>
          </div>

          {/* Avg Score */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <h2 className="text-xl font-bold text-primary">
              {avgScore.toFixed(1)} / 10
            </h2>
          </div>

          {/* Sliders */}
          <div className="grid gap-4">
            <FeedbackSlider
              label="Technical Skills"
              value={rating.technicalSkills}
            />
            <FeedbackSlider
              label="Communication"
              value={rating.communication}
            />
            <FeedbackSlider
              label="Problem Solving"
              value={rating.problemSolving}
            />
            <FeedbackSlider label="Experience" value={rating.experience} />
          </div>

          {/* Summary */}
          {summary?.length > 0 && (
            <div className="text-sm">
              <p className="font-semibold mb-2">Summary:</p>
              <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                {summary.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div className="text-sm">
              <p className="font-semibold">
                Recommendation:{" "}
                <span className="text-primary">{recommendation}</span>
              </p>
              <p className="text-muted-foreground mt-1">{recommendationMsg}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const FeedbackSlider = ({ label, value = 0 }) => (
  <div className="flex items-center justify-between">
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <Slider
        defaultValue={[value]}
        max={10}
        step={1}
        disabled
        className="w-full"
      />
    </div>
    <div className="ml-3 min-w-[40px] text-right text-sm font-medium text-muted-foreground">
      {value}/10
    </div>
  </div>
);

export default CandidateFeedbackDialog;
