"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { useOnboarding } from "../OnboardingContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ALL_QUESTIONS } from "@/data/questions";
import { initialMessages } from "@/data/prompt";
import { useRouter } from "next/navigation";

export default function Step5() {
  const step = 5;
  const totalSteps = 5;
  const { answers, correction, setCorrection, summary, setSummary } =
    useOnboarding();
  const mappedAnswers = Object.entries(answers).map(([qId, ans]) => {
    const q = ALL_QUESTIONS.find((q) => q.id === qId);
    return { question: q?.question, answer: ans };
  });

  const [confirmation, setConfirmation] = useState<
    "accurate" | "needsCorrection" | null
  >(null);

  // Initialize chat
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/reflection",
    }),
  });

  const hasSentInitial = useRef(false);

  const router = useRouter();
  const [showContextInput, setShowContextInput] = useState(false);

  useEffect(() => {
    if (hasSentInitial.current) return;
    if (!mappedAnswers || Object.keys(mappedAnswers).length === 0) return;

    sendMessage(initialMessages(mappedAnswers));
    hasSentInitial.current = true;
  }, [mappedAnswers, sendMessage]);

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "assistant");

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-16">
      <div className="w-full max-w-lg space-y-6">
        <Header step={step} totalSteps={totalSteps} />

        <h2 className="text-3xl font-semibold text-gray-900 text-center">
          Reflection Before Advice
        </h2>

        <p className="text-gray-700 text-center leading-relaxed">
          Before I suggest any strategy, I want to reflect back how I currently
          understand you — based solely on your answers.
        </p>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 min-h-[140px] overflow-y-auto">
          {status === "streaming" && (
            <p className="text-gray-500 italic">Thinking carefully…</p>
          )}
          {lastAssistantMessage && (
            <p className="text-gray-800 leading-relaxed">
              {lastAssistantMessage.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("")}
            </p>
          )}
        </div>

        {status === "ready" && confirmation === null && (
          <div className="space-y-3">
            <button
              onClick={() => setConfirmation("accurate")}
              className="w-full px-4 py-3 rounded-xl border border-green-300 text-green-900 font-medium
           hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              This feels accurate
            </button>

            <button
              onClick={() => setConfirmation("needsCorrection")}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 font-medium
             hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Something is missing or wrong
            </button>
          </div>
        )}

        {confirmation === "needsCorrection" && (
          <div className="space-y-4 bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-gray-700 leading-relaxed">
              You can either review and adjust your earlier answers, or add
              context that I should keep in mind when interpreting them.
            </p>

            <div className="space-y-3">
              {/* Option 1: Review answers */}
              <button
                onClick={() => {
                  // You can route to the first block or a review screen
                  router.push("/onboarding/step1");
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 transition font-medium"
              >
                Review my answers
              </button>

              {/* Option 2: Add context */}
              <button
                onClick={() => setShowContextInput(true)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 transition font-medium"
              >
                Add context
              </button>
            </div>
          </div>
        )}

        {showContextInput && (
          <div className="space-y-3">
            <textarea
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Anything you want me to keep in mind?"
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              rows={4}
            />

            <button
              className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
              onClick={() => {
                sendMessage({
                  text: `Additional context from the user: ${correction}`,
                });
                setShowContextInput(false);
                setConfirmation(null);
              }}
            >
              Update understanding
            </button>
          </div>
        )}

        {confirmation === "accurate" && (
          <button
            className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => {
              setSummary(
                lastAssistantMessage?.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("") || null,
              );
              router.push("/onboarding/step6"); // 👈 Add this
            }}
          >
            Continue to Strategy
          </button>
        )}
      </div>
    </div>
  );
}
