# ATQ Spelling Bee -- Expansion & Launch Design Specification

**Date:** 3 April 2026
**Status:** Draft
**Author:** Rebecca Everton + Claude

---

## 1. Executive Summary

ATQ Spelling Bee is a standalone spelling app for children aged 8-11 preparing for SATs and the 11+ exam. It builds on the existing Cover-Copy-Compare study flow and SM-2 spaced repetition engine, expanding from 50 words to ~500-600 curated words across three difficulty tiers. The product uses a freemium model with a one-time paid upgrade at £9.99, cross-promoted with AnswerTheQuestion (ATQ).

The app teaches children to spell through active recall, not passive memorisation. The core loop is: hear the word, attempt the spelling, get instant feedback, review mistakes on a spaced schedule until mastered.

---

## 2. Project Context

### What Already Exists

The app at `/Users/rebeccaeverton/ATQ Spelling` has:

| Component | Status |
|---|---|
| React 19 + Vite 7 + TypeScript + Tailwind CSS 4 | Built |
| Framer Motion animations | Built |
| Supabase backend (shared auth with ATQ) | Built |
| Zustand state management with localStorage persistence | Built |
| SM-2 spaced repetition algorithm | Built + tested |
| Cover-Copy-Compare study flow (Show > Cover > Type > Compare) | Built |
| Queen Bee mascot (BeeChar with 5 moods) | Built |
| 50 words in data file | Built |
| Dev server on port 5174 | Configured |
| Vercel deployment | Configured |

### Companion Product

AnswerTheQuestion (ATQ) at answerthequestion.co.uk is a 12-week 11+ exam technique app priced at £29.99 one-time. It shares the same Supabase project, auth system, and child profiles. Same Tweenage LemonSqueezy store (#326946).

---

## 3. Business Model

### Positioning

Standalone product. Separate domain, separate checkout, separate Vercel project. Cross-promoted with ATQ but does not require it.

### Freemium Model

| Tier | Content | Access |
|---|---|---|
| **Free** | ~40-50 sample words (mix of Year 3/4 and Year 5/6 statutory) | Email capture required |
| **Paid** (£9.99) | Full statutory word lists (200 words) + 11+ vocabulary (300+ words from Atom list + curated additions) | One-time payment |

### Pricing Rationale

| Comparable Product | Price |
|---|---|
| Bond 11+ flashcards | £8-12 per pack of 200 |
| CGP flashcards | £8-10 per pack of 199 |
| Typical spelling apps | £3.99-9.99 |
| ATQ (exam technique) | £29.99 |

**Recommended price: £9.99 one-time.** This is:
- Cheaper than physical flashcard packs (and reusable, adaptive, with audio)
- At the top of the app range, justified by the curated 11+ vocabulary and spaced repetition
- Low enough to be an impulse purchase for parents already spending on 11+ prep

### Bundle Pricing

| Option | Price | Saving |
|---|---|---|
| ATQ alone | £29.99 | -- |
| Spelling Bee alone | £9.99 | -- |
| Bundle (both) | £34.99 | £4.99 |

Bundle is offered as a checkout bump in both directions (ATQ checkout offers Spelling Bee add-on, and vice versa).

### LemonSqueezy Setup

- Same Tweenage store (#326946)
- New product: "ATQ Spelling Bee"
- New variant for the £9.99 one-time payment
- Bundle variant at £34.99 (or handled via discount code logic)
- Discount codes: mirror ATQ pattern (e.g. `SPELLBETA` for 100% off during beta)

### Email Capture Flow

1. Landing page headline: "Get 40 free spelling words for SATs & 11+ prep"
2. Email input + submit
3. Email stored in Supabase (new `spelling_leads` table or reuse existing marketing table)
4. User gets immediate access to free tier (no email confirmation gate -- reduce friction)
5. Drip sequence via Resend: welcome email, usage tips at day 3, upgrade nudge at day 7

---

## 4. Word Bank

### Sources

| Source | Word Count | Difficulty | Notes |
|---|---|---|---|
| Year 3/4 statutory spellings (DfE) | 100 | D1 | Official national curriculum. Every child must learn these. |
| Year 5/6 statutory spellings (DfE) | 100 | D2 | Official national curriculum. Core SATs vocabulary. |
| Atom Learning 11+ vocabulary list | 300 | D3 | Themed words with definitions, parts of speech, example sentences. Well-established in 11+ prep. |
| Curated additions | 50-100 | D3 | High-value words from 11 Plus Guide, Keystone Tutors, common 11+ past paper vocabulary. Fill gaps in the Atom list. |
| **Total** | **~550-600** | | |

### Free Tier Word Selection

~40-50 words split roughly evenly between D1 and D2 statutory lists. Selection criteria:
- Include some "easy wins" (words most children already know) to build confidence
- Include some genuinely tricky words to demonstrate the app's value
- Do NOT include 11+ vocabulary in free tier -- that is the premium differentiator

### Word Data Structure

```typescript
interface SpellingWord {
  id: string;                    // e.g. "stat-y3y4-accommodate"
  word: string;                  // "accommodate"
  definition: string;            // Child-friendly definition
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  exampleSentence: string;       // Contextual usage
  theme: string;                 // Thematic grouping (e.g. "emotions", "settings", "movement")
  difficulty: 1 | 2 | 3;        // 1 = Year 3/4, 2 = Year 5/6, 3 = 11+ advanced
  trickyIndices: [number, number][]; // Character ranges commonly misspelled
  audioFile?: string;            // Path to ElevenLabs MP3 in Supabase Storage
  source: 'statutory-y3y4' | 'statutory-y5y6' | 'eleven-plus' | 'curated';
  isFree: boolean;               // Whether available in free tier
}
```

### Thematic Groupings

Words are grouped by theme for weekly programme cohesion. Example themes:
- **Emotions & feelings** (anxious, courageous, melancholy, euphoric)
- **Settings & places** (environment, atmosphere, metropolis, rural)
- **Movement & action** (manoeuvre, accelerate, hesitate, plummet)
- **Character & personality** (benevolent, arrogant, cunning, resilient)
- **Time & sequence** (consequently, previously, simultaneously, intermittent)
- **Science & nature** (photosynthesis, erosion, habitat, phenomenon)
- **Everyday tricky** (necessary, separate, definitely, occurred)

### Weekly Programme Structure

- **8 new words per week** (research-backed optimal for ages 9-11)
- Words grouped by theme within each week (not random)
- SM-2 handles review scheduling -- if a child masters words faster, the next batch is introduced sooner
- Programme adapts to the child's pace, but the baseline schedule is:

| Programme Length | Words Deep-Learned | Pace |
|---|---|---|
| 12 weeks | ~96 words | 8/week standard |
| 6 months | ~208 words | 8/week standard |
| Full bank | ~550-600 words | Adaptive (SM-2 driven) |

"Deep-learned" means the word has been recalled correctly at least 3 times across increasing intervals (SM-2 interval >= 8 days).

---

## 5. Features

### 5.1 Study Mode (EXISTING -- Cover-Copy-Compare)

Already built. Four phases:

1. **Show** -- Word displayed with definition, example sentence, tricky parts highlighted
2. **Cover** -- Word hidden, child must recall
3. **Type** -- Child types the spelling
4. **Compare** -- Side-by-side comparison, correct/incorrect feedback

SM-2 schedules the next review based on performance. No changes needed to core flow.

**Enhancement for expansion:** Add audio playback button during the Show phase so the child hears the pronunciation.

### 5.2 Spelling Test Mode (NEW -- core feature)

The primary new feature. Two sub-modes:

#### 5.2a Type-it Mode (Automated)

This is the default test mode. Simulates a real spelling test but with instant feedback.

**Flow:**

1. Child selects word count: 5, 10, 15, or 20 words
2. Word selection algorithm picks words based on:
   - Current week's theme (prioritised)
   - Words due for SM-2 review
   - Mix of new and review words (ratio: ~60% new, ~40% review)
3. For each word:
   a. Audio plays the word pronunciation (auto-play)
   b. Audio plays the word in a sentence (optional, togglable in settings)
   c. Child types the spelling into the input field
   d. "Repeat" button replays the audio
   e. Timer shows elapsed time (informational, not punishing)
   f. Child presses Enter or taps "Next"
   g. Instant feedback: green flash + tick for correct, red flash + correct spelling shown for incorrect
   h. Brief pause (1.5s), then next word
4. After all words:
   - Score summary: X/Y correct
   - List of incorrect words with correct spellings
   - "Practice these words" button (sends incorrect words to Drill mode)
   - Wrong words added to SM-2 queue with lowered ease factor

**UI Layout:**

```
+------------------------------------------+
|  Queen Bee (encouraging mood)             |
|                                           |
|  Word 3 of 10          [Repeat audio]     |
|                                           |
|  +--------------------------------------+ |
|  |  [text input field]                  | |
|  +--------------------------------------+ |
|                                           |
|  [Show definition hint]     [Next >>]     |
|                                           |
|  Progress: === === ===  .  .  .  .  .  .  |
+------------------------------------------+
```

Progress dots at the bottom: green = correct, red = incorrect, grey = upcoming.

#### 5.2b Write-it Mode (Parent-Assisted / Self-Check)

For children who prefer writing on paper, or for parent-led practice.

**Flow:**

1. Same word selection as Type-it mode
2. For each word:
   a. Audio plays the word pronunciation
   b. Screen shows: "Write this word on your paper"
   c. Child writes on physical paper
   d. Child taps "I've written it" button
   e. App shows the correct spelling
   f. Child (or parent) taps "I got it right" (green) or "I got it wrong" (red)
3. Same scoring and SM-2 integration as Type-it mode

**Why this matters:** Many 11+ exams and SATs require handwriting. Typing is not the same motor skill. This mode bridges the gap.

### 5.3 Drill Mode (NEW -- Diminishing Set)

Takes words the child got wrong and drills them until mastered. The set shrinks as words are mastered -- visible, motivating progress.

**Flow:**

1. Entry points: "Practice these words" from test results, or "Drill weak words" from dashboard
2. Pool: all words the child has got wrong in recent tests (or manually selected words)
3. Mini-test of 5 words at a time (shuffled from the pool)
4. For each word: same audio + type + feedback as Type-it mode
5. A word is "drilled" (removed from the pool) when spelled correctly 3 times in a row across drill sessions
6. After each mini-test: show remaining pool size
7. When pool reaches 0: celebration screen, Queen Bee in celebrating mood

**Visual progress:**

```
+------------------------------------------+
|  Drill Mode                               |
|                                           |
|  12 words left to master                  |
|  [=========-----------]  12/20            |
|                                           |
|  (word input UI same as Type-it)          |
+------------------------------------------+
```

The progress bar shrinks as words are mastered. Numbers update in real time.

**Data model:** Drill state stored in Zustand with localStorage persistence:

```typescript
interface DrillState {
  pool: string[];           // word IDs remaining
  correctStreak: Record<string, number>;  // word ID -> consecutive correct count
  totalDrilled: number;     // words removed from pool (mastered)
  startedAt: string;        // ISO date
}
```

### 5.4 Random Review Tests (NEW)

Prevents forgetting by periodically testing previously mastered words.

**Logic:**
- SM-2 already schedules reviews at increasing intervals
- Random Review pulls words where `nextReview <= today` from the mastered pool
- Presented as a "Quick Review" card on the dashboard: "You have 8 words to review today"
- Test format is identical to Type-it mode but with a fixed 10-word count
- If the child gets a review word wrong, its SM-2 ease factor drops and it re-enters the active learning queue

**Scheduling:**
- Day 1 after mastery: first review
- Day 3: second review
- Day 7: third review
- Day 14, 30, 60: subsequent reviews (SM-2 intervals)
- After 60-day interval with correct recall: word is "permanently mastered" (still reviewed occasionally but at very long intervals)

### 5.5 Word Explorer (NEW)

A browse-and-discover mode for children (and parents) to explore the word bank.

**Features:**
- Browse all words by: theme, difficulty, or alphabetically
- Filter: "Show only words I haven't learned yet" / "Show mastered words" / "Show all"
- Tap a word to see:
  - Definition
  - Part of speech
  - Example sentence
  - Hear pronunciation (audio button)
  - Tricky parts highlighted
  - SM-2 status: new / learning / mastered
- Search bar for finding specific words
- Downloadable PDF word list (for parents to print)

**PDF Generation:**
- Client-side using jsPDF (same approach as ATQ certificates)
- Formatted as a printable word list: word, definition, example sentence
- Grouped by theme or difficulty (user choice)
- Queen Bee branding in header

### 5.6 Progress Dashboard

**Metrics displayed:**

| Metric | Description |
|---|---|
| Words mastered / total | e.g. "127 / 547 words mastered" with progress ring |
| Current week | "Week 4 of 12" (or adaptive based on pace) |
| Words learned this week | "6 / 8 new words this week" |
| Streak | Consecutive days of practice |
| Accuracy trend | Line chart: last 7 days / 4 weeks accuracy % |
| Words to review today | Count of SM-2 due reviews |
| Weakest words | Top 5 words with lowest SM-2 ease factor |
| Time spent | Total practice time this week |

**Visual style:** Match ATQ dashboard -- violet-fuchsia gradient palette, frosted glass cards. Queen Bee replaces Professor Hoot.

### 5.7 Email Capture / Free Tier Gating

**Landing page flow:**

1. Hero section: "Master 500+ spellings for SATs & 11+" with Queen Bee
2. Social proof: "Join X families preparing for exams"
3. Email gate: "Enter your email to get 40 free spelling words"
4. Email submitted -> stored in Supabase -> immediate access to free tier
5. Free tier: Study mode + Type-it test mode, limited to `isFree: true` words
6. Upgrade prompt appears when child tries to access a paid word or after completing the free word set

**Gating logic:**

```typescript
function canAccessWord(word: SpellingWord, hasPaid: boolean): boolean {
  return word.isFree || hasPaid;
}
```

All features (Study, Test, Drill, Explorer) work in free tier but with the limited word set. No feature gating -- only content gating.

---

## 6. Audio Strategy

### Primary: ElevenLabs Voice Clone

- Clone the user's own voice (or select a suitable child-friendly British English voice)
- Generate all ~550-600 word pronunciations as individual MP3 files
- Batch generation using ElevenLabs API
- Estimated cost: ~£5 (one month Starter plan at £5/mo, generate all files, cancel)

**File naming convention:** `{word-id}.mp3` (e.g. `stat-y3y4-accommodate.mp3`)

**Storage:** Supabase Storage, private bucket (`spelling-audio`), accessed via signed URLs (same pattern as ATQ crib sheet PDF).

**Generation script:** A one-time Node.js script that:
1. Reads all words from the TypeScript data files
2. Calls ElevenLabs TTS API for each word
3. Saves MP3 to local directory
4. Uploads batch to Supabase Storage

### Fallback: Browser Web Speech API

For any missing audio files or as the v1 implementation before ElevenLabs is set up:

```typescript
function speakWord(word: string): void {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-GB';
  utterance.rate = 0.85; // Slightly slower for clarity
  speechSynthesis.speak(utterance);
}
```

**Limitations:** Voice quality varies by browser/OS. Not suitable for production long-term, but acceptable for MVP.

### Audio for Example Sentences

Optional enhancement: generate audio for each word's example sentence as well. This doubles the audio file count but significantly helps children who learn better by hearing context. Defer to Phase 2.

---

## 7. Technical Architecture

### Stack

Identical to existing app -- no new dependencies needed except potentially jsPDF for PDF generation.

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand with persist middleware |
| Database | Supabase (shared project with ATQ) |
| Payments | LemonSqueezy (Tweenage store #326946) |
| Email | Resend |
| Deployment | Vercel (separate project from ATQ) |
| Audio | ElevenLabs (generated) + Web Speech API (fallback) |

### Supabase Schema (New Tables)

```sql
-- Word progress per child (SM-2 state)
CREATE TABLE spelling_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review DATE DEFAULT CURRENT_DATE,
  correct_streak INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, word_id)
);

-- Test session records
CREATE TABLE spelling_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL, -- 'study' | 'test-type' | 'test-write' | 'drill' | 'review'
  word_count INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_time_ms INTEGER,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual word results within a session
CREATE TABLE spelling_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES spelling_sessions(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  word_id TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  typed_answer TEXT, -- What the child typed (null for write-it mode)
  time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email leads for free tier
CREATE TABLE spelling_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment tracking (mirrors ATQ pattern)
CREATE TABLE spelling_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lemonsqueezy_order_id TEXT UNIQUE,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT,
  status TEXT DEFAULT 'pending',
  include_bundle BOOLEAN DEFAULT FALSE, -- Whether this is a bundle purchase
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:** Same pattern as ATQ. Children can read/write their own `spelling_progress`, `spelling_sessions`, and `spelling_results` rows. Parents can read their children's data. Service role key used in webhooks.

**Add column to child_profiles:**

```sql
ALTER TABLE child_profiles
ADD COLUMN IF NOT EXISTS has_paid_spelling BOOLEAN DEFAULT FALSE;
```

### Word Data Files

Words stored as TypeScript files in `src/data/words/`, following the same pattern as ATQ question files:

```
src/data/words/
  statutory-y3y4.ts      -- 100 words
  statutory-y5y6.ts      -- 100 words
  eleven-plus-a-d.ts     -- ~75 words (A-D)
  eleven-plus-e-l.ts     -- ~75 words (E-L)
  eleven-plus-m-r.ts     -- ~75 words (M-R)
  eleven-plus-s-z.ts     -- ~75 words (S-Z)
  curated.ts             -- 50-100 words
  index.ts               -- Re-exports all words as a single array
  types.ts               -- SpellingWord interface
```

Vite manual chunks config: add a `spelling-words` chunk for code-splitting (same as ATQ's `questions` chunk).

### Zustand Stores

**`useSpellingStore`** -- Core spelling state:

```typescript
interface SpellingStore {
  // SM-2 progress (synced to Supabase, offline-first)
  wordProgress: Record<string, SM2State>;

  // Drill state
  drillPool: string[];
  drillStreaks: Record<string, number>;

  // Session tracking
  currentSession: SpellingSession | null;

  // Actions
  recordResult: (wordId: string, correct: boolean) => void;
  getWordsForReview: () => SpellingWord[];
  getWeeklyWords: (week: number) => SpellingWord[];
  startDrill: (wordIds: string[]) => void;
  completeDrill: (wordId: string) => void;
  syncToSupabase: () => Promise<void>;
}
```

**`useSpellingPaywall`** -- Payment gating:

```typescript
interface SpellingPaywallStore {
  hasPaid: boolean;  // Sourced from Supabase child_profiles.has_paid_spelling
  canAccessWord: (word: SpellingWord) => boolean;
}
```

### Edge Functions (New)

| Function | Purpose | Rate Limit |
|---|---|---|
| `create-spelling-checkout` | Creates LemonSqueezy checkout for Spelling Bee | 10/min |
| `spelling-webhook` | Handles `order_created` for Spelling Bee purchases | 100/min |
| `claim-spelling-payment` | Matches unclaimed spelling payments by email | 10/min |
| `capture-spelling-lead` | Stores email lead, triggers welcome email | 10/min |

These mirror the ATQ Edge Function patterns exactly. Shared CORS config, shared rate limiter, shared Resend setup.

---

## 8. Cross-Promotion with ATQ

### ATQ Checkout Bump

In the ATQ `create-checkout-session`, add an optional bump:
- "Add Spelling Bee -- Master 500+ spellings (£9.99 £4.99 when bundled)"
- If selected, the checkout total becomes £34.99
- The webhook marks both `has_paid` and `has_paid_spelling` on the child profile

### Spelling Bee Checkout Bump

In the Spelling Bee checkout, add an ATQ bump:
- "Add AnswerTheQuestion -- 12-week exam technique programme (£29.99 £24.99 when bundled)"
- Same bundle price: £34.99 total

### Shared Auth Experience

Both apps share the same Supabase auth. A parent who already has an ATQ account:
1. Visits Spelling Bee
2. Logs in with existing credentials
3. Sees their existing child profiles
4. Can start using Spelling Bee immediately (free tier) or purchase

No new account creation needed. The `child_profiles` table is shared.

### Cross-Links

- ATQ dashboard: "New! Spelling Bee -- Master 500+ spellings" card with link
- Spelling Bee dashboard: "Also from ATQ: 12-week exam technique programme" card with link
- Both apps share the Queen Bee / Professor Hoot mascot universe

---

## 9. Exam Urgency Feature

### Countdown Display

Dashboard card showing:
- "X weeks until SATs" (if SATs date set -- fixed nationally, mid-May each year)
- "X weeks until 11+" (if 11+ exam date set -- varies by region, typically September)
- "Your child can master Y words before exam day" (calculated from current pace)

### Exam Date Input

Settings page: dropdown for exam type (SATs / 11+) + date picker.

SATs dates are pre-populated (known annually). 11+ dates must be entered manually (vary by region and school).

### Urgency Messaging

| Weeks Until Exam | Message |
|---|---|
| 12+ | "Great start -- plenty of time to master every word" |
| 8-12 | "On track -- keep up the daily practice" |
| 4-8 | "Sprint time -- focus on your weakest words" |
| 1-4 | "Final push -- drill mode every day this week" |
| 0 | "Exam day -- you've got this!" |

Queen Bee mood matches urgency level (calm -> encouraging -> determined -> celebrating).

---

## 10. Build Phases

### Phase 1: MVP (24-hour sprint)

**Goal:** Shippable product with core value proposition.

| Task | Estimated Time | Priority |
|---|---|---|
| Expand word bank: add all 200 statutory words to data files | 3 hours | P0 |
| Expand word bank: add 300 Atom 11+ words to data files | 4 hours | P0 |
| Implement Spelling Test mode (Type-it only) | 3 hours | P0 |
| Implement Drill mode (diminishing set) | 2 hours | P0 |
| Add browser TTS audio playback (Web Speech API fallback) | 1 hour | P0 |
| Basic landing page with email capture | 2 hours | P0 |
| LemonSqueezy checkout integration | 2 hours | P0 |
| Free tier gating (isFree flag on words) | 1 hour | P0 |
| Wire up Supabase tables + RLS policies | 2 hours | P0 |
| Deploy to Vercel | 1 hour | P0 |
| **Total** | **~21 hours** | |

**Deferred from Phase 1:**
- Write-it mode
- ElevenLabs audio
- Word Explorer
- PDF downloads
- Cross-promotion with ATQ
- Random Review tests
- Curated word additions (50-100 words)

### Phase 2: Polish (next week)

| Task | Estimated Time | Priority |
|---|---|---|
| ElevenLabs audio generation (batch script) | 2 hours | P1 |
| Upload audio to Supabase Storage | 1 hour | P1 |
| Integrate ElevenLabs audio (replace TTS fallback) | 1 hour | P1 |
| Write-it mode (parent-assisted) | 2 hours | P1 |
| Downloadable PDF word lists (jsPDF) | 2 hours | P1 |
| Email capture flow + Resend drip sequence | 3 hours | P1 |
| Cross-promotion cards in ATQ dashboard | 1 hour | P1 |
| Progress dashboard enhancements (charts, trends) | 2 hours | P1 |
| Exam date countdown feature | 1 hour | P1 |
| Add curated word additions (50-100 words) | 3 hours | P1 |
| **Total** | **~18 hours** | |

### Phase 3: Growth (weeks 2-4)

| Task | Estimated Time | Priority |
|---|---|---|
| Random Review tests | 2 hours | P2 |
| Word Explorer browse mode | 3 hours | P2 |
| ATQ checkout bundle integration | 3 hours | P2 |
| Parent dashboard (per-child spelling analytics) | 3 hours | P2 |
| Referral system (shared with ATQ) | 2 hours | P2 |
| SEO landing pages (one per word list: "Year 5/6 statutory spellings", "11+ vocabulary list") | 3 hours | P2 |
| **Total** | **~16 hours** | |

---

## 11. Word Selection Algorithm

### For Spelling Tests

```
function selectTestWords(count: number, childProgress: SM2State[], weekConfig: WeekConfig): SpellingWord[] {
  1. Get this week's themed words (up to 60% of count)
  2. Get words due for SM-2 review (up to 40% of count)
  3. If still under count, pull from next week's theme
  4. If still under count, pull random unlearned words
  5. Shuffle the final selection
  6. Return
}
```

### For Drill Mode

```
function selectDrillWords(drillPool: string[]): SpellingWord[] {
  1. Take up to 5 words from the pool
  2. Prioritise words with lowest correct_streak (most struggled)
  3. Shuffle
  4. Return
}
```

### For Random Review

```
function selectReviewWords(): SpellingWord[] {
  1. Get all words where next_review <= today AND mastered == true
  2. Take up to 10
  3. Prioritise longest time since last review
  4. Return
}
```

---

## 12. SM-2 Integration Notes

The existing SM-2 implementation handles the core algorithm. Key adaptations for the expanded app:

- **Test results feed SM-2:** After each test, every word result is fed into `recordResult()` which updates the SM-2 state
- **Drill results feed SM-2:** Drill completions also update SM-2, but with a bonus -- 3 correct in drill = stronger ease factor boost
- **Mastery threshold:** A word is "mastered" when `interval_days >= 8` AND `correct_streak >= 3`
- **Regression:** If a mastered word is answered incorrectly in a review test, it loses mastered status and re-enters the active queue

---

## 13. Design Specifications

### Visual Language

Consistent with ATQ's design system but with Spelling Bee's own identity:

| Element | Specification |
|---|---|
| Background | Amber/honey gradient (warm, bee-themed) |
| Cards | Frosted glass (same as ATQ) |
| Primary accent | Amber-500 / Yellow-400 |
| Secondary accent | Violet-500 (shared with ATQ for brand cohesion) |
| Mascot | Queen Bee (BeeChar) -- 5 moods: happy, thinking, teaching, warning, celebrating |
| Fonts | Nunito (display) + Inter (body) -- same as ATQ |
| Animations | Framer Motion -- same patterns as ATQ |

### Queen Bee Moods by Context

| Context | Mood |
|---|---|
| Study mode (showing word) | teaching |
| Waiting for input | thinking |
| Correct answer | happy |
| Incorrect answer | warning (not angry -- encouraging) |
| Test complete (good score) | celebrating |
| Drill complete | celebrating |
| Dashboard idle | happy |

### Mobile-First

All features must work on mobile. The typing input must be comfortable on phone keyboards. Test mode should work in portrait orientation.

---

## 14. Analytics & Tracking

### Key Metrics

| Metric | How Measured |
|---|---|
| Email capture rate | `spelling_leads` table count / landing page visits |
| Free-to-paid conversion | Payments / email captures |
| Daily active users | Unique `child_id` in `spelling_sessions` per day |
| Words mastered per child | Count of `mastered = true` in `spelling_progress` |
| Retention (day 7, day 30) | Return visits after first session |
| Average accuracy | `correct_count / word_count` across sessions |
| Most misspelled words | Aggregate from `spelling_results` where `correct = false` |

### Tracking Implementation

- Supabase tables provide all analytics data (no third-party analytics needed for MVP)
- Parent dashboard shows per-child metrics
- Admin queries for aggregate metrics (run manually via Supabase dashboard)

---

## 15. Security

### Same Standards as ATQ

- All secrets in environment variables, never in code
- RLS on all Supabase tables
- LemonSqueezy webhook signature verification (HMAC-SHA256)
- Rate limiting on all Edge Functions
- Signed URLs for audio files (private Supabase Storage bucket)
- CORS whitelist for production domains + Vercel previews + localhost
- Paywall enforced server-side only (no localStorage bypass)
- `console.log` stripped in production builds
- CSP headers in `vercel.json`

### Audio File Security

Audio files in Supabase Storage use signed URLs with short expiry (120 seconds). This prevents hotlinking and ensures only authenticated users can access paid content audio.

Free tier audio files can use longer-lived signed URLs or public access (since the words themselves are free).

---

## 16. Domain & Deployment

### Domain Options

Recommended: **spellingbee.answerthequestion.co.uk** (subdomain of ATQ)

Alternative: **atqspelling.co.uk** (separate domain)

The subdomain approach is simpler (no new domain purchase, shared SSL, brand cohesion) and better for SEO (domain authority inheritance).

### Vercel Setup

- Separate Vercel project (not the same as ATQ)
- Connected to its own GitHub repo or a monorepo subfolder
- Auto-deploys from Git
- `vercel.json` with security headers (mirror ATQ pattern)
- SPA rewrites for client-side routing

---

## 17. Open Questions

1. **Voice for audio:** Use the user's own voice clone, or a professional British English child-friendly voice from ElevenLabs library?
2. **Domain:** Subdomain of ATQ or separate domain?
3. **Bundle implementation:** LemonSqueezy product bundle, or discount code applied at checkout?
4. **SATs date auto-detection:** Pre-populate SATs dates (they are nationally fixed) or always require manual input?
5. **Offline support:** Should the app work offline (PWA with cached audio)? This significantly increases complexity.
6. **Multi-child support:** Already handled via shared `child_profiles`, but need to confirm `has_paid_spelling` is per-parent or per-child.

---

## 18. Success Criteria

### MVP Launch (Phase 1)

- [ ] 500+ words in data files with complete metadata
- [ ] Type-it spelling test mode working end-to-end
- [ ] Drill mode working with diminishing set
- [ ] Audio playback working (TTS fallback acceptable)
- [ ] LemonSqueezy checkout accepting payments
- [ ] Free tier gating working correctly
- [ ] Landing page with email capture
- [ ] Deployed to Vercel and accessible via URL

### Week 1 Post-Launch (Phase 2)

- [ ] ElevenLabs audio integrated
- [ ] Write-it mode available
- [ ] PDF word lists downloadable
- [ ] Email drip sequence active
- [ ] Cross-promotion visible in ATQ

### Month 1 (Phase 3)

- [ ] 50+ email signups
- [ ] 10+ paid conversions
- [ ] Word Explorer live
- [ ] Bundle checkout working
- [ ] Average 3+ sessions per active child per week
