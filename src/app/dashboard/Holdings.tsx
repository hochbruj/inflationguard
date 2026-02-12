// components/dashboard/Holdings.tsx
"use client";

import type { StrategyIntent } from "@/lib/strategyFraming";
import { useFundData } from "@/hooks/useFundData";

interface HoldingsProps {
  totalValue: number; // Total portfolio value in USD
  activeIntent: StrategyIntent;
}

// Token icon URLs
const TOKEN_ICONS: Record<string, string> = {
  WBTC: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  XAUT: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x68749665FF8D2d112Fa859AA293F07A622782F38/logo.png",
  sUSDe: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9D39A5DE30e57443BfF2A8307A4256c8797A3497/logo.png",
  USDC: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
};

export default function Holdings({ totalValue, activeIntent }: HoldingsProps) {
  const { data, isLoading } = useFundData();
  const composition = data?.funds[activeIntent]?.composition ?? null;
  const leverage = data?.funds[activeIntent]?.leverage ?? 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Current Holdings
        </h3>
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!composition) {
    return null;
  }

  const isLeveraged = leverage && +leverage > 1;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Current Holdings
      </h3>
      <div className="space-y-2">
        {composition.map((asset, idx) => {
          const assetValue = (totalValue * asset.allocation) / 100;
          const effectiveExposure = isLeveraged ? assetValue * +leverage : null;
          
          return (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={TOKEN_ICONS[asset.symbol] || "/placeholder-token.png"}
                    alt={asset.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {asset.symbol}
                    </p>
                    <p className="text-xs text-gray-500">{asset.asset}</p>
                  </div>
                </div>

                {/* Right: Value + Allocation */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${assetValue.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">{asset.allocation}%</p>
                </div>
              </div>

              {/* Effective Exposure (only for leveraged funds) */}
              {effectiveExposure && (
                <div className="mt-2 ml-11 flex items-center gap-1.5">
                  <span className="text-xs text-purple-600">💎</span>
                  <span className="text-xs text-purple-700 font-medium">
                    {leverage}x exposure
                  </span>
                  <span className="text-xs text-gray-500">
                    (~${effectiveExposure.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })})
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Allocation Bar */}
      <div className="mt-4">
        <div className="flex gap-1 h-2 rounded-full overflow-hidden">
          {composition.map((asset, idx) => {
            const colors = ["bg-orange-500", "bg-yellow-500", "bg-blue-500"];
            return (
              <div
                key={idx}
                className={colors[idx % 3]}
                style={{ width: `${asset.allocation}%` }}
                title={`${asset.symbol}: ${asset.allocation}%`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}