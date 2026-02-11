"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useOnboarding } from "../OnboardingContext";
import { deriveProfile } from "@/lib/profileDerivation";
import { deriveStrategyFrame, StrategyFrame } from "@/lib/strategyFraming";

export default function Step6() {
  const router = useRouter();
  const { answers } = useOnboarding();

  const step = 6;
  const totalSteps = 8; // Updated: 6 steps + Fund Rec + Investment Guide

  const [strategyFrame, setStrategyFrame] = useState<StrategyFrame | null>(
    null
  );
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    // Derive profile and strategy frame from answers
    const profile = deriveProfile(answers);
    console.log("Derived profile:", profile);
    const frame = deriveStrategyFrame(profile);
    console.log("Derived strategy frame:", frame);
    setStrategyFrame(frame);
  }, [answers]);

  const handleContinue = () => {
    if (!acknowledged) return;

    // TODO: Save strategy frame to context or storage
    // setStrategyFrame in context if you want to persist it

    // Move to fund recommendation
    router.push("/onboarding/step7");
  };

  const handleReviewAnswers = () => {
    router.push("/onboarding/step1");
  };

  if (!strategyFrame) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading strategy framework...</p>
      </div>
    );
  }

  const hasWarnings = strategyFrame.warnings.length > 0;
  const isInappropriate = strategyFrame.inappropriateIf.length > 0;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-16 pb-12">
      <div className="w-full max-w-2xl space-y-6">
        <Header step={step} totalSteps={totalSteps} />

        <h2 className="text-3xl font-semibold text-gray-900 text-center">
          Your Strategy Framework
        </h2>

        <p className="text-gray-700 text-center leading-relaxed">
          Based on your profile, here's how this strategy is framed. This is not
          yet a specific fund — just the philosophy.
        </p>

        {/* Intent Badge */}
        <div className="flex justify-center">
          <div
            className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            ${
              strategyFrame.intent === "conservative"
                ? "bg-green-100 text-green-800"
                : ""
            }
            ${
              strategyFrame.intent === "balanced"
                ? "bg-blue-100 text-blue-800"
                : ""
            }
            ${
              strategyFrame.intent === "growth"
                ? "bg-purple-100 text-purple-800"
                : ""
            }
          `}
          >
            {strategyFrame.intent === "conservative" &&
              "🛡️ Conservative Strategy"}
            {strategyFrame.intent === "balanced" && "⚖️ Balanced Strategy"}
            {strategyFrame.intent === "growth" &&
              "📈 Growth-Oriented Strategy"}
          </div>
        </div>

        {/* Main Framing Text */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 space-y-4">
          {strategyFrame.framingText.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Risk Acknowledgment */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="space-y-1">
              <p className="font-medium text-amber-900">Risk Acknowledgment</p>
              <p className="text-sm text-amber-800">
                {strategyFrame.riskAcknowledgment}
              </p>
            </div>
          </div>
        </div>

        {/* Warnings (if any) */}
        {hasWarnings && (
          <div className="space-y-3">
            {strategyFrame.warnings.map((warning, idx) => (
              <div
                key={idx}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-sm text-red-800">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Inappropriate Conditions (if any) */}
        {isInappropriate && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-5">
            <p className="font-semibold text-red-900 mb-3">
              ❌ This strategy may be inappropriate if:
            </p>
            <ul className="space-y-2">
              {strategyFrame.inappropriateIf.map((condition, idx) => (
                <li
                  key={idx}
                  className="text-sm text-red-800 flex items-start gap-2"
                >
                  <span className="text-red-600 mt-0.5">•</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Acknowledgment Checkbox */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I understand this framework describes the intent and philosophy of
              the strategy. I acknowledge the stated risks and accept that this
              approach may experience significant temporary losses. I will not
              be shown the specific fund until I confirm this understanding.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleContinue}
            disabled={!acknowledged}
            className={`
              w-full px-6 py-3 rounded-xl font-medium transition-colors
              ${
                acknowledged
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            {acknowledged
              ? "Continue to Fund Recommendation"
              : "Please acknowledge to continue"}
          </button>

          <button
            onClick={handleReviewAnswers}
            className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 
                     hover:bg-gray-50 transition-colors font-medium"
          >
            Review My Answers
          </button>
        </div>

        {/* Additional Context */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>What's next:</strong> Once you confirm this framework, I'll
            recommend the specific dHedge fund that matches your profile, with
            live performance data and investment instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
