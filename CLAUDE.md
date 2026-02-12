# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

Profile derivation applies safety adjustments (e.g., high capital criticality caps volatility tolerance). Strategy framing is constraint-driven: any hard constraint → conservative, all growth conditions met → growth, else → balanced. See `profileDerivation.ts` and `strategyFraming.ts`.

## Environment variables

Server-side: `OPENAI_API_KEY`
Client-side (NEXT_PUBLIC_): Firebase config keys (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID)

## Stack

Next.js 16, React 19, TypeScript 5 (strict), Firebase 12, Vercel AI SDK 5, Tailwind CSS 4, Recharts 3, Lucide React
