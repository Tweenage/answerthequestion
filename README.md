# AnswerTheQuestion (ATQ)

A 12-week web app for children preparing for the UK 11+ exam. It teaches exam technique — specifically, how to read questions carefully — rather than subject knowledge. The core pedagogical insight: most children lose marks because they don't read the question properly, not because they don't know the answer.

Live at [answerthequestion.co.uk](https://answerthequestion.co.uk)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand with persist middleware |
| Database / Auth | Supabase |
| Payments | Stripe (£19.99 one-time) |
| Email | Zoho SMTP via Supabase Edge Functions |
| Deployment | Vercel (frontend) + Supabase (edge functions) |

---

## Getting Started

### Prerequisites

- Node.js v22 (via nvm)
- A Supabase project
- A Stripe account (for payment flows)

### Environment setup

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server on http://localhost:5173
npm run build     # TypeScript check + Vite build (strips console.* in output)
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

---

## Architecture Overview

### The CLEAR Method

Every interaction in the app enforces the CLEAR Method:

- **C — Calm:** Breathing exercise before each session
- **L — Look:** Must read the full question before seeing answer options
- **E — Eliminate:** Must tap and eliminate all wrong answers before selecting the correct one
- **A — Answer:** Focuses the child on what the question is actually asking
- **R — Review:** After selecting, child re-reads the question before confirming

These steps are mechanically enforced — children cannot skip them. Technique scoring (0–100%) rewards correct process, not just correct answers, and drives 80% of XP earned.

### 12-Week Programme

Three phases defined in `src/data/programme/weeks.ts`:

| Phase | Weeks | Difficulty | Scaffolding | Timer/Q |
|---|---|---|---|---|
| Foundation | 1–4 | D1 | Heavy | 105–120s |
| Building | 5–8 | D2 | Medium | 75–95s |
| Exam Ready | 9–12 | D3 | Light | 55–70s |

Week advancement: every 7 completed sessions = +1 week, capped at 12.

Fast Track mode activates automatically when fewer than 12 weeks remain until a child's exam date — it proportionally maps the current week to the standard 12-week config so the programme fits the available time.

Use the `useWeekConfig` hook (not inline `programmeWeeks[...]` lookups) to get the current week configuration anywhere in the app.

### Question Bank

~13,000 lines of TypeScript across 14 files in `src/data/questions/`. Questions are statically bundled at build time (Vite manual chunk: `questions`). There is no question API — updating questions requires a redeploy.

Each question includes `questionTokens` (for keyword highlighting), `keyWordIndices`, `options` with `eliminationReason` per option, and `trickType` for trap-answer classification.

Subjects: `english | maths | reasoning` (verbal and non-verbal reasoning were merged into `reasoning`; the source files retain the old names).

### Supabase Edge Functions

All functions include in-memory sliding-window rate limiting per IP.

| Function | Purpose |
|---|---|
| `create-checkout-session` | Creates Stripe Checkout Session (guest or authenticated) |
| `stripe-webhook` | Handles `checkout.session.completed`, marks payment, sends emails |
| `claim-payment` | Matches unclaimed guest payments to newly-created accounts by email |
| `send-welcome-email` | Sends branded welcome email via Zoho SMTP |
| `delete-account` | Hard-deletes user + all child data (CASCADE) |

Required secrets (set via `supabase secrets set`):

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
ZOHO_SMTP_PASSWORD
ALLOW_LOCALHOST=true   # local dev only
```

Deploy:

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy claim-payment
supabase functions deploy send-welcome-email
supabase functions deploy delete-account
```

### Database Schema (key tables)

- `child_profiles` — per-child settings, `has_paid`, `exam_date`
- `user_progress` — XP, levels, streaks, subject scores, mistake queue
- `daily_sessions` — per-session aggregate scores
- `question_results` — per-question technique data (highlights, eliminations, timing)
- `earned_badges` — badge unlock history
- `payments` — Stripe payment records

Row Level Security is enabled on all tables. The `stripe-webhook` and `delete-account` functions use the service role key server-side to bypass RLS where required.

---

## Deployment

### Frontend (Vercel)

Auto-deploys from the `main` branch. `vercel.json` handles SPA rewrites and security headers (CSP, HSTS, X-Frame-Options). Static assets are cached with `immutable` headers.

### Edge Functions (Supabase)

Deployed separately via the Supabase CLI. The Stripe webhook endpoint is the deployed `stripe-webhook` function URL — configure it in the Stripe Dashboard to receive `checkout.session.completed` events.

---

## Key Design Decisions

**Technique scoring over correctness.** XP = `techniquePercent × 0.8 + 20` (if correct). Technique drives 80% of XP, correctness 20%. This makes skipping the method less rewarding than using it.

**Static question bank.** Questions are TypeScript files bundled at build time. No API, no CMS. Simple, fast, and works offline. The trade-off is that question updates require a deploy.

**Offline-first.** Progress is stored in localStorage (Zustand persist). Supabase sync is fire-and-forget in the background. Merge strategy: more data wins.

**No free tier.** Every user pays £19.99 before accessing practice. The paywall is enforced server-side via Supabase — `usePaywall.ts` reads `has_paid` exclusively from the fetched child profile, not localStorage.

**Guest checkout.** Users can pay before creating an account. The `claim-payment` edge function matches payments to accounts by email when the account is created.

**Stripe webhook verification.** The `stripe-webhook` function uses manual HMAC-SHA256 via the Web Crypto API. The Stripe SDK's `constructEvent` / `constructEventAsync` methods fail in the Deno runtime — do not revert to those.

**Multi-child support.** One parent account, multiple child profiles. Each child has independent progress, dyslexia mode setting, exam date, and badge history.
