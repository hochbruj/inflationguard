"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import QuestionBlock from "@/components/QuestionBlock";
import { useOnboarding } from "../OnboardingContext";
import { block3Questions } from "@/data/questions";


export default function Step3() {
  const router = useRouter();
  const totalSteps = 5;
  const step = 3;

  const { answers, setAnswer } = useOnboarding();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswer(questionId, answer);
  };

  const handleNext =() => {
    router.push("/onboarding/step4");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-16">
      <div className="w-full max-w-lg space-y-6">
        <Header step={step} totalSteps={totalSteps} />

        {/* Block intro */}
        <h2 className="text-3xl font-semibold text-gray-900 text-center">
          Experience & Asset Understanding
        </h2>
        <p className="text-gray-700 leading-relaxed text-center">
          Before suggesting any allocation, I need to understand your
          familiarity with the assets involved. Conviction and experience are
          not the same — both matter.
        </p>

        {block3Questions.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q.question}
            options={q.options}
            value={answers[q.id]}
            onAnswer={(ans) => handleAnswer(q.id, ans as string)}
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
