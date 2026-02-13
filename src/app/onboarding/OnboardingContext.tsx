"use client";

import { createContext, useContext, useState } from "react";

export type Answers = Record<string, string | string[]>;

const OnboardingContext = createContext<{
  answers: Answers;
  correction: string;
  summary: string;
  setAnswer: (key: string, value: string | string[]) => void;
  setCorrection: (correction: string) => void;
  setSummary: (summary: string) => void;
}>({
  answers: {},
  correction: "",
  summary: "",
  setAnswer: () => {},
  setCorrection: () => {},
  setSummary: () => {},
});

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [answers, setAnswers] = useState<Answers>({});

  const setAnswer = (key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const [correction, setCorrection] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  return (
    <OnboardingContext.Provider
      value={{
        answers,
        correction,
        summary,
        setAnswer,
        setCorrection,
        setSummary,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
