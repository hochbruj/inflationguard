import { AlertTriangle, TrendingDown, Shield, Zap, Info } from "lucide-react";

interface RiskData {
  maxDrawdown: number; // Theoretical worst-case
  drawdownLabel: string;
  historicalMaxDD?: number; // Optional: Actual backtest max DD
  historicalDDLabel?: string;
  historicalEvents: Array<{
    event: string;
    year: string;
    impact: number; // Percentage loss
  }>;
  keyRisks: Array<{
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
  }>;
  worstCaseScenarios: string[];
}

interface RiskSummaryProps {
  intent: string;
  riskData: RiskData;
}

export default function RiskSummary({ intent, riskData }: RiskSummaryProps) {
  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getDrawdownColor = (dd: number) => {
    if (dd >= 50) return "bg-red-500";
    if (dd >= 30) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-amber-600" />
        Risk Summary
      </h4>

      <p className="text-sm text-gray-600 mb-6">
        Understanding potential losses is critical before investing. Here's what
        you should expect during market downturns.
      </p>

      {/* Historical Max Drawdown (if available) */}
      {riskData.historicalMaxDD !== undefined && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h5 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                <Info size={16} />
                Historical Maximum Drawdown (2018-2025)
              </h5>
              <p className="text-xs text-blue-700">
                {riskData.historicalDDLabel ||
                  "Worst decline observed in backtesting"}
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              -{riskData.historicalMaxDD}%
            </div>
          </div>

          {/* Historical drawdown bar - text above */}
          <div className="mb-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-blue-700">
                Observed maximum
              </span>
            </div>
            <div className="relative w-full h-6 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
                style={{ width: `${riskData.historicalMaxDD}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Theoretical Maximum Drawdown */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h5 className="font-semibold text-red-900 mb-1 flex items-center gap-2">
              <TrendingDown size={18} />
              {riskData.historicalMaxDD !== undefined
                ? "Stress Scenario (Theoretical Maximum)"
                : "Maximum Expected Drawdown"}
            </h5>
            <p className="text-sm text-red-700">{riskData.drawdownLabel}</p>
          </div>
          <div className="text-3xl font-bold text-red-600">
            -{riskData.maxDrawdown}%
          </div>
        </div>

        {/* Visual drawdown bar - text always above */}
        <div className="mb-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-red-700">
              Worst-case scenario
            </span>
          </div>
          <div className="relative w-full h-8 bg-red-100 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${getDrawdownColor(riskData.maxDrawdown)} transition-all`}
              style={{ width: `${riskData.maxDrawdown}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-red-700 mt-2">
          {riskData.historicalMaxDD !== undefined
            ? "This theoretical scenario has not occurred historically but remains possible given the strategy's design."
            : "This represents the maximum portfolio decline during severe bear markets. Recovery typically takes 1-3 years."}
        </p>
      </div>

      {/* Historical Stress Test Performance */}
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield size={18} />
          Historical Stress Test Performance
        </h5>
        <p className="text-sm text-gray-600 mb-3">
          How this strategy would have performed during major market crashes:
        </p>

        <div className="space-y-2">
          {riskData.historicalEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{event.event}</p>
                <p className="text-xs text-gray-500">{event.year}</p>
              </div>
              <div
                className={`text-lg font-semibold ${
                  event.impact < -40
                    ? "text-red-600"
                    : event.impact < -20
                      ? "text-amber-600"
                      : event.impact < -10
                        ? "text-blue-600"
                        : "text-green-600"
                }`}
              >
                {event.impact > 0 ? "+" : ""}
                {event.impact}%
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>Note:</strong> These are backtested simulations based on
            historical prices. Actual fund performance may differ due to
            rebalancing timing, fees, and market conditions.
          </p>
        </div>
      </div>

      {/* Key Risks Breakdown */}
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Zap size={18} />
          Key Risks
        </h5>

        <div className="space-y-3">
          {riskData.keyRisks.map((risk, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}
            >
              <div className="flex items-start justify-between mb-1">
                <h6 className="font-semibold text-sm">{risk.title}</h6>
                <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded">
                  {risk.severity}
                </span>
              </div>
              <p className="text-sm">{risk.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Worst-Case Scenarios */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
        <h5 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} />
          Worst-Case Scenarios to Consider
        </h5>
        <ul className="space-y-2">
          {riskData.worstCaseScenarios.map((scenario, idx) => (
            <li
              key={idx}
              className="text-sm text-red-800 flex items-start gap-2"
            >
              <span className="text-red-600 mt-0.5">•</span>
              <span>{scenario}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recovery Timeline */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h5 className="font-semibold text-blue-900 mb-2">Recovery Timeline</h5>
        <p className="text-sm text-blue-800">
          Based on historical data, portfolio recoveries from major drawdowns
          typically take:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li className="flex items-center gap-2">
            <span className="font-semibold">• Short correction (&lt;25%):</span>{" "}
            3-9 months
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">• Bear market (25-50%):</span> 1-2
            years
          </li>
          <li className="flex items-center gap-2">
            <span className="font-semibold">• Severe crash (&gt;50%):</span> 2-4
            years
          </li>
        </ul>
      </div>
    </div>
  );
}
