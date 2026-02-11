// components/fund-recommendation/AssetAllocation.tsx

import {
  getAssetExplanation,
  getAssetRisks,
  getAssetUnderperformance,
  getAssetExpectations,
} from "@/lib/assetEducation";
import { StrategyIntent } from "@/lib/strategyFraming";
import { AssetComposition } from "@/lib/types";


interface AssetAllocationProps {
  composition: AssetComposition[];
  intent: StrategyIntent;
  borrowing?: {
    amount: number;
    rate: number;
    asset: string;
  } | null;
  leverage: number;
  liquidationPrice?: {
    btc: number;
    combined: number;
  } | null;
}

// Token icon URLs (using TrustWallet assets)
const TOKEN_ICONS: Record<string, string> = {
  WBTC: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  XAUT: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x68749665FF8D2d112Fa859AA293F07A622782F38/logo.png",
  sUSDe:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9D39A5DE30e57443BfF2A8307A4256c8797A3497/logo.png",
    USDC: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
};

export default function AssetAllocation({
  composition,
  intent,
  leverage,
}: AssetAllocationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        📦 Current Holdings & Strategy
      </h4>

      <div className="space-y-6">
        {composition.map((asset, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl p-5 space-y-3"
          >
            {/* Asset Header with Icon and Allocation Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Token Icon */}
                  <img
                    src={TOKEN_ICONS[asset.symbol] || "/placeholder-token.png"}
                    alt={asset.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      // Fallback to colored circle if image fails
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div>
                    <span className="text-lg font-semibold text-gray-900 block">
                      {asset.symbol}
                    </span>
                    <span className="text-sm text-gray-500">
                      {asset.asset}
                    </span>
                  </div>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {asset.allocation}%
                </span>
              </div>

              {/* Visual Allocation Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    asset.asset === "WBTC"
                      ? "bg-orange-500"
                      : asset.asset === "XAUT"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${asset.allocation}%` }}
                />
              </div>
            </div>

            {/* AI-Generated Explanation */}
            <div className="space-y-3 pt-2">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {getAssetExplanation(
                    asset.symbol,
                    intent,
                    asset.allocation,
                    leverage,
                  )}
                </p>
              </div>

              {/* Risk Indicators */}
              <div className="grid gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-medium  whitespace-nowrap">
                    ⚠️ Risks:
                  </span>
                  <span className="text-gray-700">
                    {getAssetRisks(asset.symbol, intent)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-medium  whitespace-nowrap">
                    📉 Underperforms:
                  </span>
                  <span className="text-gray-700">
                    {getAssetUnderperformance(asset.symbol)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 font-medium  whitespace-nowrap">
                    ❌ Don't expect:
                  </span>
                  <span className="text-gray-700">
                    {getAssetExpectations(asset.symbol)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
