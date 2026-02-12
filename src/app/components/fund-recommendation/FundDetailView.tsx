"use client";

import { useState } from "react";
import FundHeader from "./FundHeader";
import FundStats from "./FundStats";
import PerformanceChart from "./PerformanceChart";
import RiskSummary from "./RiskSummary";
import AssetAllocation from "./AssetAllocation";
import FundComparison from "./FundComparison";
import { getFundContent } from "@/lib/fundContent";
import type { StrategyIntent } from "@/lib/strategyFraming";
import type { AllFundsResponse } from "@/lib/types";

interface FundDetailViewProps {
  recommendedIntent: StrategyIntent;
  initialActiveIntent: StrategyIntent;
  allData: AllFundsResponse;
  onIntentChange?: (newIntent: StrategyIntent) => void;
}

export default function FundDetailView({
  recommendedIntent,
  initialActiveIntent,
  allData,
  onIntentChange,
}: FundDetailViewProps) {
  const [activeIntent, setActiveIntent] =
    useState<StrategyIntent>(initialActiveIntent);

  const fundApiData = allData.funds[activeIntent];
  const fundContent = getFundContent(activeIntent);

  const handleFundSwitch = (newIntent: StrategyIntent) => {
    setActiveIntent(newIntent);
    onIntentChange?.(newIntent);
  };

  return (
    <>
      <FundHeader
        name={fundContent.name}
        intent={activeIntent}
        matchReason={fundContent.matchReason}
      />

      <FundStats
        leverage={
          activeIntent === "conservative"
            ? undefined
            : parseFloat(fundApiData.leverage)
        }
        targetAPY={fundContent.targetAPY}
        returns={fundApiData.returns}
        intent={activeIntent}
      />

      <AssetAllocation
        composition={fundApiData.composition}
        intent={activeIntent}
        leverage={parseFloat(fundApiData.leverage)}
      />

      <PerformanceChart
        intent={activeIntent}
        fundLaunchDate={fundContent.launchDate}
        chartData={{
          shortTermChartData: allData.shortTermChartData,
          monthlyChartData: allData.monthlyChartData,
        }}
      />

      <RiskSummary
        intent={activeIntent}
        riskData={fundContent.riskData}
      />

      <FundComparison
        recommendedIntent={recommendedIntent}
        activeIntent={activeIntent}
        allFunds={allData.funds}
        onFundSwitch={handleFundSwitch}
      />
    </>
  );
}
