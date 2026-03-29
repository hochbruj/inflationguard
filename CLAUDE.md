# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is InflationGuard?

InflationGuard is a retail investor platform that helps users protect their wealth against inflation by recommending an appropriate dHedge on-chain fund based on their risk profile. The app guides users through a short questionnaire, generates an AI-powered reflection on their answers, derives a risk profile, and then recommends one of three proprietary dHedge vaults (conservative/balanced/growth). Users can then view live fund data and invest directly via dHedge.

The core thesis: traditional savings erode under inflation. InflationGuard steers users toward scarce, non-sovereign assets (Bitcoin, Gold, Ethereum) packaged as managed on-chain funds.

## Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
```

## Architecture

Next.js 16 App Router application with Firebase (auth + Firestore) and Vercel AI SDK (OpenAI). Guides users through an onboarding questionnaire, derives a risk profile, and recommends a dHedge fund (conservative/balanced/growth).

### Path alias

`@/*` maps to `./src/app/*`

### Key directories

- `src/app/onboarding/` — 8-step flow (step1–step8 pages), each with its own `page.tsx`
- `src/app/api/` — Route handlers: `funds/` (fetches live fund data from external GCF endpoints), `reflection/` (streams AI analysis via `gpt-4.1-mini`)
- `src/app/contexts/` — AuthContext (Firebase email/password auth)
- `src/app/components/fund-recommendation/` — Fund display components (charts, stats, risk, allocation)
- `src/app/lib/` — Core business logic (profile derivation, strategy framing, fund content, Firestore ops)
- `src/app/data/` — Static questions and AI prompt templates

### Data flow

User answers (steps 1–4) → AI reflection (step 5, streaming) → `profileDerivation.ts` converts answers to `DerivedProfile` → `strategyFraming.ts` maps profile to `StrategyIntent` (conservative/balanced/growth) via rule-based constraints → fund selection (step 7) with live data from external APIs → save to Firestore (step 8)

### State management

- **AuthContext**: Firebase auth state, `signup()`/`login()`/`logout()`
- **OnboardingContext**: Scoped to `/onboarding/*`, stores `answers`, `correction`, `summary`
- No external state library; React Context + useState throughout

### Auth & route protection

Firebase email/password auth. Route protection is per-page via `useAuth()` + `useEffect` redirects (no centralized middleware).

### External APIs

Fund data comes from two hardcoded Google Cloud Functions:
- `us-central1-bullion-vs-bytes.cloudfunctions.net/getPerformance`
- `us-central1-bitcoin-gold-functions.cloudfunctions.net/getFunds`

### Strategy determination logic

Profile derivation applies safety adjustments (e.g., high capital criticality caps volatility tolerance). Strategy framing is constraint-driven: **any hard constraint → conservative**, all growth conditions met → growth, else → balanced. See `profileDerivation.ts` and `strategyFraming.ts`.

Hard constraints that force conservative: `capitalCriticality === "high"`, `volatilityTolerance === "low"`, `timeHorizon === "short"`, `liquidityNeed === "high"`.

## Onboarding questionnaire (4 blocks → 10 questions)

- **Block 1 — Capital & time horizon** (q1.1–q1.6): When they need the capital, liquidity needs, emotional safety, impact of 50% permanent loss, ability to rebuild.
- **Block 2 — Volatility tolerance** (q2.1–q2.3): Reaction to 30% drawdown, experience holding through crashes, fear of loss vs. fear of missing out.
- **Block 3 — Asset familiarity** (q3.1–q3.3): Bitcoin/Ethereum knowledge level, view of Gold/Silver, preference for simplicity vs. optimization.
- **Block 4 — Goals** (q4.2): Primary goal (growth / preserve purchasing power / balanced).

Questions are defined in `src/app/data/questions.ts`. The AI reflection (step 5) uses these answers to generate a personalized narrative before profile derivation.

## dHedge funds

All three are proprietary vaults managed on dHedge. Fund metadata (name, address, risk data, launch date) lives in `src/app/lib/fundContent.ts`. Live performance/allocation data is fetched at runtime from external GCF endpoints.

| Strategy | Fund name | Vault address | Max drawdown | Key assets |
|---|---|---|---|---|
| **Conservative** | InflationGuard Stable Yield | `0x01d34eb628c40318f906a598b32da8796ec102ed` | ~30% (theoretical); ~10% historical | sUSDe (Ethena) leveraged on Aave, small BTC position. Target 10–15% APY. |
| **Balanced** | InflationGuard Balanced | `0x892d59b29fd67ab1c1dbc35d8af03f0465d2c211` | ~41% | ~35% BTC, Gold allocation, stablecoin yield via Aave |
| **Growth** | InflationGuard Leveraged-Growth | `0xba5c9d41415189d01203f471ca501940406bae89` | ~72% | Bitcoin + Ethereum with 1.5× leverage via Aave |

All vaults are accessible on dHedge at `https://app.dhedge.org/vault/<address>`. The helper `getDhedgeUrl(intent)` in `fundContent.ts` builds this URL.

Key risks by tier:
- **Conservative**: USDe de-peg, health factor close to liquidation (1.18), Ethena/Aave smart contract risk.
- **Balanced**: BTC volatility dampened by gold; gold may drag during crypto bull runs.
- **Growth**: 70–80% BTC drawdowns amplified by leverage; liquidation risk during flash crashes.

## Environment variables

Server-side: `OPENAI_API_KEY`
Client-side (NEXT_PUBLIC_): Firebase config keys (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID)

## Stack

Next.js 16, React 19, TypeScript 5 (strict), Firebase 12, Vercel AI SDK 5, Tailwind CSS 4, Recharts 3, Lucide React
