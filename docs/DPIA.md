# Data Protection Impact Assessment (DPIA)

**Product:** AnswerTheQuestion! (ATQ) — 11+ exam technique training application
**Operator:** Answer The Question (UK-based sole trader / Ltd)
**Controller:** Rebecca Everton (data protection lead)
**Contact:** hello@answerthequestion.co.uk
**Assessment date:** 11 April 2026
**Next review:** 11 April 2027 (or earlier on material change)
**Status:** Pre-launch v1.0

---

## 1. Why this DPIA exists

Under UK GDPR Art. 35 and the ICO Age Appropriate Design Code (the "Children's Code"), a DPIA is **mandatory** for any online service likely to be accessed by children. ATQ is explicitly designed for children aged 9–11 preparing for the 11+ exam. This DPIA documents:

- What personal data we collect, from whom, and why
- The legal basis for each processing activity
- The risks to data subjects (primarily children) and the mitigations in place
- Compliance with each of the 15 standards of the Children's Code
- Retention and deletion schedules
- Third-party data flows and safeguards
- Processes for subject access requests, rectification, erasure, and breach notification

It is a living document. Any material change to data processing triggers a review before deployment.

---

## 2. Scope

**In scope:**
- Parent account creation and authentication (Supabase Auth)
- Child profile creation and management by parents
- Child learning data (question responses, scores, timestamps, streaks, badges)
- Payment processing via LemonSqueezy
- Transactional email via Resend
- Analytics via Google Analytics 4 and Vercel Analytics

**Out of scope (not processed by ATQ):**
- Surnames, dates of birth, schools, addresses, photographs, voice, biometrics
- Geolocation
- Device fingerprinting for advertising
- Any data about the child beyond their chosen first name/nickname and avatar

---

## 3. Data inventory

### 3.1 Parent (adult) personal data

| Field | Purpose | Legal basis | Retention | Source |
|---|---|---|---|---|
| Email address | Account identifier, transactional email | Contract | Until account deletion + 30 days | Parent enters at sign-up |
| Hashed password | Authentication | Contract | Until account deletion | Parent enters, hashed by Supabase Auth (bcrypt) |
| Marketing opt-in flag | Consent tracking for product-update emails | Consent (separate from contract) | Until withdrawn | Parent ticks opt-in at sign-up |
| LemonSqueezy customer ID | Payment reconciliation, refunds | Contract / legitimate interest | 6 years (UK tax) | Created by LemonSqueezy on first order |
| Payment status (`has_paid`) | Access control | Contract | Until account deletion | Derived from LemonSqueezy webhook |
| IP address (transient) | Rate limiting, abuse prevention | Legitimate interest | Not persisted beyond 10 minutes (in-memory rate limiter window) | HTTP headers |

**We do NOT store:** card numbers, CVV, bank details, physical addresses, phone numbers, dates of birth, or government ID.

### 3.2 Child personal data

| Field | Purpose | Legal basis | Retention | Source |
|---|---|---|---|---|
| First name or nickname | Personalisation ("Well done, Alex!") | Contract (with parent) | Until child profile deleted | Parent enters |
| Avatar (emoji + colour) | Visual identifier in UI | Contract | Until child profile deleted | Parent selects |
| Pseudonymous child ID (UUID) | Primary key for learning data | Contract | Until child profile deleted | Generated server-side |
| Question responses | Adaptive learning, progress tracking | Contract | Until child profile deleted | Child's in-app interactions |
| Technique scores (CLEAR) | Feedback, next-question selection | Contract | Until child profile deleted | Derived from responses |
| Timestamps per question | Pacing, session reconstruction | Contract | Until child profile deleted | Generated server-side |
| Streak count | Motivation display | Contract | Until child profile deleted | Derived from session history |
| Badge progress | Motivation display | Contract | Until child profile deleted | Derived from session history |
| Exam date (optional) | Countdown widget | Contract | Until child profile deleted | Parent optionally enters |
| Dyslexia mode toggle | UI adaptation only (font, spacing) | Contract | Until child profile deleted | Parent or child sets |

**We do NOT store:** the child's surname, school, year group beyond "Year 5/6", date of birth, photograph, voice, email, postcode, or any identifier that could link the child profile to a real-world individual without the parent's own knowledge.

### 3.3 Classification of the dyslexia-mode toggle

The dyslexia-mode toggle enables a font and spacing adaptation in the UI. It is stored as a boolean on the child profile and is used **exclusively** to render the interface differently. It is not shared with any third party, is not used for profiling, is not aggregated, and is not used for adaptive learning decisions.

**Classification:** UI preference, **not** health or special-category data. Any parent who finds it more comfortable for any reason (dyslexia, visual fatigue, general preference) can enable it, and we do not ask why. Because the toggle has no health-data footprint — we never ask, store, or infer any medical condition — it falls outside Art. 9 UK GDPR.

If future features require us to collect actual health information (e.g. "which access needs does your child have?"), that will trigger a new DPIA and an explicit-consent flow. This is explicitly on the roadmap as a review gate.

---

## 4. Data flows

```
┌────────────┐                  ┌─────────────────┐
│  Browser   │                  │                 │
│ (parent or │◀── TLS 1.3 ────▶ │ Vercel (edge)   │
│  child)    │                  │ apps/atq        │
└────────────┘                  └────────┬────────┘
                                         │ TLS
                                         ▼
                                ┌─────────────────┐
                                │   Supabase      │
                                │  Frankfurt, EU  │
                                │                 │
                                │  Postgres       │
                                │  Auth           │
                                │  Edge Functions │
                                └────┬────────┬───┘
                                     │        │
                     ┌───────────────┘        └────────────────┐
                     │ (service role, server-only)             │
                     ▼                                         ▼
           ┌──────────────────┐                   ┌──────────────────────┐
           │   Resend         │                   │   LemonSqueezy       │
           │   (email)        │                   │   (payments)         │
           │   EU/US          │                   │   US (SCCs)          │
           └──────────────────┘                   └──────────────────────┘

           ┌──────────────────────────────┐       ┌──────────────────────┐
           │ Google Analytics 4           │       │ Vercel Analytics     │
           │ (anonymised, no child route  │       │ (Web Vitals,         │
           │  names, IP-anonymised)       │       │  no personal data)   │
           └──────────────────────────────┘       └──────────────────────┘
```

All communication to and from the browser is encrypted in transit (TLS 1.3). All data at rest in Supabase is encrypted at the volume level.

---

## 5. Third-party processors

| Processor | Purpose | Data disclosed | Location | Transfer safeguard | DPA |
|---|---|---|---|---|---|
| Supabase (Supabase Inc.) | Database, Auth, Edge Functions, Storage | All parent + child data | Frankfurt (DE) for data; US for corporate | SCCs + UK IDTA; EU hosting; **Pro tier** (daily backups, no auto-pause, DPA covered) | [supabase.com/dpa](https://supabase.com/dpa) |
| Vercel (Vercel Inc.) | Frontend hosting, edge CDN, Web Vitals | IP, user agent, page paths | Global edge; origin US | SCCs + UK IDTA | [vercel.com/legal/dpa](https://vercel.com/legal/dpa) |
| LemonSqueezy (Lemon Squeezy LLC) | Payment processing, merchant of record | Parent email, billing name, card details (we never see) | US | SCCs + UK IDTA | [lemonsqueezy.com/dpa](https://www.lemonsqueezy.com/dpa) |
| Resend (Resend Inc.) | Transactional email delivery | Parent email, message content | EU/US | SCCs + UK IDTA | [resend.com/legal/dpa](https://resend.com/legal/dpa) |
| Google Analytics 4 (Google LLC) | Anonymous aggregate usage statistics | IP-anonymised, page paths (stripped of child names), device class | EU (with US fallback) | SCCs + UK IDTA; IP anonymisation enabled | [support.google.com/analytics/answer/12937603](https://support.google.com/analytics/answer/12937603) |

**No subprocessor is disclosed child data beyond what is listed above.** No processor is used for advertising, profiling, retargeting, or cross-site tracking.

**Non-EU transfers:** Where data leaves the UK/EEA (Vercel, LemonSqueezy, Resend, GA4), we rely on the UK International Data Transfer Addendum to the EU Standard Contractual Clauses. Each processor has been assessed for adequacy of additional safeguards (technical: encryption in transit and at rest; organisational: ISO 27001 or SOC 2 certification).

---

## 6. Legal basis for processing

| Activity | Legal basis | Why |
|---|---|---|
| Create parent account, store password hash | Contract (Art. 6(1)(b)) | Necessary to provide the service the parent requested |
| Create child profile, store learning data | Contract (Art. 6(1)(b)) — parent is the contracting party | Necessary to provide the tutoring service to the parent's child |
| Send payment confirmation email | Contract (Art. 6(1)(b)) | Part of the purchase |
| Send product update / marketing email | Consent (Art. 6(1)(a)) | Marketing opt-in is a separate tick-box, default off, withdrawable at any time |
| Rate limiting, fraud prevention | Legitimate interest (Art. 6(1)(f)) | Necessary for the security of the service, no override by the data subject's interests |
| Aggregate anonymous analytics | Legitimate interest (Art. 6(1)(f)) + DUAA 2025 statistical-purposes exemption | Understand and improve the product; IP-anonymised and never combined with profile data |

**Children's Code notes:**
- The child is not the contracting party. The parent is.
- No processing depends on the child's consent, and no data is collected from the child that the parent has not already authorised.
- No profiling of the child for any purpose other than adaptive teaching (selecting the next question based on prior performance). Adaptive teaching is inside the contract scope.

---

## 7. Children's Code — 15 standards assessment

| # | Standard | Status | Evidence |
|---|---|---|---|
| 1 | Best interests of the child | ✅ | Entire product is education-focused; no revenue model tied to engagement; no ads |
| 2 | Data protection impact assessment | ✅ | This document |
| 3 | Age-appropriate application | ✅ | Designed for 9–11; no features from adjacent ages (no chat, no open world, no commerce UI shown to child) |
| 4 | Transparency | ✅ | Privacy policy has a plain-English child-facing summary; parent-facing section cites the Code directly |
| 5 | Detrimental use of data | ✅ | No advertising, no profiling for commercial gain, no behavioural marketing |
| 6 | Policies and community standards | ✅ | Privacy policy, terms, refund policy, complaints form all live and linked from every page footer |
| 7 | Default settings | ✅ | All defaults are privacy-maximising: analytics off for child routes, no shared profiles, no public leaderboards |
| 8 | Data minimisation | ✅ | See §3.2 above — only first name and avatar stored; nothing else that could identify a real child |
| 9 | Data sharing | ✅ | No sharing with third parties other than processors in §5; no sale, no rental, no ad network |
| 10 | Geolocation | ✅ | **Not collected or used.** The app has no geolocation feature |
| 11 | Parental controls | ✅ | Parent manages all child profiles, can view all learning data, can edit or delete child profile at any time |
| 12 | Profiling | ✅ | Adaptive-learning profile is used solely to choose the next question. No profiling for ads, scoring the child for third parties, or nudging engagement |
| 13 | Nudge techniques | ✅ | No countdown timers that pressure purchase, no fabricated scarcity, no autoplay, no dark patterns. Streak counter is a standard educational motivation tool and can be reset by parent |
| 14 | Connected toys and devices | N/A | Web application only; no IoT integration |
| 15 | Online tools | ✅ | Parents have one-click account deletion (within 30 days all child data purged). DSAR via hello@answerthequestion.co.uk |

---

## 8. Risk register

Each risk is assessed for **likelihood** (L–M–H) and **impact** (L–M–H) **before** mitigation. The same assessment is then re-scored **after** mitigation.

| # | Risk | Before (L×I) | Mitigation | After (L×I) |
|---|---|---|---|---|
| R1 | Unauthorised access to another family's data | M × H | Row Level Security on every table, scoped to `auth.uid() = parent_id`; `protect_has_paid` trigger on child_profiles; pen-test-style RLS review performed 11 Apr 2026 | L × H |
| R2 | Child's real-world identity inferred from profile | M × M | First name only (and can be a nickname); no school, no DOB, no surname, no photograph; exam date optional and stored as month only if possible — **action: verify date granularity in UI** | L × M |
| R3 | Payment data exposure | L × H | We never see card data; LemonSqueezy is merchant of record; webhook signature verified via HMAC-SHA256 with constant-time comparison; `test_mode: false` hardcoded in production | L × H |
| R4 | Parent credential compromise | M × H | bcrypt hashing (Supabase Auth), rate-limited login endpoint, **action: raise password min length from 8 → 10** | L × H |
| R5 | GA4 leaks child path or identifier | M × M | Child routes are not tracked in GA4; IP anonymisation enabled; **action: verify GA4 configuration matches policy** | L × M |
| R6 | Email containing child data sent to wrong address | L × M | Emails are addressed to the parent account email only. No child data is included in any email body beyond streak status and session summaries | L × L |
| R7 | Breach of Supabase account | L × H | 2FA enabled on Supabase account; service role key stored only in Supabase Edge Functions, never in frontend; secret rotation documented | L × H |
| R8 | Stale data after account deletion | M × M | Deletion cascades via FK on parent_id; 30-day purge window documented in privacy policy; **action: schedule weekly cron to verify no orphans** | L × L |
| R9 | Dev/prod data co-mingling | M × M | Separate Supabase environments documented in `docs/environment-separation.md`; **action: verify no prod data ever in dev project** | L × L |
| R10 | LemonSqueezy refund not reflected in ATQ `has_paid` | H × M | **CLOSED** — `order_refunded` webhook handler shipped (`4d20fd8`) and live-tested 12 Apr 2026; refund correctly sets `has_paid = false` via service-role bypass of `protect_has_paid` trigger | L × M |
| R11 | Webhook replay attack | L × M | **CLOSED** — Webhook body verified by HMAC signature; idempotency guard on `lemonsqueezy_order_id` prevents duplicate writes on replay (`4d20fd8`) | L × L |
| R12 | Analytics cookies used without consent | L × L | Under DUAA 2025 s.87, statistical-purposes analytics are exempt from the consent requirement; GA4 is configured for statistical purposes only | L × L |
| R13 | Browser-side secrets leaked | L × M | Only the anon key ships in the browser bundle; service role key server-side only; `.env.local` gitignored and verified absent from git history | L × L |

Open actions from this register are tracked in §11 below.

---

## 9. Retention schedule

| Data class | Retention period | Trigger for deletion |
|---|---|---|
| Active parent account | Indefinite while active | Parent requests deletion OR 24 months of total inactivity (automated review, not automated purge) |
| Child profile | Indefinite while parent account active | Parent deletes child profile OR parent account deleted |
| Learning data (questions, sessions, badges) | Same as child profile | Cascade on child profile deletion |
| Payment records | 6 years from transaction | UK HMRC requirement for financial records |
| Email delivery logs (Resend) | 30 days (Resend default) | Automatic |
| Analytics (GA4) | 14 months (GA4 default, configured minimum) | Automatic |
| Backup copies | 30 days from backup date | Automatic Supabase rolling backup |
| In-memory rate-limit counters | 10 minutes | Automatic sliding window |
| Incident response logs | 2 years from closure | Manual |

**30-day full-deletion window after account deletion request:** covers all production data, cascades, email logs, and the oldest backup generation, so that no data older than 30 days survives in any form.

---

## 10. Rights and requests

Parents can exercise all UK GDPR rights on their own and their children's behalf:

| Right | How to exercise | SLA |
|---|---|---|
| Access (Art. 15) | Email hello@answerthequestion.co.uk with subject "DSAR" | 30 days |
| Rectification (Art. 16) | In-app settings page for most fields; email for the rest | 14 days |
| Erasure (Art. 17) | In-app "Delete account" button OR email | 30 days full purge |
| Restriction (Art. 18) | Email | 30 days |
| Portability (Art. 20) | Email — delivered as JSON export | 30 days |
| Object (Art. 21) | Email for processing based on legitimate interest | 30 days |
| Withdraw consent (Art. 7) | Unsubscribe link in every marketing email | Immediate |
| Complain to ICO | [ico.org.uk/make-a-complaint](https://ico.org.uk/make-a-complaint) | N/A |
| Complain directly to us | /data-complaint form on site | 30 days acknowledgement |

All requests are logged in an internal spreadsheet (not stored alongside customer data) for audit.

---

## 11. Outstanding actions from this DPIA

These are cross-referenced with the integrated launch-gate remediation plan.

| # | Action | Owner | Priority | Status |
|---|---|---|---|---|
| A1 | Implement `order_refunded` webhook handler in `lemonsqueezy-webhook/index.ts` | Rebecca + Claude | P0 | ✅ Shipped `4d20fd8`; live refund tested 12 Apr 2026 — access correctly revoked |
| A2 | Add idempotency guard on LemonSqueezy `order_id` in webhook handler | Rebecca + Claude | P0 | ✅ Shipped `4d20fd8`; proven in production 12 Apr 2026 |
| A3 | Raise password minimum length 8 → 10 across `SignupPage.tsx` / `LoginPage.tsx` | Rebecca + Claude | P0 | ✅ Shipped `4d20fd8` (12 Apr 2026) |
| A4 | Verify `ALLOW_LOCALHOST` is not set on production Supabase Edge Functions | Rebecca | P0 | ✅ Verified absent (12 Apr 2026) |
| A5 | Confirm Supabase plan tier supports production workload and DPA | Rebecca | P0 | ✅ Upgraded to Pro (12 Apr 2026) |
| A6 | Manual cross-account RLS verification with two test parents | Rebecca | P0 | Pending — code audit passed, manual test recommended |
| A7 | GA4 configuration review: IP anonymisation on, child routes excluded, 14-month retention set | Rebecca | P1 | Pending — GA4 IP anonymisation is on by default since 2023; retention and route exclusion are dashboard-only settings |
| A8 | Exam date stored at full-date granularity (YYYY-MM-DD) — justified because 11+ exam dates are published at LA/school level and are public knowledge; no DOB-like inference risk | Rebecca | P1 | ✅ Accepted — no code change needed |
| A9 | Weekly cron to verify no orphaned child_profiles or payments after deletion | Claude | P1 | Post-launch |
| A10 | Annual DPIA review | Rebecca | — | 11 April 2027 |

---

## 12. Review, approval, and change control

**Reviewed by:** Rebecca Everton (data protection lead)
**Approved by:** Rebecca Everton
**Date of approval:** (pending signature)
**Next scheduled review:** 11 April 2027

Material changes that trigger a DPIA review before deployment:

- Any new data field collected from or about a child
- Any new third-party processor added to §5
- Any change in legal basis (e.g. moving from contract to consent)
- Any change to the product that makes it attractive to a new age bracket
- Any security incident above severity "low" (see `docs/security/incident-response.md`)
- Any change in the physical hosting location of personal data

A DPIA revision number and date is recorded at the top of this file on every material change, and the previous version is kept in git history.

---

## Appendix A — Referenced documents

- `/docs/security/incident-response.md` — breach detection, containment, notification (ICO 72-hour rule), communication templates
- `/docs/environment-separation.md` — dev / staging / prod isolation
- `/docs/secret-rotation.md` — rotation cadence and procedure for all credentials
- `/docs/backup-restore.md` — backup cadence, restore drill procedure
- `/docs/guest-checkout-auth.md` — guest checkout flow and how it interacts with later account creation
- `packages/shared/src/pages/PrivacyPolicyPage.tsx` — public-facing privacy policy (Section 4 describes Children's Code compliance in plain English)
- `supabase/migrations/` — RLS policies and `protect_has_paid` trigger
- `supabase/functions/lemonsqueezy-webhook/index.ts` — payment webhook with signature verification
- `supabase/functions/_shared/rate-limit.ts` — rate limiter used on all sensitive endpoints
