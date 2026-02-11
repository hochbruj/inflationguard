// Types for the /api/funds endpoint response

export interface AssetComposition {
  symbol: string;
  asset: string;
  allocation: string; // Percentage as string from API
}

export interface FundReturns {
  "1M": string;
  "3M": string;
  YTD: string;
  "1Y": string;
  "3Y": string;
  "5Y": string;
}

export interface FundData {
  symbol: string; // e.g., "YPGLD"
  poolValue: string; // AUM in dollars
  leverage: string;
  healthFactor: string;
  composition: AssetComposition[];
  returns: FundReturns;
}

export interface ChartDataPoint {
  date?: string; // For short-term data
  month?: string; // For monthly data
  YPGLD: number;
  BBGLD: number;
  BTGLD: number;
  BTC: number;
  AU: number;
}

export interface ChartData {
  shortTermChartData: ChartDataPoint[];
  monthlyChartData: ChartDataPoint[];
}

export interface AllFundsResponse {
  funds: {
    conservative: FundData;
    balanced: FundData;
    growth: FundData;
  };
  shortTermChartData: ChartDataPoint[];
  monthlyChartData: ChartDataPoint[];
}