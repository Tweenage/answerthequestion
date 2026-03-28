# Landing Page Rewrite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the AnswerTheQuestion! sales landing page to match the 10-section brief — new copy, two new components (GapSection, ScreenshotsSection), three sections removed from the page, and the overall section order updated.

**Architecture:** Each landing section is an independent TSX component in `src/components/landing/`. The orchestrator `LandingPage.tsx` imports and orders them. Two new components are created from scratch; the rest are in-place rewrites. No routing, auth, or backend changes.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion 12, React Router 7 (`react-router`).

---

## Chunk 1: Orchestrator — remove sections, add new ones, fix order

### Task 1: Update LandingPage.tsx

**Files:**
- Modify: `src/pages/LandingPage.tsx`

New section order per spec:
1. HeroSection
2. ProblemSection
3. StorySection
4. GapSection *(new)*
5. ClearMethodSection
6. ScreenshotsSection *(new)*
7. JourneySection (repurposed as WhatYouGet)
8. PricingSection
9. SocialProofSection (repurposed as BetaSection)
10. FaqSection
11. FinalCtaSection
12. LandingFooter

Removed from page (files kept): `CalmSection`, `GuaranteeSection`, `StickyCtaBar`.

- [ ] **Step 1: Rewrite LandingPage.tsx**

Replace the entire file:

```tsx
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { StorySection } from '../components/landing/StorySection';
import { GapSection } from '../components/landing/GapSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { ScreenshotsSection } from '../components/landing/ScreenshotsSection';
import { JourneySection } from '../components/landing/JourneySection';
import { PricingSection } from '../components/landing/PricingSection';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <StorySection />
      <GapSection />
      <ClearMethodSection />
      <ScreenshotsSection />
      <JourneySection />
      <PricingSection />
      <SocialProofSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  );
}
```

Note: `GapSection` and `ScreenshotsSection` will be created in Tasks 5 and 6. The build will fail until they exist — create stub files first (see Step 2).

- [ ] **Step 2: Create stub files so TypeScript doesn't block the build**

Create `src/components/landing/GapSection.tsx`:
```tsx
export function GapSection() { return null; }
```

Create `src/components/landing/ScreenshotsSection.tsx`:
```tsx
export function ScreenshotsSection() { return null; }
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: Zero TypeScript errors. The stubs satisfy the imports.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LandingPage.tsx src/components/landing/GapSection.tsx src/components/landing/ScreenshotsSection.tsx
git commit -m "feat: update LandingPage section order, add stub components"
```

---

## Chunk 2: HeroSection + ProblemSection + StorySection rewrites

### Task 2: Rewrite HeroSection

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

Spec:
- Nav: `🦉 AnswerTheQuestion!` left | `Sign in` right (keep existing)
- H1: *"Your child knew the answer. They just didn't read the question."* — "read the question" in `text-fuchsia-300`
- Subheadline in glass card (`bg-white/15 backdrop-blur-sm`)
- CTA button: `Start the 12-week programme — £19.99` (gradient, full-width max-w-md)
- Below CTA small text: `One-time payment · Whole family · 7-day money-back guarantee`

- [ ] **Step 1: Rewrite HeroSection.tsx**

```tsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Nav */}
      <div className="max-w-3xl mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        <span className="font-display font-extrabold text-base text-white tracking-tight">
          🦉 AnswerTheQuestion!
        </span>
        <Link
          to="/login"
          className="text-sm text-white/70 font-display font-semibold hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-10 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-extrabold text-[2rem] leading-[1.15] md:text-5xl md:leading-[1.15] text-white drop-shadow-lg mb-5 max-w-2xl mx-auto">
            Your child knew the answer. They just didn&rsquo;t{' '}
            <span className="text-fuchsia-300">read the question.</span>
          </h1>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xl mx-auto mb-10">
            <p className="text-white font-display font-bold text-lg md:text-xl leading-relaxed">
              AnswerTheQuestion! trains children to use the{' '}
              <strong className="text-fuchsia-200">CLEAR Method</strong> — a five-step exam
              technique that turns careless mistakes into confident, correct answers. Built
              for 11+, independent school entrance, and every exam beyond.
            </p>
          </div>

          <Link
            to="/checkout"
            className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Start the 12-week programme &mdash; &pound;19.99
          </Link>

          <p className="text-white/70 font-display text-sm font-medium mt-4">
            One-time payment &middot; Whole family &middot; 7-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Start dev server and verify visually**

Run: `npm run dev`
Navigate to `http://localhost:5173/`
Expected: H1 shows "Your child knew the answer. They just didn't read the question." — "read the question" in fuchsia/pink. Subhead in glass card. CTA says "Start the 12-week programme — £19.99".

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "feat: rewrite HeroSection with new headline and CTA copy"
```

---

### Task 3: Rewrite ProblemSection

**Files:**
- Modify: `src/components/landing/ProblemSection.tsx`

Spec:
- White/light card section (`bg-white/95`)
- Header: *"If this sounds familiar…"*
- 5 bullet points with a tick/dot marker
- Closing line in bold: *"That's not a knowledge problem. It's an exam-technique habit. And habits can be trained."*

- [ ] **Step 1: Rewrite ProblemSection.tsx**

```tsx
import { motion } from 'framer-motion';

const BULLETS = [
  'They come out of the exam saying "I knew all of that" — but the marks don\'t reflect it.',
  'The question said "give two reasons" — they gave one and moved on.',
  'You\'ve said "read the question" so many times it\'s lost all meaning.',
  'They ace practice papers at home, then panic and rush under timed conditions.',
  'They knew the answer. They just didn\'t answer the question that was asked.',
];

export function ProblemSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-8 leading-tight">
            If this sounds familiar&hellip;
          </h2>

          <ul className="space-y-4 mb-8">
            {BULLETS.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-gray-700 font-display text-base leading-relaxed"
              >
                <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-fuchsia-400" />
                {text}
              </motion.li>
            ))}
          </ul>

          <p className="font-display font-bold text-base md:text-lg text-gray-800 text-center leading-relaxed">
            That&rsquo;s not a knowledge problem. It&rsquo;s an exam-technique habit.
            <br />
            And habits can be trained.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload `http://localhost:5173/`. Scroll to the white section.
Expected: "If this sounds familiar…" header, 5 bullets with fuchsia dot markers, bold closing line.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ProblemSection.tsx
git commit -m "feat: rewrite ProblemSection as Sound Familiar checklist"
```

---

### Task 4: Rewrite StorySection

**Files:**
- Modify: `src/components/landing/StorySection.tsx`

Spec: Shortened to 3 paragraphs — Blue anecdote → "other parents" line → 10% stat + attribution. Keep `bg-white/95 rounded-2xl` card design.

- [ ] **Step 1: Rewrite StorySection.tsx**

```tsx
import { motion } from 'framer-motion';

export function StorySection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-white/30 max-w-xl mx-auto">
          <p className="text-gray-700 font-display text-base leading-relaxed italic mb-5">
            My daughter had just finished her 11+ comprehension practice. I started marking
            and stopped cold at Question 1: &ldquo;In what year did scientists discover
            the colour of&hellip;&rdquo; Her answer? Blue.
            <br /><br />
            I asked her to read it again &mdash; out loud. She got to &ldquo;In what
            year&hellip;&rdquo; and immediately: &ldquo;D&rsquo;uh! It&rsquo;s meant to be
            1957!&rdquo; She had known the answer all along. She just hadn&rsquo;t read
            the question.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            Talking to other parents going through 11+ and independent school prep,
            the story was always the same. Bright, capable children losing marks &mdash;
            not because they didn&rsquo;t know the material &mdash; but because they
            didn&rsquo;t read the question properly. So I researched the science of
            exam technique, built the method, and turned it into a programme.
          </p>

          <p className="text-gray-600 font-display text-base leading-relaxed mb-5">
            &ldquo;Within a week of using the programme, my daughter&rsquo;s practice
            test scores improved by over 10%.&rdquo;
          </p>

          <p className="font-display font-bold text-base text-purple-700">
            &mdash; Rebecca, Founder
          </p>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload and scroll to story section.
Expected: White card, 3 compact paragraphs, 10% quote, "— Rebecca, Founder" attribution.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/StorySection.tsx
git commit -m "feat: shorten StorySection to 3 paragraphs with 10% stat"
```

---

## Chunk 3: GapSection (new) + ClearMethodSection rewrite

### Task 5: Create GapSection

**Files:**
- Modify: `src/components/landing/GapSection.tsx` (replace stub)

Spec:
- Dark section on gradient background (no card, white text)
- H2: *"The piece that's missing"*
- 2 paragraphs
- Mid-page CTA: `See how it works — £19.99` (ghost button style: `bg-white/20 border border-white/40`)

- [ ] **Step 1: Write GapSection.tsx**

```tsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function GapSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-6 leading-tight">
          The piece that&rsquo;s missing
        </h2>

        <p className="text-white/85 font-display text-base md:text-lg leading-relaxed mb-5">
          Tutors and practice papers teach your child what to know and how to apply it.
          But there&rsquo;s a layer that most exam preparation skips: the habit of actually
          reading the question before answering it. That single habit is responsible for
          more lost marks than any gap in knowledge.
        </p>

        <p className="text-white/85 font-display text-base md:text-lg leading-relaxed mb-10">
          The CLEAR Method trains that habit &mdash; not by teaching more content, but by
          building the automatic slow-down that prevents careless mistakes. It&rsquo;s what
          sits between &ldquo;knowing the answer&rdquo; and &ldquo;getting the mark.&rdquo;
        </p>

        <Link
          to="/checkout"
          className="inline-block px-8 py-4 rounded-2xl font-display font-bold text-white text-base bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          See how it works &mdash; &pound;19.99
        </Link>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload. The GapSection appears after StorySection as white text on the gradient — no card background.
Expected: "The piece that's missing" heading, 2 paragraphs, ghost-style CTA button.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/GapSection.tsx
git commit -m "feat: create GapSection (The piece that's missing)"
```

---

### Task 6: Rewrite ClearMethodSection (condensed)

**Files:**
- Modify: `src/components/landing/ClearMethodSection.tsx`

Spec:
- Remove the 5 expanded cards entirely
- H2: *"The CLEAR Method"*
- One paragraph (metacognition research + EEF 7-month stat)
- Below paragraph: large horizontal row of `C · L · E · A · R` letter circles — keep existing colours (blue/violet/pink/amber/emerald) but circles only, no text descriptions
- No CTA in this section

- [ ] **Step 1: Rewrite ClearMethodSection.tsx**

```tsx
import { motion } from 'framer-motion';

const LETTERS = [
  { letter: 'C', bg: 'bg-blue-500' },
  { letter: 'L', bg: 'bg-violet-500' },
  { letter: 'E', bg: 'bg-pink-500' },
  { letter: 'A', bg: 'bg-amber-500' },
  { letter: 'R', bg: 'bg-emerald-500' },
];

export function ClearMethodSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 mb-6 leading-tight">
            The CLEAR Method
          </h2>

          <p className="text-gray-600 font-display text-base md:text-lg leading-relaxed mb-10">
            The CLEAR Method is grounded in metacognition research &mdash; thinking about
            how you think. The Education Endowment Foundation found metacognitive strategies
            add an average of seven months of progress. Your child learns the method in
            week one. They use it automatically by week twelve.
          </p>

          <div className="flex items-center justify-center gap-4">
            {LETTERS.map((step, i) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className={`w-14 h-14 rounded-full ${step.bg} flex items-center justify-center shadow-md`}
              >
                <span className="font-display font-extrabold text-2xl text-white">
                  {step.letter}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload. ClearMethodSection should now be a compact white card with one paragraph and a row of 5 coloured circles.
Expected: No card-by-card breakdown, no CTA, just heading + paragraph + C·L·E·A·R circles.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/ClearMethodSection.tsx
git commit -m "feat: condense ClearMethodSection to one paragraph + letter circles"
```

---

## Chunk 4: ScreenshotsSection (new) + JourneySection rewrite

### Task 7: Create ScreenshotsSection

**Files:**
- Modify: `src/components/landing/ScreenshotsSection.tsx` (replace stub)

Spec:
- H2: *"See what a session looks like"* (white text on gradient)
- Two phone frame mockups side by side (stacked on mobile)
- Each frame: dark rounded border, subtle shadow, approx 220px wide × 440px tall on desktop
- Phone 1: iframe `src="/mock-question-screen.html"` — label *"The question flow"*
- Phone 2: iframe `src="/mock-home-screen.html"` — label *"Your child's dashboard"*
- `pointer-events: none` and `transform: scale()` on iframes to fit the frame

The HTML mock files already exist at `public/mock-question-screen.html` and `public/mock-home-screen.html`.

- [ ] **Step 1: Write ScreenshotsSection.tsx**

```tsx
import { motion } from 'framer-motion';

const PHONES = [
  { src: '/mock-question-screen.html', label: 'The question flow' },
  { src: '/mock-home-screen.html', label: 'Your child\'s dashboard' },
];

export function ScreenshotsSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-10 leading-tight">
          See what a session looks like
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {PHONES.map((phone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Phone frame */}
              <div
                className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
                style={{
                  width: 220,
                  height: 440,
                  border: '3px solid rgba(30,10,60,0.85)',
                  background: '#0f0a28',
                }}
              >
                <iframe
                  src={phone.src}
                  title={phone.label}
                  style={{
                    width: 390,
                    height: 844,
                    border: 'none',
                    transform: 'scale(0.5538)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <p className="font-display font-bold text-sm text-white/80">
                {phone.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

Note on the scale value: the frame is 220px wide, the iframe content is 390px wide — scale = 220/390 ≈ 0.5538. Height: 844 × 0.5538 ≈ 467px, but the frame clips it to 440px, which cuts off the bottom nav slightly. This is fine — it looks natural on a phone.

- [ ] **Step 2: Verify visually**

Reload. Scroll to ScreenshotsSection.
Expected: Two phone frames side by side on desktop, stacked on mobile. Each frame shows the HTML mock rendered inside a dark rounded phone border. Frames are not interactive (pointer-events: none).

- [ ] **Step 3: Check mobile layout**

Resize browser to 375px wide (mobile).
Expected: Phones stack vertically, each centred.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/ScreenshotsSection.tsx
git commit -m "feat: create ScreenshotsSection with CSS phone frame mockups"
```

---

### Task 8: Rewrite JourneySection (WhatYouGet)

**Files:**
- Modify: `src/components/landing/JourneySection.tsx`

Spec:
- White section (`bg-white/95`)
- H2: *"What your child gets"*
- 8 feature rows with emoji + bold title + description sentence
- Vertical list (NOT a grid) — each feature gets its own row

- [ ] **Step 1: Rewrite JourneySection.tsx**

```tsx
import { motion } from 'framer-motion';

const FEATURES = [
  {
    emoji: '🎯',
    title: 'Daily 10-question sessions',
    desc: '10 questions every day, roughly 10 minutes, covering English, Maths and Reasoning.',
  },
  {
    emoji: '📈',
    title: '12-week progressive programme',
    desc: 'Starts gently, builds to exam pace. Scaffolding fades as the habit takes hold.',
  },
  {
    emoji: '⚡',
    title: 'Fast Track mode',
    desc: "Exam in a few weeks? Enter your child's date and the app adapts the programme automatically.",
  },
  {
    emoji: '👨‍👩‍👧‍👦',
    title: 'Whole family access',
    desc: 'One purchase covers all your children — each with independent progress, badges and their own journey.',
  },
  {
    emoji: '🧘',
    title: 'Breathing & calm exercises',
    desc: 'Every session starts with a short breathing exercise to settle nerves before the questions begin.',
  },
  {
    emoji: '📊',
    title: 'Parent progress dashboard',
    desc: 'Track technique scores, subject breakdowns and session history — see exactly what is improving.',
  },
  {
    emoji: '🦉',
    title: 'Professor Hoot',
    desc: 'The owl mascot guides children through each step, giving real-time feedback and encouragement.',
  },
  {
    emoji: '🏆',
    title: 'Certificate of Achievement',
    desc: 'Complete all 12 weeks and earn a personalised certificate — perfect for a sense of pride.',
  },
];

export function JourneySection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-10 leading-tight">
            What your child gets
          </h2>

          <div className="max-w-xl mx-auto space-y-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-4"
              >
                <span className="shrink-0 text-2xl mt-0.5">{feature.emoji}</span>
                <div>
                  <p className="font-display font-extrabold text-base text-gray-800">
                    {feature.title}
                  </p>
                  <p className="font-display text-sm md:text-base text-gray-500 leading-relaxed mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload. Scroll to JourneySection.
Expected: "What your child gets" heading, 8 rows each with emoji, bold title, and description. Vertical list, not a grid.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/JourneySection.tsx
git commit -m "feat: rewrite JourneySection as WhatYouGet 8-feature list"
```

---

## Chunk 5: PricingSection + SocialProofSection rewrites

### Task 9: Rewrite PricingSection

**Files:**
- Modify: `src/components/landing/PricingSection.tsx`

Spec:
- H2: *"One price. The whole family."*
- `£19.99` large, `One-time payment · No subscription` subtext
- Urgency banner (amber/orange pill): *"Beta price — increases to £39.99 on 30 April"*
- Anchor line: *"One private tutor session costs £30–£50. This builds exam technique over 12 weeks — for less."*
- Feature list (compact): 6 items
- CTA: `Start the 12-week programme — £19.99`
- Guarantee block below CTA (green card, inline)

- [ ] **Step 1: Rewrite PricingSection.tsx**

```tsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const INCLUDES = [
  ['📚', '12-week CLEAR Method programme'],
  ['⚡', 'Fast Track mode — any timeline'],
  ['👨‍👩‍👧‍👦', 'Whole family — unlimited children'],
  ['🧘', 'Breathing & calm exercises'],
  ['📊', 'Parent progress dashboard'],
  ['🏆', 'Certificate of Achievement'],
];

export function PricingSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm" id="pricing">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-10 leading-tight">
            One price. The whole family.
          </h2>

          {/* Price card */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 rounded-2xl p-8 border border-purple-200/50 text-center mb-6">
            <p className="font-display font-extrabold text-6xl text-fuchsia-600">
              &pound;19.99
            </p>
            <p className="font-display text-base text-gray-500 mt-2 font-medium">
              One-time payment &middot; No subscription
            </p>

            {/* Urgency */}
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 border border-amber-300/60 rounded-full px-4 py-2">
              <span className="text-amber-600 text-sm">⏰</span>
              <p className="font-display text-sm text-amber-700 font-bold">
                Beta price &mdash; increases to &pound;39.99 on 30 April
              </p>
            </div>
          </div>

          {/* Anchor */}
          <p className="font-display text-base text-gray-500 text-center max-w-md mx-auto mb-8 leading-relaxed">
            One private tutor session costs &pound;30&ndash;&pound;50. This builds exam
            technique over 12 weeks &mdash; for less.
          </p>

          {/* Features */}
          <div className="max-w-md mx-auto space-y-3 mb-8">
            {INCLUDES.map(([emoji, text], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 text-gray-700 font-display text-sm md:text-base"
              >
                <span className="shrink-0 text-base">{emoji}</span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-md mx-auto text-center">
            <Link
              to="/checkout"
              className="inline-block w-full py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mb-6"
            >
              Start the 12-week programme &mdash; &pound;19.99
            </Link>

            {/* Guarantee */}
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200/50 text-center">
              <p className="font-display font-extrabold text-base text-green-800 mb-1.5">
                🛡️ 7-day money-back guarantee
              </p>
              <p className="font-display text-sm text-green-700 leading-relaxed">
                Try the full programme for 7 days. If it&rsquo;s not right for your child,
                email us and we&rsquo;ll refund in full. No forms. No questions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload. Scroll to pricing section.
Expected: "One price. The whole family." heading, £19.99 large, amber urgency pill with "30 April", anchor line, 6 feature items as vertical list, CTA button, green guarantee card below.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/PricingSection.tsx
git commit -m "feat: rewrite PricingSection with urgency date and updated features"
```

---

### Task 10: Rewrite SocialProofSection (BetaSection)

**Files:**
- Modify: `src/components/landing/SocialProofSection.tsx`

Spec:
- H2: *"We're in early access"*
- 2 paragraphs of honest beta framing (no fake testimonials)

- [ ] **Step 1: Rewrite SocialProofSection.tsx**

```tsx
import { motion } from 'framer-motion';

export function SocialProofSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md text-center mb-8 leading-tight">
          We&rsquo;re in early access
        </h2>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-white/30">
          <p className="text-gray-700 font-display text-base leading-relaxed mb-5">
            AnswerTheQuestion! launched in early 2026. We&rsquo;re a small team &mdash; one
            mum, one mission &mdash; and the families using it are our first. That means
            you&rsquo;re getting the founding price, direct access to us, and the knowledge
            that your feedback shapes the product.
          </p>

          <p className="text-gray-700 font-display text-base leading-relaxed">
            The programme is complete and live. The CLEAR Method works &mdash; it&rsquo;s
            built on research, tested at the kitchen table, and now available to every
            family preparing for 11+ and independent school entrance. We&rsquo;re proud of
            it. We think your child will be too.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify visually**

Reload. Scroll to the section before FAQ.
Expected: "We're in early access" heading, white card with 2 honest paragraphs. No fake testimonials.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/SocialProofSection.tsx
git commit -m "feat: rewrite SocialProofSection as honest BetaSection"
```

---

## Chunk 6: FaqSection header + FinalCtaSection + LandingFooter

### Task 11: Update FaqSection header text

**Files:**
- Modify: `src/components/landing/FaqSection.tsx`

The FAQ items are already correct. Only the section header needs updating: from *"Parents ask…"* to match the spec section title *"FAQ"* style. Per spec, the section is titled "FAQ" but the current friendly "Parents ask…" works well — keep it. The FAQ content (9 items including Fast Track) is already aligned with the brief.

Check: the spec says "8 Q&As from brief" but the current file has 9 comprehensive items all relevant to the product. All 9 should be kept.

- [ ] **Step 1: Verify FaqSection needs no changes**

Open `src/components/landing/FaqSection.tsx` and confirm:
- Header reads "Parents ask…" (acceptable — warm and on-brand)
- 9 Q&As covering subjects, practice papers, session length, schools, year groups, multi-child, Fast Track, subscription, and refund
- Accordion structure intact

If all correct, no edit needed.

- [ ] **Step 2: Confirm in browser**

Reload. Scroll to FAQ.
Expected: Accordion with 9 questions, all relevant, expanding on click.

---

### Task 12: Verify FinalCtaSection (already correct)

**Files:**
- Read: `src/components/landing/FinalCtaSection.tsx`

The existing `FinalCtaSection.tsx` already matches the spec exactly:
- H2: "Some questions they won't know. Don't let them lose marks on the ones they do."
- CTA: "Start the 12-week programme — £19.99"
- Below: "7-day money-back guarantee · No subscription"

The only gap: spec adds "Secure checkout powered by Stripe" to the below-button text.

- [ ] **Step 1: Add Stripe to the small print**

In `src/components/landing/FinalCtaSection.tsx`, update the small-print line:

Old:
```tsx
<p className="text-white/60 font-display text-xs mt-4">
  7-day money-back guarantee &middot; No subscription
</p>
```

New:
```tsx
<p className="text-white/60 font-display text-xs mt-4">
  7-day money-back guarantee &middot; No subscription &middot; Secure checkout powered by Stripe
</p>
```

- [ ] **Step 2: Verify**

Reload. Scroll to FinalCta section.
Expected: Small text below CTA now includes "Secure checkout powered by Stripe".

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/FinalCtaSection.tsx
git commit -m "feat: add Stripe mention to FinalCtaSection small print"
```

---

### Task 13: Update LandingFooter tagline

**Files:**
- Modify: `src/components/landing/LandingFooter.tsx`

The footer already has all 6 correct links (Privacy Policy, Terms, Refund Policy, Why It Works, Contact, Sign In). Only the tagline needs updating:

Old: `Made with 🦉 by a working mum`
New: `Made with care by a working mum.`

- [ ] **Step 1: Update tagline**

In `src/components/landing/LandingFooter.tsx`, change:

```tsx
<p className="text-white/50 font-display text-xs mt-5">
  Made with 🦉 by a working mum
</p>
```

to:

```tsx
<p className="text-white/50 font-display text-xs mt-5">
  Made with care by a working mum.
</p>
```

- [ ] **Step 2: Verify**

Reload. Scroll to footer.
Expected: "Made with care by a working mum." — no owl emoji.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/LandingFooter.tsx
git commit -m "feat: update LandingFooter tagline"
```

---

## Chunk 7: Final build check + full-page review

### Task 14: Production build and full-page walkthrough

- [ ] **Step 1: Run production build**

```bash
npm run build
```
Expected: Zero TypeScript errors. Build completes successfully.

- [ ] **Step 2: Full-page scroll on desktop**

With the dev server running, open `http://localhost:5173/` and scroll from top to bottom.

Verify section order:
1. ✅ HeroSection — new H1, "read the question" in fuchsia
2. ✅ ProblemSection — "If this sounds familiar…" + 5 bullets
3. ✅ StorySection — 3 paragraphs + 10% quote + attribution
4. ✅ GapSection — "The piece that's missing" on gradient, ghost CTA
5. ✅ ClearMethodSection — condensed, circles only row
6. ✅ ScreenshotsSection — 2 phone frames
7. ✅ JourneySection — "What your child gets", 8 feature rows
8. ✅ PricingSection — £19.99, amber urgency, guarantee inline
9. ✅ SocialProofSection — "We're in early access", 2 paragraphs
10. ✅ FaqSection — accordion, 9 items
11. ✅ FinalCtaSection — emotional close + Stripe mention
12. ✅ LandingFooter — 6 links + tagline

Verify sections NOT present:
- ❌ CalmSection — not rendered
- ❌ GuaranteeSection — not rendered
- ❌ StickyCtaBar — not rendered

- [ ] **Step 3: Check mobile (375px)**

Resize to 375px width. Scroll top to bottom.
Expected: All sections readable. ScreenshotsSection phones stack vertically. No horizontal overflow.

- [ ] **Step 4: Verify all CTAs link to /checkout**

Click each CTA button/link on the page. All should navigate to `/checkout`.
Buttons to check: Hero CTA, GapSection ghost button, PricingSection CTA, FinalCtaSection CTA.

- [ ] **Step 5: Final commit**

```bash
git add -p  # review any unstaged changes
git commit -m "feat: complete landing page rewrite per 2026-03-25 spec"
```
