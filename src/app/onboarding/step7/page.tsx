"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FundHeader from "@/components/fund-recommendation/FundHeader";
import FundStats from "@/components/fund-recommendation/FundStats";
import PerformanceChart from "@/components/fund-recommendation/PerformanceChart";
import RiskSummary from "@/components/fund-recommendation/RiskSummary";
import AssetAllocation from "@/components/fund-recommendation/AssetAllocation";
import FundComparison from "@/components/fund-recommendation/FundComparison";
import { useOnboarding } from "../OnboardingContext";
import { deriveProfile } from "@/lib/profileDerivation";
import { deriveStrategyFrame, StrategyIntent } from "@/lib/strategyFraming";
import type { AllFundsResponse } from "@/lib/types";
import { getFundContent } from "@/lib/fundContent";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveOnboarding } from "@/hooks/useSaveOnboarding";
import { ArrowRight } from "lucide-react";
import { FUND_CONTENT } from "@/lib/fundContent";

export default function Step7() {
  const { user } = useAuth();
  const router = useRouter();
  const { answers, correction, summary } = useOnboarding();

  const step = 7;
  const totalSteps = 8;

  const [allData, setAllData] = useState<AllFundsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<StrategyIntent | null>(null);
  const [activeIntent, setActiveIntent] = useState<StrategyIntent | null>(null);
  const [saving, setSaving] = useState(false);

  const { saveToFirestore } = useSaveOnboarding();

  const handleContinueToInvest = async () => {
    if (!user) {
      // Redirect to signup if not logged in
      router.push('/signup');
      return;
    }

    setSaving(true);
    try {
      // Save everything to Firestore
      await saveToFirestore(answers, correction, summary, activeIntent!);
      
      // Navigate to Step 8 (Investment Guide)
      router.push('/onboarding/step8');
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Failed to save your recommendation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Derive profile and get recommended fund intent
    const profile = deriveProfile(answers);
    const strategyFrame = deriveStrategyFrame(profile);
    setIntent(strategyFrame.intent);
    setActiveIntent(strategyFrame.intent); // Start with AI recommendation

    // Fetch all fund data from API
    async function fetchFunds() {
      try {
        const response = await fetch("/api/funds");
        if (!response.ok) {
          throw new Error("Failed to fetch fund data");
        }
        const data: AllFundsResponse = await response.json();
        setAllData(data);
      } catch (err) {
        console.error("Error fetching funds:", err);
        setError("Failed to load fund data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchFunds();
  }, [answers]);

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
  const fundApiData = allData.funds[currentIntent!];
  const fundContent = getFundContent(currentIntent!);
  const isLaunched = parseFloat(fundApiData.poolValue) > 0;
  const currentAPY =
    currentIntent === "conservative" ? fundApiData.returns["1Y"] : undefined;

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

        <FundHeader
          name={fundContent.name}
          intent={currentIntent!}
          dhedgeUrl={fundContent.dhedgeUrl}
          matchReason={fundContent.matchReason}
        />

        <FundStats
          isLaunched={isLaunched}
          leverage={
            currentIntent === "conservative"
              ? undefined
              : parseFloat(fundApiData.leverage)
          }
          targetAPY={fundContent.targetAPY}
          currentAPY={currentAPY}
          returns={fundApiData.returns}
          intent={currentIntent!}
        />

        <AssetAllocation
          composition={fundApiData.composition}
          intent={currentIntent!}
          leverage={parseFloat(fundApiData.leverage)}
        />

        <PerformanceChart
          intent={currentIntent!}
          fundLaunchDate={fundContent.launchDate}
          chartData={{
            shortTermChartData: allData.shortTermChartData,
            monthlyChartData: allData.monthlyChartData,
          }}
        />

        <RiskSummary
          intent={currentIntent!}
          riskData={fundContent.riskData}
          healthFactor={
            currentIntent === "conservative"
              ? parseFloat(fundApiData.healthFactor)
              : undefined
          }
        />

        <FundComparison
          recommendedIntent={intent!}
          activeIntent={currentIntent!}
          allFunds={allData.funds}
          onFundSwitch={(newIntent) => setActiveIntent(newIntent)}
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
              'Saving...'
            ) : (
              <>
                {user ? 'Continue to Investment Guide' : 'Sign Up & Continue'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}