import React from "react";
import InterviewHeader from "./_components/InterviewHeader";
import { InterviewDataProvider } from "../context/InterviewDataContext";

function InterviewLayout({ children }) {
  return (
    <InterviewDataProvider>
      <div className="bg-secondary ">
        <InterviewHeader />
        {children}
      </div>
    </InterviewDataProvider>
  );
}

export default InterviewLayout;
