// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, type UserProfile } from "@/lib/firestore";
import { FUND_CONTENT } from "@/lib/fundContent";
import { Shield, TrendingUp, Zap, LogOut, ArrowRight } from "lucide-react";
import type { StrategyIntent } from "@/lib/strategyFraming";

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
            {/* Recommended Fund */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Recommended Fund
              </h2>

              {profile.recommendedIntent && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-4">
                    {(() => {
                      const Icon = getIconForIntent(profile.recommendedIntent);
                      return (
                        <Icon
                          size={32}
                          className="text-blue-600 flex-shrink-0"
                        />
                      );
                    })()}

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {FUND_CONTENT[profile.recommendedIntent].name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {FUND_CONTENT[profile.recommendedIntent].matchReason}
                      </p>

                      {profile.activeIntent &&
                        profile.activeIntent !== profile.recommendedIntent && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs text-amber-800">
                              <strong>Note:</strong> You switched to{" "}
                              <strong>
                                {FUND_CONTENT[profile.activeIntent].name}
                              </strong>
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => router.push("/recommendation")}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Fund Details
                    </button>
                    <a
                      href={
                        FUND_CONTENT[
                          profile.activeIntent || profile.recommendedIntent
                        ].dhedgeUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors text-center"
                    >
                      Invest on dHedge
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Investment Status (placeholder for Phase 3) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Investment Status
              </h2>

              {profile.walletAddress ? (
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Wallet:</strong> {profile.walletAddress}
                  </p>
                  {/* Phase 3: Add portfolio value, holdings, etc. */}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No wallet connected yet. Connect your wallet once you invest.
                </p>
              )}
            </div>

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
