"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, switchActiveFund } from "@/lib/firestore";
import { useFundData } from "@/hooks/useFundData";
import FundDetailView from "@/components/fund-recommendation/FundDetailView";
import type { StrategyIntent } from "@/lib/strategyFraming";
import { ArrowLeft } from "lucide-react";

export default function FundDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recommendedIntent, setRecommendedIntent] =
    useState<StrategyIntent | null>(null);
  const [activeIntent, setActiveIntent] = useState<StrategyIntent | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  const { data: allData, isLoading: fundLoading, error: fundError } = useFundData();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.recommendedIntent && profile?.activeIntent) {
          setRecommendedIntent(profile.recommendedIntent);
          setActiveIntent(profile.activeIntent);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setProfileError(true);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleIntentChange = (newIntent: StrategyIntent) => {
    setActiveIntent(newIntent);
    if (user) {
      switchActiveFund(user.uid, newIntent).catch((err) =>
        console.error("Failed to persist fund switch:", err)
      );
    }
  };

  if (authLoading || profileLoading || fundLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading fund details...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-red-600">Failed to load your profile.</p>
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

  if (!recommendedIntent || !activeIntent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-700 text-lg font-medium">
            No fund recommendation found.
          </p>
          <p className="text-gray-500">
            Complete the onboarding to get your personalized fund recommendation.
          </p>
          <button
            onClick={() => router.push("/onboarding/step1")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (fundError || !allData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-red-600">Failed to load fund data.</p>
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 pt-16 pb-12">
      <div className="w-full max-w-3xl space-y-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold text-gray-900">
            Your Fund Details
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View your active fund performance, allocation, and risk profile.
          </p>
        </div>

        <FundDetailView
          recommendedIntent={recommendedIntent}
          initialActiveIntent={activeIntent}
          allData={allData}
          onIntentChange={handleIntentChange}
        />
      </div>
    </div>
  );
}
