# AnswerTheQuestion!

> 11+ exam technique trainer for children, built by a parent (Rebecca Everton).
> Live at **https://answerthequestion.co.uk**

---

## What This Project Does

AnswerTheQuestion! (ATQ!) teaches children the **CLEAR Method** for answering 11+ exam questions. Rather than testing knowledge, it trains *exam technique* — the habits that prevent avoidable mistakes under pressure. Children practise 10 questions daily across English, Maths, and Reasoning over a structured 12-week programme with decreasing scaffolding. A mascot called **Professor Hoot** (an owl) guides them throughout.

The CLEAR Method:
- **C** — Calm: Breathe, then begin (pre-session breathing exercise)
- **L** — Look: Read every word (forced double-read before seeing answers)
- **E** — Eliminate: Cross out wrong answers (must eliminate all wrong before selecting)
- **A** — Answer: Choose with confidence
- **R** — Review: Check before moving on

The app scores *technique* (did you read twice? highlight key words? eliminate wrong answers?) separately from correctness, and both are tracked over time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.9, Vite 7 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite` plugin, configured in `src/index.css` with `@theme`) |
| State | Zustand 5 with `persist` middleware (localStorage) |
| Routing | React Router 7 (imported as `react-router`) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Auth + DB | Supabase (PostgreSQL + Auth + Edge Functions + Storage) |
| Payments | Stripe Checkout (one-time, server-side session creation) |
| Email | Zoho SMTP via Deno `denomailer` in Edge Functions |
| Analytics | Vercel Analytics |
| Hosting | Vercel (SPA with rewrites in `vercel.json`) |
| PDF gen | jsPDF (for certificates) |
| IDs | nanoid |
| PWA | Service worker (`public/sw.js`, `public/register-sw.js`, `public/manifest.json`) |

**No Tailwind config file** — Tailwind 4 uses CSS-based configuration. Custom theme tokens (colours, fonts, spacing, border-radii) are defined in `src/index.css` under `@theme`.

---

## Architecture Overview

```
Single-page React app (Vite)
    |
    |-- Supabase Auth (email/password, magic link)
    |-- Supabase PostgreSQL (child_profiles, user_progress, daily_sessions, question_results, earned_badges, payments)
    |-- Supabase Edge Functions (Deno) for server-side logic
    |-- Stripe Checkout for payments
    |-- Vercel for hosting
```

**Parent/child model**: A parent creates a Supabase account (email + password). Under that account they create one or more **child profiles** (`child_profiles` table). Each child has their own progress, badges, and settings. The parent selects which child is "playing" via the ChildPickerPage.

**Offline-first with cloud sync**: All progress is stored in localStorage (Zustand `persist`) and synced to Supabase in the background. On load, the app fetches from Supabase and merges (whichever has more data wins). Failed syncs show a toast but don't block the user.

**Question flow is fully client-side**: Questions are bundled as static TypeScript arrays (~13,000 lines across 14 files). No API calls during practice. The `useQuestionFlow` hook manages a state machine: `READING_FIRST` -> `READING_SECOND` -> `NUMBER_EXTRACTION` (optional) -> `HIGHLIGHTING` -> `SHOWING_ANSWERS` -> `ELIMINATING` -> `SELECTING` -> `FEEDBACK` -> `COMPLETE`.

---

## Key Files & Folders

```
/
├── src/
│   ├── App.tsx                      # Router, route guards, lazy loading
│   ├── main.tsx                     # React entry point
│   ├── index.css                    # Tailwind 4 theme config (colours, fonts, radii)
│   ├── pages/                       # 23 page components (see below)
│   ├── components/
│   │   ├── layout/                  # AppShell, Header, BottomNav
│   │   ├── question/                # QuestionScreen, HighlightableText, AnswerOptions, StepBanner, QuestionFeedback
│   │   ├── mascot/                  # ProfessorHoot.tsx
│   │   ├── session/                 # PreSessionBreathing, SessionCompleteScreen
│   │   ├── onboarding/              # OnboardingFlow.tsx
│   │   ├── tutorial/                # GuidedTutorial.tsx (interactive CLEAR walkthrough)
│   │   ├── celebrations/            # ConfettiExplosion, XpPopup, MascotMessage
│   │   ├── landing/                 # 14 section components for the marketing page
│   │   ├── techniques/              # ChildTechniquesView, ParentTechniquesView, etc.
│   │   ├── home/                    # DailyChallengeCard, MockExamCard, ExamCountdown, SubjectFocusPicker
│   │   ├── settings/                # SoundToggle
│   │   ├── ErrorBoundary.tsx
│   │   ├── SyncToast.tsx            # Global toast for sync status
│   │   ├── BumpUpsell.tsx           # Crib sheet upsell
│   │   ├── FeedbackButton.tsx       # Floating feedback button
│   │   ├── ReferralModal.tsx
│   │   └── ReviewPrompt.tsx         # App Store review prompt
│   ├── stores/
│   │   ├── useAuthStore.ts          # Parent session, child profiles, child selection
│   │   ├── useProgressStore.ts      # All progress data, Supabase sync
│   │   ├── useDyslexiaStore.ts      # Per-child dyslexia mode toggle
│   │   └── useSettingsStore.ts      # Sound, exam date, techniques view mode
│   ├── hooks/
│   │   ├── useSupabaseAuth.ts       # Supabase auth listener, claim-payment on sign-in
│   │   ├── useCurrentUser.ts        # Reactive child profile selector
│   │   ├── usePaywall.ts            # Checks hasPaid flag (no free tier)
│   │   ├── useDailyQuestions.ts     # Selects questions by week/difficulty/subject
│   │   ├── useQuestionFlow.ts       # State machine for the question answering flow
│   │   ├── useDyslexiaMode.ts       # Convenience wrapper for dyslexia store
│   │   ├── useSoundEffects.ts
│   │   └── useTimer.ts
│   ├── data/
│   │   ├── questions/               # 14 .ts files, ~13,000 lines total
│   │   │   ├── index.ts             # Aggregates all into `allQuestions: Question[]`
│   │   │   ├── english.ts, new-english.ts, batch2-english.ts, batch3-english.ts
│   │   │   ├── maths.ts, new-maths.ts, batch2-maths.ts, batch3-maths.ts
│   │   │   ├── verbal-reasoning.ts, new-verbal-reasoning.ts, batch2-verbal-reasoning.ts
│   │   │   └── non-verbal-reasoning.ts, new-non-verbal-reasoning.ts, batch2-non-verbal-reasoning.ts
│   │   ├── programme/weeks.ts       # 12 WeekConfig objects (phases, difficulty, timers, distribution)
│   │   ├── badges.ts                # 18 badge definitions
│   │   ├── techniques.ts            # CORE_STEPS, SUBJECT_TECHNIQUES, TRICK_TYPES, research data
│   │   ├── visualisation-scripts.ts # Guided exam-day visualisation (text + audio)
│   │   ├── tutorialQuestion.ts      # Single hand-crafted tutorial question + step scripts
│   │   └── navItems.ts              # Bottom nav configuration (4 items)
│   ├── types/
│   │   ├── question.ts              # Subject ('english' | 'maths' | 'reasoning'), Difficulty, Question
│   │   ├── user.ts                  # User, AvatarConfig
│   │   ├── progress.ts              # UserProgress, DailySession, QuestionResult, StreakData, etc.
│   │   ├── badge.ts                 # BadgeDefinition, EarnedBadge
│   │   ├── technique.ts             # TechniqueScore
│   │   └── programme.ts             # WeekConfig, Phase, ScaffoldingLevel
│   ├── utils/
│   │   ├── scoring.ts               # calculateTechniqueScore, calculateXpFromResult
│   │   ├── numberWords.ts           # Detects number words in question tokens
│   │   └── dashboardAnalytics.ts
│   └── lib/
│       └── supabase.ts              # Supabase client init (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── supabase/
│   └── functions/
│       ├── _shared/rate-limit.ts    # In-memory sliding-window rate limiter (shared by all functions)
│       ├── create-checkout-session/  # Creates Stripe Checkout session (auth optional for guest checkout)
│       ├── stripe-webhook/           # Handles checkout.session.completed, sends confirmation + crib sheet emails
│       ├── claim-payment/            # Links guest checkout payments to newly created accounts
│       ├── send-welcome-email/       # Sends branded welcome email via Zoho SMTP
│       └── delete-account/           # Deletes user account + all data (CASCADE)
├── public/
│   ├── manifest.json                # PWA manifest
│   ├── sw.js, register-sw.js        # Service worker
│   ├── favicon.svg, favicon.png
│   ├── audio/                       # Pre-recorded visualisation audio
│   ├── icons/                       # PWA icons (SVG)
│   └── assets/
├── vercel.json                      # SPA rewrites + security headers (CSP, HSTS, X-Frame-Options)
├── vite.config.ts                   # Plugins, manual chunks, console.log stripping in prod
├── index.html                       # Fonts (Nunito + Inter), meta tags, PWA, OG tags
└── package.json
```

---

## Pages (23 total)

| Route | Page | Auth | Notes |
|---|---|---|---|
| `/` | LandingPage | Public | Marketing page, redirects logged-in users to /home |
| `/login` | LoginPage | Public | Email/password + password reset |
| `/signup` | SignupPage | Public | |
| `/checkout` | CheckoutPage | Public | Guest or authenticated checkout |
| `/payment-success` | PaymentSuccessPage | Public | Post-Stripe redirect |
| `/privacy-policy` | PrivacyPolicyPage | Public | |
| `/terms` | TermsPage | Public | |
| `/refunds` | RefundPolicyPage | Public | |
| `/research` | ResearchPage | Public | Evidence base for the method |
| `/contact` | ContactPage | Public | |
| `/select-child` | ChildPickerPage | Parent | Create/select child profiles |
| `/home` | HomePage | Parent+Child | Dashboard: streak, XP, week progress, daily challenge |
| `/practice` | PracticePage | Parent+Child | Main question flow (10 Qs per session) |
| `/badges` | BadgesPage | Parent+Child | Badge collection |
| `/visualise` | VisualisationPage | Parent+Child | Guided exam-day visualisation with audio |
| `/techniques` | TipsPage | Parent+Child | CLEAR Method reference (child/parent toggle) |
| `/daily-challenge` | DailyChallengePage | Parent+Child | Single bonus question per day |
| `/mock-exam` | MockExamPage | Parent+Child | Timed multi-subject mock |
| `/review-mistakes` | MistakeReviewPage | Parent+Child | Spaced repetition of wrong answers |
| `/parent-dashboard` | DashboardPage | Parent+Child | Analytics: technique breakdown, subject scores, session history |
| `/upgrade` | UpgradePage | Parent+Child | Payment CTA for unpaid users |
| `/settings` | SettingsPage | Parent+Child | Exam date, sound, dyslexia mode, delete account |
| `/certificate` | CertificatePage | Parent+Child | Downloadable PDF certificate (jsPDF) |

**Route guards** (in `App.tsx`):
- `PublicLandingRoute` — redirects authenticated users away from `/`
- `ParentProtectedRoute` — requires Supabase session, redirects to `/login`
- `ChildProtectedRoute` — requires a child profile to be selected, redirects to `/select-child`
- `ProgressSync` — fetches progress + badges from Supabase when a child is selected

Protected pages are wrapped in `AppShell` which provides `Header`, `BottomNav`, and `FeedbackButton`.

---

## State Management

Four Zustand stores, all using `persist` middleware (localStorage):

### `useAuthStore` (key: `rtq-auth`)
- `parentSession`: Supabase `Session` object (not persisted — Supabase handles session refresh)
- `children`: array of `User` objects (child profiles)
- `currentChildId`: which child is active
- Only `currentChildId` is persisted to localStorage; session comes from Supabase on load

### `useProgressStore` (key: `rtq-progress`)
- `progressByUser`: `Record<childId, UserProgress>` — all progress keyed by child
- `badgesByUser`: `Record<childId, EarnedBadge[]>`
- Every mutation syncs to Supabase in the background (fire-and-forget with error toast)
- On load, fetches from Supabase and merges: whichever has more `totalQuestionsAnswered` wins

### `useDyslexiaStore` (key: `rtq-dyslexia`)
- `enabledByChild`: `Record<childId, boolean>` — per-child toggle

### `useSettingsStore` (key: `rtq-settings`)
- `soundEnabled`, `examDate`, `techniquesViewMode` ('child' | 'parent')

---

## Payment Flow

**Model**: One-time payment of **£19.99** for lifetime access. No subscription. No free tier. Optional **£4.99 crib sheet** add-on (only at checkout). 7-day no-questions-asked refund guarantee (handled manually via Stripe).

**Guest checkout** is supported — users can pay before creating an account.

### Flow:
1. User lands on `/checkout` (from landing page CTA)
2. If logged in, the session token is sent. If not, they enter an email address.
3. Frontend calls `create-checkout-session` Edge Function, which creates a Stripe Checkout Session with `allow_promotion_codes: true`
4. User is redirected to Stripe-hosted checkout page
5. On success, Stripe redirects to `/payment-success`
6. Stripe sends `checkout.session.completed` webhook to `stripe-webhook` Edge Function, which:
   - Updates `payments` table status to 'completed'
   - If authenticated user: marks all their `child_profiles` as `has_paid = true`
   - Sends payment confirmation email via Zoho SMTP
   - If crib sheet was purchased: sends separate email with PDF attachment from Supabase Storage

### Guest payment claiming:
- `claim-payment` Edge Function links unclaimed payments to accounts by matching email
- Called automatically on sign-in (in `useSupabaseAuth`) and on child creation (in `ChildPickerPage`)
- This handles the race condition where the user pays as guest, then creates an account

### Paywall enforcement:
- `usePaywall` hook checks `currentUser.hasPaid`
- `needsPayment` is true when `hasPaid` is false
- Pages redirect to `/upgrade` when payment is needed

---

## Authentication Flow

- **Supabase Auth** with email + password
- `useSupabaseAuth` hook (mounted once in `App.tsx`):
  - Calls `getSession()` on mount to restore session
  - Listens to `onAuthStateChange` for sign-in/sign-out/recovery events
  - On `SIGNED_IN`, automatically calls `claim-payment` in background
  - On `PASSWORD_RECOVERY`, sets flag to prevent redirect away from login page
- `useRequireNoAuth` hook: used on login/signup pages to redirect already-authenticated users
- Password reset: detected via URL hash containing `type=recovery`

### Multi-child model:
1. Parent authenticates with Supabase (gets a session)
2. Parent goes to `/select-child` to create or select a child profile
3. `currentChildId` is set in `useAuthStore`
4. All subsequent data operations use `currentChildId` as the key

---

## Database (Supabase)

### Tables (inferred from code):
- **`child_profiles`**: `id`, `parent_id`, `name`, `avatar` (JSON), `programme_start_date`, `has_seen_onboarding`, `has_seen_tutorial`, `has_paid`, `referral_code`, `referred_by`, `created_at`
- **`user_progress`**: `child_id` (PK), `current_week`, `streak` (JSON), `total_questions_answered`, `total_correct`, `average_technique_score`, `subject_scores` (JSON), `level`, `xp`, `xp_to_next_level`, `mistake_queue` (JSON), `daily_challenge` (JSON), `mock_exams` (JSON), `updated_at`
- **`daily_sessions`**: `id`, `child_id`, `date`, `average_technique_score`, `average_correctness`, `total_time_ms`, `completed`, `created_at`
- **`question_results`**: `session_id`, `child_id`, `question_id`, `subject`, `correct`, `technique_score` (JSON), `reading_time_ms`, `total_time_ms`, `highlighted_word_indices`, `eliminated_option_indices`, `selected_option_index`, `timestamp`
- **`earned_badges`**: `child_id`, `badge_id` (composite PK), `earned_at`, `seen`
- **`payments`**: `stripe_checkout_session_id`, `stripe_payment_intent_id`, `parent_id`, `status`, `completed_at`, `include_crib_sheet`, `customer_email`

**RLS**: Row Level Security is enabled. The `stripe-webhook` function uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. User-facing operations use the user's JWT via the anon key.

**CASCADE**: `delete-account` relies on `ON DELETE CASCADE` foreign keys to clean up all child data when a parent account is deleted.

---

## Edge Functions

All deployed to Supabase. All use the shared `_shared/rate-limit.ts` (in-memory sliding-window per IP).

| Function | Rate Limit | Auth | Purpose |
|---|---|---|---|
| `create-checkout-session` | 10/min | Optional | Creates Stripe Checkout Session. Supports guest (email in body) or authenticated (JWT in header) |
| `stripe-webhook` | 100/min | Stripe sig | Handles `checkout.session.completed`. Marks payment complete, sends emails |
| `claim-payment` | 10/min | Required | Matches unclaimed payments by email, marks child profiles as paid |
| `send-welcome-email` | (has limit) | Required | Sends branded HTML welcome email via Zoho SMTP |
| `delete-account` | 3/min | Required | Uses service role key to delete user from Supabase Auth + all data |

**CORS**: All functions whitelist `answerthequestion.co.uk`, `www.answerthequestion.co.uk`, Vercel preview URLs (`*.vercel.app`), and `localhost:5173` when `ALLOW_LOCALHOST=true`.

**Secrets required**:
- `STRIPE_SECRET_KEY` (create-checkout-session, stripe-webhook)
- `STRIPE_WEBHOOK_SECRET` (stripe-webhook)
- `ZOHO_SMTP_PASSWORD` (stripe-webhook, send-welcome-email)
- `SUPABASE_SERVICE_ROLE_KEY` (delete-account, stripe-webhook — auto-available in Supabase functions)

---

## Question Bank

~13,000 lines of TypeScript across 14 files in `src/data/questions/`. Questions are statically bundled (code-split into a `questions` chunk via Vite manual chunks).

### Structure of a `Question`:
```typescript
{
  id: string;                    // e.g. "eng-comp-1"
  subject: 'english' | 'maths' | 'reasoning';
  difficulty: 1 | 2 | 3;        // Maps to programme phases
  questionText: string;
  questionTokens: string[];      // Tokenised for highlighting (includes spaces)
  keyWordIndices: number[];      // Indices into questionTokens that are key words
  options: AnswerOption[];       // 4-5 options, each with eliminationReason
  correctOptionIndex: number;
  explanation: string;
  category?: string;
  trickType?: string;            // e.g. 'number-format', 'reverse-logic', 'two-step'
}
```

### Subject model (important!):
Originally 4 subjects: english, maths, verbal-reasoning, non-verbal-reasoning. **Merged to 3** by combining VR + NVR into `reasoning`. The question files still use the old names (`verbal-reasoning.ts`, `non-verbal-reasoning.ts`) but the `Subject` type is `'english' | 'maths' | 'reasoning'`. The `useProgressStore` has migration logic (`migrateSubjectScores`) to merge old VR/NVR progress data.

### Question selection (`useDailyQuestions`):
- Selects 10 questions per session based on `WeekConfig` settings
- Distributes across subjects according to `subjectDistribution`
- Injects up to 2 mistake-review questions from the spaced repetition queue
- Prefers questions at the current difficulty level, falls back to easier
- Allows repeats if the pool is exhausted
- Supports subject focus mode (all questions from one subject)

---

## Curriculum & Week System

12 weeks split into 3 phases, defined in `src/data/programme/weeks.ts`:

| Phase | Weeks | Difficulty | Scaffolding | Time/Q | Daily Qs |
|---|---|---|---|---|---|
| Foundation | 1-4 | 1 | Heavy | 105-120s | 10 |
| Building | 5-8 | 2 | Medium | 75-95s | 10 |
| Exam Ready | 9-12 | 3 | Light | 55-70s | 10 |

**Week advancement**: Every 7 completed sessions = 1 week, capped at 12. Calculated in `saveSession`.

**Scaffolding levels** control:
- `heavy`: Full step-by-step prompts, number word extraction phase, generous timers
- `medium`: Shorter prompts, tighter timers
- `light`: Minimal prompts, near-exam-pace timers, number extraction skipped

Each week also has `minReadingTimeMs`, `minHighlights`, `minEliminations`, and `subjectDistribution`.

---

## Dyslexia-Friendly Mode

- Stored per-child in `useDyslexiaStore` (persisted to localStorage as `rtq-dyslexia`)
- Toggled in Settings page
- When enabled, applies dyslexia-friendly CSS (likely larger text, different font, increased spacing)
- Mentioned prominently on the landing page as a feature
- The `useDyslexiaMode` hook provides a simple `{ dyslexiaMode, toggleDyslexiaMode }` API scoped to the current child

---

## Technique Scoring

Defined in `src/utils/scoring.ts`. Every question gets a technique score (0-100%):

| Component | Weight | Criteria |
|---|---|---|
| Read Twice | 25% | readCount >= 2 |
| Reading Time | 15% | readingTimeMs >= weekConfig.minReadingTimeMs |
| Key Words | 30% | proportion of key words correctly highlighted |
| Elimination | 20% | eliminated all wrong answers correctly |
| Process Bonus | +10% | all steps used (read twice + eliminated + highlighted at least 1) |

XP: `techniquePercent * 0.5` (up to 50 XP) + 30 bonus for correct answer. Levels require 20% more XP each time (`xpToNextLevel * 1.2`).

---

## Gamification

- **XP + Levels**: Earned per question, level up with increasing thresholds
- **Streaks**: Current/longest streak, 3 freezes available, auto-detected from practice dates
- **Badges**: 18 definitions in `src/data/badges.ts` — technique, streak, subject mastery, and milestone categories. Synced to Supabase `earned_badges` table.
- **Daily Challenge**: One bonus question per day with separate streak tracking
- **Mock Exams**: Timed multi-subject tests, best score tracked
- **Mistake Queue**: Spaced repetition — wrong answers re-appear with doubling intervals (1, 2, 4, 8, 16 days). Removed at interval >= 16 (mastered).
- **Certificates**: Downloadable PDF generated client-side with jsPDF
- **Confetti + celebrations**: ConfettiExplosion, XpPopup, MascotMessage components

---

## What's Working

- Full question flow with all technique steps (read twice, highlight, number extraction, eliminate, select, feedback)
- 12-week progressive programme with 3 phases
- Stripe checkout (guest + authenticated) with webhook handling
- Guest payment claiming on account creation
- Supabase auth (email/password, password reset)
- Multi-child profiles under one parent account
- Progress sync to Supabase with offline-first localStorage
- Badges, XP, levels, streaks with spaced repetition mistake queue
- Parent dashboard with analytics
- Guided tutorial (interactive CLEAR Method walkthrough)
- Pre-session breathing exercise (box breathing 4-4-4-4)
- Exam-day visualisation with audio
- Dyslexia-friendly mode (per-child)
- PWA with service worker
- Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting on all Edge Functions
- Welcome + payment confirmation + crib sheet emails via Zoho SMTP
- Account deletion with CASCADE cleanup
- Referral code system (generated per child, tracked via `referred_by`)
- `console.log`/`console.debug`/`console.warn` stripped in production builds

---

## Known Issues / Incomplete

- The `gamification/` component directory is empty — gamification features are scattered across other components
- The `auth/`, `dashboard/`, `ui/` component directories are empty — functionality may be inline in pages
- The README is still the default Vite template
- Question files use old 4-subject naming convention (`verbal-reasoning.ts`, `non-verbal-reasoning.ts`) even though the type system uses 3 subjects. This is cosmetic but could confuse contributors.
- Sound effects hook exists (`useSoundEffects.ts`) but sound assets not visible in public directory
- The `visualisation/` component directory is empty — visualisation logic is likely inline in `VisualisationPage.tsx`
- No automated tests

---

## Security Audit Summary

**Good**:
- Strict CSP in `vercel.json` (no `unsafe-eval`, limited `connect-src` to Supabase/Stripe)
- HSTS with preload, X-Frame-Options DENY, X-Content-Type-Options nosniff
- Stripe webhook signature verification
- Rate limiting on all Edge Functions (sliding window per IP)
- Service role key only used server-side (delete-account, stripe-webhook)
- Redirect URL validation in checkout (must be trusted origin)
- `console.log`/`warn` stripped in production builds via Vite esbuild config
- `npm audit` runs as prebuild step
- CORS whitelist restricted to production domains + Vercel previews

**Notes**:
- Rate limiting is in-memory (resets on cold start) — adequate for burst protection but not persistent
- `.env`, `.env.local`, `.env.production` are in `.gitignore`
- Supabase anon key is exposed to the client (by design — RLS protects data)
- `unsafe-inline` is allowed for styles in CSP (needed for inline Tailwind + Google Fonts)

---

## Development Setup

### Prerequisites
- Node.js (compatible with Vite 7)
- Supabase project (for auth + database)
- Stripe account (for payments)

### Environment variables
Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:5173
npm run build        # TypeScript check + Vite build (strips console.log/warn)
npm run preview      # Preview production build locally
npm run lint         # ESLint
```

### Edge Functions
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy claim-payment
supabase functions deploy send-welcome-email
supabase functions deploy delete-account
```

Required secrets (set via `supabase secrets set`):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ZOHO_SMTP_PASSWORD`
- `ALLOW_LOCALHOST=true` (for local dev only)

---

## Deployment

- **Frontend**: Vercel (auto-deploys from Git). `vercel.json` handles SPA rewrites and security headers. Static assets get 1-year cache (`immutable`).
- **Edge Functions**: Deployed to Supabase separately via CLI.
- **Stripe Webhook**: Endpoint is the Supabase function URL. Must be configured in Stripe Dashboard to send `checkout.session.completed` events.
- **Domain**: `answerthequestion.co.uk` (Vercel)
- **Email**: `rebecca@answerthequestion.co.uk` via Zoho SMTP

---

## Key Decisions & Context

1. **No free tier**: Every user must pay £19.99. The `usePaywall` hook enforces this. There's no freemium model — the 7-day refund guarantee serves as the "try before you commit" mechanism.

2. **Guest checkout**: Users can pay before creating an account. The `claim-payment` function bridges the gap by matching payments to accounts by email. This reduces friction in the purchase funnel.

3. **Crib sheet upsell (£4.99)**: Available only at checkout as a bump offer. It's a printable PDF of the CLEAR Method steps, emailed as an attachment via the stripe-webhook function. Stored in Supabase Storage.

4. **3 subjects, merged from 4**: The original design had verbal-reasoning and non-verbal-reasoning as separate subjects. They were merged into `reasoning` for simplicity. Migration logic exists in `useProgressStore` to convert old data.

5. **Professor Hoot**: The owl mascot appears throughout — as `ProfessorHoot` component with moods (`happy`, `thinking`, `teaching`, `warning`, `celebrating`), in speech bubbles, in tutorials, in emails. It's a core part of the brand voice.

6. **Technique scoring over correctness**: The app deliberately weights *how* children answer (technique score) over *whether* they got it right. This is the pedagogical core — building exam habits.

7. **Offline-first**: Progress works without internet. Supabase sync is background, fire-and-forget. The merge strategy (more data wins) handles conflicts simply.

8. **Static question bank**: Questions are TypeScript files bundled at build time, not fetched from an API. This means questions can't be updated without a deploy, but it simplifies the architecture and ensures instant load.

9. **Forced technique steps**: Children cannot see answer options until they've read twice and highlighted key words. They cannot select the correct answer until they've eliminated all wrong answers. This enforces the CLEAR Method mechanically.

10. **12-week progressive scaffolding**: The programme gradually removes support (longer timers -> shorter, more prompts -> fewer, easier questions -> harder) so the technique becomes automatic by exam time.

11. **Multi-child support**: One parent account, multiple child profiles. Each child has independent progress, badges, and settings (including dyslexia mode).

12. **Fonts**: Nunito (display/headings, `font-display`) and Inter (body text, `font-body`). Loaded from Google Fonts with `preconnect`.

13. **Lazy loading**: Auth + landing pages are eagerly loaded. All post-login pages are lazy loaded via `React.lazy()` with a Professor Hoot spinner as fallback.

14. **Manual chunks**: Vite config splits the bundle into `react-vendor`, `framer`, and `questions` chunks for better caching.
