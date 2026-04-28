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
    launchDate: "2025-10-22",
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
    targetAPY: "5-10%",
    riskData: {
      maxDrawdown: 10,
      drawdownLabel:
        "USDT de-peg or Aave smart contract exploit (theoretical worst-case)",
      historicalMaxDD: 5,
      historicalDDLabel: "Worst observed decline in 2018-2025 backtest",
      historicalEvents: [
        { event: "2022 Crypto Crash", year: "2022", impact: -3 },
        { event: "COVID-19 Crash", year: "Mar 2020", impact: -2 },
        { event: "2018 Bear Market", year: "2018", impact: -3 },
      ],
      keyRisks: [
        {
          title: "USDT De-peg Risk",
          description:
            "Tether's USDT could lose its $1 peg if reserves are insufficient or regulators restrict operations. A significant de-peg would directly reduce the value of this core position.",
          severity: "medium",
        },
        {
          title: "Tether Counterparty Risk",
          description:
            "USDT is issued by Tether Ltd. Regulatory action, reserve shortfalls, or insolvency at Tether could impair the value of USDT holdings.",
          severity: "medium",
        },
        {
          title: "Aave Smart Contract Risk",
          description:
            "Funds deposited on Aave are exposed to smart contract vulnerabilities. While Aave is battle-tested and audited, exploits could result in partial or total loss.",
          severity: "medium",
        },
        {
          title: "Yield Compression Risk",
          description:
            "Aave supply rates can compress significantly during periods of low borrowing demand, reducing returns below the current ~5% APY.",
          severity: "low",
        },
      ],
      worstCaseScenarios: [
        "USDT de-pegs to $0.90 → ~10% loss on the stablecoin position",
        "Tether regulatory action → USDT redemptions halted, liquidity crisis",
        "Aave exploit → Partial or total loss of deposited USDT",
        "DeFi borrowing demand collapses → Aave yields drop to 1-2% APY",
        "Bitcoin crashes 70% simultaneously → Small BTC position contributes further loss",
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