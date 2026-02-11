import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { StrategyIntent } from "@/lib/strategyFraming";
import { ChartData } from "@/lib/types";

interface PerformanceChartProps {
  intent: StrategyIntent;
  fundLaunchDate: string; // Format: "2025-01-15"
  chartData: ChartData; // Now passed as prop instead of fetched
}

// Map intent to fund key in API data
const FUND_MAPPING: Record<StrategyIntent, string> = {
  conservative: "YPGLD", // Yield-Stable
  balanced: "BBGLD", // Balanced
  growth: "BTGLD", // Leveraged-Growth
};

const FUND_COLORS: Record<string, string> = {
  fund: "#8b5cf6", // Purple for fund
  btc: "#f97316", // Orange for BTC
  gold: "#eab308", // Yellow for Gold
  balanced: "#3b82f6", // Blue for 50/50
};

export default function PerformanceChart({
  intent,
  fundLaunchDate,
  chartData,
}: PerformanceChartProps) {
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<"3M" | "1Y" | "3Y" | "7Y">("7Y");
  const [launchDate, setLaunchDate] = useState<Date | null>(null);

  const fundKey = FUND_MAPPING[intent];

  useEffect(() => {
    async function fetchData() {
      if (!chartData) return; // Wait for chart data to be loaded
      // Use monthly data for longer timeframes, short-term for 3M
      const sourceData =
        timeframe === "3M"
          ? chartData.shortTermChartData
          : chartData.monthlyChartData;

      const parseDateFlexible = (dateStr: string): Date => {
        if (dateStr.length === 7) {
          // 'YYYY-MM'
          return new Date(`${dateStr}-01`);
        } else if (dateStr.length === 10) {
          // 'YYYY-MM-DD'
          return new Date(dateStr);
        } else {
          console.warn(`Unexpected date format: ${dateStr}`);
          return new Date(dateStr); // fallback
        }
      };

      const findFirstDateOnOrAfterLaunch = (
        sourceData: any[],
        fundLaunchDate: string,
      ): Date | null => {
        if (!sourceData || sourceData.length === 0) return null;

        const launchDateObj = new Date(fundLaunchDate);
        if (isNaN(launchDateObj.getTime())) return null;

        let result: Date | null = null;

        for (const item of sourceData) {
          const dateStr = item.month || item.date;
          if (!dateStr) continue;

          const dataDate = parseDateFlexible(dateStr);
          if (isNaN(dataDate.getTime())) continue;

          if (dataDate >= launchDateObj) {
            // Take the first one that is on or after
            if (!result || dataDate < result) {
              result = dataDate;
            }
          }
        }

        return result;
      };

      const closestLaunchDate = findFirstDateOnOrAfterLaunch(
        sourceData,
        fundLaunchDate,
      );

      setLaunchDate(closestLaunchDate);

      // Transform data for chart
      const transformed = sourceData.map((item: any) => {
        const date = item.month || item.date;
        const isLive = parseDateFlexible(date) >= new Date(fundLaunchDate);
        const isLaunched =
          parseDateFlexible(date).toString() === closestLaunchDate?.toString();

        // Normalize to starting value of 100
        const firstValue = sourceData[0][fundKey];
        const base = sourceData[0];
        const fundValue = (item[fundKey] / base[fundKey]) * 100;

        return {
          date: parseDateFlexible(date),
          fund: ((item[fundKey] / firstValue) * 100).toFixed(2),
          btc: ((item.BTC / base.BTC) * 100).toFixed(2),
          gold: ((item.AU / base.AU) * 100).toFixed(2),
          balanced50_50: (
            ((item.BTC / base.BTC) * 0.5 + (item.AU / base.AU) * 0.5) *
            100
          ).toFixed(2),
          fundLive: isLive ? fundValue : null,
          fundSimulated: isLive && !isLaunched ? null : fundValue,
          isLaunched: isLaunched,
        };
      });

      // Filter by timeframe
      const now = new Date();
      let filtered = transformed;

      if (timeframe === "3M") {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        filtered = transformed.filter(
          (d: any) => new Date(d.date) >= threeMonthsAgo,
        );
      } else if (timeframe === "1Y") {
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filtered = transformed.filter(
          (d: any) => new Date(d.date) >= oneYearAgo,
        );
      } else if (timeframe === "3Y") {
        const threeYearsAgo = new Date(now.setFullYear(now.getFullYear() - 3));
        filtered = transformed.filter(
          (d: any) => new Date(d.date) >= threeYearsAgo,
        );
      }

      if (filtered.length > 0) {
        const visibleBase = filtered[0];

        filtered = filtered.map((item: any) => ({
          ...item,
          fund: ((Number(item.fund) / Number(visibleBase.fund)) * 100).toFixed(
            2,
          ),
          btc: ((Number(item.btc) / Number(visibleBase.btc)) * 100).toFixed(2),
          gold: ((Number(item.gold) / Number(visibleBase.gold)) * 100).toFixed(
            2,
          ),
          balanced50_50: (
            (Number(item.balanced50_50) / Number(visibleBase.balanced50_50)) *
            100
          ).toFixed(2),
          fundLive:
            item.fundLive !== null
              ? (
                  (Number(item.fundLive) / Number(visibleBase.fund)) *
                  100
                ).toFixed(2)
              : null,
          fundSimulated:
            item.fundSimulated !== null
              ? (
                  (Number(item.fundSimulated) / Number(visibleBase.fund)) *
                  100
                ).toFixed(2)
              : null,
        }));
      }

      setTransformedData(filtered);
    }

    fetchData();
  }, [timeframe, fundKey, fundLaunchDate, chartData]);

  const getFundName = () => {
    const names: Record<string, string> = {
      conservative: "Stable Yield",
      balanced: "Balanced",
      growth: "Leveraged-Growth",
    };
    return names[intent] || "Fund";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} />
          Historical Performance
        </h4>

        {/* Timeframe selector */}
        <div className="flex gap-2">
          {(["3M", "1Y", "3Y", "7Y"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeframe === tf
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-900 flex items-start gap-2">
          <Calendar size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            <strong>Backtest Notice:</strong> Data before{" "}
            {new Date(fundLaunchDate).toLocaleDateString()} is backtested using
            historical prices (dotted lines). Live fund performance begins on
            the launch date (solid lines). Past performance does not guarantee
            future results.
          </span>
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              return timeframe === "3M"
                ? value.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : value.toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "short",
                  });
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={["auto", "auto"]}
            label={{
              value: "Growth of $100",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            labelStyle={{
              color: "#1f2937", // darker gray (gray-800) – very readable
              // or even darker: "#111827" (gray-900) or "#0f172a" (slate-900)
              fontWeight: 600, // optional: make it bold for better contrast
              fontSize: 13, // optional: slightly larger
            }}
            labelFormatter={(label) => {
              return timeframe === "3M"
                ? label.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : label.toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "short",
                  });
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />

          {/* Vertical line at fund launch */}
          <ReferenceLine
            x={launchDate?.getTime()}
            stroke="#0c131c"
            strokeDasharray="3 3"
          />

          {/* Fund performance line */}
          <Line
            type="monotone"
            dataKey="fundSimulated"
            stroke={FUND_COLORS.fund}
            strokeWidth={2.5}
            strokeDasharray="3 3"
            dot={false}
            name={`${getFundName()} Fund (backtest)`}
            connectNulls={true}
          />

          <Line
            type="monotone"
            dataKey="fundLive"
            stroke={FUND_COLORS.fund}
            strokeWidth={2.5}
            dot={false}
            name={`${getFundName()} Fund`}
            connectNulls={true}
          />

          {/* Bitcoin benchmark */}
          <Line
            type="monotone"
            dataKey="btc"
            stroke={FUND_COLORS.btc}
            strokeWidth={1.5}
            dot={false}
            name="Bitcoin"
            strokeDasharray="2 2"
          />

          {/* Gold benchmark */}
          <Line
            type="monotone"
            dataKey="gold"
            stroke={FUND_COLORS.gold}
            strokeWidth={1.5}
            dot={false}
            name="Gold"
            strokeDasharray="2 2"
          />

          {/* 60/40 benchmark */}
          <Line
            type="monotone"
            dataKey="balanced50_50"
            stroke={FUND_COLORS.balanced}
            strokeWidth={1.5}
            dot={false}
            name="50/50 BTC/Gold"
            strokeDasharray="2 2"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend explanation */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
        {/* Solid */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-purple-600"></div>
          <span className="text-gray-700">
            <strong>Solid line:</strong> Live fund data
          </span>
        </div>

        {/* Dotted fund (backtest) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-b border-dashed border-purple-600" />
          <span className="text-gray-700">
            <strong>Dotted line:</strong> Backtested simulation
          </span>
        </div>

        {/* Benchmarks – keep your working version or also use border */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-b border-dotted border-orange-500" />
          <span className="text-gray-700">Benchmarks (always simulated)</span>
        </div>

        {/* Vertical launch line – using dashed border */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 flex items-center justify-center">
            <div className="w-px h-5 border-l border-dashed border-[#0c131c]" />
          </div>
          <span className="text-gray-700">
            <strong>Dashed vertical:</strong> Fund launch
          </span>
        </div>
      </div>
    </div>
  );
}
