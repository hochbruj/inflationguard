"use client";

import { createContext, useContext, useState } from "react";

export type Answers = Record<string, string | string[]>;

const OnboardingContext = createContext<{
  answers: Answers;
  correction: string | null;
  summary: string | null;
  setAnswer: (key: string, value: string | string[]) => void;
  setCorrection: (correction: string | null) => void;
  setSummary: (summary: string | null) => void;
}>({
  answers: {},
  correction: null,
  summary: null,
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

  const [correction, setCorrection] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

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
