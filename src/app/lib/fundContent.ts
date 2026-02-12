// Static content for fund recommendations
// This includes all text, narratives, risk descriptions that don't change with market data

import { StrategyIntent } from "./strategyFraming";


interface RiskEvent {
  event: string;
  year: string;
  impact: number;
}

interface KeyRisk {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface RiskData {
  maxDrawdown: number;
  drawdownLabel: string;
  historicalMaxDD?: number;
  historicalDDLabel?: string;
  historicalEvents: RiskEvent[];
  keyRisks: KeyRisk[];
  worstCaseScenarios: string[];
}

interface FundContent {
  name: string;
  address: string;
  matchReason: string;
  launchDate: string;
  targetAPY?: string;
  riskData: RiskData;
}

export const FUND_CONTENT: Record<StrategyIntent, FundContent> = {
  "growth": {
    name: "InflationGuard Leveraged-Growth",
    address: "0xba5c9d41415189d01203f471ca501940406bae89", 
     matchReason: "You have a very long time horizon, high volatility tolerance, and growth-oriented goals. This leveraged strategy maximizes exposure to scarce assets.",
    launchDate: "2024-10-22",
    riskData: {
      maxDrawdown: 72,
      drawdownLabel: "Severe drawdowns expected during crypto bear markets",
      historicalEvents: [
        { event: "2022 Crypto Crash", year: "2022", impact: -67 },
        { event: "COVID-19 Crash", year: "Mar 2020", impact: -36 },
        { event: "2018 Bear Market", year: "2018", impact: -69 },
      ],
      keyRisks: [
        {
          title: "Price Volatility Risk",
          description:
            "Bitcoin can drop 70-80% during bear markets. With 1.5x leverage, portfolio losses are amplified.",
          severity: "high",
        },
        {
          title: "Leverage Liquidation Risk",
          description:
            "If collateral value drops rapidly, positions may be liquidated to prevent further losses.",
          severity: "high",
        },
        {
          title: "Smart Contract Risk",
          description:
            "Exposure to Aave and dHedge protocols. While audited, exploits remain possible.",
          severity: "medium",
        },
      ],
      worstCaseScenarios: [
        "Bitcoin drops 80% in a prolonged bear market → Portfolio down 65-70% (including leverage amplification)",
        "Aave protocol exploit → Collateral funds at risk of total loss",
        "Forced liquidation during flash crash → Permanent capital loss on leveraged positions",
        "Multi-year bear market → 3-4 years to recover to break-even",
      ],
    },
  },

  balanced: {
    name: "InflationGuard Balanced",
    address: "0x892d59b29fd67ab1c1dbc35d8af03f0465d2c211", 
    matchReason:
      "You balance preservation with growth potential and accept moderate volatility. This fund allocates meaningfully to both crypto and precious metals.",
    launchDate: "2026-01-15",
    riskData: {
      maxDrawdown: 41,
      drawdownLabel:
        "Moderate drawdowns during crypto bear markets, cushioned by gold and yield",
      historicalEvents: [
        { event: "2022 Crypto Crash", year: "2022", impact: -37 },
        { event: "COVID-19 Crash", year: "Mar 2020", impact: -16 },
        { event: "2018 Bear Market", year: "2018", impact: -37 },
      ],
      keyRisks: [
        {
          title: "Bitcoin Volatility",
          description:
            "35% BTC allocation means portfolio will experience crypto market swings, though less severe than pure crypto exposure.",
          severity: "medium",
        },
        {
          title: "Gold Underperformance",
          description:
            "During crypto bull markets, gold allocation may drag returns as it typically doesn't keep pace with BTC gains.",
          severity: "low",
        },
        {
          title: "Stablecoin Yield Risk",
          description:
            "Aave yields can compress during low-demand periods, reducing income generation.",
          severity: "low",
        },
      ],
      worstCaseScenarios: [
        "Bitcoin drops 70% + Gold flat → Portfolio down 35-40%",
        "Prolonged crypto bear market → 2-3 years to recover",
        "Aave yields drop to 1-2% → Income portion generates minimal returns",
        "Simultaneous BTC crash + gold selloff → Portfolio experiences full correlation drawdown",
      ],
    },
  },

  conservative: {
    name: "InflationGuard Stable Yield",
    address: "0x01d34eb628c40318f906a598b32da8796ec102ed",
    matchReason:
      "You prioritize capital stability and consistent yield. This fund uses DeFi strategies to amplify returns on stable assets while minimizing price volatility.",
    launchDate: "2026-01-15",
    targetAPY: "10-15%",
    riskData: {
      maxDrawdown: 30,
      drawdownLabel:
        "Severe stablecoin de-peg with leveraged position liquidation (theoretical worst-case)",
      historicalMaxDD: 10,
      historicalDDLabel: "Worst observed decline in 2018-2025 backtest",
      historicalEvents: [
        { event: "2022 Crypto Crash", year: "2022", impact: -8 },
        { event: "COVID-19 Crash", year: "Mar 2020", impact: -5 },
        { event: "2018 Bear Market", year: "2018", impact: -8 },
      ],
      keyRisks: [
        {
          title: "USDe De-peg Risk",
          description:
            "Ethena's USDe is a synthetic dollar. If it loses its $1 peg significantly, the leveraged position could be liquidated.",
          severity: "high",
        },
        {
          title: "Health Factor Risk",
          description:
            "Current health factor of 1.18 is close to liquidation threshold (1.0). Requires active monitoring and potential deleveraging.",
          severity: "high",
        },
        {
          title: "Smart Contract Risk",
          description:
            "Exposure to Ethena (newer protocol) and Aave. While audited, exploits could result in total loss of leveraged position.",
          severity: "medium",
        },
        {
          title: "Yield Compression Risk",
          description:
            "If USDe-USDT yield spread narrows or borrowing costs spike, returns could drop below target 10% APY.",
          severity: "low",
        },
      ],
      worstCaseScenarios: [
        "USDe de-pegs to $0.85 → Leveraged position liquidated, 20-30% capital loss on stable portion",
        "Ethena protocol exploit → Total loss of sUSDe position (65% of portfolio)",
        "Health factor drops below 1.0 → Forced liquidation with slippage losses",
        "Yield spread collapses → Returns drop to 3-5% APY instead of 10%+",
        "Bitcoin crashes 70% simultaneously → Small BTC position (10%) contributes -7% to portfolio",
      ],
    },
  },
};

// Helper function to get fund content by intent
export function getFundContent(intent: StrategyIntent): FundContent {
  return FUND_CONTENT[intent];
}
 export function getDhedgeUrl(intent: StrategyIntent): string {
  return `https://app.dhedge.org/vault/${FUND_CONTENT[intent].address}`;
}