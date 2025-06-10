"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Clock1,
  Copy,
  List,
  Mail,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function InterviewLink({ interview_id, formData, onReset }) {
  const GetInterviewUrl = () => {
    return `${process.env.NEXT_PUBLIC_HOST_URL}/${interview_id}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(GetInterviewUrl()).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const getExpiryDate = () => {
    if (!formData?.created_at) return "N/A";

    const createdAtDate = new Date(formData.created_at);
    createdAtDate.setDate(createdAtDate.getDate() + 30);

    // Format as readable string, e.g., "Jun 30, 2025"
    return createdAtDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center w-full justify-center mt-7">
      <div className="relative w-[100px] h-[50px]">
        <Image src="/check.png" alt="check" fill className="object-contain" />
      </div>

      <h2 className="font-bold text-lg mt-4">Your AI Interview is Ready!</h2>
      <p className="mt-3">
        Share this link with your candidates to start the interview process
      </p>

      <div className="w-full p-7 mt-6 rounded-lg bg-white">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Interview Link</h2>
          <h2 className="p-1 px-2 text-primary bg-blue-50 rounded-4xl text-xs">
            Valid for 30 Days
          </h2>
        </div>

        <div className="mt-3 flex gap-3 items-center">
          <Input defaultValue={GetInterviewUrl()} disabled />
          <Button className="cursor-pointer" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>

        <hr className="my-5" />

        <div className="flex gap-33">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            {formData?.duration}
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <List className="h-4 w-4" />
            Questions
          </h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            Valid until {getExpiryDate()}
          </h2>
        </div>
      </div>

      <div className="bg-white mt-6 p-5 rounded-lg w-full">
        <h2 className="font-bold">Share Via</h2>
        <div className="flex gap-5 mt-3 ">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Slack
          </Button>
        </div>
      </div>

      <div className="flex gap-5 w-full mt-6 justify-between">
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Button onClick={onReset}>
          <Plus className="mr-2" />
          Create New Interview
        </Button>
      </div>
    </div>
  );
}

export default InterviewLink;
