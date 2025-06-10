"use client";

import React, { createContext, useState, useContext } from "react";

export const InterviewDataContext = createContext();

export function InterviewDataProvider({ children }) {
  const [interviewInfo, setInterviewInfo] = useState(null);

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContext.Provider>
  );
}

// Optional hook
export const useInterviewData = () => useContext(InterviewDataContext);
