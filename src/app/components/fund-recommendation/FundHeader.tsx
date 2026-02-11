// components/fund-recommendation/FundHeader.tsx

import { StrategyIntent } from "@/lib/strategyFraming";
import { ExternalLink } from "lucide-react";

interface FundHeaderProps {
  name: string;
  intent: StrategyIntent;
  dhedgeUrl: string;
  matchReason: string;
}

export default function FundHeader({
  name,
  intent,
  dhedgeUrl,
  matchReason,
}: FundHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${intent === "conservative" ? "bg-green-100 text-green-800" : ""}
              ${intent === "balanced" ? "bg-blue-100 text-blue-800" : ""}
              ${intent === "growth" ? "bg-purple-100 text-purple-800" : ""}
            `}
            >
              {intent === "conservative" && "🛡️Conservative Strategy"}
              {intent === "balanced" && "⚖️ Balanced Strategy"}
              {intent === "growth" && "📈 Growth-Oriented Strategy"}
            </span>
          </div>
        </div>
        <a
          href={dhedgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          View on dHedge
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong>Why this matches your profile:</strong> {matchReason}
        </p>
      </div>
    </div>
  );
}
