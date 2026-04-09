# ATQ Spelling (Spelling Bees)

> 11+ vocabulary trainer for children, built by Rebecca Everton.
> Companion product to [AnswerTheQuestion!](https://answerthequestion.co.uk).
> **Domain:** [spellingbees.co.uk](https://spellingbees.co.uk)

---

## What This Project Does

Spelling Bees teaches children the vocabulary they need for 11+ exams using **Cover-Copy-Compare** — a proven study technique — combined with **SM-2 spaced repetition**. A bee mascot called **Bee** (the Queen Bee 🐝👑) guides children through daily sessions.

**624 words** — statutory Year 3–6 words plus 11+ vocabulary, all deduplicated at load time.

**Cover-Copy-Compare flow:**
1. **Show** — See the word with tricky characters amber-highlighted. Read the definition and context sentence.
2. **Cover** — Word is hidden. Recall it in your mind.
3. **Type** — Type the word from memory. Timer runs silently.
4. **Compare** — See your attempt character-by-character (green/red). Bee reacts to the result.

Each attempt is graded (1–5) and fed into the SM-2 algorithm. A mastery score (0–3 stars) accumulates per word, displayed on the Bingo grid.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7 |
| Styling | Tailwind CSS 4 (CSS-based config in `src/index.css` with `@theme`) |
| State | Zustand 5 with `persist` middleware (localStorage) |
| Routing | React Router 7 (imported as `react-router`, NOT `react-router-dom`) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Auth + DB | Supabase — **shared Tweenage project** (project ID: `ganlncdbebtnstgcewsd`) |
| Payments | LemonSqueezy (£19.99 one-time) |
| Email | Resend (from `hello@spellingbees.co.uk`) |
| IDs | nanoid |
| Testing | Vitest + jsdom |
| Hosting | Vercel (SPA with rewrites) |

**Dev port: 5175** (ATQ runs on 5173).

---

## Monorepo Structure

This is an npm workspaces monorepo. Both ATQ and Spelling Bees share auth, pages, and types.

```
/
├── apps/
│   ├── atq/                          # AnswerTheQuestion! app
│   └── spelling/                     # Spelling Bees app (this one)
│       ├── src/
│       │   ├── App.tsx               # Router, route guards, SpellingSync, brand config
│       │   ├── pages/                # 13 pages (see Routes table below)
│       │   ├── components/
│       │   │   ├── layout/           # AppShell, Header, BottomNav
│       │   │   ├── mascot/           # BeeChar (emoji-based, 5 moods, Framer Motion)
│       │   │   ├── study/            # CoverCopyCompare (4-phase state machine)
│       │   │   ├── test/             # Test mode components
│       │   │   ├── progress/         # Progress/bingo components
│       │   │   └── ui/              # MasteryStars, ProgressBar, StreakBadge
│       │   ├── stores/
│       │   │   └── useSpellingProgressStore.ts  # SM-2 state, sessions, streaks, sync
│       │   ├── hooks/
│       │   │   ├── useDailySession.ts           # Selects new + review words via SM-2
│       │   │   ├── useDrill.ts                  # Drill mode (diminishing pool)
│       │   │   ├── usePlacement.ts              # Placement test (10 words → tier)
│       │   │   ├── useSpellingPaywall.ts        # Reads hasPaidSpelling from user
│       │   │   └── useSpellingTest.ts           # Test mode
│       │   ├── data/
│       │   │   └── words/            # 624 words across 7 source files, deduped in index.ts
│       │   ├── utils/
│       │   │   ├── sm2.ts            # SM-2 algorithm (unit-tested)
│       │   │   └── stars.ts          # Star calculation from attempts/sessions/interval
│       │   └── types/
│       │       └── spelling.ts       # SpellingWord, WordProgress, SpellingSessionRecord
│       ├── vercel.json               # SPA rewrites + security headers
│       └── vite.config.ts            # Aliases, code splitting, console stripping
├── packages/
│   └── shared/                       # Shared between ATQ and Spelling Bees
│       └── src/
│           ├── pages/                # LoginPage, SignupPage, ChildPickerPage, legal pages
│           ├── stores/               # useAuthStore, useDyslexiaStore, useSettingsStore
│           ├── hooks/                # useSupabaseAuth, useCurrentUser, useDyslexiaMode
│           ├── context/              # AppBrandContext (amber for Spelling, purple for ATQ)
│           ├── components/           # ErrorBoundary, SyncToast, ProfessorHoot, celebrations
│           ├── types/                # User, AvatarConfig
│           └── lib/                  # supabase.ts client
└── supabase/
    ├── migrations/                   # 8 SQL migrations (shared across both apps)
    └── functions/                    # 9 Edge Functions + _shared/rate-limit.ts
```

---

## Routes

| Route | Page | Auth | Notes |
|---|---|---|---|
| `/` | LandingPage | Public | Redirects logged-in users to `/home` or `/select-child` |
| `/login` | LoginPage | Public | Shared page, branded amber via AppBrandContext |
| `/signup` | SignupPage | Public | Shared page, branded amber |
| `/auth` | Redirect → `/login` | Public | Backward compat |
| `/checkout` | CheckoutPage | **Public** | Guest checkout allowed (email field for guests) |
| `/payment-success` | PaymentSuccessPage | **Public** | Calls `claim-spelling-payment` on load |
| `/privacy-policy` | PrivacyPolicyPage | Public | Shared legal page |
| `/terms` | TermsPage | Public | |
| `/refunds` | RefundPolicyPage | Public | |
| `/select-child` | ChildPickerPage | Parent | Auto-redirects to `/home` if child exists |
| `/home` | HomePage | Parent+Child | Streak, session card, mastery overview |
| `/study` | StudyPage | Parent+Child | Full Cover-Copy-Compare session |
| `/test` | TestPage | Parent+Child | Test mode |
| `/drill` | DrillPage | Parent+Child | Drill mode (diminishing pool) |
| `/bingo` | BingoPage | Parent+Child | Bingo grid progress view (0–3 stars per word) |
| `/placement` | PlacementPage | Parent+Child | 10-word placement test → tier |
| `/progress` | ProgressPage | Parent+Child | Full mastery overview |
| `/session-complete` | SessionCompletePage | Parent+Child | Score, streak, per-word stars |
| `/upgrade` | UpgradePage | Parent+Child | Paywall upgrade prompt |
| `/settings` | SettingsPage | Parent+Child | Dyslexia mode, ritual toggle |

**Route guards** (in `App.tsx`):
- `PublicLandingRoute` — redirects authenticated users to `/home` or `/select-child`
- `ParentProtectedRoute` — requires Supabase session
- `ChildProtectedRoute` — requires active child
- `SpellingSync` — calls `claim-spelling-payment` then `fetchFromSupabase` on child selection

---

## Payment Flow

**Price:** £19.99 one-time via LemonSqueezy.

**Guest checkout** (pay before account):
1. Landing page → `/checkout` → enter email → LemonSqueezy external checkout
2. LemonSqueezy webhook (`spelling-webhook`) fires → records in `spelling_payments`, marks `has_paid_spelling=true`
3. Redirect to `/payment-success` → calls `claim-spelling-payment`
4. User creates account → `claim-spelling-payment` matches by email

**Authenticated checkout:**
1. User already has account → `/checkout` → LemonSqueezy checkout (email pre-filled)
2. Webhook fires → marks `has_paid_spelling=true` on all child profiles

**Paywall:** `useSpellingPaywall` hook reads `user.hasPaidSpelling`. Free tier shows limited content; paid unlocks all 624 words.

---

## Edge Functions

| Function | Rate Limit | Auth | Purpose |
|---|---|---|---|
| `create-spelling-checkout` | 10/min | Optional | Creates LemonSqueezy checkout. Reads `SPELLING_LS_VARIANT_ID` secret |
| `spelling-webhook` | 100/min | HMAC sig | Handles `order_created`. Records payment, marks `has_paid_spelling`, sends welcome email |
| `claim-spelling-payment` | 10/min | Required | Matches unclaimed payments by email, marks child profiles paid |
| `lead-capture` | 10/min | None | Captures email → `email_leads`, sends free PDF word list via Resend |

**Required secrets** (set via `supabase secrets set`):
- `LEMONSQUEEZY_API_KEY` — shared with ATQ (already set)
- `SPELLING_LS_VARIANT_ID` — Spelling Bees product variant ID from LemonSqueezy
- `SPELLING_WEBHOOK_SECRET` — webhook signing secret from LemonSqueezy
- `RESEND_API_KEY` — shared with ATQ (already set)

**CORS:** All functions whitelist `spellingbees.co.uk`, `www.spellingbees.co.uk`, `answerthequestion.co.uk`, Vercel preview URLs, and `localhost` when `ALLOW_LOCALHOST=true`.

---

## Supabase Tables

**Spelling-specific** (all prefixed per naming convention):

| Table | Purpose |
|---|---|
| `spelling_progress` | One row per (child, word). SM-2 state (`sm2_*` columns), stars, attempt counts. Composite PK `(child_id, word_id)` |
| `spelling_sessions` | One row per session. `words_studied`, `correct`/`total`, `duration_ms` |
| `spelling_results` | Per-word results within sessions |
| `spelling_payments` | LemonSqueezy payment records. `lemonsqueezy_order_id`, `parent_id`, `customer_email`, `status` |
| `spelling_custom_lists` | Homework word lists per child |

**Shared tables** (used by both ATQ and Spelling):
- `child_profiles` — includes `has_paid_spelling BOOLEAN DEFAULT false` and `placement_tier INTEGER`
- `email_leads` — email capture from landing page

**Do NOT touch ATQ's tables** (`user_progress`, `daily_sessions`, `question_results`, `payments`, etc.).

---

## SM-2 Algorithm

Pure function in `src/utils/sm2.ts`. Unit-tested (17 tests).

- `applyReview(state, grade, today)` → new SM-2 state
- `gradeAnswer(correct, responseTimeMs)` → grade 1–5
- `isDueForReview(state, today)` → boolean
- `createInitialSM2State(today)` → starting state
- `easeFactor` never drops below 1.3
- `masteryScore` = `Math.min(5, repetitions)`

Star calculation in `src/utils/stars.ts`: 0–3 stars based on total attempts, correct sessions, and current SM-2 interval.

---

## State Management

### `useAuthStore` (shared, key: `rtq-auth`)
- `parentSession`, `children`, `currentChildId`
- `hasPaidSpelling` field on each child (mapped from DB in ChildPickerPage)
- Persists `currentChildId` + `children` array

### `useSpellingProgressStore` (key: `atq-spelling-progress`)
- `dataByChild: Record<string, ChildSpellingData>`
- `ChildSpellingData`: `{ wordProgress, sessions, streak, settings }`
- `getData(childId)` defensively merges with defaults (handles stale localStorage)
- Persist config has `version: 1` + migration from v0 (adds streak/settings to old data)
- Key methods: `recordAnswer`, `getDueWords`, `getNewWords`, `saveSession`, `updateStreak`, `fetchFromSupabase`, `syncToSupabase`

### `useDyslexiaStore` (shared, key: `atq-spelling-dyslexia`)
- Per-child dyslexia toggle

---

## Branding

**AppBrandContext** (in `packages/shared/src/context/`) provides app-specific theming to shared pages:

| Property | Spelling Bees | ATQ |
|---|---|---|
| `buttonGradient` | `from-amber-500 via-orange-500 to-rose-500` | `from-purple-600 via-fuchsia-500 to-pink-500` |
| `headingColor` | `text-amber-800` | `text-purple-800` |
| `accentColor` | `text-amber-600` | `text-purple-600` |
| `mascot` | BeeChar (🐝👑) | ProfessorHoot (🦉) |

Body background: gradient `#fbbf24 → #f59e0b → #fb923c → #ef4444` (fixed attachment).

---

## Database Naming Convention (Non-Negotiable)

All Tweenage products share a single Supabase project. Every table and Edge Function MUST be prefixed by app:

| App | Table Prefix | Edge Function Prefix |
|---|---|---|
| **ATQ** | *(none — legacy)* | *(none — legacy)* |
| **Spelling Bees** | `spelling_` | `spelling-` or `create-spelling-` |
| **Appeal Ready** | `appeal_` | `appeal-` |
| **Tweenage / Parent Hub** | `hub_` | `hub-` |
| **SATs Boost** | `sats_` | `sats-` |

**Shared tables**: `child_profiles`, `email_leads`

---

## Dev Conventions

- **Import routing as `react-router`**, never `react-router-dom`
- **No `console.log/debug/warn`** in production — esbuild strips them
- **Tailwind classes only** — no inline styles, no CSS modules
- **Framer Motion** for all animations. `<MotionConfig reducedMotion="user">` wraps the app
- **`nanoid()`** for all generated IDs
- **TypeScript strict** — no `any` casts unless unavoidable
- **Offline-first**: Zustand primary, Supabase fire-and-forget. Never await Supabase in user-facing handlers

---

## Running the App

```bash
cd "/Users/rebeccaeverton/ATQ Spelling"
npm install
# Create apps/spelling/.env.local with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev --workspace=apps/spelling    # http://localhost:5175
npm test --workspace=apps/spelling       # SM-2 unit tests
npm run build --workspace=apps/spelling  # Production build
```

Both ATQ (5173) and Spelling (5175) can run simultaneously.

---

## Deployment

- **Frontend:** Vercel (auto-deploys from git). `vercel.json` handles SPA rewrites and security headers.
- **Edge Functions:** Deployed via `supabase functions deploy <name>` from the repo root.
- **Domain:** `spellingbees.co.uk` (Vercel)
- **Email:** `hello@spellingbees.co.uk` via Resend (domain must be verified in Resend dashboard)

---

## Current Status (April 2026)

- ✅ 624 words (statutory + 11+ vocabulary)
- ✅ Cover-Copy-Compare study mode with SM-2 spaced repetition
- ✅ Test mode, Drill mode, Bingo grid, Placement test
- ✅ LemonSqueezy payment flow (guest + authenticated checkout)
- ✅ Payment claiming on account creation
- ✅ Branded shared pages (amber theme via AppBrandContext)
- ✅ Lead capture with free PDF word list email
- ✅ Streaks, stars (0–3), session tracking
- ✅ Supabase sync (offline-first)
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Rate limiting on all Edge Functions
- ⚠️ `SPELLING_LS_VARIANT_ID` secret — must be set after creating product in LemonSqueezy
- ⚠️ `SPELLING_WEBHOOK_SECRET` secret — must be set after creating webhook in LemonSqueezy
- ⚠️ `spellingbees.co.uk` domain verification in Resend — required for emails to send
