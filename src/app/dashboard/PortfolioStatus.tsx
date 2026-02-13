// components/dashboard/PortfolioStatus.tsx
"use client";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import { FUND_CONTENT, getDhedgeUrl } from "@/lib/fundContent";
import type { StrategyIntent } from "@/lib/strategyFraming";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Percent,
  ArrowRight,
} from "lucide-react";
import Holdings from "./Holdings";

interface PortfolioStatusProps {
  walletAddress: string | undefined;
  activeIntent: StrategyIntent;
}

export default function PortfolioStatus({
  walletAddress,
  activeIntent,
}: PortfolioStatusProps) {
  const { data: portfolioData, isLoading } = usePortfolioData(
    walletAddress,
    activeIntent,
  );

  // No wallet connected yet
  if (!walletAddress) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Portfolio Performance
        </h2>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Wallet size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Investment Yet
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Follow the investment guide to set up your wallet and invest in{" "}
            {FUND_CONTENT[activeIntent].name}.
          </p>
          <a
            href="/onboarding/step8"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Investment Guide
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Portfolio Performance
        </h2>
        <div className="bg-gray-50 rounded-xl p-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Loading portfolio data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Wallet connected but no investment found
  if (!portfolioData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Portfolio Performance
        </h2>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-start gap-3">
            <Wallet size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">
                Wallet Connected, No Investment Found
              </h3>
              <p className="text-xs text-amber-800 mb-3">
                We found your wallet but couldn't detect an investment in{" "}
                {FUND_CONTENT[activeIntent].name}. It may take a few minutes for
                your investment to appear after you invest.
              </p>
              <div className="text-xs text-amber-700">
                <p className="font-mono bg-amber-100 px-2 py-1 rounded inline-block">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <a
              href={getDhedgeUrl(activeIntent)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900"
            >
              Invest on dHedge
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Investment found - show portfolio metrics
  const isProfitable = portfolioData.totalPnL >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Portfolio Performance
        </h2>
        <a
          href={getDhedgeUrl(activeIntent)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View on dHedge →
        </a>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Value */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-blue-700" />
            </div>
          </div>
          <div className="text-xs text-blue-700 font-medium uppercase mb-1">
            Total Value
          </div>
          <div className="text-2xl font-bold text-blue-900">
            $
            {portfolioData.totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        {/* Invested */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <Wallet size={16} className="text-gray-600" />
            </div>
          </div>
          <div className="text-xs text-gray-600 font-medium uppercase mb-1">
            Invested
          </div>
          <div className="text-2xl font-bold text-gray-900">
            $
            {portfolioData.totalInvested.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        {/* Profit/Loss */}
        <div
          className={`rounded-xl p-4 border ${
            isProfitable
              ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isProfitable ? "bg-green-200" : "bg-red-200"
              }`}
            >
              {isProfitable ? (
                <TrendingUp size={16} className="text-green-700" />
              ) : (
                <TrendingDown size={16} className="text-red-700" />
              )}
            </div>
          </div>
          <div
            className={`text-xs font-medium uppercase mb-1 ${
              isProfitable ? "text-green-700" : "text-red-700"
            }`}
          >
            {isProfitable ? "Profit" : "Loss"}
          </div>
          <div
            className={`text-2xl font-bold ${
              isProfitable ? "text-green-900" : "text-red-900"
            }`}
          >
            {isProfitable ? "+" : ""}$
            {portfolioData.totalPnL.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        {/* Return % */}
        <div
          className={`rounded-xl p-4 border ${
            isProfitable
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
              : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isProfitable ? "bg-emerald-200" : "bg-orange-200"
              }`}
            >
              <Percent
                size={16}
                className={
                  isProfitable ? "text-emerald-700" : "text-orange-700"
                }
              />
            </div>
          </div>
          <div
            className={`text-xs font-medium uppercase mb-1 ${
              isProfitable ? "text-emerald-700" : "text-orange-700"
            }`}
          >
            Return
          </div>
          <div
            className={`text-2xl font-bold ${
              isProfitable ? "text-emerald-900" : "text-orange-900"
            }`}
          >
            {isProfitable ? "+" : ""}
            {portfolioData.totalReturn.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Current Holdings */}
      <Holdings
        totalValue={portfolioData.totalValue}
        activeIntent={activeIntent}
      />

      {/* Fund Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {FUND_CONTENT[activeIntent].name}
            </p>
            <p className="text-xs text-gray-600">
              Wallet:{" "}
              <code className="text-gray-800 font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </code>
            </p>
          </div>
          {isProfitable && portfolioData.totalReturn > 5 && (
            <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              📈 Outperforming
            </div>
          )}
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Updates automatically every minute
      </p>
    </div>
  );
}
