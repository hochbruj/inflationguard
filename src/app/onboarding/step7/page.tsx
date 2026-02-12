"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FundDetailView from "@/components/fund-recommendation/FundDetailView";
import { useOnboarding } from "../OnboardingContext";
import { deriveProfile } from "@/lib/profileDerivation";
import { deriveStrategyFrame, StrategyIntent } from "@/lib/strategyFraming";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveOnboarding } from "@/hooks/useSaveOnboarding";
import { useFundData } from "@/hooks/useFundData";
import { ArrowRight } from "lucide-react";
import { FUND_CONTENT } from "@/lib/fundContent";

export default function Step7() {
  const { user } = useAuth();
  const router = useRouter();
  const { answers, correction, summary } = useOnboarding();

  const step = 7;
  const totalSteps = 8;

  const { data: allData, isLoading: loading, error: fetchError } = useFundData();
  const intent = useMemo(() => {
    const profile = deriveProfile(answers);
    return deriveStrategyFrame(profile).intent;
  }, [answers]);
  const [activeIntent, setActiveIntent] = useState<StrategyIntent | null>(null);
  const [saving, setSaving] = useState(false);

  const { saveToFirestore } = useSaveOnboarding();

  // Set activeIntent to AI recommendation on first render
  if (activeIntent === null && intent) {
    setActiveIntent(intent);
  }

  const handleContinueToInvest = async () => {
    if (!user) {
      // Redirect to signup if not logged in
      router.push("/signup");
      return;
    }

    setSaving(true);
    try {
      // Save everything to Firestore
      await saveToFirestore(answers, correction, summary, activeIntent!);

      // Navigate to Step 8 (Investment Guide)
      router.push("/onboarding/step8");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save your recommendation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const error = fetchError ? "Failed to load fund data. Please try again." : null;

  if (loading || !intent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading fund recommendation...</p>
      </div>
    );
  }

  if (error || !allData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error || "Failed to load fund data"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentIntent = activeIntent || intent;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-16 pb-12">
      <div className="w-full max-w-3xl space-y-6">
        <Header step={step} totalSteps={totalSteps} />

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-gray-900">
            Your Recommended Fund
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your profile, this dHedge fund matches your strategy and
            risk tolerance.
          </p>
        </div>

        <FundDetailView
          recommendedIntent={intent}
          initialActiveIntent={intent}
          allData={allData}
          onIntentChange={(newIntent) => setActiveIntent(newIntent)}
        />

        {/* Bottom CTA - Save and Continue */}
        <div className="mt-8 pt-8 border-t border-gray-200 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Invest?
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            Investing in{" "}
            <span className="font-semibold text-gray-900">
              {FUND_CONTENT[currentIntent!].name}
            </span>
          </p>
          {currentIntent !== intent && (
            <p className="text-xs text-amber-600 mt-1 mb-4">
              Note: This differs from your AI-recommended fund (
              {FUND_CONTENT[intent!].name}). You can switch back above.
            </p>
          )}

          {!user && (
            <p className="text-sm text-blue-600 mb-4">
              Create a free account to save your recommendation and continue.
            </p>
          )}

          <button
            onClick={handleContinueToInvest}
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                {user ? "Continue to Investment Guide" : "Sign Up & Continue"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
