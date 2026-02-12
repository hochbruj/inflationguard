// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, type UserProfile } from "@/lib/firestore";
import { FUND_CONTENT, getDhedgeUrl } from "@/lib/fundContent";
import {
  Shield,
  TrendingUp,
  Zap,
  LogOut,
  ArrowRight,
  Brain,
  User,
  Info,
} from "lucide-react";
import type { StrategyIntent } from "@/lib/strategyFraming";
import PortfolioStatus from "./PortfolioStatus";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getIconForIntent = (intent: StrategyIntent) => {
    const icons = {
      conservative: Shield,
      balanced: TrendingUp,
      growth: Zap,
    };
    return icons[intent] || Shield;
  };

  const profileFieldLabels: Record<string, string> = {
    timeHorizon: "Time Horizon",
    liquidityNeed: "Liquidity Need",
    volatilityTolerance: "Volatility Tolerance",
    primaryMotivation: "Primary Motivation",
    capitalCriticality: "Capital Criticality",
    btcEthExperienceLevel: "BTC/ETH Experience",
    goldSilverExperienceLevel: "Gold/Silver Experience",
    complexityPreference: "Complexity Preference",
  };

  const getValueColor = (value: string): string => {
    const greenValues = ["low", "preservation", "simple", "short"];
    const amberValues = ["medium", "balanced"];
    const redValues = ["high", "growth", "optimized", "long", "very-long"];

    if (greenValues.includes(value)) return "bg-green-100 text-green-800";
    if (amberValues.includes(value)) return "bg-amber-100 text-amber-800";
    if (redValues.includes(value)) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatValue = (value: string): string =>
    value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    );
  }

  const hasCompletedOnboarding = !!profile.onboardingCompletedAt;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">{profile.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Onboarding Status */}
        {!hasCompletedOnboarding ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to InflationGuard!
            </h2>
            <p className="text-gray-600 mb-6">
              Let's find the right investment strategy for you. Complete our
              quick onboarding to get your personalized fund recommendation.
            </p>
            <button
              onClick={() => router.push("/onboarding/step1")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Onboarding
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Fund */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Active Fund
              </h2>

              {profile.activeIntent && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    {(() => {
                      const Icon = getIconForIntent(profile.activeIntent);
                      return (
                        <Icon
                          size={32}
                          className="text-blue-600 flex-shrink-0"
                        />
                      );
                    })()}

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {FUND_CONTENT[profile.activeIntent].name}
                      </h3>

                      {/* Show match reason ONLY if user followed AI recommendation */}
                      {profile.activeIntent === profile.recommendedIntent ? (
                        <p className="text-sm text-gray-600 mt-1">
                          {FUND_CONTENT[profile.activeIntent].matchReason}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600 mt-1">
                            You chose this fund over our AI recommendation.
                          </p>
                          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-800">
                              <strong>AI recommended:</strong>{" "}
                              {FUND_CONTENT[profile.recommendedIntent!].name}
                              {" — "}
                              {
                                FUND_CONTENT[profile.recommendedIntent!]
                                  .matchReason
                              }
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => router.push("/fund-details")}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Fund Details
                    </button>
                    <a
                      href={getDhedgeUrl(profile.activeIntent)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors text-center"
                    >
                      {profile.walletAddress
                        ? "View on dHedge"
                        : "Invest on dHedge"}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Summary */}
            {profile.onboardingSummary && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User size={20} className="text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Profile Summary
                  </h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profile.onboardingSummary}
                  </p>
                </div>
              </div>
            )}

            {/* Risk Profile */}
            {profile.derivedProfile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={20} className="text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Risk Profile
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(profileFieldLabels).map(([key, label]) => {
                    const value = profile.derivedProfile?.[key];
                    if (!value || typeof value !== "string") return null;
                    return (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-500">
                          {label}
                        </span>
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${getValueColor(value)}`}
                        >
                          {formatValue(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {Array.isArray(profile.derivedProfile.notes) &&
                  profile.derivedProfile.notes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {profile.derivedProfile.notes.map(
                        (note: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3"
                          >
                            <Info
                              size={14}
                              className="text-blue-600 flex-shrink-0 mt-0.5"
                            />
                            <p className="text-xs text-blue-800">{note}</p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* Portfolio Performance */}
            <PortfolioStatus
              walletAddress={profile.walletAddress}
              activeIntent={profile.activeIntent!} 
            />

            {/* Retake Onboarding */}
            <div className="text-center">
              <button
                onClick={() => router.push("/onboarding/step1")}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Life changed? Retake the onboarding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
