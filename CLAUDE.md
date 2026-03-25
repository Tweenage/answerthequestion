# CLAUDE.md — AnswerTheQuestion (ATQ)
*Last updated: 25 March 2026*

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

- Not a tutoring service — it teaches technique, not subject knowledge
- Not a question bank — the method is the product, questions serve the method
- Not for all exams — specifically GL Assessment (Medway, Kent, and other grammar school regions)
- Not complex to use — a child should be able to navigate it independently within 2 minutes
