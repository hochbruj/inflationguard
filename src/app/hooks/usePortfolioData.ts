// hooks/usePortfolioData.ts
import { useQuery } from "@tanstack/react-query";
import type { StrategyIntent } from "@/lib/strategyFraming";
import { FUND_CONTENT } from "@/lib/fundContent";

// dHedge GraphQL endpoint
const DHEDGE_ENDPOINT = "https://api-v2.dhedge.org/graphql";

interface FundInvestment {
  fundAddress: string;
  fundName: string;
  investorBalance: string; // User's token balance in the fund
  adjustedTokenPrice: string; // Current token price
  investmentValue: string; // Current USD value
  returnOnInvestment: string; // ROI percentage
  roiUsd: string; // ROI in USD
  blockchainCode: string;
  managerAddress: string;
  managerName: string;
  createdAt: string;
}

interface AllFundsByInvestorResponse {
  data: {
    allFundsByInvestor: FundInvestment[];
  };
}

interface PortfolioData {
  // Summary metrics
  totalValue: number; // Current total portfolio value in USD
  totalInvested: number; // Initial investment amount (calculated)
  totalPnL: number; // Total profit/loss in USD
  totalReturn: number; // Total return percentage
}

interface PortfolioDataResult {
  data: PortfolioData | null;
  isLoading: boolean;
}

/**
 * Hook to fetch portfolio data from dHedge for a given wallet address
 * Filters to only show the user's active fund (activeIntent)
 */
export function usePortfolioData(
  walletAddress: string | undefined,
  activeIntent: StrategyIntent | null
): PortfolioDataResult {
  const { data, isLoading } = useQuery({
    queryKey: ["portfolioData", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("No wallet address");
      
      // Simple fetch call with GraphQL query in body
      const response = await fetch(DHEDGE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query AllFundsByInvestor($address: String!) {
              allFundsByInvestor(investorAddress: $address) {
                fundAddress
                fundName
                investorBalance
                adjustedTokenPrice
                investmentValue
                returnOnInvestment
                roiUsd
                blockchainCode
                managerAddress
                managerName
                createdAt
              }
            }
          `,
          variables: { address: walletAddress },
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      
      const result: AllFundsByInvestorResponse = await response.json();
      return result.data;
    },
    enabled: !!walletAddress, // Only run query if wallet exists
    staleTime: 30000, // 30 seconds - portfolio data updates frequently
    refetchInterval: 60000, // Refetch every minute
  });

  // If no data yet or still loading, return null data with loading state
  if (!data || !walletAddress || !activeIntent) {
    return {
      data: null,
      isLoading,
    };
  }
 console.log("Fetched portfolio data:", data);
  const investments = data.allFundsByInvestor || [];

  // Find the active fund based on activeIntent
  const activeFund = investments.find(
    (inv) => inv.fundAddress.toLowerCase() === FUND_CONTENT[activeIntent].address.toLowerCase()
  ) || null;

  if (!activeFund) {
    return {
      data: null,
      isLoading: false, // Not loading, just no investment found
    };
  }

  // Calculate totals from active fund
  const totalValue = +activeFund.investmentValue / 1e18;
  const totalPnL = +activeFund.roiUsd / 1e18;
  const totalInvested = totalValue - totalPnL;
  const totalReturn = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return {
    data: {
      totalValue,
      totalInvested,
      totalPnL,
      totalReturn,
    },
    isLoading: false,
  };
}