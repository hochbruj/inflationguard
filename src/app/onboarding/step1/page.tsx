"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import QuestionBlock from "@/components/QuestionBlock";
import { useOnboarding } from "../OnboardingContext";
import { block1Questions } from "@/data/questions";


export default function Step1() {
  const router = useRouter();
  const totalSteps = 5;
  const step = 1;

  const { answers, setAnswer } = useOnboarding();

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswer(questionId, answer);
  };

  const handleNext = () => {
    // TODO: send answers to Firestore or AI processing
    router.push("/onboarding/step2");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 pt-16">
      <div className="w-full max-w-lg space-y-6">
        <Header step={step} totalSteps={totalSteps} />

        {/* Block 1 Intro */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
          Time Horizon & Capital Commitment
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6 text-center">
          To make any recommendation responsibly, I need to understand the scale
          of what we’re discussing. You can answer in ranges — precision is not
          required.
        </p>

        {/* Questions */}
        {block1Questions.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q.question}
            options={q.options}
            type={q.type}
            helper={q.helper}
            value={answers[q.id]}
            onAnswer={(ans) => handleAnswer(q.id, ans)}
          />
        ))}

        <button
          onClick={handleNext}
          className="mt-6 w-full px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}
