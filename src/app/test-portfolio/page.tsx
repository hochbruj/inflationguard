// app/test-portfolio/page.tsx
"use client";

import { useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { StrategyIntent } from "@/lib/strategyFraming";

export default function TestPortfolioPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [activeIntent, setActiveIntent] =
    useState<StrategyIntent>("conservative");
  const [submitted, setSubmitted] = useState(false);

  const portfolioData = usePortfolioData(submitted ? walletAddress : undefined, activeIntent);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Portfolio Hook Test
        </h1>

        {/* Test Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Fund Intent
              </label>
              <select
                value={activeIntent}
                onChange={(e) =>
                  setActiveIntent(e.target.value as StrategyIntent)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="growth">Growth</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Fetch Portfolio Data
            </button>
          </form>
        </div>

        {/* Results */}
        {submitted && (
          <div className="space-y-6">
            {/* Loading State */}
            {portfolioData?.isLoading && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Loading portfolio data...</p>
              </div>
            )}

            {/* Error State */}
            {portfolioData?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 font-semibold">Error:</p>
                <p className="text-red-700 text-sm mt-1">{portfolioData.error.message}</p>
              </div>
            )}

            {/* Data Display */}
            {!portfolioData?.isLoading && !portfolioData?.error && portfolioData && (
              <>
                {/* Summary Metrics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Summary Metrics
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Total Value
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        ${portfolioData.totalValue.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Invested
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        ${portfolioData.totalInvested.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        P&L
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          portfolioData.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {portfolioData.totalPnL >= 0 ? "+" : ""}${portfolioData.totalPnL.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-gray-500 uppercase mb-1">
                        Return
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          portfolioData.totalReturn >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {portfolioData.totalReturn >= 0 ? "+" : ""}
                        {portfolioData.totalReturn.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
