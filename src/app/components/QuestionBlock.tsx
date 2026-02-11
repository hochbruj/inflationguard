// components/QuestionBlock.tsx
"use client";

import AnswerOptions from "./AnswerOptions";

interface QuestionBlockProps {
  question: string;
  options?: string[];
  value?: string | string[];
  onAnswer: (answer: any) => void;
  helper?: string;
  type?: "radio" | "checkbox" | "text";
}

export default function QuestionBlock({
  question,
  options = [],
  value,
  onAnswer,
  helper,
  type = "radio",
}: QuestionBlockProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{question}</h3>

      {helper && <p className="text-sm text-gray-600 mb-4">{helper}</p>}

      {type === "text" ? (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Optional"
          rows={3}
          className="w-full rounded-xl border border-gray-200 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <AnswerOptions
          options={options}
          value={value}
          type={type}
          onChange={onAnswer}
        />
      )}
    </div>
  );
}
