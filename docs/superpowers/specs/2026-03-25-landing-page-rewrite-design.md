# Landing Page Rewrite — Design Spec
**Date:** 2026-03-25
**Status:** Ready for implementation

---

## Overview

Full rewrite of the AnswerTheQuestion! sales page at `answerthequestion.co.uk`. The copy is provided verbatim in the brief. This spec covers component mapping, file structure, visual direction, and the screenshots approach.

---

## Visual Direction

**Hero:** Keep the dark purple-to-pink gradient background (confirmed by user — Option A). Clean it up: less busy, copy front and centre. Owl branding secondary.

**Colour palette:** Unchanged — fuchsia/purple/indigo gradient, white cards with `bg-white/95`, `text-gray-700` body text.

**Typography:** Unchanged — Nunito display, Inter body. Same heading sizes and weights.

---

## Section Structure (10 sections + footer)

New page order, mapped to components:

| # | Section | Component | Action |
|---|---------|-----------|--------|
| 1 | Hero | `HeroSection.tsx` | **Rewrite** — new headline, subheadline, CTA copy |
| 2 | Sound Familiar checklist | `ProblemSection.tsx` | **Rewrite** — new header, 5 bullet list, closing line |
| 3 | Origin story | `StorySection.tsx` | **Rewrite** — shortened, add 10% stat and closing attribution |
| 4 | The piece that's missing | *(new)* `GapSection.tsx` | **Create** — 3-paragraph value prop with mid-page CTA |
| 5 | The CLEAR Method (condensed) | `ClearMethodSection.tsx` | **Rewrite** — remove 5-card breakdown, one paragraph + "C·L·E·A·R" letters only |
| 6 | See it in action (screenshots) | *(new)* `ScreenshotsSection.tsx` | **Create** — two phone frame mockups |
| 7 | What your child gets | `JourneySection.tsx` | **Rewrite** — replace journey visual with 8-item feature list |
| 8 | Pricing | `PricingSection.tsx` | **Rewrite** — add urgency date, update anchor, new features list, guarantee inline |
| 9 | Beta / early access | `SocialProofSection.tsx` | **Rewrite** — replace fake testimonial with honest beta framing |
| 10 | FAQ | `FaqSection.tsx` | **Rewrite** — 8 Q&As from brief |
| 11 | Final CTA | `FinalCtaSection.tsx` | **Rewrite** — emotional close copy from brief |
| 12 | Footer | `LandingFooter.tsx` | **Rewrite** — 6 links + "Made with care by a working mum." |

**Sections to delete from page (not from filesystem):**
- `CalmSection` — content folded into features list
- `GuaranteeSection` — folded into PricingSection
- `StickyCtaBar` — remove (clutters the clean redesign)

**`LandingPage.tsx`** — update import list and section order to match above.

---

## Component Details

### 1. HeroSection
- Nav: `🦉 AnswerTheQuestion!` (left) | `Sign in` link (right)
- H1: *"Your child knew the answer. They just didn't read the question."*
  - "read the question" in fuchsia-300 for emphasis
- Subheadline in glass card (`bg-white/15 backdrop-blur-sm`): full subheadline from brief
- CTA button: `Start the 12-week programme — £19.99` (gradient fuchsia→purple→indigo, full width max-w-md)
- Below CTA small text: `One-time payment · Whole family · 7-day money-back guarantee`

### 2. ProblemSection (Sound Familiar)
- White/light card section (`bg-white/95`)
- Header: *"If this sounds familiar…"*
- 5 bullet points from brief — each as a row with a subtle tick/dot marker
- Closing line in slightly bolder text: *"That's not a knowledge problem. It's an exam-technique habit. And habits can be trained."*

### 3. StorySection (How it started)
- Keep existing card design (`bg-white/95 rounded-2xl`)
- Shortened to 3 paragraphs: Blue anecdote → "other parents" line → 10% stat + attribution
- Add the 10% proof point: *"Within a week of using the programme, my daughter's practice test scores improved by over 10%"*
- Attribution: *"— Rebecca, Founder"*

### 4. GapSection (The piece that's missing) — NEW
- Dark section on gradient background (no card, white text)
- H2: *"The piece that's missing"*
- 2 paragraphs from brief
- Mid-page CTA: `See how it works — £19.99` (ghost button style: `bg-white/20 border border-white/40`)

### 5. ClearMethodSection (condensed)
- Remove the 5 expanded cards entirely
- H2: *"The CLEAR Method"*
- One paragraph from brief (metacognition research + EEF 7-month stat)
- Below the paragraph: large letter display — `C · L · E · A · R` — each letter in its coloured circle (keep the existing colour system: blue/violet/pink/amber/emerald) but as a horizontal row of circles only, no text descriptions
- No CTA in this section (CTA lives in GapSection above it)

### 6. ScreenshotsSection — NEW
- H2: *"See what a session looks like"* (white text on gradient)
- Two phone frame mockups side by side (or stacked on mobile)
- Each phone frame: dark rounded border, subtle shadow, screen fills the frame
- Phone 1: iframe pointing to `/mock-question-screen.html` — labelled *"The question flow"*
- Phone 2: iframe pointing to `/mock-home-screen.html` — labelled *"Your child's dashboard"*
- iframes: `pointer-events: none`, scaled to fit frame with CSS transform
- Phone frames: approx 220px wide × 440px tall on desktop, full-width stacked on mobile

### 7. WhatYouGet (formerly JourneySection)
- White section (`bg-white/95`)
- H2: *"What your child gets"*
- 8 feature rows from brief, each with emoji + bold title + description sentence
- NOT a grid — vertical list for readability, each feature gets its own row with clear separation

### 8. PricingSection
- H2: *"One price. The whole family."*
- Price card: `£19.99` large, `One-time payment · No subscription` subtext
- Urgency banner: amber/orange pill — *"Beta price — increases to £39.99 on 30 April"*
- Anchor line: *"One private tutor session costs £30–£50. This builds exam technique over 12 weeks — for less."*
- Feature list (compact): 6 bullet items from brief
- CTA: `Start the 12-week programme — £19.99`
- Guarantee block below CTA: green card, 7-day guarantee copy from brief

### 9. BetaSection (formerly SocialProofSection)
- H2: *"We're in early access"*
- 2 paragraphs from brief (honest, small-team framing)
- Subtle note at bottom: *"When you have real testimonials, replace this section with parent quotes."* — styled as a dev comment (small, muted — only visible in dev, not production? Or just honest small italic text)
- Actually: just remove the dev note entirely, keep the public-facing copy only

### 10. FaqSection
- 8 Q&As from brief — replace existing FAQ items entirely
- Keep existing accordion component structure

### 11. FinalCtaSection
- Emotional close: *"Some questions they won't know. Don't let them lose marks on the ones they do."*
- CTA: `Start the 12-week programme — £19.99`
- Below: `7-day money-back guarantee · No subscription · Secure checkout powered by Stripe`

### 12. LandingFooter
- Links: Privacy Policy | Terms | Refund Policy | Why It Works | Contact | Sign In
- Tagline: *"Made with care by a working mum."*

---

## Screenshots Approach

Two HTML mock screens live in `public/`:
- `/mock-question-screen.html` — practice session showing the Eliminate step, Professor Hoot, highlighted question, crossed-out wrong answers
- `/mock-home-screen.html` — home dashboard showing streak, XP, technique score, session card, journey tracker

These are served as static files by Vite dev server and in production. The `ScreenshotsSection` component wraps them in CSS phone frames using iframes with `pointer-events: none` and `transform: scale()`.

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/LandingPage.tsx` | Update imports + section order |
| `src/components/landing/HeroSection.tsx` | Rewrite |
| `src/components/landing/ProblemSection.tsx` | Rewrite |
| `src/components/landing/StorySection.tsx` | Rewrite |
| `src/components/landing/ClearMethodSection.tsx` | Rewrite |
| `src/components/landing/JourneySection.tsx` | Rewrite (repurposed as WhatYouGet) |
| `src/components/landing/PricingSection.tsx` | Rewrite |
| `src/components/landing/SocialProofSection.tsx` | Rewrite (repurposed as BetaSection) |
| `src/components/landing/FaqSection.tsx` | Rewrite |
| `src/components/landing/FinalCtaSection.tsx` | Rewrite |
| `src/components/landing/LandingFooter.tsx` | Rewrite |
| `src/components/landing/GapSection.tsx` | **Create new** |
| `src/components/landing/ScreenshotsSection.tsx` | **Create new** |
| `public/mock-question-screen.html` | Already created |
| `public/mock-home-screen.html` | Already created |

**Removed from page (files kept):**
- `CalmSection` — no longer rendered
- `GuaranteeSection` — no longer rendered
- `StickyCtaBar` — no longer rendered

---

## What Does NOT Change

- Routing, auth, checkout flow — untouched
- `SectionWrapper.tsx` — may be used or not, unchanged
- App shell, navigation, all non-landing pages — untouched
- Supabase, Stripe, edge functions — untouched
- Framer Motion scroll animations on section entry — keep pattern
