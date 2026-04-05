# ATQ Spelling Bee — Design Specification v2

**Date:** 4 April 2026
**Status:** Approved — ready for implementation
**Author:** Rebecca Everton + Claude
**Supersedes:** `2026-04-03-spelling-bee-expansion-design.md`

---

## 1. Product Overview

ATQ Spelling Bee is a vocabulary and spelling app for children aged **7–10** (Years 3–6) preparing for SATs and the 11+ exam. It teaches spelling through multi-sensory learning: children hear the word, understand what it means, see it in context, learn related word forms, and practise spelling through active recall using the Spelling Bee ritual.

This is not just a spelling drill — it is a **vocabulary builder**. Every word comes with its definition(s), example sentences, synonyms, antonyms, word family, and (where possible) a visual image. The app uses SM-2 spaced repetition to schedule reviews and a 3-star mastery system to show progress on a visual bingo grid.

### Companion Product

AnswerTheQuestion (ATQ) at answerthequestion.co.uk is a 12-week 11+ exam technique app priced at £29.99 one-time. Spelling Bee shares the same Supabase project, auth system, and child profiles. Same Tweenage LemonSqueezy store (#326946).

---

## 2. Business Model

### Pricing

| Option | Price |
|---|---|
| Spelling Bee alone | **£19.99** one-time |
| ATQ alone | £29.99 one-time |
| Bundle (both) | **£39.99** (save £9.99) |

**Pricing rationale:** £19.99 is less than a single tutoring session (£40–60/hour) and positions the app as a serious tool rather than a throwaway. The bundle at £39.99 is a no-brainer for parents already buying one product.

### Freemium Model

| Tier | Content | Access |
|---|---|---|
| **Free** | ~40–50 sample words (mix of D1 and D2 statutory) | Email capture required |
| **Paid** (£19.99) | Full word bank: ~500 words (200 statutory + ~300 11+ vocabulary) | One-time payment |

All features (flashcards, tests, drill, homework mode) are available in the free tier — only **content** is gated, not features. This lets parents and children experience the full app before paying.

### Email Capture Flow

1. Landing page: "Get 40 free spelling words for SATs & 11+ prep"
2. Email input → stored in Supabase
3. Immediate access to free tier (no email confirmation gate)
4. Drip sequence via Resend: welcome email, usage tips at day 3, upgrade nudge at day 7

### LemonSqueezy Setup

- Same Tweenage store (#326946)
- New product: "ATQ Spelling Bee" at £19.99
- Bundle offered as checkout bump in both directions (ATQ offers Spelling Bee add-on, Spelling Bee offers ATQ add-on)
- Discount codes: SPELLBETA (100% off for beta), matching ATQ pattern

---

## 3. Target Audience & Progression

### Age Range: 7–10 (Years 3–6)

Children start 11+ preparation at different ages. The app accommodates all entry points:

| Starting Year | Typical Path |
|---|---|
| Year 3 (age 7–8) | D1 → D2 → D3 over 6–12 months |
| Year 4 (age 8–9) | D1 quickly → D2 → D3 over 6–9 months |
| Year 5 (age 9–10) | D1 as warmup → D2 → D3 over 3–6 months |
| Year 6 (age 10) | Placement test → start where needed |

### Placement Test

On first use, the child takes a quick 10-word assessment:
- 3 words from D1 (Year 3/4 statutory)
- 3 words from D2 (Year 5/6 statutory)
- 4 words from D3 (11+ vocabulary)

Results determine the starting tier and pre-populate SM-2 state so already-known words don't clog the queue. A Year 5 child who already knows the D1 words starts at D2 immediately.

### Pacing

- **8 new words per week** (research-backed optimal for ages 7–10)
- Words grouped by **theme** within each week (not random)
- ~32 new words per month at standard pace (8/week × 4 weeks)
- SM-2 handles review scheduling — if a child masters words faster, the next batch is introduced sooner
- The full ~500 word bank takes 6+ months at standard pace, or faster if the child already knows many words (placement test skips ahead)

| Programme Length | Words Deep-Learned | Pace |
|---|---|---|
| 12 weeks | ~96 words | 8/week standard |
| 6 months | ~208 words | 8/week standard |
| Full bank | ~500 words | Adaptive (SM-2 driven) |

"Deep-learned" means spelled correctly at least 3 times across increasing spaced intervals (SM-2 interval ≥ 8 days).

---

## 4. Word Data Model

Each word contains rich vocabulary data, modelled on the Atom flashcard format and expanded with word families and mnemonics.

### SpellingWord Interface

```typescript
interface WordDefinition {
  definition: string;           // Child-friendly definition
  exampleSentence: string;      // Contextual usage
  synonyms: string[];           // e.g. ["falsify", "invent", "forge"]
  antonyms?: string[];          // e.g. ["release", "liberate"]
}

interface SpellingWord {
  id: string;                   // e.g. "y34-separate", "atom-fabricate"
  word: string;                 // "fabricate"
  definitions: WordDefinition[]; // Multiple meanings supported (like Atom cards)
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  wordFamily: string[];         // ["fabricated", "fabricating", "fabrication", "fabricator"]
  trickyIndices: [number, number][]; // Character ranges commonly misspelled, highlighted in amber
  mnemonic?: string;            // "there's A RAT in sepARATE" (pre-built for tricky words)
  imageUrl?: string;            // Path to illustration in Supabase Storage
  audioFile?: string;           // Path to ElevenLabs MP3 in Supabase Storage
  theme: string;                // e.g. "Deception & Truth", "Nature & Forests"
  difficulty: 1 | 2 | 3;       // 1 = Year 3/4, 2 = Year 5/6, 3 = 11+ advanced
  source: 'statutory-y3y4' | 'statutory-y5y6' | 'eleven-plus' | 'curated';
  isFree: boolean;              // Whether available in free tier
}
```

### Word Bank Sources

| Source | Count | Difficulty | Notes |
|---|---|---|---|
| Year 3/4 statutory spellings (DfE) | 100 | D1 | Official national curriculum |
| Year 5/6 statutory spellings (DfE) | 100 | D2 | Official national curriculum |
| Atom Learning 11+ vocabulary | ~300 | D3 | Themed words from established 11+ prep resource |
| Curated additions (Phase 3) | 50–100 | D3 | High-value words from 11+ past papers, filling Atom gaps. Deferred to Phase 3. |
| **Phase 1 Total** | **~500** | | 200 statutory + ~300 Atom |
| **Final Total (Phase 3)** | **~550–600** | | + curated additions |

### Free Tier Word Selection (~40–50 words)

Split roughly evenly between D1 and D2 statutory lists:
- Include some "easy wins" to build confidence
- Include some genuinely tricky words to demonstrate the app's value
- No 11+ vocabulary in free tier — that is the premium differentiator

### Thematic Groupings

Words are grouped by theme for weekly programme cohesion. Example themes from the Atom list:
- **Emotions & Character** (anxious, empathetic, resolute, sullen)
- **Nature & Forests** (canopy, majestic, serene, verdant)
- **Movement** (bolt, dart, glide, trudge, stagger)
- **Science & Discovery** (breakthrough, observation, pioneer, theory)
- **Deception & Truth** (fabricate, conceal, elusive, revelation)
- **Everyday Tricky** (necessary, separate, definitely, occurred)

### Word Families

Each word includes 3–5 related forms showing morphological patterns:
- *remember → remembered, remembering, remembrance, memorable*
- *fabricate → fabricated, fabricating, fabrication, fabricator*
- *populate → populated, populating, population, populous*

This teaches children that learning one root "unlocks" multiple words. Research (Nunes & Bryant, 2006) shows morphological instruction transfers to untaught words sharing the same patterns.

### Mnemonics

Pre-built spelling tips for commonly misspelled words:
- **BECAUSE** — Big Elephants Can Always Understand Small Elephants
- **SEPARATE** — There's A RAT in sepARATE
- **NECESSARY** — Never Eat Cake, Eat Salmon Sandwiches And Remain Young
- **RHYTHM** — Rhythm Helps Your Two Hips Move
- **ISLAND** — An island IS LAND
- **BELIEVE** — Never beLIEve a LIE
- **WEDNESDAY** — WED-NES-DAY (syllabic decomposition)

Children can also create their own mnemonics (self-generated mnemonics are 2–3x more effective — Slamecka & Graf, 1978).

---

## 5. Learning Modes

Five modes supporting different learning styles. All *test and practice* modes (Type It, Write It, Drill, Homework) use the Spelling Bee ritual by default. Flashcard Mode is passive study and does not include the ritual.

### 5.1 Flashcard Mode (Study)

Digital version of the Atom flashcards with animated flip interaction.

**Front of card:** Word in large bold text, colour-coded by theme (matching Atom's front-of-card style). Star rating overlay (0–3) showing mastery status.

**Back of card:**
- Theme-coloured header bar with word in white (matching Atom's header style)
- Part of speech on cream highlight bar with definition (matching Atom's peach bars)
- Multiple definitions supported (like Atom's "fabricate" card showing two meanings)
- Example sentence in italics
- Synonyms and antonyms
- Word family tree (branching visual showing related forms)
- Illustration representing the word's meaning (like Atom's cartoons)
- Audio play button — hear pronunciation, definition, and example sentence
- Mnemonic tip (if available)

Child taps to flip, swipes to next word. Queen Bee reacts to each word with contextual mood.

### 5.2 Spelling Bee Mode (The Oral Ritual)

The core learning mechanic, used before typing in all test modes. Adapted from the American spelling bee protocol and the Simultaneous Oral Spelling (SOS) method (Bradley & Bryant, 1983).

**Flow:**

1. App plays the word aloud: *"Fabricate"*
2. Screen shows: **"Say the word out loud"** + **Done** button. Child says it, taps Done.
3. Screen shows: **"Now spell it out loud, letter by letter"** + **Done** button. Child spells aloud: *"F-A-B-R-I-C-A-T-E"*, taps Done.
4. Screen shows: **"Say the word one more time"** + **Done** button. Child says it, taps Done.
5. Input field appears: **"Now type it"**

**Why this works:** The word → letters → word sandwich activates phonological, sequential, and whole-word memory simultaneously. No microphone needed — the learning benefit comes from the child speaking aloud, not from the app listening. Research confirms letter-by-letter speech recognition is not viable for children (30–50% accuracy — Kennedy et al., 2017), but prompted vocalisation without recognition preserves all the pedagogical benefit.

**Toggleable setting:** "Spelling Bee mode" on/off. Default: on. Can be turned off for quiet environments (e.g. library, late evening). When off, the child goes straight to typing.

Queen Bee is on screen throughout, giving encouraging reactions. One button, same position each time — simple and consistent.

### 5.3 Spelling Test — Type It

The primary test mode. Blends the American bee protocol (hear it, ask for context) with UK written test format (type the answer).

**Flow:**

1. Child selects word count: 5, 10, 15, or 20 words
2. Word selection algorithm picks words based on current week's theme (60%) and SM-2 review queue (40%)
3. For each word:
   a. **Spelling Bee ritual** (steps 1–4 above, if enabled)
   b. Child types the spelling in the input field
   c. "Repeat" button replays the audio
   d. Optional: tap to hear definition or example sentence
   e. Child presses Enter or taps "Next"
   f. **Instant letter-by-letter feedback**: green for correct letters, red for incorrect, correct spelling shown
   g. Brief pause (1.5s), then next word
4. After all words:
   - Score summary: X/Y correct
   - List of incorrect words with correct spellings
   - **"Drill these words"** button (sends incorrect words to Drill mode)
   - Wrong words added to SM-2 queue with lowered ease factor

**No time pressure.** An optional elapsed time is shown (informational only) for children who want to track speed. Research shows spelling accuracy benefits from calm, unpressured practice.

**Progress dots** at the bottom: green = correct, red = incorrect, grey = upcoming.

### 5.4 Spelling Test — Write It (Parent-Assisted)

For children who prefer writing on paper, or for parent-led practice.

**Flow:**

1. Same word selection as Type It mode
2. For each word:
   a. **Spelling Bee ritual** (if enabled)
   b. Screen shows: "Write this word on your paper"
   c. Child writes on physical paper
   d. Child taps "I've written it"
   e. App shows the correct spelling
   f. Child (or parent) taps "I got it right" (green) or "I got it wrong" (red)
3. Same scoring and SM-2 integration as Type It mode

**Why this matters:** Many 11+ exams and SATs require handwriting. Typing is not the same motor skill. Handwriting activates the left fusiform gyrus (the "visual word form area") more strongly than typing (Longcamp et al., 2005).

### 5.5 Drill Mode (Diminishing Set)

Takes words the child got wrong and drills them until mastered. The set shrinks as words are mastered — visible, motivating progress.

**Flow:**

1. Entry points: "Drill these words" from test results, or "Drill weak words" from dashboard
2. Pool: all words the child got wrong in recent tests (or manually selected words)
3. Mini-test of 5 words at a time (shuffled from the pool, prioritising words with lowest correct streak)
4. For each word: Spelling Bee ritual + type + feedback (same as Type It)
5. A word exits the drill when spelled correctly **3 times in a row** across drill sessions
6. After each mini-test: show remaining pool size
7. When pool reaches 0: celebration screen, Queen Bee in celebrating mood, confetti

**Visual progress:**

```
+------------------------------------------+
|  Drill Mode                               |
|                                           |
|  12 words left to master                  |
|  [=========-----------]  8/20 mastered    |
|                                           |
|  (word input UI same as Type It)          |
+------------------------------------------+
```

The progress bar grows as words are mastered. Numbers update in real time.

### 5.6 Homework Mode (Custom Words)

For when a child comes home with spelling words for Friday's test.

**Flow:**

1. Parent/child taps **"Add School Words"** from the home screen
2. Types in up to 20 words (simple text input, one per line or comma-separated)
3. Child names the list (e.g. "This Week's Homework") or it defaults to "School Words"
4. App creates a **temporary custom list** with the full treatment: Spelling Bee mode, test mode, drill mode, and a mini bingo grid
5. **Auto-matching:** If the child types "separate" and it's already in the D2 word bank, the app pulls in the full data (definition, synonyms, image, word family). For unknown words, the app works with just the spelling — no definition or image required
6. List persists until the child deletes it or creates a new one

This makes the app useful **every single week** for school homework, not just long-term 11+ prep.

**Input validation:** Words are trimmed, lowercased, and deduplicated. Maximum 10 concurrent custom lists per child. Words with apostrophes (e.g. "it's") and hyphens (e.g. "well-known") are accepted. If a child misspells the input word itself, the app cannot detect this — the parent should verify the list.

**Custom word IDs:** Words not in the built-in bank get a generated `word_id` of the form `custom-{listId}-{word}` (e.g. `custom-abc123-bicycle`). This allows them to have `spelling_progress` rows and participate in the star system like any other word.

---

## 6. Progress & Gamification

### 6.1 The Bingo Grid

The centrepiece of progress tracking. A visual 10×10 grid of all words in the current block (100 words per block). Each cell shows the word text and its mastery state:

| State | Stars | Visual | How Earned |
|---|---|---|---|
| Not attempted | 0 | Grey/empty | — |
| Seen it | 1 | Bronze | Attempted at least once (any result) |
| Getting there | 2 | Silver | Correct in 2 **separate sessions** (different sessions, not same sitting) |
| Mastered | 3 | Gold (with subtle glow) | Correct in 3 separate sessions with SM-2 spaced intervals (interval ≥ 8 days) |

**Star rules:** "Separate sessions" means different `spelling_sessions` records — not consecutive attempts within the same test. Drill mode correct streaks count toward stars only when achieved across different drill sessions. Stars can drop: if a mastered (3-star) word is answered incorrectly in any mode, it drops to 2 stars and re-enters the active SM-2 queue.

**Blocks** aligned to difficulty tiers, each displayed as a 10×10 grid:
- **Block 1:** D1 — Year 3/4 statutory (100 words, 1 grid)
- **Block 2:** D2 — Year 5/6 statutory (100 words, 1 grid)
- **Block 3:** D3 — 11+ vocabulary (~300 words, displayed as 3 grids of 100)

Child can switch between blocks. Tapping a cell opens that word's flashcard. An overall progress ring shows total mastered across all blocks.

A mastered word still comes back for occasional SM-2 review, but stays at 3 stars unless answered incorrectly — then it drops back to 2 and re-enters the active queue.

### 6.2 Streaks & Badges

Same pattern as ATQ:
- **Daily streak** with streak freezes (forgiving, not punishing)
- **Badges** for milestones:
  - "First 10 words mastered"
  - "50-word champion"
  - "Perfect test (10/10)"
  - "7-day streak"
  - "Completed D1 block"
  - "Completed D2 block"
  - "Word family explorer" (viewed 20 word families)
  - "Homework hero" (completed 5 custom word lists)
- Queen Bee mood reflects progress — gets more excited as the grid fills up

### 6.3 No Time Pressure

Unlike ATQ (which tightens timers to simulate exam conditions), spelling has **no countdown timer**. Research shows spelling accuracy benefits from calm, unpressured practice. Speed is an optional informational metric, never a constraint.

### 6.4 Random Review

SM-2 scheduling is **Phase 1 infrastructure** — it runs silently in the background, determining when words reappear in regular tests and drill mode. The SM-2 intervals (Day 1 → Day 3 → Day 7 → Day 14 → Day 30 → Day 60) drive the 3-star mastery system.

The dedicated **"Quick Review" UI** is a **Phase 3** feature: a dashboard card ("You have 8 words to review today") and standalone review test mode with a fixed 10-word count drawn from mastered words where `next_review <= today`.

In both cases: if a review word is answered incorrectly, its SM-2 ease factor drops and it re-enters the active queue (loses 3-star status, drops to 2).

---

## 7. Visual Design

### Design Language

Building on the Atom flashcard aesthetic with the app's own identity:

| Element | Specification |
|---|---|
| **Background** | Warm amber/honey gradient (bee-themed, distinct from ATQ's purple) |
| **Cards** | Frosted glass panels (same as ATQ) |
| **Card headers** | Colour-coded by theme (orange, teal, purple, green, etc. — matching Atom's approach) |
| **Definition bars** | Cream/peach highlight (matching Atom's peach bars for part of speech + definition) |
| **Primary accent** | Amber-500 / Yellow-400 |
| **Secondary accent** | Violet-500 (shared with ATQ for brand cohesion) |
| **Mascot** | Queen Bee (BeeChar) — 5 moods: happy, thinking, teaching, warning, celebrating |
| **Fonts** | Nunito (display) + Inter (body) — same as ATQ |
| **Animations** | Framer Motion — card flip, grid cell transitions, confetti |
| **Bingo grid cells** | Grey → bronze → silver → gold with subtle glow on gold |
| **Word front** | Large bold text in theme colour on white background (matching Atom's front-of-card format) |

### Image Strategy (Phased)

| Phase | Approach |
|---|---|
| Phase 1 (MVP) | No images — text-only flashcards. Ship fast. |
| Phase 2 | Add images for ~100 most concrete/visual words (nouns, action verbs) using royalty-free or AI-generated illustrations |
| Phase 3 | Commission or generate images for remaining words where useful. Abstract words (e.g. "consequence") may not need images. |

### Audio Strategy

| Phase | Approach |
|---|---|
| Phase 1 (MVP) | Browser Web Speech API — `en-GB`, rate 0.85 for clarity. Says the word, then "It means [definition]", then the example sentence. |
| Phase 2 | ElevenLabs voice clone — Rebecca's voice, ~£5 one-time. Generate MP3s for all words + definitions + sentences. Stored in private Supabase Storage bucket (`spelling-audio`), served via signed URLs. |

**TTS quality note:** Web Speech API quality varies across devices. iOS Safari has high-quality `en-GB` voices; some Android devices have robotic voices. Mitigation: prefer specific voice names where available (e.g. "Google UK English Female" on Chrome), and prioritise ElevenLabs audio in Phase 2 for the most commonly tested words. The Phase 1 TTS is a ship-fast compromise, not the final experience.

### Spelling Bee Prompt Screens

Clean, minimal — just the prompt text and Queen Bee:
- Large centred text: "Say the word out loud"
- Single **Done** button, same position each time
- Queen Bee watching/encouraging
- No clutter, no distractions
- Consistent rhythm: prompt → child speaks → taps Done → next prompt

### Mobile-First

All features must work on mobile. Typing input must be comfortable on phone keyboards. Test mode works in portrait orientation. Bingo grid is scrollable/zoomable on small screens.

---

## 8. Homework Mode — Detail

### Why This Feature Matters

This is the retention feature. It makes the app useful **every week** for school homework, not just for long-term exam prep. It directly replaces the parent scribbling words on the back of an envelope and testing at the kitchen table.

### Custom Word Input

- Simple text input: one word per line, or comma-separated
- Up to 20 words per list
- Child can name the list (default: "School Words — [date]")
- Multiple lists can coexist (e.g. "This Week" + "Last Week's Mistakes")

### Auto-Matching

When the child types a word that exists in the built-in word bank, the app pulls in the full data automatically:
- Definition, example sentence, synonyms/antonyms
- Word family
- Image (if available)
- Mnemonic (if available)

For words NOT in the bank, the app works with just the spelling. The Spelling Bee ritual, tests, and drill mode all work — just without the vocabulary enrichment.

### Mini Bingo Grid

Each custom list gets its own small bingo grid (e.g. 2×5 for 10 words, 4×5 for 20). Same 0–3 star progression. Same satisfying gold cells for mastered words.

---

## 9. Technical Architecture

### Stack

Identical to existing app. jsPDF will be added in Phase 3 for PDF word list downloads (same pattern as ATQ certificates).

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
| Audio | Web Speech API (Phase 1) → ElevenLabs (Phase 2) |

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
  stars INTEGER DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, word_id)
);

-- Test/drill session records
CREATE TABLE spelling_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL, -- 'study' | 'test-type' | 'test-write' | 'drill' | 'review' | 'homework'
  word_count INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_time_ms INTEGER,
  custom_list_id UUID, -- null for standard sessions, references custom list for homework mode
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
  typed_answer TEXT,           -- What the child typed (null for write-it mode)
  time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom word lists (homework mode)
CREATE TABLE spelling_custom_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,           -- e.g. "This Week's Homework"
  words TEXT[] NOT NULL,        -- Array of words (strings)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email leads for free tier
CREATE TABLE spelling_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment tracking
CREATE TABLE spelling_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lemonsqueezy_order_id TEXT UNIQUE,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email TEXT,
  status TEXT DEFAULT 'pending',
  include_bundle BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Add column to child_profiles:**

```sql
ALTER TABLE child_profiles
ADD COLUMN IF NOT EXISTS has_paid_spelling BOOLEAN DEFAULT FALSE;
```

**RLS Policies:** Same pattern as ATQ. Children read/write their own rows. Parents read their children's data. Service role key in webhooks.

### Word Data Files

Static TypeScript files bundled at build time (same pattern as ATQ questions):

```
src/data/words/
  types.ts               -- SpellingWord interface + WordDefinition
  statutory-y3y4.ts      -- 100 words (difficulty 1)
  statutory-y5y6.ts      -- 100 words (difficulty 2)
  eleven-plus-a-d.ts     -- ~75 words (difficulty 3)
  eleven-plus-e-l.ts     -- ~75 words (difficulty 3)
  eleven-plus-m-r.ts     -- ~75 words (difficulty 3)
  eleven-plus-s-z.ts     -- ~75 words (difficulty 3)
  curated.ts             -- 50-100 words (difficulty 3)
  placement-test.ts      -- 10 curated words for placement assessment
  index.ts               -- Re-exports all words as a single array
```

Vite manual chunks: add a `spelling-words` chunk for code-splitting.

### Edge Functions (New)

| Function | Purpose | Rate Limit | Auth |
|---|---|---|---|
| `create-spelling-checkout` | Creates LemonSqueezy checkout for Spelling Bee | 10/min | Optional |
| `spelling-webhook` | Handles `order_created` for Spelling Bee purchases | 100/min | LS sig |
| `claim-spelling-payment` | Matches unclaimed spelling payments by email | 10/min | Required |
| `capture-spelling-lead` | Stores email lead, triggers welcome email | 10/min | None |

These mirror the ATQ Edge Function patterns exactly. Shared CORS config, shared rate limiter, shared Resend setup.

### Routes & Page Structure

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing page (email capture, pricing, features) | No |
| `/login` | Login (shared Supabase auth) | No |
| `/signup` | Signup (shared Supabase auth) | No |
| `/select-child` | Child profile picker (shared with ATQ) | Yes |
| `/home` | Dashboard — daily stats, review card, quick actions | Yes |
| `/placement` | Placement test (first use only) | Yes |
| `/flashcards` | Flashcard study mode | Yes |
| `/test` | Spelling test — Type It or Write It | Yes |
| `/drill` | Drill mode (diminishing set) | Yes |
| `/homework` | Homework mode — add/manage custom word lists | Yes |
| `/bingo` | Bingo grid progress view (all blocks) | Yes |
| `/settings` | Settings (Spelling Bee mode toggle, dyslexia mode, exam date) | Yes |
| `/upgrade` | Upgrade/paywall page | Yes |

Navigation: bottom tab bar on mobile (Home, Test, Bingo, Settings). Homework and Drill accessible from Home dashboard cards.

### Queen Bee Mascot

Same implementation pattern as ATQ's Professor Hoot — **emoji + CSS** character (not image assets). The existing `BeeChar` component in the codebase has 5 moods:

| Mood | Used When |
|---|---|
| `happy` | Dashboard idle, correct answer, good score |
| `thinking` | Waiting for input, Spelling Bee ritual prompts |
| `teaching` | Flashcard study, showing definitions |
| `warning` | Incorrect answer (encouraging, not punishing) |
| `celebrating` | Test complete with good score, drill complete, badge earned |

### Free Tier Auth Model

Free tier users **must create a Supabase account** (email + password). The email capture on the landing page leads to account creation, not anonymous access. This means:
- All progress is persisted to Supabase from the start (via `child_id` foreign keys)
- Free-tier and paid users have the same auth flow — only content is gated
- The `spelling_leads` table tracks email capture *before* signup (for conversion analytics), but the app itself requires a real account
- This matches ATQ's model: no anonymous usage, no localStorage-only progress

### SM-2 Integration

Reuse the existing SM-2 implementation at `src/utils/sm2.ts` (17 unit tests already passing). Key parameters:

| Parameter | Value |
|---|---|
| Initial ease factor | 2.5 |
| Minimum ease factor | 1.3 |
| Correct answer | Increase interval: `interval × easeFactor` |
| Incorrect answer | Reset interval to 1, reduce ease factor by 0.2 |

**Star mapping to SM-2 state:**

| Stars | SM-2 Condition |
|---|---|
| 0 | `total_attempts == 0` |
| 1 | `total_attempts >= 1` AND not yet at 2-star threshold |
| 2 | `total_correct >= 2` across separate sessions AND `interval_days >= 1` |
| 3 | `total_correct >= 3` across separate sessions AND `interval_days >= 8` (SM-2 considers it retained) |

Stars are recalculated after each attempt. The `stars` column in `spelling_progress` is a denormalised cache updated by the `recordResult()` function.

---

## 10. Security

Same standards as ATQ — non-negotiable:

- All secrets in environment variables, never in code
- RLS on all Supabase tables
- LemonSqueezy webhook signature verification (HMAC-SHA256, constant-time via `crypto.subtle.verify`)
- Rate limiting on all Edge Functions
- Signed URLs for audio files (private Supabase Storage bucket)
- CORS whitelist for production domains + Vercel previews + localhost
- Paywall enforced server-side only (no localStorage bypass)
- `console.log` stripped in production builds
- CSP headers in `vercel.json`
- Parameterized queries throughout (Supabase JS client)
- GDPR-compliant hard delete (CASCADE) for account deletion

---

## 11. Build Phases

### Phase 1: MVP

| Task | Priority |
|---|---|
| Expand word bank: 200 statutory words + ~300 Atom words (with definitions, synonyms, word families) | P0 |
| Placement test flow (10 words) | P0 |
| Spelling Bee ritual (prompted oral steps + Done button) | P0 |
| Spelling Test — Type It mode | P0 |
| Drill mode (diminishing set) | P0 |
| Bingo grid progress view (10×10, 0–3 stars) | P0 |
| Browser TTS audio (Web Speech API) | P0 |
| Free tier gating (isFree flag on words) | P0 |
| Landing page with email capture | P0 |
| LemonSqueezy checkout integration | P0 |
| Supabase tables + RLS policies | P0 |
| Deploy to Vercel | P0 |

**Deferred from Phase 1:**
- Flashcard mode (study)
- Write-it mode
- Homework mode
- ElevenLabs audio
- Images for words
- Cross-promotion with ATQ
- Random review tests
- Badges
- Mnemonics (data can be added later)

### Phase 2: Polish (next week)

| Task | Priority |
|---|---|
| Flashcard mode with animated flip | P1 |
| Homework mode (custom word input + auto-matching) | P1 |
| Write-it mode (parent-assisted) | P1 |
| ElevenLabs audio generation + integration | P1 |
| Badges and streak system | P1 |
| Email drip sequence via Resend | P1 |
| Cross-promotion cards in ATQ dashboard | P1 |
| Mnemonics for tricky words | P1 |
| Progress dashboard enhancements | P1 |

### Phase 3: Growth (weeks 2–4)

| Task | Priority |
|---|---|
| Images for ~100 most visual words | P2 |
| Word Explorer browse mode | P2 |
| ATQ checkout bundle integration | P2 |
| Parent dashboard (per-child spelling analytics) | P2 |
| Random review tests | P2 |
| Exam date countdown feature | P2 |
| PDF downloadable word lists (jsPDF, same as ATQ certificates) | P2 |
| SEO landing pages per word list | P2 |
| Curated word additions (50–100 words) | P2 |

---

## 12. Research References

Key findings informing this design:

| Finding | Source | Impact on Design |
|---|---|---|
| Multi-sensory instruction outperforms single-modality | Graham & Santangelo, 2014 | See + hear + say + type for every word |
| Morphological awareness predicts spelling accuracy | Nagy, Berninger & Abbott, 2006 | Word families as core feature |
| Word → letters → word encoding is strongest | Bradley & Bryant, 1983 | Spelling Bee ritual |
| Dual coding (verbal + visual) improves recall | Paivio, 1986 | Images for words |
| Self-generated mnemonics are 2–3x more effective | Slamecka & Graf, 1978 | Mnemonic creation feature (Phase 2+) |
| Speech recognition for children's letters: 30–50% accuracy | Kennedy et al., 2017 | No speech recognition — prompted vocalisation instead |
| Handwriting activates visual word form area > typing | Longcamp et al., 2005 | Write-it mode for paper practice |
| Partially-filled grids motivate completion (Zeigarnik effect) | Zeigarnik, 1927 | Bingo grid design |
| Visible mastery indicators increase intrinsic motivation | Hanus & Fox, 2015 | 0–3 star system |
| No time pressure improves spelling accuracy | Multiple | No countdown timer |
| 8–10 words/week optimal for ages 7–10 | Multiple curriculum studies | 8 words/week pacing |

---

## 13. Open Questions

1. **Domain:** Subdomain of ATQ (`spellingbee.answerthequestion.co.uk`) or separate domain?
2. **Voice for audio:** Rebecca's own voice clone, or a professional British English voice from ElevenLabs library?
3. **Bundle implementation:** LemonSqueezy product bundle, or discount code applied at checkout?
4. ~~**Multi-child `has_paid_spelling`:** Per-parent or per-child?~~ **Resolved:** Per-child (column on `child_profiles` table, matching ATQ's `has_paid`)
5. **Offline support:** PWA with cached audio? Significantly increases complexity — defer to Phase 3?

---

## 14. Success Criteria

### MVP Launch (Phase 1)

- [ ] 500+ words in data files with definitions, example sentences, synonyms, word families
- [ ] Placement test determining starting tier
- [ ] Spelling Bee ritual working (prompted oral steps + Done button)
- [ ] Type It test mode working end-to-end with letter-by-letter feedback
- [ ] Drill mode working with diminishing set and visual progress
- [ ] Bingo grid showing 0–3 star mastery per word
- [ ] Browser TTS audio playing words, definitions, and sentences
- [ ] LemonSqueezy checkout accepting £19.99 payments
- [ ] Free tier gating working correctly
- [ ] Landing page with email capture
- [ ] Deployed to Vercel and accessible via URL

### Week 1 Post-Launch (Phase 2)

- [ ] Flashcard mode with animated flip
- [ ] Homework mode accepting custom word lists
- [ ] Write-it mode available
- [ ] ElevenLabs audio integrated
- [ ] Badges and streak system live
- [ ] Cross-promotion visible in ATQ

### Month 1 (Phase 3)

- [ ] 50+ email signups
- [ ] 10+ paid conversions
- [ ] Images for 100+ words
- [ ] Bundle checkout working
- [ ] Average 3+ sessions per active child per week
