// components/fund-recommendation/InvestmentGuide.tsx
"use client";

import { useState } from "react";
import {
  Shield,
  CreditCard,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Gift,
  Loader2,
} from "lucide-react";
import { StrategyIntent } from "@/lib/strategyFraming";
import { FUND_CONTENT, getDhedgeUrl } from "@/lib/fundContent";
import { saveWalletAddress } from "@/lib/firebase";

interface InvestmentGuideProps {
  intent: StrategyIntent;
}

// Each phase has steps, each step has sub-tasks the user checks off
const PHASES = [
  {
    id: "wallet",
    title: "Set Up Your Wallet",
    icon: Shield,
    color: "blue",
    description:
      "A self-custodial wallet lets you own your crypto directly — no bank, no middleman.",
    steps: [
      {
        id: "download",
        title: "Download a wallet app",
        detail: `We recommend Rainbow Wallet — it's clean, easy to use, and works great on mobile. Download it from the App Store or Google Play. You can also use MetaMask if you prefer.`,
        links: [
          {
            label: "Rainbow Wallet",
            url: "https://rainbow.me/download",
          },
          {
            label: "MetaMask",
            url: "https://metamask.io/download/",
          },
        ],
      },
      {
        id: "create",
        title: "Create a new wallet",
        detail: `Open the app and tap "Create a new wallet". It will show you a 12-word recovery phrase. This is your master key — write it down on paper (not digitally!) and store it somewhere safe like a fireproof box.`,
        warning:
          "Never share your recovery phrase with anyone, not even us. Anyone who has it can access your funds.",
        isWalletSave: true,
      },
    ],
  },
  {
    id: "fund",
    title: "Add Funds to Your Wallet",
    icon: CreditCard,
    color: "emerald",
    description:
      "You'll need two things: USDC to invest, and a small amount of ETH to pay for transaction fees (gas).",
    steps: [
      {
        id: "buy",
        title: "Buy USDC on an exchange",
        detail: `You'll need a crypto exchange to buy USDC with your bank card or bank transfer. We recommend Kraken — it's reliable, has low fees, and a clean interface. Sign up, verify your identity, and buy USDC. It's pegged 1:1 to the US dollar, so $100 of USDC is always worth ~$100. Make sure you're buying USDC on Ethereum (not another chain). Coinbase is also a solid option if you prefer.`,
        links: [
          {
            label: "⭐ Kraken (Recommended)",
            url: "https://proinvite.kraken.com/9f1e/dpppdf9j",
          },
          {
            label: "Coinbase",
            url: "https://www.coinbase.com",
          },
        ],
      },
      {
        id: "withdraw",
        title: "Send USDC to your wallet",
        detail: `In the exchange, go to "Withdraw" or "Send". Choose USDC and make sure to select Ethereum as the network. Paste your wallet address from Rainbow/MetaMask as the destination. Wait a few minutes for it to arrive.`,
        warning:
          "Always double-check the network (Ethereum) before withdrawing. Sending to the wrong network can result in lost funds.",
      },
      {
        id: "gas",
        title: "Get a little ETH for gas fees",
        detail: `Every transaction on Ethereum costs a small fee called "gas", paid in ETH. You'll need roughly $5–10 worth of ETH to cover fees for approving and investing. You can buy a small amount of ETH on the same exchange, or — if you're one of our early users — we can send you a small amount for free!`,
        tip: "Gas fees on Ethereum are typically $2–5 per transaction. You'll need ETH for approving USDC and for the actual investment — so a little extra doesn't hurt.",
        isGasFunding: true,
      },
    ],
  },
  {
    id: "invest",
    title: "Invest on dHedge",
    icon: ArrowRight,
    color: "purple",
    description:
      "dHedge is a decentralized fund platform. You connect your wallet and invest directly into the fund — no middleman holds your money.",
    steps: [
      {
        id: "visit",
        title: "Open the fund on dHedge",
        detail: `Click the button below to open your recommended fund on dHedge. The page will show the fund's current performance, composition, and details.`,
        isDhedgeLink: true,
      },
      {
        id: "connect",
        title: "Connect your wallet",
        detail: `On the dHedge page, look for a "Connect Wallet" button (usually top-right). Tap it and select Rainbow or MetaMask. Your wallet app will ask you to approve the connection — tap "Connect" or "Approve".`,
      },
      {
        id: "approve",
        title: "Approve and invest",
        detail: `Enter the amount you'd like to invest. You'll see two transactions: first an "Approve" (gives dHedge permission to use your USDC), then the actual investment. Confirm both in your wallet. Each will cost a small gas fee in ETH. And you're in! 🎉`,
        tip: "You'll see two separate transactions — this is normal. The first 'Approve' step only needs to happen once.",
      },
    ],
  },
];

// Color utility (Tailwind requires full class strings)
const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-600",
    progress: "bg-blue-500",
    ring: "ring-blue-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-600",
    progress: "bg-emerald-500",
    ring: "ring-emerald-500",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-600",
    progress: "bg-purple-500",
    ring: "ring-purple-500",
  },
};

// Add these type guard functions inside the component or before it
function hasWarning(step: any): step is { warning: string } {
  return "warning" in step;
}

function hasTip(step: any): step is { tip: string } {
  return "tip" in step;
}

function hasGasFunding(step: any): step is { isGasFunding: boolean } {
  return "isGasFunding" in step;
}

function hasLinks(
  step: any,
): step is { links: { label: string; url: string }[] } {
  return "links" in step;
}

function hasDhedgeLink(step: any): step is { isDhedgeLink: boolean } {
  return "isDhedgeLink" in step;
}

function hasWalletSave(step: any): step is { isWalletSave: boolean } {
  return "isWalletSave" in step;
}

// --- Save Wallet Address Sub-component ---
function WalletAddressInput() {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(walletAddress.trim());

  const handleSubmit = async () => {
    if (!isValidAddress) return;
    setStatus("loading");

    try {
      await saveWalletAddress(walletAddress.trim());
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <CheckCircle2
            size={18}
            className="text-emerald-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Wallet address saved!
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your wallet address has been saved to your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-xs text-blue-700 mb-3">
        Once you have your wallet address, paste it below to save it to your
        profile.
      </p>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="0x..."
          value={walletAddress}
          onChange={(e) => {
            setWalletAddress(e.target.value);
            setStatus("idle");
            setErrorMsg("");
          }}
          className={`w-full text-sm px-3 py-2 rounded-lg border bg-white font-mono placeholder-gray-400 focus:outline-none focus:ring-2 text-gray-900 ${
            walletAddress && !isValidAddress
              ? "border-red-300 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-300"
          }`}
        />

        {walletAddress && !isValidAddress && (
          <p className="text-xs text-red-600">
            That doesn&apos;t look like a valid Ethereum address. It should
            start with 0x and be 42 characters long.
          </p>
        )}

        {status === "error" && (
          <p className="text-xs text-red-600">{errorMsg}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValidAddress || status === "loading"}
          className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg transition-colors ${
            isValidAddress && status !== "loading"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Wallet Address"
          )}
        </button>
      </div>
    </div>
  );
}

// --- Gas Funding Request Sub-component (mock for MVP) ---
function GasFundingRequest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleRequest = () => {
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  };

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <CheckCircle2
            size={18}
            className="text-emerald-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Request sent!
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              We&apos;ll send a small amount of ETH to your wallet shortly. Keep
              an eye on your wallet — it usually arrives within a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Gift size={16} className="text-purple-600" />
        <p className="text-sm font-semibold text-purple-900">
          Free ETH for early users
        </p>
      </div>
      <p className="text-xs text-purple-700 mb-3">
        As an early InflationGuard user, we&apos;ll cover your initial gas fees.
        Click below and we&apos;ll send a small amount of ETH (~$5) to the
        wallet address you saved earlier.
      </p>

      <button
        type="button"
        onClick={handleRequest}
        disabled={status === "loading"}
        className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-lg transition-colors ${
          status !== "loading"
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending request...
          </>
        ) : (
          <>
            <Gift size={16} />
            Request Free ETH
          </>
        )}
      </button>

      <p className="text-[10px] text-purple-500 mt-3 text-center">
        One-time offer · Limited to early users · ~$5 ETH value
      </p>
    </div>
  );
}

export default function InvestmentGuide({ intent }: InvestmentGuideProps) {
  const fundContent = FUND_CONTENT[intent];

  // Track checked sub-tasks: { "wallet-download": true, ... }
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  // Track which step detail is expanded
  const [expanded, setExpanded] = useState<string | null>("wallet-download"); // First step open by default

  const toggleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  // Calculate progress per phase
  const getPhaseProgress = (phase: (typeof PHASES)[0]) => {
    const total = phase.steps.length;
    const done = phase.steps.filter(
      (s) => checked[`${phase.id}-${s.id}`],
    ).length;
    return { done, total, percent: Math.round((done / total) * 100) };
  };

  // Calculate overall progress
  const totalSteps = PHASES.reduce((sum, p) => sum + p.steps.length, 0);
  const completedSteps = PHASES.reduce(
    (sum, p) => sum + p.steps.filter((s) => checked[`${p.id}-${s.id}`]).length,
    0,
  );
  const overallPercent = Math.round((completedSteps / totalSteps) * 100);

  // Determine if a phase is "reachable" (previous phase complete)
  const isPhaseReachable = (phaseIdx: number) => {
    if (phaseIdx === 0) return true;
    const prevPhase = PHASES[phaseIdx - 1];
    const { done, total } = getPhaseProgress(prevPhase);
    return done === total;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Overall Progress Bar */}
      <div className="mb-8 bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Your Progress
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {completedSteps}/{totalSteps} steps
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        {overallPercent === 100 && (
          <p className="text-sm text-emerald-600 font-semibold mt-2 text-center">
            You&apos;re all set! Welcome to InflationGuard.
          </p>
        )}
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {PHASES.map((phase, phaseIdx) => {
          const Icon = phase.icon;
          const colors = colorClasses[phase.color as keyof typeof colorClasses];
          const { done, total, percent } = getPhaseProgress(phase);
          const isComplete = done === total;
          const reachable = isPhaseReachable(phaseIdx);
          const isLocked = !reachable;

          return (
            <div
              key={phase.id}
              className={`rounded-xl border-2 transition-all ${
                isComplete
                  ? "border-emerald-300 bg-emerald-50"
                  : isLocked
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : `${colors.border} bg-white`
              }`}
            >
              {/* Phase Header */}
              <div className="p-4 flex items-center gap-4">
                {/* Phase Icon / Completion */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isComplete
                      ? "bg-emerald-500"
                      : isLocked
                        ? "bg-gray-200"
                        : colors.bg
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 size={22} className="text-white" />
                  ) : (
                    <Icon
                      size={20}
                      className={isLocked ? "text-gray-400" : colors.text}
                    />
                  )}
                </div>

                {/* Phase Title & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-bold text-base ${
                        isLocked ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {phaseIdx + 1}. {phase.title}
                    </h4>
                    {isLocked && (
                      <span className="text-xs text-gray-400">🔒 Locked</span>
                    )}
                  </div>
                  {/* Mini progress bar */}
                  <div className="mt-1.5 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete ? "bg-emerald-500" : colors.progress
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Step Count */}
                <span
                  className={`text-xs font-semibold flex-shrink-0 ${
                    isComplete
                      ? "text-emerald-600"
                      : isLocked
                        ? "text-gray-400"
                        : colors.text
                  }`}
                >
                  {done}/{total}
                </span>
              </div>

              {/* Phase Description + Steps (only if not locked) */}
              {!isLocked && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 mb-4 ml-14">
                    {phase.description}
                  </p>

                  {/* Steps */}
                  <div className="ml-14 space-y-2">
                    {phase.steps.map((step) => {
                      const key = `${phase.id}-${step.id}`;
                      const isChecked = !!checked[key];
                      const isOpen = expanded === key;

                      return (
                        <div
                          key={step.id}
                          className={`rounded-lg border transition-all ${
                            isChecked
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          {/* Step Row */}
                          <div className="flex items-center gap-3 p-3">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleCheck(key)}
                              className="flex-shrink-0 text-gray-400 hover:text-emerald-500 transition-colors"
                            >
                              {isChecked ? (
                                <CheckCircle2
                                  size={20}
                                  className="text-emerald-500"
                                />
                              ) : (
                                <Circle size={20} />
                              )}
                            </button>

                            {/* Title */}
                            <span
                              className={`flex-1 text-sm font-medium ${
                                isChecked
                                  ? "line-through text-gray-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {step.title}
                            </span>

                            {/* Expand toggle */}
                            <button
                              onClick={() => toggleExpand(key)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isOpen ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                          </div>

                          {/* Expanded Detail */}
                          {isOpen && (
                            <div className="px-3 pb-3 pl-11 space-y-3">
                              <p className="text-sm text-gray-600">
                                {step.detail}
                              </p>

                              {/* Warning box */}
                              {hasWarning(step) && (
                                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                                  <AlertTriangle
                                    size={16}
                                    className="text-red-500 mt-0.5 flex-shrink-0"
                                  />
                                  <p className="text-xs text-red-800">
                                    {step.warning}
                                  </p>
                                </div>
                              )}

                              {/* Save Wallet Address */}
                              {hasWalletSave(step) && <WalletAddressInput />}

                              {/* Tip box */}
                              {hasTip(step) && (
                                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <span className="text-blue-500 flex-shrink-0">
                                    💡
                                  </span>
                                  <p className="text-xs text-blue-800">
                                    {step.tip}
                                  </p>
                                </div>
                              )}

                              {/* Gas Funding Request */}
                              {hasGasFunding(step) && <GasFundingRequest />}

                              {/* Links */}
                              {hasLinks(step) && (
                                <div className="flex flex-wrap gap-2">
                                  {step.links.map((link) => (
                                    <a
                                      key={link.label}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors hover:bg-blue-100"
                                    >
                                      {link.label}
                                      <ExternalLink size={11} />
                                    </a>
                                  ))}
                                </div>
                              )}

                              {/* dHedge CTA (only for invest phase) */}
                              {hasDhedgeLink(step) && (
                                <a
                                  href={getDhedgeUrl(intent)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                  Open {fundContent.name} on dHedge
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Disclaimer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertTriangle
            size={16}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-xs text-amber-800">
            <strong>Not financial advice.</strong> This guide is for educational
            purposes only. Crypto investments carry significant risk. Only
            invest what you can afford to lose. Do your own research before
            making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
