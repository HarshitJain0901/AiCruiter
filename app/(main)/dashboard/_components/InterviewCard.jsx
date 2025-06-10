import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
  const interviewUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/${interview?.interview_id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(interviewUrl);
    toast("Copied");
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Interview Link");
    const body = encodeURIComponent(
      `Hi,\n\nHere is the interview link: ${interviewUrl}\n\nBest regards.`
    );
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    toast("Email client opened");
  };

  return (
    <div className="p-5 bg-white rounded-lg border mt-3">
      <div className="flex items-center justify-between">
        <div className="h-[40px] w-[40px] bg-primary rounded-full"></div>
        <h2 className="text-sm">
          {moment(interview?.created_at).format("DD MMM yyyy")}
        </h2>
      </div>
      <h2 className="mt-3 font-bold text-lg">{interview?.jobPosition}</h2>
      <h2 className="mt-2 text-sm flex justify-between text-gray-500">
        {interview?.duration}
        <span className="text-green-700">
          {interview["interview-feedback"]?.length} Candidates
        </span>
      </h2>
      {!viewDetail ? (
        <div className="flex gap-3 w-full mt-5">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
            onClick={copyLink}
          >
            <Copy />
            Copy Link
          </Button>
          <Button
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
            onClick={sendEmail}
          >
            <Send />
            Send
          </Button>
        </div>
      ) : (
        <Link
          href={"/scheduled-interview/" + interview?.interview_id + "/details"}
        >
          <Button className="mt-5 w-full cursor-pointer" variant="outline">
            {" "}
            View Detail <ArrowRight />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default InterviewCard;
