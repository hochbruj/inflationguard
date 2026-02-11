"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/firestore";
import Header from "@/components/Header";
import InvestmentGuide from "@/components/fund-recommendation/InvestmentGuide";
import type { StrategyIntent } from "@/lib/strategyFraming";

export default function Step8() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeIntent, setActiveIntent] = useState<StrategyIntent | null>(null);
  const [loading, setLoading] = useState(true);

  const step = 8;
  const totalSteps = 8;

  useEffect(() => {
    // Redirect to signup if not logged in
    if (!authLoading && !user) {
      router.push("/signup");
      return;
    }

    // Load user profile to get their active intent
    async function loadProfile() {
      if (!user) return;

      try {
        const profile = await getUserProfile(user.uid);

        if (!profile || !profile.activeIntent) {
          // No saved data - redirect back to onboarding
          router.push("/onboarding/step1");
          return;
        }

        setActiveIntent(profile.activeIntent);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!activeIntent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600">Failed to load your recommendation</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-16 pb-12">
      <div className="w-full max-w-3xl space-y-6">
        <Header step={step} totalSteps={totalSteps} />

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-gray-900">
            How to Invest
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow these steps to set up your wallet and invest in your chosen
            fund.
          </p>
        </div>

        {/* Investment Guide */}
        <InvestmentGuide intent={activeIntent} />

        {/* Bottom Navigation */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>

          <div>
            <button
              onClick={() => router.push("/onboarding/step7")}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              ← Back to fund details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
