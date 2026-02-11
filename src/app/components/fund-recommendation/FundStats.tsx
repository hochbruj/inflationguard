// components/fund-recommendation/FundStats.tsx
// Updated to show APY for conservative, leverage for others

import { FundReturns } from "@/lib/types";
import { Activity } from "lucide-react";

interface FundStatsProps {
  leverage?: number;
  targetAPY?: string; // for conservative fund
  returns: FundReturns;
  intent: string;
}

export default function FundStats({
  leverage,
  targetAPY,
  returns,
  intent,
}: FundStatsProps) {
  const formatPercent = (value: string) => {
    const sign = +value > 0 ? "+" : "";
    return `${sign}${(+value).toFixed(1)}%`;
  };

  const currentAPY = ((1 + parseFloat(returns["1M"]) / 100) ** 12 - 1) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Activity size={20} />
        Current Fund Status
      </h4>
      <>
        {/* Metrics Grid - Different for conservative vs balanced vs growth */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Conservative: Show APY */}
          {intent === "conservative" ? (
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Target APY
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {targetAPY}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  From yield-optimized stables
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Current APY
                </div>
                <div className="text-xl font-semibold text-green-600">
                  {currentAPY ? `${currentAPY.toFixed(1)}%` : "~10.5%"}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Last 30 days annualized
                </p>
              </div>
            </>
          ) : intent === "balanced" ? (
            /* Balanced: Show allocation mix and YTD return */
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Portfolio Mix
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  35/35/30
                </div>
                <p className="text-xs text-gray-600 mt-1">BTC / Gold / Yield</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  YTD Return
                </div>
                <div
                  className={`text-xl font-semibold ${
                    +returns.YTD > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPercent(returns.YTD)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Year to date</p>
              </div>
            </>
          ) : (
            /* Growth: Show leverage and all-time return */
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Portfolio Leverage
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {leverage}x
                </div>
                <p className="text-xs text-gray-600 mt-1">Amplified exposure</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  5-Year Return
                </div>
                <div
                  className={`text-xl font-semibold ${
                    returns["5Y"] > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPercent(returns["5Y"])}
                </div>
                <p className="text-xs text-gray-600 mt-1">Annualized</p>
              </div>
            </>
          )}
        </div>

        {/* Strategy explanation - intent-specific */}
        {intent === "conservative" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Yield Strategy:</strong> Uses DeFi lending protocols to
              amplify stablecoin yields from 6% to 10%+. Bitcoin and gold
              positions are NOT leveraged—only the stable portion uses leverage
              for yield enhancement.
            </p>
          </div>
        )}

        {intent === "balanced" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Balanced Approach:</strong> Equal weight to Bitcoin
              (growth) and gold (stability), with 30% in yield-bearing
              stablecoins earning ~5% APY. No leverage—this is a simple, passive
              allocation designed to balance growth and preservation.
            </p>
          </div>
        )}

        {intent === "growth-oriented" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Leveraged Growth Strategy:</strong> Maximizes exposure to
              Bitcoin and gold using 1.5x leverage via Aave borrowing. This
              amplifies both gains and losses—designed for long-term holders
              (10+ years) who can tolerate 50%+ drawdowns in pursuit of higher
              returns.
            </p>
          </div>
        )}

        {/* Performance Breakdown */}
        {/* Performance Breakdown */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Performance History
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { label: "1M", value: returns["1M"] },
              { label: "3M", value: returns["3M"] },
              { label: "YTD", value: returns.YTD },
              { label: "1Y", value: returns["1Y"] },
              { label: "3Y", value: returns["3Y"] },
              { label: "5Y", value: returns["5Y"] },
            ].map((period) => (
              <div key={period.label} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{period.label}</div>
                <div
                  className={`text-sm font-semibold ${
                    +period.value > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPercent(period.value)}
                </div>
              </div>
            ))}
          </div>

          {/* ADD THIS */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            3Y and 5Y returns are annualized (CAGR). All other periods show
            total return.
          </p>
        </div>
      </>
    </div>
  );
}
