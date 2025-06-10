"use client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { InterviewType } from "@/app/services/constants";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/provider";

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedInterviewTypes, setSelectedInterviewTypes] = useState([]);
  const { user } = useUser();

  // Update parent state when inputs change
  useEffect(() => {
    onHandleInputChange("jobPosition", jobPosition);
  }, [jobPosition]);

  useEffect(() => {
    onHandleInputChange("jobDescription", jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    onHandleInputChange("duration", duration);
  }, [duration]);

  useEffect(() => {
    onHandleInputChange("type", selectedInterviewTypes);
  }, [selectedInterviewTypes]);

  const handleNext = () => {
    if (
      !jobPosition ||
      !jobDescription ||
      !duration ||
      selectedInterviewTypes.length === 0
    ) {
      toast.error("Please fill all fields before continuing");
      return;
    }

    if (user?.redits <= 0) {
      toast("Credit limit exceeded. Update your plan.");
      return;
    }
    GoToNext(); // Only proceed if all fields are filled
  };

  const toggleInterviewType = (title) => {
    setSelectedInterviewTypes((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2"
          value={jobPosition}
          onChange={(e) => setJobPosition(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detailed job description"
          className="mt-2 h-[200px]"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select onValueChange={(value) => setDuration(value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5m">5 Minutes</SelectItem>
            <SelectItem value="15m">15 Minutes</SelectItem>
            <SelectItem value="30m">30 Minutes</SelectItem>
            <SelectItem value="45m">45 Minutes</SelectItem>
            <SelectItem value="60m">60 Minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="flex gap-6 flex-wrap mt-2">
          {InterviewType.map((type, index) => {
            const isSelected = selectedInterviewTypes.includes(type.title);
            return (
              <div
                key={index}
                onClick={() => toggleInterviewType(type.title)}
                className={`flex items-center cursor-pointer gap-3 p-1 px-3 border rounded-2xl select-none transition ${
                  isSelected
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                <type.icon className="h-4 w-4" />
                <span>{type.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <Button className="cursor-pointer" onClick={handleNext}>
          Generate Questions <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
