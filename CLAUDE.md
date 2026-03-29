# CLAUDE.md — AnswerTheQuestion (ATQ)
*Last updated: 29 March 2026*

---

## What This Project Is

AnswerTheQuestion teaches children to answer exam questions correctly — not by knowing more, but by reading more carefully. The entire product is built around one insight: most children lose marks not because they don't know the answer, but because they don't read the question properly.

The product is a 12-week web app for children preparing for the 11+ (UK grammar school entrance exam). It is in beta as of March 2026.

---

## The CLEAR Method — The Heart of Everything

Every question, every scaffold, every UI interaction must reinforce CLEAR. This is non-negotiable.

**C — Calm:** Take a breath before you start
**L — Look:** Read the whole question before looking at any answers
**E — Eliminate:** Cross out answers that are obviously wrong
**A — Answer:** What is the question ACTUALLY asking you?
**R — Review:** Read your answer back against the question before moving on

**Critical design rule:** Questions must require deduction — never give away the answer or method in the question text. Trap answers are essential. The product exists to teach children to slow down and avoid them. If a question can be answered by skim-reading, it fails.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand with persist middleware |
| Database | Supabase (project ID: ganlncdbebtnstgcewsd) |
| Payments | Stripe (£19.99 one-time, £4.99 bump) |
| Email | Resend |
| Deployment | Vercel |
| Fonts | Nunito (display), Inter (body) |
| Package manager | npm |
| Node | v22 (nvm) |

**GitHub:** imperial-design/readthequestion
**Domain:** answerthequestion.co.uk
**Vercel:** readthequestion.vercel.app

---

## Design Language

- Vibrant purple/pink gradient background
- Frosted glass UI panels
- Colourful gradient buttons
- Mascot: Professor Hoot (emoji+CSS owl — multiple moods and sizes)
- Child-friendly, fun, colourful — must work on mobile
- Never clinical or school-like in tone

---

## Programme Architecture

**Difficulty levels:**
- D1 — Year 4–5 (Foundation)
- D2 — Year 5–6 (Building)
- D3 — Exam Ready

**Scaffolding phases:**
- Weeks 1–4: Foundation (maximum scaffolding, CLEAR steps shown explicitly)
- Weeks 5–8: Building (scaffolding fades, child internalises method)
- Weeks 9–12: Exam Ready (exam conditions, minimal scaffolding)

**Timer:** Generous early, tightens gradually across the 12 weeks. Never punishing — encouraging.

---

## Pricing and Codes

- **Main product:** £19.99 one-time
- **Checkout bump:** £4.99 — CLEAR Method Crib Sheet (printable PDF, Professor Hoot branded)
- **Beta code:** `BETA100` — 100% off
- **Launch code:** `WELCOME10` — 10% off

---

## Current Status (March 2026)

- ✅ Stripe payment flow live
- ✅ Resend email confirmation live
- ✅ Security audit: 22/22 clean
- ✅ First beta user onboarded
- ⚠️ Email confirmation **currently disabled** in Supabase — must re-enable before public launch (Auth → Settings → toggle on)
- ⚠️ GitHub backup cron has had errors — verify push works before relying on it

---

## Development Rules

**Security (non-negotiable):**
- NEVER store secrets in code or config files
- NEVER commit API keys, tokens, or credentials
- Use `.env` files (gitignored) for all secrets
- Add `.env` to `.gitignore` before first commit — always

**Code:**
- TypeScript always — no plain JavaScript
- Strict mode on — unused variables are errors
- Keep components focused and composable
- Supabase schema changes: always check RLS policies

**Sessions:**
- New session for each distinct task
- Use `/compact` proactively when context gets long
- Initialise git before starting any new project

**Environment:**
- macOS (Darwin, Apple Silicon M4)
- Node v22 via nvm
- Homebrew for system packages
- Path: `/opt/homebrew/opt/node@22/bin`

---

## How to Work on This Project

**Think bigger:** Don't just fix what was asked. If you notice something broken, flag it. If there's an obvious next step, offer it. If the same bug pattern exists elsewhere in the codebase, say so.

**Planning mode:** For any task touching multiple files, affecting production, or with non-obvious consequences — surface a plan first and wait for go-ahead before executing.

**Task endings:** After significant work, close with:
- Next actions available right now (specific, not vague)
- Anything flagged while working (bugs, security issues, design inconsistencies)
- What to test before shipping

**Proactivity:** See a security issue → always flag it, never ignore. See a pattern that should be abstracted → say so. See something that will break at scale → note it even if it's not today's problem.

---

## What This Project Is Not

### Tables (inferred from code):
- **`child_profiles`**: `id`, `parent_id`, `name`, `avatar` (JSON), `programme_start_date`, `has_seen_onboarding`, `has_seen_tutorial`, `has_paid`, `referral_code`, `referred_by`, `exam_date` (TEXT, nullable), `created_at`
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
| `stripe-webhook` | 100/min | Stripe sig | Handles `checkout.session.completed`. Marks payment complete, sends emails (fire-and-forget) |
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

XP: `techniquePercent × 0.8 + 20 (correct)` — technique drives 80 XP (max), correctness adds 20. Maximum is 100 XP. Levels require 20% more XP each time (`xpToNextLevel * 1.2`).

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

- Full question flow with all 8 technique steps (read twice, highlight, number extraction, eliminate, select, **review**, feedback, complete) — CLEAR Method now fully mechanically enforced
- `REVIEWING` state in `useQuestionFlow`: after selecting answer, child sees their chosen answer and reads question one last time before confirming; can change answer if they spot a mistake
- Tutorial elimination step is **interactive**: child taps each wrong answer themselves, Professor Hoot explains the reason for each elimination in real time; auto-advances when all eliminated
- Tutorial has R — Review step (before celebration) demonstrating the review habit
- 12-week progressive programme with 3 phases
- Stripe checkout (guest + authenticated) with webhook handling
- Guest payment claiming on account creation
- Supabase auth (email/password, password reset)
- Multi-child profiles under one parent account
- Progress sync to Supabase with offline-first localStorage
- Badges, XP, levels, streaks with spaced repetition mistake queue
- Parent dashboard with analytics
- Pre-session breathing exercise (box breathing 4-4-4-4) — fully redesigned with fuchsia/pink/indigo/blue palette, phase-specific colours, animated background orbs, twinkling stars, triple-layer breathing circle
- Exam-day visualisation with audio
- Dyslexia-friendly mode (per-child)
- PWA with service worker
- Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting on all Edge Functions
- Welcome + payment confirmation + crib sheet emails via Zoho SMTP
- Account deletion with CASCADE cleanup
- Referral code system (generated per child, tracked via `referred_by`)
- `console.log`/`console.debug`/`console.warn`/`console.error` stripped in production builds (all four in Vite esbuild `pure` array)
- Stripe webhook with manual HMAC-SHA256 verification (Deno-compatible)
- Fire-and-forget email pattern in webhook to avoid CPU timeout
- Resend confirmation email on both Login and Signup pages
- Guest checkout → claim-payment → paywall clearing end-to-end flow
- Stripe promotion codes (ATQBETA100 for 100% off, ATQWELCOME10 for 10% off) configured in Stripe Dashboard
- Dashboard styled with violet-fuchsia gradient colour scheme
- Technique feedback shows amber indicators for partial scores (50-79%), not just green/red
- Number-to-figure extraction restricted to maths questions only (prevents false positives like "odd one out")
- batch3-english keyWordIndices fixed to mark passage content words, not just question stems
- `npm audit fix` runs automatically as postbuild step
- Security documentation: secret rotation policy, backup/restore procedures, environment separation guide, guest checkout auth rationale (all in `docs/security/`)
- Paywall enforced server-side only — no localStorage bypass (`usePaywall.ts` sources `hasPaid` exclusively from Supabase-fetched child profiles; secondary `atq_has_paid_<id>` localStorage fallback removed from ChildPickerPage)
- Security audit score: **22/22 (2 N/A) — SHIP**
- DANGER_WORDS restricted to genuinely exam-critical words (removed over-broad: 'at', 'each', 'more', 'less', 'before', 'after', 'between', 'until')
- "Session Complete!" (was "Quest Complete!" — brand language fix)
- Phase 2 correctly labelled "Building" everywhere (was "Improvers" on HomePage journey tracker)
- "Today's Session Complete" card no longer links to /practice (removed accidental re-trigger)
- Vertical spacing tightened across all pages (AppShell pt-4→pt-2, BadgesPage/SettingsPage/SessionCompleteScreen/PracticePage)
- Onboarding has timing progression slide: Week 1 = 20 min, Week 6 = 15 min, Week 12 = 9 min (framed positively)
- ChildTechniquesView restructured: confusing "5 Habits" + "5 Steps" dual-section replaced with single CLEAR Method™ hero using C/L/E/A/R gradient letter buttons and full step detail on tap; `CLEAR_STEPS` array added to `techniques.ts`
- C (Calm) step in techniques view explicitly links breathing exercise to CLEAR Method; "Start a session" CTA connects the two
- Onboarding "A Note for Parents" slide moved from position 7 to position 2 (immediately after Welcome) — parents see it before their child advances
- XP formula rebalanced: `techniquePercent × 0.8 + 20 (correct)` — technique now drives 80% of XP, reinforcing method over answer-guessing (max 100 XP unchanged)
- **Fast Track mode fully implemented**: `useWeekConfig` hook wired into PracticePage, MockExamPage, DailyChallengePage, DashboardPage, and HomePage — replaces all inline `programmeWeeks[Math.min(currentWeek-1, 11)]` lookups. Fast Track badge (⚡) shown in PracticePage week note and DashboardPage week display
- Mock exam unlock is proportional: `Math.ceil(totalWeeks / 2)` — adapts automatically for fast-track timelines
- Certificate gate uses `progress.currentWeek > totalWeeks` (was hardcoded `> 12`) so it works correctly in Fast Track
- Exam date persisted per-child to Supabase (`child_profiles.exam_date`) and kept in sync with `useSettingsStore.examDate` via `useEffect` in HomePage on child change
- Crib sheet download (HomePage) switched from `getPublicUrl` to `createSignedUrl(120s)` — Supabase `assets` bucket is now private
- `stripe-webhook` Edge Function uses `createSignedUrl(60s)` when emailing the crib sheet PDF attachment
- Security fix: removed `localStorage.getItem('atq_has_paid_<childId>')` fallback from ChildPickerPage — `hasPaid` now sourced exclusively from `p.has_paid` (Supabase). This closes a client-side paywall bypass
- Landing page Fast Track messaging added: JourneySection callout box (amber/orange), PricingSection feature list item (⚡), FaqSection accordion item ("What if my child's exam is only a few weeks away?")

---

## Known Issues / Incomplete

- The `gamification/` component directory is empty — gamification features are scattered across other components
- The `auth/`, `dashboard/`, `ui/` component directories are empty — functionality may be inline in pages
- Question files use old 4-subject naming convention (`verbal-reasoning.ts`, `non-verbal-reasoning.ts`) even though the type system uses 3 subjects. This is cosmetic but could confuse contributors.
- Sound effects hook exists (`useSoundEffects.ts`) but sound assets not visible in public directory
- The `visualisation/` component directory is empty — visualisation logic is likely inline in `VisualisationPage.tsx`
- **Supabase Auth confirmation emails** may not arrive reliably — a "Resend confirmation email" button exists on both Login and Signup pages as a workaround
- **Payment confirmation emails** can fail due to Supabase Edge Function CPU time limits when sending via Zoho SMTP — mitigated by fire-and-forget pattern but SMTP itself may be too slow
- **UpgradePage** still references "VR & NVR" instead of merged "Reasoning" subject

---

## Security Audit Summary

**Score: 22/22 (2 rules N/A — no AI APIs, no file uploads) — SHIP**

**Passing**:
- Supabase Auth with default session lifetime (<7 days) + refresh token rotation
- All API keys via env vars (`import.meta.env` / `Deno.env.get`), never hardcoded
- Strict CSP in `vercel.json` (no `unsafe-eval`, limited `connect-src` to Supabase/Stripe)
- HSTS with preload, X-Frame-Options DENY, X-Content-Type-Options nosniff
- Stripe webhook signature verification (manual HMAC-SHA256 via Web Crypto API)
- Rate limiting on all Edge Functions (sliding window per IP)
- Service role key only used server-side (delete-account, stripe-webhook)
- Redirect URL validation in checkout (must be trusted origin)
- `console.log`/`warn`/`debug`/`error` stripped in production builds via Vite esbuild config
- `npm audit` runs as prebuild step; `npm audit fix` runs as postbuild step
- CORS whitelist restricted to production domains + Vercel previews
- Paywall enforced server-side only — no localStorage bypass
- Parameterized queries throughout (Supabase JS client, no raw SQL)
- Row-Level Security enabled on all tables
- GDPR-compliant hard delete (CASCADE) for account deletion
- Critical actions logged (account deletion, payment completion, payment claiming)
- Documented secret rotation policy (90-day schedule in `docs/security/secret-rotation.md`)
- Documented backup/restore procedures (`docs/security/backup-restore.md`)
- Documented environment separation guide (`docs/security/environment-separation.md`)
- Guest checkout auth exception documented with rationale (`docs/security/guest-checkout-auth.md`)

**Advisory (non-blocking)**:
- Rate limiting is in-memory (resets on cold start) — adequate for current scale
- `.env`, `.env.local`, `.env.production` are in `.gitignore`
- Supabase anon key is exposed to the client (by design — RLS protects data)
- `unsafe-inline` is allowed for styles in CSP (needed for inline Tailwind + Google Fonts)
- Secret rotation dates need to be filled in and calendar reminders set
- Environment separation guide exists but may not be fully implemented yet (single Supabase project)
- Quarterly backup restore test should be scheduled

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

15. **Stripe SDK incompatibility in Deno**: The `stripe-webhook` Edge Function cannot use `stripe.webhooks.constructEvent()` or `constructEventAsync()` — they fail with `Deno.core.runMicrotasks` errors. Webhook signature verification is implemented manually using Web Crypto API HMAC-SHA256. Do not attempt to revert to the SDK method.

16. **Fire-and-forget emails in Edge Functions**: Email sending (Zoho SMTP via `denomailer`) exceeds Supabase Edge Function CPU time limits if done synchronously. The webhook returns 200 to Stripe immediately after DB updates, then sends emails in a non-blocking `try/catch` block. Uses `EdgeRuntime.waitUntil` if available.

17. **`has_paid` column**: Was missing from `child_profiles` table initially — had to be added via `ALTER TABLE`. All payment-related updates were silently failing without it. If setting up a fresh Supabase instance, ensure this column exists: `ALTER TABLE child_profiles ADD COLUMN has_paid boolean DEFAULT false;`

18. **Dashboard colour scheme**: Uses a violet-fuchsia gradient palette. Stats row: `bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30`. Exam countdown: fuchsia-pink gradient (`from-fuchsia-400 to-pink-600`). 12-week journey: more transparent fuchsia (`from-fuchsia-500/50 via-fuchsia-500/40 to-fuchsia-600/35`). The user specifically dislikes solid indigo/purple and plain white for dashboard cards.

19. **Stripe promo codes**: `create-checkout-session` passes `allow_promotion_codes: true`. Do NOT pass `customer_email` to Stripe when promo codes are enabled — it causes a Stripe error. Instead, use `customer_creation: 'always'` or collect email via Stripe's built-in form. Billing address is required (`billing_address_collection: 'required'`) to avoid empty customer name errors.

20. **Paywall persistence fix**: `useAuthStore` persists `children` array (including `hasPaid` flag) to localStorage, not just `currentChildId`. This prevents a login loop where the paywall check runs before Supabase fetches child profiles.

21. **Paywall is server-side only**: `usePaywall.ts` sources `hasPaid` exclusively from the Supabase-fetched child profile. No localStorage fallback — this prevents client-side bypass. The comment in the file explicitly warns against re-adding a localStorage check.

22. **Technique feedback amber indicators**: `QuestionFeedback.tsx` shows three colours for technique rows: green (≥80%), amber/yellow (50-79%), red (<50%). This gives children nuanced feedback — partial credit for effort rather than binary pass/fail. The overall technique percentage also uses amber text colour when in the 50-79% range.

23. **Number extraction is maths-only**: The `useQuestionFlow.ts` state machine skips the `NUMBER_EXTRACTION` step for English and Reasoning questions. This prevents false positives where words like "one" in "odd one out" or "first" in "first person" would be flagged for conversion to figures.

24. **Key word quality in question bank**: The `keyWordIndices` arrays in question files should mark ~60-70% passage content words (nouns, verbs, figurative language, key facts) and ~30-40% question focus words. The original batch3-english questions only marked question-stem words (e.g. "Which sentence best summarises") which meant children couldn't score well even when highlighting correctly. Fixed in March 2026 — other question files may need similar review.

25. **Zoho email delivery**: Emails sent from `rebecca@answerthequestion.co.uk` may fail to deliver to `@answerthequestion.co.uk` addresses if MX records don't resolve correctly. Check MX records point to `mx.zoho.eu`, `mx2.zoho.eu`, `mx3.zoho.eu`. Emails to external addresses (Gmail, Outlook) work fine.

26. **Security documentation**: Security policies live in `docs/security/`: `secret-rotation.md` (90-day rotation schedule), `backup-restore.md` (Supabase backup + quarterly restore testing), `environment-separation.md` (separate dev/prod Supabase projects + Stripe test/live keys), `guest-checkout-auth.md` (rationale for unauthenticated checkout endpoint with mitigations).

27. **R — Review step in question flow**: `useQuestionFlow` has a `REVIEWING` state between `SELECTING` and `FEEDBACK`. `startReview()` transitions SELECTING→REVIEWING; `cancelReview()` returns to SELECTING (clears selectedAnswer so child re-taps). `confirmAnswer()` works from both SELECTING and REVIEWING states. The timer timeout force-confirms from any non-FEEDBACK/COMPLETE state (including REVIEWING). StepBanner shows step 7 "R — REVIEW YOUR ANSWER" in teal. The review UI shows the selected answer text in a teal card with "Read one more time — does this make sense?" and two buttons: confirm or change.

28. **Interactive tutorial elimination**: The `show-answers` tutorial step has `interactive: true` in TUTORIAL_STEPS. `GuidedTutorial.tsx` detects this flag and renders each answer as a tappable button. Tapping a wrong answer adds it to `userEliminated[]` state, triggers a `setEliminationFeedback` with the `eliminationReason` from the option, and Professor Hoot's message changes to show the reason. When the last wrong answer is eliminated, Professor Hoot celebrates and the step auto-advances after 1.8 seconds. The correct answer is shown grayed out with "?" during elimination. No Next button is shown during interactive elimination.

29. **Breathing page visual design**: `PreSessionBreathing.tsx` uses a fuchsia/pink/indigo/blue theme. Background: `linear-gradient(160deg, #1e1b4b → #4c1d95 → #7c3aed → #c026d3 → #db2777 → #be123c)`. Four animated background orbs with independent pulse durations/delays. Six twinkling star dots. Triple-layer breathing circle (ambient glow, halo ring, main circle with shimmer). **Circle colour cycling**: All three circle layers use a single blue base gradient (`rgba(59,130,246,...)`) — a Framer Motion `hue-rotate(0° → 105° → 0°)` animation on a wrapper `motion.div` continuously cycles the colours: blue → indigo → fuchsia → pink → blue over 16 seconds (8s forward, 8s back). Phase label is always `text-white`. **Do NOT add phase-specific colours** — the hue-rotate wrapper handles all colour variation. The `VisualisationPage` box-breathing mode uses the same approach (same dark full-screen overlay, same hue-rotate cycling on the circle). Both `VisualisationPlayer` breathing circles and `BoxBreathingExercise` use the same `hue-rotate(0deg → 105deg → 0deg)` pattern. "I'm Ready!" button has a purple→pink→orange gradient with glowing box-shadow. Cycle progress shown as expanding pills.

30. **CLEAR Method™ as single source of truth in techniques view**: `ChildTechniquesView` previously showed "5 Habits" (from `CORE_HABITS`) and "The 5 Steps" (from `CORE_STEPS`) as two separate sections — the same concepts presented twice in slightly different ways, which confused children. Both sections replaced with a single **CLEAR Method™** section using the new `CLEAR_STEPS` array in `techniques.ts`. `CLEAR_STEPS` maps directly to C/L/E/A/R with `gradient` and `textColour` fields for visual styling. The C step has `linkToBreathing: true` which renders a CTA linking to `/practice` (where the breathing exercise runs).

31. **Parent onboarding note placement**: The "A Note for Parents" slide must appear as slide 2 (index 1) in `OnboardingFlow.tsx`, immediately after Welcome, before any CLEAR Method content. This ensures parents see the co-watching guidance before their child has advanced. If the note appears late (e.g. after the CLEAR Method slides), parents miss it — the child will have already clicked through before the parent reads it.

32. **XP formula rationale**: `calculateXpFromResult` uses `techniquePercent × 0.8 + 20 (correct)` so technique drives 80 XP and correctness adds 20. Previously `× 0.5 + 30` gave too much weight to answer correctness (37.5% of max XP), creating an incentive to guess quickly rather than use the method. Now technique is 80% of maximum XP. The total maximum is unchanged at 100 XP (80 + 20).

33. **Fast Track mode**: When a child has fewer than 12 full weeks until their exam date, the app automatically uses Fast Track mode. Logic in `src/data/programme/fast-track.ts`: `isFastTrack()` checks whether `getWeeksUntilExam()` < 12; `getFastTrackWeekConfig()` proportionally maps `currentWeek` → `programmeWeeks[0..11]` using `Math.round(progress * 11)`. Week 1 always maps to standard week 1 (gentle start), last week always maps to standard week 12 (exam pace). Special case: 1-week fast track maps to week 7 config (85s, medium, difficulty 2) rather than jump straight to exam pace on day 1.

34. **`useWeekConfig` hook**: Single integration point — replaces ALL inline `programmeWeeks[Math.min(currentWeek-1, 11)]` lookups. Returns `{ weekConfig, isFastTrack, totalWeeks, currentWeek }`. Used in PracticePage, MockExamPage, DailyChallengePage, DashboardPage, HomePage. Do NOT add new inline `programmeWeeks[...]` lookups — always use this hook.

35. **Exam date is per-child, not global**: `exam_date` lives in `child_profiles` table (TEXT, nullable). Exposed as `examDate?: string | null` on the `User` interface. `useWeekConfig` reads it via `currentUser?.examDate`. `HomePage.handleSetExamDate` persists changes to Supabase and local auth store simultaneously. The global `useSettingsStore.examDate` is kept in sync via a `useEffect` in `HomePage` that copies `currentUser.examDate` into the store on child load (so `ExamCountdown` can use it). **Supabase migration required**: `ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS exam_date TEXT;` — must be run manually before deploying.

36. **Mock exam unlock in Fast Track**: `MockExamPage` unlocks at `Math.ceil(totalWeeks / 2)`. Standard: week 6 of 12. Fast Track 3-week: week 2. Fast Track 6-week: week 3. This ensures the unlock is proportional — children aren't locked out of mock exams for their entire fast-track programme.

37. **Crib sheet PDF is private — always use signed URLs**: The `assets` Supabase Storage bucket is private. Do NOT use `getPublicUrl` for the crib sheet. The stripe-webhook Edge Function fetches a 60-second signed URL (`createSignedUrl(60)`) when attaching the PDF to the confirmation email. The HomePage download button uses a 120-second signed URL (`createSignedUrl(120)`). If the `assets` bucket is ever accidentally made public, rotate the signed URL approach or restrict the bucket again immediately.
