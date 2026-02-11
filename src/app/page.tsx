"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // If already logged in, skip to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleBegin = () => {
    // Redirect to signup instead of onboarding
    router.push("/signup");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-lg bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-4xl font-semibold text-gray-900 mb-6">
          Welcome to InflationGuard
        </h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          This tool helps you build and maintain a long-term portfolio of
          Bitcoin, Gold, and stable yield strategies.
        </p>
        <p className="text-gray-600 mb-8">
          Create a free account to get started with your personalized investment
          strategy.
        </p>
        <button
          onClick={handleBegin}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          Create Account & Begin
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
