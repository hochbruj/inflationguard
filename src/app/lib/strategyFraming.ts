// lib/strategyFraming.ts
// PHASE 2, STEP 5: Strategy Framing (Deterministic)

export type DerivedProfile = {
  timeHorizon: "short" | "medium" | "long" | "very-long";
  liquidityNeed: "low" | "medium" | "high";
  volatilityTolerance: "low" | "medium" | "high";
  primaryMotivation: "preservation" | "balanced" | "growth";
  complexityPreference: "simple" | "optimized";
  btcEthExperienceLevel: "low" | "medium" | "high";
  goldSilverExperienceLevel: "low" | "medium" | "high";
  capitalCriticality: "low" | "medium" | "high";
  notes: string[];
};

export type StrategyIntent = "conservative" | "balanced" | "growth";

export interface StrategyFrame {
  intent: StrategyIntent;
  framingText: string;
  riskAcknowledgment: string;
  warnings: string[];
  inappropriateIf: string[];
}

/**
 * Pure function: DerivedProfile → StrategyFrame
 * Intent is determined by CONSTRAINTS (what user CAN do)
 * Not by stated motivation (what user WANTS to do)
 */
export function deriveStrategyFrame(profile: DerivedProfile): StrategyFrame {
  const intent = determineIntent(profile);
  const framingText = generateFramingText(intent, profile);
  const riskAcknowledgment = generateRiskAcknowledgment(profile);
  const warnings = generateWarnings(profile);
  const inappropriateIf = determineInappropriateConditions(profile);

  return {
    intent,
    framingText,
    riskAcknowledgment,
    warnings,
    inappropriateIf,
  };
}

// ========================================
// STEP 1: Determine Intent
// Intent = What strategy is appropriate given constraints
// NOT what the user wants (primaryMotivation)
// ========================================

function determineIntent(profile: DerivedProfile): StrategyIntent {
  const {
    capitalCriticality,
    volatilityTolerance,
    timeHorizon,
    liquidityNeed,
    primaryMotivation,
  } = profile;

  // Conservative: ANY hard constraint forces this
  // Capital safety > user's stated goals
  if (
    capitalCriticality === "high" ||
    volatilityTolerance === "low" ||
    timeHorizon === "short" ||
    liquidityNeed === "high"
  ) {
    return "conservative";
  }

  // Growth-oriented: ALL conditions must be met
  // Long runway + high tolerance + low stakes + growth desire
  if (
    (timeHorizon === "very-long" || timeHorizon === "long") &&
    volatilityTolerance === "high" &&
    capitalCriticality === "low" &&
    liquidityNeed === "low" &&
    primaryMotivation === "growth"
  ) {
    return "growth";
  }

  // Balanced: Everything in between
  return "balanced";
}

// ========================================
// STEP 2: Generate Framing Text
// Use intent as primary driver
// primaryMotivation only for nuance within same intent tier
// ========================================

function generateFramingText(
  intent: StrategyIntent,
  profile: DerivedProfile
): string {
  const { complexityPreference, timeHorizon } = profile;

  let paragraph1 = "";
  let paragraph2 = "";
  let paragraph3 = "";

  // Paragraph 1: Core approach (driven by INTENT, not motivation)
  if (intent === "conservative") {
    paragraph1 = `This strategy prioritizes capital resilience over maximum returns. It emphasizes monetary metals (Gold) as the foundation, with Bitcoin and Ethereum treated as long-term speculation rather than core holdings. The allocation is designed to protect against currency debasement while limiting exposure to high-volatility assets.`;
  } else if (intent === "balanced") {
    paragraph1 = `This strategy balances purchasing power preservation with asymmetric growth potential. It allocates meaningfully to both Bitcoin and Gold, acknowledging that one may underperform while the other protects or appreciates. Neither asset class dominates — the goal is resilience across multiple scenarios.`;
  } else {
    paragraph1 = `This strategy is optimized for long-term capital appreciation through scarce, non-sovereign assets. It emphasizes Bitcoin and Ethereum as primary holdings, with Gold and Silver providing portfolio ballast during crypto drawdowns. The allocation assumes you have conviction in digital scarcity narratives.`;
  }

  // Paragraph 2: Volatility stance and time expectations
  if (intent === "conservative") {
    paragraph2 = `It accepts lower potential upside in exchange for reduced drawdown risk and greater stability. ${
      complexityPreference === "simple"
        ? "This allocation is designed for passive holding with minimal rebalancing."
        : "You may adjust allocations periodically as market conditions shift, but the core remains stable."
    } Recovery from temporary losses should occur within 1–2 years.`;
  } else if (intent === "balanced") {
    paragraph2 = `It assumes you can hold through significant volatility (30–50% drawdowns over 12–24 months) and prioritizes long-term conviction over short-term comfort. ${
      timeHorizon === "very-long"
        ? "Your extended time horizon provides the cushion necessary to absorb full market cycles."
        : "Your time horizon should allow you to recover from temporary losses without forced selling."
    }`;
  } else {
    paragraph2 = `This approach requires high volatility tolerance (50%+ drawdowns), a 10+ year horizon, and the discipline to add capital during periods of fear and capitulation. ${
      complexityPreference === "optimized"
        ? "You may actively rebalance or tilt toward assets showing relative weakness to improve long-term returns."
        : "Despite the aggressive allocation, the strategy remains relatively simple: hold and ignore volatility."
    }`;
  }

  // Paragraph 3: Appropriateness and who this is for
  if (intent === "conservative") {
    paragraph3 = `This approach is appropriate for capital you cannot afford to lose, capital with potential near-term uses, or investors who prioritize sleep over returns. It is not designed to maximize gains, but to protect purchasing power with measured, manageable risk.`;
  } else if (intent === "balanced") {
    paragraph3 = `This approach is appropriate for investors who understand that crypto and metals serve different purposes: crypto offers asymmetric upside but extreme volatility, while metals provide stability and centuries-tested monetary credibility. You must be comfortable with both underperforming simultaneously.`;
  } else {
    paragraph3 = `This approach is appropriate only for discretionary capital you can genuinely afford to lose entirely. It is inappropriate for capital with near-term liquidity needs, emotional constraints, or obligations that would force selling during drawdowns. This is a conviction-based, multi-year commitment.`;
  }

  return `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;
}

// ========================================
// STEP 3: Risk Acknowledgment
// ========================================

function generateRiskAcknowledgment(profile: DerivedProfile): string {
  const { volatilityTolerance, capitalCriticality } = profile;

  if (volatilityTolerance === "low" || capitalCriticality === "high") {
    return "This strategy accepts temporary losses of 15–25% but prioritizes capital preservation over growth.";
  }

  if (volatilityTolerance === "high") {
    return "This strategy accepts temporary losses of 50% or more, with the understanding that recovery may take multiple years.";
  }

  return "This strategy accepts temporary losses of 30–50%, typical of alternative asset portfolios over full market cycles.";
}

// ========================================
// STEP 4: Generate Warnings
// ========================================

function generateWarnings(profile: DerivedProfile): string[] {
  const warnings: string[] = [];
  const {
    capitalCriticality,
    volatilityTolerance,
    liquidityNeed,
    timeHorizon,
    primaryMotivation,
  } = profile;

  // Warning: Conflicting risk signals
  if (capitalCriticality === "high" && volatilityTolerance === "high") {
    warnings.push(
      "⚠️ Important: You indicated this capital is critical, but also selected high volatility tolerance. These are incompatible. Your strategy has been adjusted to conservative to protect critical capital."
    );
  }

  // Warning: Short time horizon
  if (timeHorizon === "short") {
    warnings.push(
      "⚠️ Your time horizon is short (under 3 years). This strategy may not be suitable for capital needed soon, as recovery from drawdowns typically requires 2–4 years."
    );
  }

  // Warning: High liquidity need
  if (liquidityNeed === "high") {
    warnings.push(
      "⚠️ You indicated near-term liquidity needs. This strategy involves assets that can be volatile and illiquid during market stress. Maintain a separate cash buffer for emergencies."
    );
  }

  // Warning: Growth motivation constrained by profile
  if (
    primaryMotivation === "growth" &&
    (capitalCriticality === "high" ||
      volatilityTolerance === "low" ||
      timeHorizon === "short")
  ) {
    warnings.push(
      "⚠️ You expressed growth-oriented goals, but your constraints (capital importance, volatility tolerance, or time horizon) require a more conservative approach. Your strategy has been adjusted accordingly."
    );
  }

  return warnings;
}

// ========================================
// STEP 5: Inappropriate Conditions
// ========================================

function determineInappropriateConditions(profile: DerivedProfile): string[] {
  const inappropriate: string[] = [];
  const {
    liquidityNeed,
    timeHorizon,
    capitalCriticality,
    volatilityTolerance,
  } = profile;

  if (liquidityNeed === "high" && timeHorizon === "short") {
    inappropriate.push("Capital needed within 1–2 years");
  }

  if (capitalCriticality === "high" && volatilityTolerance === "high") {
    inappropriate.push("Capital that cannot afford 40%+ temporary losses");
  }

  if (timeHorizon === "short" && volatilityTolerance === "low") {
    inappropriate.push(
      "Capital with both short time horizon and low risk tolerance"
    );
  }

  return inappropriate;
}
