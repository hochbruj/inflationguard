import { StrategyIntent } from "./strategyFraming";

export function getAssetExplanation(
  asset: string,
  intent: StrategyIntent,
  allocation: string,
  leverage: number,
): string {
  const explanations: Record<string, Record<StrategyIntent, string>> = {
    WBTC: {
      growth: `Bitcoin serves as the primary growth engine and collateral base for this leveraged strategy. At ${allocation}% allocation with ${leverage}x leverage, you have meaningful exposure to Bitcoin's asymmetric upside. Given your very long time horizon and high volatility tolerance, BTC's historical appreciation aligns with your growth goals while serving as high-quality collateral for Aave borrowing.`,
      balanced: `Bitcoin provides growth potential while serving as partial collateral for modest leverage. At ${allocation}% allocation, it balances your desire for appreciation with the need for portfolio stability. This position allows participation in crypto upside without overwhelming the portfolio during drawdowns.`,
      conservative: `Bitcoin is included as a small speculative position (${allocation}%) for long-term purchasing power protection. While volatile, this minimal allocation provides exposure to digital scarcity without compromising the fund's stability-focused mandate. It's treated as optional upside, not a core holding.`,
    },
    XAUT: {
      growth: `Tokenized gold provides portfolio ballast during crypto drawdowns and serves as stable, low-volatility collateral for Aave borrowing. At ${allocation}% allocation, XAUT helps maintain health factor during BTC crashes while offering exposure to monetary metals. Gold's historically inverse correlation to risk assets reduces liquidation risk.`,
      balanced: `Gold serves as the stability anchor in this balanced approach. At ${allocation}% allocation, XAUT provides downside protection when crypto sells off and acts as reliable collateral for modest leverage. This allocation reflects your moderate risk tolerance and desire for both growth and preservation.`,
      conservative: `Gold forms a core stability holding at ${allocation}%, providing purchasing power protection without crypto's extreme volatility. XAUT offers the monetary properties of physical gold with blockchain accessibility. This allocation prioritizes capital preservation while earning no yield—a tradeoff for stability.`,
    },
    USDC: {
      growth: `Stablecoins serve as a small liquidity buffer (${allocation}%) for deleveraging events and earn ~10% APY to partially offset borrowing costs. This allocation provides flexibility to add collateral during drawdowns without selling BTC or XAUT at unfavorable prices. It's working capital, not a core position.`,
      balanced: `Yield-bearing stablecoins provide consistent income and portfolio stability at ${allocation}% allocation. Earning ~5% APY on Aave, this position generates cash flow while buffering against crypto volatility. It allows the fund to maintain leverage without excessive risk concentration.`,
      conservative: `Yield stablecoins are a core stability holding at ${allocation}% allocation, earning ~10% APY through Aave lending. This provides consistent, predictable returns appropriate for your low volatility tolerance and capital preservation goals. The yield comes from lending to overcollateralized borrowers, not price appreciation.`,
    },
    sUSDe: {
      conservative: `This position uses Ethena's sUSDe (staked USDe earning 6% base yield) with a leveraged borrowing strategy to amplify returns to 10%+ APY. At ${allocation}% allocation, this is the core yield engine of the fund. Unlike leveraging Bitcoin (which amplifies price volatility), this strategy leverages stablecoins to amplify yield while maintaining price stability near $1.`,
      balanced: `Yield-optimized stablecoins provide enhanced income at ${allocation}% allocation through Ethena's sUSDe protocol combined with strategic borrowing. This generates higher yield than simple USDC lending while maintaining stablecoin price characteristics.`,
      growth: `Not typically used in growth-oriented funds as the focus is on capital appreciation rather than yield generation.`,
    },
  };

  return explanations[asset]?.[intent] || "Asset explanation coming soon.";
}

export function getAssetRisks(asset: string, intent: string): string {
  const risks: Record<string, string> = {
    WBTC: "50-80% drawdowns during bear markets, regulatory uncertainty, concentration risk in leveraged positions",
    XAUT: "Tether custody risk, potential stablecoin-like regulation, lower returns than BTC in bull markets",
    USDC: "Circle/USDC de-peg risk (historical max: -7%), Aave smart contract vulnerabilities, regulatory stablecoin restrictions",
    sUSDe:
      "USDe de-peg risk (synthetic dollar backed by derivatives), Ethena protocol risk, Aave smart contract risk, tight health factor (1.18) requires active monitoring",
  };
  return risks[asset] || "Risk assessment pending.";
}

export function getAssetUnderperformance(asset: string): string {
  const underperformance: Record<string, string> = {
    WBTC: "During risk-off macro cycles, when central banks raise rates aggressively, or when competing narratives (AI stocks) dominate",
    XAUT: "During crypto bull markets and risk-on environments when investors chase higher-beta assets",
    USDC: "During crypto bull markets (opportunity cost vs BTC/ETH gains), or if TradFi rates exceed DeFi yields",
    sUSDe:
      "If USDe-USDT yield spread compresses, if borrowing costs spike above 6%, or if Ethena rewards decrease",
  };
  return underperformance[asset] || "Underperformance scenarios pending.";
}

export function getAssetExpectations(asset: string): string {
  const expectations: Record<string, string> = {
    WBTC: "Stable value, steady returns, or gold-like crisis hedge properties—BTC is volatile and speculative",
    XAUT: "High returns or explosive gains—gold preserves purchasing power but rarely appreciates dramatically",
    USDC: "Capital appreciation—this is yield generation only, not a growth asset",
    sUSDe:
      "Capital appreciation—this is yield generation only, not a growth asset",
  };
  return expectations[asset] || "Expectations guidance pending.";
}
