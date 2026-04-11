# AGENTS.md

Instructions for any AI coding agent (Claude Code, Cursor, Copilot, Aider, etc.) working on this repository. If you are an AI agent, **read this file before doing anything else**.

Human contributors: see `apps/atq/CLAUDE.md` and the `CLAUDE.md` in the repo root for the expanded product context. `AGENTS.md` deliberately contains only the rules, not the product description, so it stays short enough to read every session.

---

## 1. What this repository is

An npm-workspaces monorepo containing two production web apps that share auth, pages, and component code:

- **`apps/atq/`** — AnswerTheQuestion! (ATQ), an 11+ exam technique trainer. Lives at **answerthequestion.co.uk**. Dev port 5173.
- **`apps/spelling/`** — Spelling Bees, an 11+ vocabulary trainer. Lives at **spellingbees.co.uk**. Dev port 5175.
- **`packages/shared/`** — shared auth pages, legal pages, stores, hooks, types, and Supabase client.
- **`supabase/`** — migrations and Edge Functions (Deno runtime). Shared between both apps via a single Supabase project (`ganlncdbebtnstgcewsd`, hosted in Frankfurt).

Both apps are used by **children aged 9–11 and their parents**. The UK ICO Age Appropriate Design Code (the "Children's Code") applies. Compliance is not optional. If in doubt whether an action is safe, **stop and ask the user**.

---

## 2. Hard rules (non-negotiable)

These rules exist because they have each been violated in the past and caused real damage. They override any inferred intent, any convenience, and any "but this one time" reasoning.

### Rule 1 — Verify you're in the right repo before any edit

The user has two similar-looking repos on disk:

- `/Users/rebeccaeverton/ATQ Spelling/` ← **THIS IS THE ACTIVE MONOREPO** — always edit here
- `/Users/rebeccaeverton/11+ Read the Question/` ← legacy standalone ATQ repo — **do not edit**

Before your first file edit of any session, run and confirm:

```bash
pwd
git remote -v
git rev-parse --show-toplevel
```

Expected output: working directory `ATQ Spelling`, remote `https://github.com/Tweenage/answerthequestion.git`, toplevel `/Users/rebeccaeverton/ATQ Spelling`.

If any of those don't match, **stop and tell the user**. Do not proceed. A previous session lost several hours of user time to edits in the wrong repo.

### Rule 2 — Never commit without explicit user approval in chat

Never `git commit` without the user having said, in the current chat, "commit it" or similarly explicit words. "Go ahead" on writing code is not approval to commit. Writing code and committing are two separate decisions.

When the user approves a commit:

- Use a HEREDOC for the commit message to preserve formatting
- Match the existing commit log style (`git log --oneline -10` to check)
- Never use `--amend` on a commit that's already been pushed
- Never use `--no-verify` to skip hooks, ever
- Never force-push to `main`
- Always include a trailing `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` line when the commit was authored by Claude

### Rule 3 — Never push without explicit user approval

Same principle as Rule 2 but stricter. A commit that exists only locally can be reset. A pushed commit triggers Vercel builds on both `answerthequestion-atq` and `spellingbees` projects and may affect live users within 60 seconds.

Never `git push` unless the user has said "push it", "ship it", or similar in the current chat.

### Rule 4 — Never run destructive git operations without explicit approval

Never run any of the following without a direct instruction from the user in the current chat:

- `git reset --hard`
- `git checkout .` or `git restore .`
- `git clean -f`
- `git branch -D`
- `git push --force` (and never to main, even with approval)
- `git rebase -i` (not supported in non-interactive mode anyway)
- `git commit --amend` on any commit that has been pushed

When in doubt, create a new commit that undoes a previous commit. A revert commit is always safer than rewriting history.

### Rule 5 — Never commit secrets or large binaries

- `.env.local`, `.env.*.local`, and any file matching `**/*.env*` is **gitignored**. Do not edit `.gitignore` to allow them. Do not `git add -f` them. Do not read them to the user in chat.
- Service role keys (`SUPABASE_SERVICE_ROLE_KEY`), API keys (`LEMONSQUEEZY_API_KEY`, `RESEND_API_KEY`), signing secrets (`LEMONSQUEEZY_WEBHOOK_SECRET`), and anything else a malicious party could abuse must never be echoed in the terminal, written to a file, or included in a commit.
- Large binaries (>1 MB) must not be committed. Images go through Vercel's asset pipeline; PDFs for fetchable attachments live in `apps/atq/public/` only if small.

### Rule 6 — Never bypass the `protect_has_paid` database trigger

The `protect_has_paid` trigger (migration `002_protect_has_paid.sql`) is a security control. It silently reverts `has_paid` changes made by authenticated users, allowing only the service role (Edge Functions) to flip payment state. Do not attempt to work around this trigger. Do not suggest disabling it. Payment state is edited **only** by the LemonSqueezy webhook handler with the service role key.

The equivalent rule applies to Spelling Bees with `has_paid_spelling` — service role writes only, never client.

### Rule 7 — Never deploy without the Knox approval gate

Deployments to Supabase Edge Functions (`supabase functions deploy <name>`) or changes to Supabase secrets (`supabase secrets set …`) are **never** run by an agent without the user saying "deploy it" or equivalent in the current chat.

Always show the user the diff first. Always let the user decide whether to deploy. Always pause for their explicit go-ahead before running `supabase functions deploy`, even if the commit has already been pushed.

The Vercel frontend deploys automatically on push to `main` — this is governed by Rule 3, not Rule 7.

### Rule 8 — One agent session per codebase at a time

Do not run multiple agent sessions (two Claude Code windows, Claude Code + Cursor, etc.) against this repo concurrently. Concurrent agents cause non-deterministic git states, overwrite each other's edits, and make the human unable to reason about what changed and why.

If you are an agent starting a new session, and another agent may already be active, **ask the user to confirm no other session is running** before doing any work.

### Rule 9 — Respect the user's right to understand before acting

When the user is unsure what something means (a git command, a Supabase concept, a LemonSqueezy setting), **explain it before doing it**. Do not execute on a guess about intent. The user is a non-technical founder operating a children's-data product with legal exposure. Walking them through the "why" is part of the work, not an optional nicety.

---

## 3. Pre-flight checks before starting work in any session

In order, before any file edit or bash command that touches the repo:

1. **Confirm the repo** — `pwd && git remote -v && git rev-parse --show-toplevel` (per Rule 1)
2. **Check for uncommitted work** — `git status --short` — know what's dirty before you touch anything
3. **Check the current branch** — `git branch --show-current` — should always be `main` unless the user explicitly asked for a branch
4. **Check for unpushed commits** — `git log origin/main..HEAD --oneline` — don't assume main matches origin
5. **Read `CLAUDE.md`** in the directory of the app you're about to edit — product context lives there
6. **Read this file (`AGENTS.md`)** if you haven't this session — you're reading it now, good

---

## 4. Commit style

Look at `git log --oneline -20` to see the house style. In summary:

- First line: imperative mood, sentence case, no trailing period, ~50 chars
- Examples of the style in this repo:
  - `Privacy policy: correct Children's Code applicability claim`
  - `Remove SocialProofSection from landing page`
  - `Onboarding copy tweaks: lowercase danger words`
- Body (optional, for non-trivial commits): one blank line after the subject, then wrapped paragraphs explaining **why**, not what. The diff shows what.
- Trailer: always `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` for Claude-authored commits

## 5. Deployment model

### Frontend (Vercel)

- `apps/atq/` → Vercel project `answerthequestion-atq` → answerthequestion.co.uk
- `apps/spelling/` → Vercel project `spellingbees` → spellingbees.co.uk
- **Both projects auto-rebuild on every push to `main`**, regardless of which files the commit touched. A commit that only affects `apps/atq/` still appears in the `spellingbees` deployment list as a build log entry — this is cosmetic and not a routing error.
- No staging environment. `main` is production.

### Backend (Supabase Edge Functions)

- Edge functions are in `supabase/functions/<name>/index.ts`, Deno runtime.
- **They do NOT deploy automatically on push.** You must run `supabase functions deploy <name>` from the repo root. This is a deliberate gate (Rule 7): code changes in Edge Functions are only live when someone explicitly deploys them.
- After deploy, check `supabase functions list` to confirm the new version is active.

### Secrets (Supabase)

- Managed via `supabase secrets set KEY=value` or the dashboard UI at Edge Functions → Secrets.
- **Never commit secrets to git** (see Rule 5).
- When rotating, update the secret **before** deploying any code that depends on the new value, so there is no window of mismatch.

---

## 6. Testing expectations

- ATQ: typecheck with `npx tsc -p apps/atq/tsconfig.json --noEmit` before proposing a commit
- Spelling: typecheck with `npx tsc -p apps/spelling/tsconfig.json --noEmit` before proposing a commit
- SM-2 algorithm unit tests: `npm test --workspace=apps/spelling` (17 tests, must all pass)
- Edge Functions: no local test harness; validated by deploy + smoke test

A typecheck that returns no output is a pass. An error in `packages/shared` will fail both app typechecks — fix once, verify twice.

---

## 7. Product constraints that affect code

### Children's data (Children's Code)

The app MUST NOT:

- Collect or store the child's surname, school, full date of birth, address, photograph, voice, biometric, or any health data
- Expose any child-to-child interaction (no chat, no leaderboards, no shared content, no forums)
- Use dark patterns, nudges, countdown timers, autoplay, or anything designed to extend engagement beyond pedagogical value
- Use behavioural advertising, retargeting, or cross-site tracking
- Share child data with any processor not listed in `docs/DPIA.md` §5

Any feature that might require changes to the above triggers a DPIA review before implementation (`docs/DPIA.md`).

### Payments

- One-time payments only (no subscriptions)
- LemonSqueezy is merchant of record — we never see card data
- Payment state is flipped by the webhook handler only (Rule 6)
- Refunds must flip `has_paid` back to `false` (the `order_refunded` handler in `lemonsqueezy-webhook/index.ts`)

### Auth

- Supabase Auth only (email + password). No OAuth, no magic links in production.
- Password minimum length: **10 characters** with at least one letter and one number
- Email confirmation is required for live signups
- Session tokens are stored in `localStorage` by Supabase's default setup — acceptable for our threat model

---

## 8. Environment separation

There is **one** Supabase project and **no** staging environment for either database or frontend.

This means:

- Schema migrations are applied to production the moment they run
- Test data and real user data live in the same Postgres database — distinguished only by test vs live LemonSqueezy orders and by account
- "Dev" work happens against `localhost` pointing at the production Supabase project via `.env.local`

Agents editing schema migrations must:

1. Read existing migrations first (`supabase/migrations/`) to understand the current state
2. Never `DROP` a table, column, or index without explicit user approval
3. Always write migrations as `IF NOT EXISTS` / `IF EXISTS` where possible, so replays are safe
4. Flag any destructive operation for user review before running

See `docs/environment-separation.md` for the fuller description.

---

## 9. Where to find things

| Looking for | Path |
|---|---|
| Product overview (ATQ) | `apps/atq/CLAUDE.md` |
| Product overview (Spelling) | `CLAUDE.md` (repo root, top-level) |
| DPIA | `docs/DPIA.md` |
| Incident response plan | `docs/security/incident-response.md` |
| Environment separation | `docs/environment-separation.md` |
| Backup/restore procedure | `docs/backup-restore.md` |
| Secret rotation procedure | `docs/secret-rotation.md` |
| Schema migrations | `supabase/migrations/` |
| Edge Functions | `supabase/functions/<name>/index.ts` |
| Shared pages (login, signup, legal) | `packages/shared/src/pages/` |
| Shared stores | `packages/shared/src/stores/` |
| ATQ landing page sections | `apps/atq/src/components/landing/` |
| ATQ question banks | `apps/atq/src/data/questions/` |
| Spelling word banks | `apps/spelling/src/data/words/` |
| CLEAR Method techniques | `apps/atq/src/data/techniques.ts` |

---

## 10. When things go wrong

If you notice you have violated one of the Hard Rules (wrong repo edit, committed without approval, etc.):

1. **Stop immediately.** Do not compound the mistake by "fixing" it without the user's knowledge.
2. **Tell the user exactly what happened** — which rule, which files, which commits.
3. **Propose a specific, reversible remediation** — a revert commit, a git reset on an un-pushed branch, a rollback from the last known good state.
4. **Wait for the user's go-ahead** before doing anything further.

Silence or trying to cover up a mistake turns a small problem into a large one. Honesty is always cheaper.

---

**Last reviewed:** 2026-04-12. If this file is more than 6 months old at the time of reading, tell the user it may need updating.
