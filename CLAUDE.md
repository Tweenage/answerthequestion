# ATQ Spelling

> 11+ vocabulary trainer for children, built by Rebecca Everton.
> Companion product to [AnswerTheQuestion!](https://answerthequestion.co.uk).

---

## What This Project Does

ATQ Spelling teaches children the vocabulary they need to succeed in 11+ exams. Rather than flashcards or rote learning, it uses **Cover-Copy-Compare** — a proven study technique — combined with **SM-2 spaced repetition** to surface words exactly when memory is about to fade. A bee mascot called **Bee** (the Queen Bee 🐝👑) guides children through daily sessions.

**Cover-Copy-Compare flow:**
1. **Show** — See the word with tricky characters amber-highlighted. Read the definition and a context sentence.
2. **Cover** — Word is hidden. Recall it in your mind.
3. **Type** — Type the word from memory. Timer runs silently.
4. **Compare** — See your attempt character-by-character (green/red). Bee reacts to the result.

Each attempt is graded (1–5) and fed into the SM-2 algorithm, which schedules the next review. Fast-correct responses score 5, slow-correct score 3–4, incorrect score 1. A mastery score (0–5 stars) accumulates per word.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite` plugin, configured in `src/index.css` with `@theme`) |
| State | Zustand 5 with `persist` middleware (localStorage) |
| Routing | React Router 7 (imported as `react-router`, NOT `react-router-dom`) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Auth + DB | Supabase — **shared ATQ project** (same PostgreSQL, same Auth, same `child_profiles` table) |
| IDs | nanoid |
| Testing | Vitest + jsdom |
| Hosting | Vercel (SPA with rewrites in `vercel.json`) |

**No Tailwind config file** — Tailwind 4 uses CSS-based configuration. All custom tokens live in `src/index.css` under `@theme`.

**Dev port: 5174** (ATQ runs on 5173, so this avoids collisions).

---

## Architecture Overview

```
Single-page React app (Vite, port 5174)
    |
    |-- Supabase Auth (shared ATQ project — same email/password login)
    |-- Supabase PostgreSQL
    |      shared: child_profiles (same table ATQ uses)
    |      new:    spelling_progress (SM-2 state per word per child)
    |              spelling_sessions (session history per child)
    |-- Vercel for hosting
```

**Parent/child model**: identical to ATQ. A parent has a Supabase account. Under it they create child profiles (`child_profiles`). ATQ Spelling reads/writes its own `spelling_progress` and `spelling_sessions` tables; it never touches ATQ's `user_progress` or `daily_sessions` tables.

**Offline-first**: All progress is stored in Zustand + localStorage (key: `atq-spelling-progress`). Supabase sync happens in the background (fire-and-forget). Merge rule: whichever record has more `timesAttempted` wins.

**No paywall in Phase 1**: `hasPaid` is hard-coded to `true` for all child profiles. No Stripe, no payment Edge Functions.

**SM-2 algorithm**: pure function in `src/utils/sm2.ts`. Fully unit-tested (17 tests in `src/__tests__/sm2.test.ts`). `applyReview(state, grade, today)` returns new state; `gradeAnswer(correct, responseTimeMs)` converts timing to SM-2 grade.

---

## Key Files & Folders

```
/
├── src/
│   ├── App.tsx                         # Router, 3-layer route guards, lazy-loaded pages
│   ├── main.tsx                        # React entry point
│   ├── index.css                       # Tailwind 4 @theme (amber/honey palette)
│   ├── pages/
│   │   ├── LandingPage.tsx             # Marketing page (unauthenticated)
│   │   ├── LoginPage.tsx               # Email/password login
│   │   ├── SignupPage.tsx              # New account creation
│   │   ├── ChildPickerPage.tsx         # Create/select child profiles
│   │   ├── HomePage.tsx                # Streak, today's session card, mastery overview
│   │   ├── StudyPage.tsx               # Iterates CoverCopyCompare through session words
│   │   ├── SessionCompletePage.tsx     # Score, streak, per-word mastery stars
│   │   └── ProgressPage.tsx           # Full mastery overview (stub — expand in Phase 2)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx            # Header + Outlet + BottomNav
│   │   │   ├── Header.tsx              # Logo, streak, dyslexia toggle (Aa), avatar dropdown
│   │   │   └── BottomNav.tsx           # 3 items: Home /, Study /study, Progress /progress
│   │   ├── mascot/
│   │   │   └── BeeChar.tsx             # Bee mascot, emoji-based, 5 moods, Framer Motion
│   │   ├── study/
│   │   │   └── CoverCopyCompare.tsx    # 4-phase state machine (show→cover→type→compare)
│   │   ├── ui/
│   │   │   ├── MasteryStars.tsx        # 0–5 stars display (⭐/☆)
│   │   │   ├── ProgressBar.tsx         # Horizontal bar, honey/meadow/buzz colours
│   │   │   └── StreakBadge.tsx         # 🔥 + streak number
│   │   ├── SyncToast.tsx               # 4s auto-dismiss toast for sync status
│   │   └── ErrorBoundary.tsx           # Bee-themed ("Back to the Hive!")
│   ├── stores/
│   │   ├── useAuthStore.ts             # Parent session, children, currentChildId (key: atq-spelling-auth)
│   │   ├── useDyslexiaStore.ts         # Per-child dyslexia toggle (key: atq-spelling-dyslexia)
│   │   └── useSpellingProgressStore.ts # SM-2 state, sessions, streaks, Supabase sync (key: atq-spelling-progress)
│   ├── hooks/
│   │   ├── useSupabaseAuth.ts          # Supabase auth listener (no claim-payment call)
│   │   ├── useCurrentUser.ts           # Reactive active child selector
│   │   └── useDailySession.ts          # Selects 3 new + up to 5 review words via SM-2
│   ├── data/
│   │   ├── words.ts                    # 50 SpellingWord objects (word-001 to word-050)
│   │   └── navItems.ts                 # BottomNav items config
│   ├── types/
│   │   ├── spelling.ts                 # SpellingWord, WordProgress, SpellingSessionRecord
│   │   └── user.ts                     # User, AvatarConfig (honey-based avatar colours)
│   ├── utils/
│   │   └── sm2.ts                      # SM-2 algorithm (createInitialSM2State, applyReview, gradeAnswer, isDueForReview)
│   ├── __tests__/
│   │   └── sm2.test.ts                 # 17 Vitest unit tests for SM-2
│   └── lib/
│       └── supabase.ts                 # Supabase client (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
├── supabase/
│   └── migrations/
│       └── 004_spelling.sql            # spelling_progress + spelling_sessions tables + RLS
├── public/
│   ├── manifest.json                   # PWA manifest
│   ├── sw.js, register-sw.js           # Service worker
│   └── favicon.svg, favicon.png
├── vercel.json                         # SPA rewrites
├── vite.config.ts                      # Plugins, manual chunks, console.log stripping in prod
├── vitest.config.ts                    # jsdom environment, src/__tests__
├── index.html                          # amber theme-color #f59e0b, fonts, PWA meta
└── package.json                        # port 5174
```

---

## Pages & Routes

| Route | Page | Auth | Notes |
|---|---|---|---|
| `/` | LandingPage | Public | Marketing; redirects logged-in+child users to /home |
| `/login` | LoginPage | Public | |
| `/signup` | SignupPage | Public | No referral code, no welcome email call |
| `/select-child` | ChildPickerPage | Parent | No paywall/claim-payment logic |
| `/home` | HomePage | Parent+Child | Streak, session card, mastery overview |
| `/study` | StudyPage | Parent+Child | Full CCC session |
| `/study/complete` | SessionCompletePage | Parent+Child | Score + streak after session |
| `/progress` | ProgressPage | Parent+Child | Mastery overview (stub — Phase 2) |

**Route guards** (in `App.tsx`):
- `PublicLandingRoute` — redirects authenticated+active-child users to `/home`
- `ParentProtectedRoute` — requires Supabase session, redirects to `/login`
- `ChildProtectedRoute` — requires active child, redirects to `/select-child`
- `ProgressSync` — calls `fetchFromSupabase` when a child is selected

---

## State Management

Three Zustand stores, all `persist` middleware:

### `useAuthStore` (key: `atq-spelling-auth`)
- `parentSession`: Supabase `Session`
- `children`: `User[]`
- `currentChildId`: `string | null`
- Logout clears `atq-spelling-progress` and `atq-spelling-dyslexia` from localStorage

### `useDyslexiaStore` (key: `atq-spelling-dyslexia`)
- `enabledByChild: Record<string, boolean>`
- `toggle(childId)` / `isEnabled(childId)`

### `useSpellingProgressStore` (key: `atq-spelling-progress`)
- `dataByChild: Record<string, ChildSpellingData>`
- `ChildSpellingData`: `{ wordProgress: Record<string, WordProgress>, sessions: SpellingSessionRecord[], streak: StreakData }`
- `WordProgress`: `{ wordId, sm2: SM2State, lastSeenDate, timesAttempted, timesCorrect }`
- Key methods: `recordAnswer`, `getDueWords`, `getNewWords`, `saveSession`, `updateStreak`, `fetchFromSupabase`, `syncToSupabase`

---

## SM-2 Algorithm

The algorithm is in `src/utils/sm2.ts`. Key invariants:
- `easeFactor` never drops below 1.3
- `masteryScore` is capped at 5 (equals `Math.min(5, repetitions)`)
- `gradeAnswer(correct, responseTimeMs)`: `<5s → 5`, `5–15s → 4`, `>15s → 3`, incorrect → 1
- `isDueForReview(state, today)`: `state.nextReviewDate <= today`

Do not change these without updating the unit tests first.

---

## Word Data (`src/data/words.ts`)

50 `SpellingWord` objects, IDs `word-001` to `word-050`.

Each word has:
- `word`: the target spelling
- `definition`: kid-friendly, 1–2 sentences
- `sentence`: 11+ context usage
- `trickyIndices: [startIndex, endIndex]`: character range highlighted amber in SHOW phase
- `difficulty: 1 | 2 | 3`: Foundation / Building / Exam Ready
- `category?: string`

Exports: `SPELLING_WORDS: SpellingWord[]` and `WORDS_BY_ID: Record<string, SpellingWord>`.

---

## Colour Palette

Amber/honey theme — distinct from ATQ's purple/cyan. Defined in `src/index.css` `@theme`:

| Token | Value | Usage |
|---|---|---|
| `honey-50` – `honey-700` | `#fffbeb` – `#b45309` | Primary brand colour (amber) |
| `buzz-400`, `buzz-500` | `#fb923c`, `#f97316` | Accent (orange) |
| `meadow-400`, `meadow-500` | `#4ade80`, `#22c55e` | Correct/success states |

Body background: gradient `#fbbf24 → #f59e0b → #fb923c → #ef4444` (fixed attachment).

Cards: `bg-white/80 backdrop-blur-sm rounded-2xl shadow-md`

---

## Supabase Tables (run `004_spelling.sql` in shared ATQ project)

**`spelling_progress`** — one row per (child, word). SM-2 state columns + times_attempted/correct. Unique constraint on `(child_id, word_id)`. RLS: parent owns via `child_profiles.parent_id = auth.uid()`.

**`spelling_sessions`** — one row per session. `words_studied` is JSONB array of word IDs. RLS: same pattern.

Do NOT touch ATQ's existing tables (`user_progress`, `daily_sessions`, `question_results`, etc.).

---

## Dev Conventions

These match ATQ exactly:

- **Import routing as `react-router`**, never `react-router-dom`
- **No `console.log/debug/warn`** in production code — esbuild strips them, but don't rely on it. Use `console.error` for genuine errors only (auth failures etc.)
- **`debugger` statements** are stripped by esbuild `drop: ['debugger']`
- **Tailwind classes only** — no inline styles, no CSS modules
- **Framer Motion** for all animations. `<MotionConfig reducedMotion="user">` wraps the whole app
- **`nanoid()`** for all generated IDs (sessions etc.)
- **TypeScript strict** — `"strict": true` in tsconfig. No `any` casts unless absolutely unavoidable
- **Offline-first pattern**: Zustand primary, Supabase fire-and-forget. Never await Supabase calls in user-facing handlers
- **No backwards-compat hacks** — if something is removed, delete it completely

---

## Database Naming Convention (Non-Negotiable)

All Tweenage products share a single Supabase project. To prevent data becoming a mess, every table and Edge Function MUST be prefixed by app:

| App | Table Prefix | Edge Function Prefix | Example Tables |
|---|---|---|---|
| **ATQ** (Answer The Question) | *(none — legacy, already live)* | *(none — legacy)* | `payments`, `user_progress`, `daily_sessions`, `question_results`, `earned_badges` |
| **Spelling Bees** | `spelling_` | `spelling-` or `create-spelling-` | `spelling_progress`, `spelling_sessions` |
| **Appeal Ready** | `appeal_` | `appeal-` | `appeal_orders`, `appeal_cases`, `appeal_documents` |
| **Tweenage / Parent Hub** | `hub_` | `hub-` | `hub_subscriptions`, `hub_preferences` |
| **SATs Boost** | `sats_` | `sats-` | `sats_progress`, `sats_sessions` |

**Shared tables** (used by all apps): `child_profiles`, `email_leads`

**Rules:**
1. NEVER create a generic table name like `orders` for a new app — always prefix it
2. ATQ tables are unprefixed because they existed first — do NOT rename them
3. Payment tables: ATQ uses `payments`. New apps use `spelling_payments`, `appeal_payments`, etc.
4. When creating a new app's tables, include the prefix in the migration filename too (e.g. `006_appeal_tables.sql`)
5. Edge Functions follow the same pattern: `create-spelling-checkout`, `appeal-webhook`, etc.
6. RLS policies should reference the app name: `"Spelling: parent can read own progress"`

This convention ensures any developer (or AI) can look at a table name and instantly know which app owns it.

---

## Phase Roadmap

| Phase | Scope |
|---|---|
| **1 (MVP — built)** | 50 words, Cover-Copy-Compare, SM-2, streak, Supabase sync, offline-first |
| **2** | 300 words, 6 study modes (anagram, fill-in-blank, word-builder, speed-spell, sentence-use), adaptive exam-date pacing |
| **3** | ElevenLabs audio pronunciation, OpenDyslexic font option |
| **4** | Stripe paywall (£9.99 standalone / £19.99 bundle), welcome email |

---

## Running the App

```bash
cd "/Users/rebeccaeverton/ATQ Spelling"
npm install
# Create .env.local with the same VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY as ATQ
npm run dev        # http://localhost:5174
npm test           # 17 unit tests (SM-2 algorithm)
npm run build      # Production build
```

ATQ (the parent app) runs on port 5173. Both can run simultaneously.
