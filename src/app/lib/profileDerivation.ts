// lib/profileDerivation.ts

import { Answers } from "@/onboarding/OnboardingContext";

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

export function deriveProfile(answers: Answers): DerivedProfile {
  const notes: string[] = [];

  /* -----------------------------
     TIME HORIZON (q1.1)
  ------------------------------*/
  let timeHorizon: DerivedProfile["timeHorizon"] = "medium";

  switch (answers["q1.1"]) {
    case "Within 3 years":
      timeHorizon = "short";
      break;
    case "3–7 years":
      timeHorizon = "medium";
      break;
    case "7–15 years":
      timeHorizon = "long";
      break;
    case "15+ years":
      timeHorizon = "very-long";
      break;
    case "I don't know yet":
      timeHorizon = "medium";
      notes.push("Time horizon uncertain");
      break;
  }

  /* -----------------------------
     LIQUIDITY NEED (q1.2, q1.6)
  ------------------------------*/
  let liquidityNeed: DerivedProfile["liquidityNeed"] = "low";

  if (
    answers["q1.2"] === "Yes, likely" ||
    answers["q1.6"] === "Not realistically"
  ) {
    liquidityNeed = "high";
  } else if (
    answers["q1.2"] === "Possibly" ||
    answers["q1.6"] === "With difficulty"
  ) {
    liquidityNeed = "medium";
  }

  /* -----------------------------
     CAPITAL CRITICALITY (q1.3, q1.5)
  ------------------------------*/
  let capitalCriticality: DerivedProfile["capitalCriticality"] = "low";

  if (
    answers["q1.3"] === "No" ||
    answers["q1.5"] === "It would be financially devastating" ||
    answers["q1.6"] === "Not realistically"
  ) {
    capitalCriticality = "high";
  } else if (
    answers["q1.3"] === "Mostly" ||
    answers["q1.5"] === "It would seriously impact my financial security" ||
    answers["q1.6"] === "With difficulty"
  ) {
    capitalCriticality = "medium";
  }

  /* -----------------------------
     VOLATILITY TOLERANCE (q2.1, q2.2, q2.3)
     Now includes historical behavior (q2.2)
  ------------------------------*/
  let volatilityTolerance: DerivedProfile["volatilityTolerance"] = "medium";

  // Low volatility tolerance signals
  if (
    answers["q2.1"] === "I would exit and reassess" ||
    answers["q2.2"] === "Yes, but I sold" ||
    answers["q2.3"] === "Temporary losses"
  ) {
    volatilityTolerance = "low";
  }
  // High volatility tolerance signals
  else if (
    answers["q2.1"] === "I would be concerned but stay invested" &&
    answers["q2.2"] === "Yes, and I held"
  ) {
    volatilityTolerance = "high";
  }

  // Add note if past behavior conflicts with stated tolerance
  if (
    answers["q2.1"] === "I would be concerned but stay invested" &&
    answers["q2.2"] === "Yes, but I sold"
  ) {
    notes.push(
      "Historical behavior suggests lower volatility tolerance than stated"
    );
  }

  /* -----------------------------
     PRIMARY MOTIVATION (q4.2)
     Removed q4.1 (redundant fiat question)
  ------------------------------*/
  let primaryMotivation: DerivedProfile["primaryMotivation"] = "balanced";

  switch (answers["q4.2"]) {
    case "Maximize long-term growth":
      primaryMotivation = "growth";
      break;
    case "Preserve purchasing power":
      primaryMotivation = "preservation";
      break;
    case "Balance growth and preservation":
      primaryMotivation = "balanced";
      break;
  }

  /* -----------------------------
     BTC/ETH EXPERIENCE LEVEL (q3.1)
  ------------------------------*/
  let btcEthExperienceLevel: DerivedProfile["btcEthExperienceLevel"] = "low";

  if (answers["q3.1"] === "I actively use and understand them") {
    btcEthExperienceLevel = "high";
  } else if (answers["q3.1"] === "I understand the basics") {
    btcEthExperienceLevel = "medium";
  }

  /* -----------------------------
     GOLD/SILVER EXPERIENCE LEVEL (q3.2)
  ------------------------------*/
  let goldSilverExperienceLevel: DerivedProfile["goldSilverExperienceLevel"] =
    "low";

  if (answers["q3.2"] === "Monetary protection against currency debasement") {
    goldSilverExperienceLevel = "high";
  } else if (answers["q3.2"] === "Portfolio diversification") {
    goldSilverExperienceLevel = "medium";
  }

  /* -----------------------------
     COMPLEXITY PREFERENCE (q3.3)
  ------------------------------*/
  const complexityPreference: DerivedProfile["complexityPreference"] =
    answers["q3.3"] === "Optimization is worth added complexity"
      ? "optimized"
      : "simple";

  /* -----------------------------
     FINAL SAFETY ADJUSTMENTS
     These override conflicts to protect users
  ------------------------------*/
  if (capitalCriticality === "high" && volatilityTolerance === "high") {
    volatilityTolerance = "medium";
    notes.push("Volatility tolerance capped due to capital importance");
  }

  if (primaryMotivation === "growth" && volatilityTolerance === "low") {
    primaryMotivation = "balanced";
    notes.push(
      "Growth-oriented intent moderated due to low volatility tolerance"
    );
  }

  // Additional safety check: short time horizon + high volatility
  if (timeHorizon === "short" && volatilityTolerance === "high") {
    volatilityTolerance = "medium";
    notes.push("Volatility tolerance reduced due to short time horizon");
  }

  return {
    timeHorizon,
    liquidityNeed,
    volatilityTolerance,
    primaryMotivation,
    complexityPreference,
    goldSilverExperienceLevel,
    btcEthExperienceLevel,
    capitalCriticality,
    notes,
  };
}
