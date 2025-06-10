"use client";

import React from "react";
import { CheckCircle, Mail, Globe } from "lucide-react";

export default function InterviewComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Interview Completed
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for completing the interview.
        </p>

        <div className="flex flex-col gap-3 items-start text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Your interviewing company will email you the results.
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            You may now close your browser.
          </div>
        </div>
      </div>
    </div>
  );
}
