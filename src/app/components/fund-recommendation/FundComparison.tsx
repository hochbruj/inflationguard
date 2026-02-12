// components/fund-recommendation/FundComparison.tsx
import { useState } from "react";
import { ArrowRight, TrendingUp, Shield, Zap, Info } from "lucide-react";
import type { AllFundsResponse } from "@/lib/types";
import { FUND_CONTENT, getDhedgeUrl } from "@/lib/fundContent";
import { StrategyIntent } from "@/lib/strategyFraming";

interface FundComparisonProps {
  recommendedIntent: StrategyIntent;
  activeIntent: StrategyIntent; // Currently active fund (may differ if user switched)
  allFunds: AllFundsResponse["funds"];
  onFundSwitch: (intent: StrategyIntent) => void;
}

// Fund metadata for display
const FUND_META = {
  conservative: {
    icon: Shield,
    color: "emerald",
    tagline: "Stability First",
    idealFor: "Conservative investors seeking yield",
  },
  balanced: {
    icon: TrendingUp,
    color: "blue",
    tagline: "Growth & Preservation",
    idealFor: "Balanced risk-return profile",
  },
  growth: {
    icon: Zap,
    color: "purple",
    tagline: "Maximum Growth",
    idealFor: "Aggressive long-term holders",
  },
} as const;

export default function FundComparison({
  recommendedIntent,
  activeIntent,
  allFunds,
  onFundSwitch,
}: FundComparisonProps) {
  const [selectedFund, setSelectedFund] = useState<StrategyIntent | null>(null);

  // Calculate comparison metrics
  const getComparisonData = (intent: StrategyIntent) => {
    const fund = allFunds[intent];
    const content = FUND_CONTENT[intent];
    const meta = FUND_META[intent];

    return {
      intent,
      fund,
      content,
      meta,
      isRecommended: intent === recommendedIntent,
    };
  };

  const allFundData = (Object.keys(allFunds) as StrategyIntent[]).map(
    getComparisonData,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Compare All Funds
        </h3>
        <p className="text-gray-600">
          See how the three InflationGuard strategies stack up. Your recommended
          fund is highlighted.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {allFundData.map(({ intent, fund, content, meta, isRecommended }) => {
          const Icon = meta.icon;
          const colorClasses = {
            emerald: {
              bg: "bg-emerald-50",
              border: "border-emerald-200",
              text: "text-emerald-700",
              badge: "bg-emerald-600",
              hover: "hover:border-emerald-300",
            },
            blue: {
              bg: "bg-blue-50",
              border: "border-blue-200",
              text: "text-blue-700",
              badge: "bg-blue-600",
              hover: "hover:border-blue-300",
            },
            purple: {
              bg: "bg-purple-50",
              border: "border-purple-200",
              text: "text-purple-700",
              badge: "bg-purple-600",
              hover: "hover:border-purple-300",
            },
          }[meta.color];

          const isActive = intent === activeIntent;

          return (
            <div
              key={intent}
              className={`relative rounded-xl border-2 transition-all ${
                isActive
                  ? `${colorClasses.border} ${colorClasses.bg}`
                  : "border-gray-200 bg-gray-50 opacity-80"
              } ${colorClasses.hover} cursor-pointer`}
              onClick={() => setSelectedFund(intent)}
            >
              {/* AI Recommendation Badge — always stays on the recommended fund */}
              {isRecommended && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 ${colorClasses.badge} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
                >
                  ✓ AI Pick
                </div>
              )}

              {/* "Your Choice" badge — only if user switched away from AI pick */}
              {isActive && !isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  ✓ Your Choice
                </div>
              )}

              <div className="p-5">
                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">
                      {content.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {meta.tagline}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">1Y Return</span>
                    <span
                      className={`font-semibold ${
                        +fund.returns["1Y"] > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {+fund.returns["1Y"] > 0 ? "+" : ""}
                      {+fund.returns["1Y"]}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">5Y Return (ann.)</span>
                    <span
                      className={`font-semibold ${
                        +fund.returns["5Y"] > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {+fund.returns["5Y"] > 0 ? "+" : ""}
                      {+fund.returns["5Y"]}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Max Drawdown</span>
                    <span className="font-semibold text-orange-600">
                      -
                      {content.riskData.historicalMaxDD ??
                        content.riskData.maxDrawdown}
                      %
                    </span>
                  </div>

                  {intent === "conservative" && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Target APY</span>
                      <span className="font-semibold text-gray-900">
                        {content.targetAPY}
                      </span>
                    </div>
                  )}

                  {intent === "balanced" && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Risk Level</span>
                      <span className="font-semibold text-orange-500">
                        Moderate
                      </span>
                    </div>
                  )}

                  {intent === "growth" && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Leverage</span>
                      <span className="font-semibold text-gray-900">
                        {parseFloat(fund.leverage).toFixed(1)}x
                      </span>
                    </div>
                  )}
                </div>

                {/* Asset Mix */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">
                    Asset Allocation
                  </div>
                  <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                    {fund.composition.map((asset, idx) => {
                      const colors = [
                        "bg-orange-500",
                        "bg-yellow-500",
                        "bg-blue-500",
                      ];
                      return (
                        <div
                          key={idx}
                          className={colors[idx % 3]}
                          style={{ width: `${asset.allocation}%` }}
                          title={`${asset.asset}: ${asset.allocation}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-1 text-[10px] text-gray-600 leading-tight">
                    {fund.composition
                      .map((a) => `${a.allocation}% ${a.symbol}`)
                      .join(" · ")}
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  className={`w-full text-xs font-medium py-2 rounded-lg transition-colors ${
                    isActive
                      ? `${colorClasses.text} ${colorClasses.bg} border ${colorClasses.border}`
                      : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFund(intent);
                  }}
                >
                  {selectedFund === intent ? "Hide Details" : "View Details"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Details Section */}
      {selectedFund && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {FUND_CONTENT[selectedFund].name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {FUND_META[selectedFund].idealFor}
              </p>
            </div>
            <button
              onClick={() => setSelectedFund(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Why This Fund Section */}
          {selectedFund === recommendedIntent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <div className="text-green-600 mt-0.5">✓</div>
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Why We Recommend This Fund
                  </p>
                  <p className="text-sm text-green-800">
                    {FUND_CONTENT[selectedFund].matchReason}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Info
                  size={16}
                  className="text-amber-600 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Why This Might Not Fit
                  </p>
                  <p className="text-sm text-amber-800">
                    {selectedFund === "conservative" &&
                    recommendedIntent !== "conservative"
                      ? "Based on your profile, you're comfortable with higher volatility in exchange for growth potential. The Conservative fund's focus on yield and stability may not align with your goals."
                      : selectedFund === "balanced" &&
                          recommendedIntent === "conservative"
                        ? "The Balanced fund includes 35% Bitcoin allocation, which introduces more volatility than your profile indicates you're comfortable with."
                        : selectedFund === "balanced" &&
                            recommendedIntent === "growth"
                          ? "You have a very long time horizon and high risk tolerance. The Balanced fund's conservative 35/35/30 split may not maximize your growth potential."
                          : selectedFund === "growth" &&
                              recommendedIntent === "conservative"
                            ? "The Leveraged-Growth fund uses 1.5x leverage and can experience 70%+ drawdowns. This level of volatility doesn't match your stated risk tolerance."
                            : "This fund's risk/return profile doesn't align as well with your stated preferences."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Risks */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-gray-900 mb-2">
              Key Risks to Understand
            </h5>
            <div className="space-y-2">
              {FUND_CONTENT[selectedFund].riskData.keyRisks
                .slice(0, 2)
                .map((risk, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                          risk.severity === "high"
                            ? "bg-red-500"
                            : risk.severity === "medium"
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {risk.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {risk.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action: switch fund or confirm current */}
          <div className="flex items-center gap-3 mt-2">
            {selectedFund !== activeIntent ? (
              <button
                onClick={() => onFundSwitch(selectedFund)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Switch to {FUND_CONTENT[selectedFund].name}
              </button>
            ) : (
              <span className="text-sm text-emerald-700 font-medium">
                ✓ This is your currently selected fund
              </span>
            )}

            <a
              href={getDhedgeUrl(selectedFund)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              View on dHedge
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
