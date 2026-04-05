# Spelling Bee Expansion Plan

**Date:** 3 April 2026
**Project:** ATQ Spelling (`/Users/rebeccaeverton/ATQ Spelling`)
**Goal:** Expand from 50-word MVP to ~500-word product with spelling tests, drill mode, audio, and free-tier gating

---

## Current State Summary

The existing app has:
- **50 words** in `src/data/words.ts` (IDs `word-001` to `word-050`, difficulty 1/2/3)
- **Cover-Copy-Compare** study flow in `src/components/study/CoverCopyCompare.tsx` (4 phases: show, cover, type, compare)
- **SM-2 spaced repetition** in `src/utils/sm2.ts` (17 unit tests passing)
- **Daily session logic** in `src/hooks/useDailySession.ts` (3 new + up to 5 review words per session)
- **Zustand + localStorage** state in `src/stores/useSpellingProgressStore.ts` with Supabase sync
- **6 routes**: `/`, `/login`, `/signup`, `/select-child`, `/home`, `/study`, `/session-complete`, `/progress`
- **No paywall** (`hasPaid` hard-coded to `true`)
- **SpellingWord type**: `{ id, word, definition, sentence, trickyIndices: [start, end], difficulty: 1|2|3, category? }`

### Key Constraints
- Import routing as `react-router` (not `react-router-dom`)
- Tailwind 4 via CSS `@theme` in `src/index.css` (no tailwind.config)
- Dev port 5174 (ATQ parent app uses 5173)
- Shared Supabase project with ATQ (same auth, same `child_profiles` table)
- Offline-first: Zustand primary, Supabase fire-and-forget

---

## Phase 1: Word Bank Expansion (Tasks 1-3)

### Task 1: Create the full word dataset (~500 words)

**File:** `src/data/words.ts`

**What to do:**
Expand from 50 to ~500 `SpellingWord` objects. Split into three sources:

#### 1a. Year 3/4 Statutory Spellings (100 words, difficulty: 1)
- [ ] Source the DfE National Curriculum Year 3/4 statutory word list (100 words)
- [ ] ID format: `y34-001` through `y34-100`
- [ ] All `difficulty: 1`
- [ ] Each needs: `word`, `definition` (kid-friendly), `sentence` (11+ context), `trickyIndices` (amber-highlighted tricky characters), `category`
- [ ] Add `source: 'statutory-y3y4'` field
- [ ] Mark ~25 words as `isFree: true` (good spread of easy/medium)

#### 1b. Year 5/6 Statutory Spellings (100 words, difficulty: 2)
- [ ] Source the DfE National Curriculum Year 5/6 statutory word list (100 words)
- [ ] ID format: `y56-001` through `y56-100`
- [ ] All `difficulty: 2`
- [ ] Same fields as above
- [ ] Add `source: 'statutory-y5y6'`
- [ ] Mark ~15-20 words as `isFree: true`

#### 1c. Atom 11+ Vocabulary (300 words, difficulty: 3)
- [ ] ID format: `atom-001` through `atom-300`
- [ ] All `difficulty: 3`
- [ ] Add `source: 'eleven-plus'`
- [ ] All `isFree: false` (premium content)
- [ ] Group by theme using the categories from the Atom PDF

The 300 Atom words (with themes inferred from groupings):

| Theme | Words |
|---|---|
| Emotions & Character | Amused, Empathetic, Expressive, Exultant, Resolute, Anxious, Desolate, Dismayed, Irritable, Sullen, Astute, Diligent, Generous, Taciturn, Tenacious |
| Heroes & Courage | Champion, Courage, Guardian, Persevere, Selfless |
| Intelligence & Learning | Discern, Ingenious, Resourceful, Scholar, Visionary |
| Urban Life | Bustling, Haphazardly, Metropolis, Opulent, Overcrowding |
| Nature & Forests | Canopy, Majestic, Serene, Thrive, Verdant |
| Sea & Water | Briny, Drift, Foamy, Surge, Tempestuous |
| Weather | Breeze, Chilly, Drizzle, Scorching, Tempest |
| Light & Glow | Ascend, Creep, Dip, Glint, Glow |
| Fast Movement | Bolt, Dart, Lunge, Scurry, Zoom |
| Slow Movement | Glide, Linger, Stroll, Trudge, Wander |
| Strength & Effort | Endure, Propel, Robust, Strain, Tense |
| Unsteady Movement | Stagger, Stumble, Tentative, Unsteadiness, Waver |
| Body Language | Shrug, Nod, Wince, Fidget, Clench |
| Tone of Voice | Factual, Gentle, Menacing, Sharp, Warm |
| Speaking Verbs | Murmur, Mutter, Proclaim, Ramble, Snarl |
| Agreement & Disagreement | Acknowledge, Align, Dissent, Oppose, Support |
| Persuasion | Appeal, Convince, Emphasise, Exaggerate, Persuade |
| Criticism | Discourage, Dismiss, Challenge, Contradict, Criticise |
| Exploration | Endurance, Expedition, Harsh, Inhabit, Navigate |
| Competition | Defeat, Precision, Resilient, Rivalry, Strive |
| Mystery | Conceal, Elusive, Obscure, Revelation, Unravel |
| Science & Discovery | Breakthrough, Observation, Pioneer, Revolutionary, Theory |
| Scientific Character | Inquisitive, Logical, Observant, Practical, Tireless |
| Technology | Artificial, Device, Groundbreaking, Innovate, Sustainable |
| Environment & Biology | Adaptation, Biodiversity, Ecosystem, Erosion, Substance |
| Health & Wellbeing | Fatigue, Recover, Rejuvenate, Vital, Wellness |
| Culture & Heritage | Ancestral, Custom, Folklore, Festivity, Heritage |
| Community Types | Close-knit, Diverse, Isolated, Multicultural, Urbanisation |
| Belonging | Belonging, Collectively, Embrace, Inclusive, Roots |
| History | Civilisation, Dynasty, Era, Monarchy, Revolution |
| Cause & Effect | Commemorate, Factor, Outcome, Repercussion, Trigger |
| Diplomacy | Alliance, Diplomatic, Negotiate, Treaty, Truce |
| Social Change | Campaign, Equality, Protest, Reform, Transformative |
| Environment Action | Compost, Conservation, Eco-friendly, Preserve, Renewable |
| Argument & Evidence | Articulate, Bias, Counterargument, Evidence, Justify |
| Disaster | Collapse, Devastation, Escalate, Perish, Wreckage |
| Media & News | Headline, Misinformation, Source, Transparent, Verify |
| Leadership (Positive) | Authoritative, Charismatic, Decisive, Delegate, Steadfast |
| Leadership (Influence) | Commanding, Driven, Influential, Mentor, Sway |
| Empowerment | Awareness, Defiance, Dissent, Disobedient, Empower |
| Justice | Impartial, Integrity, Just, Lawful, Righteous |
| Deception | Conceal, Deceit, Disloyal, Manipulation, Traitor |
| Fear | Dread, Hesitantly, Intimidate, Timid, Petrified |
| Confidence | Assured, Bold, Confide, Poise, Triumphantly |
| Anxiety | Apprehensive, Jittery, Restlessness, Tremble, Uneasy |
| Determination | Fearless, Determined, Perseverance, Persist, Relentless |
| Kindness | Comfort, Compassion, Considerate, Impactful, Thoughtful |
| Visual Arts | Abstract, Balance, Depict, Symmetry, Texture |
| Music | Echo, Harmony, Melody, Resonate, Rhythm |
| Literature | Foreshadow, Imagery, Opposition, Plot, Tone |
| Drama | Dramatic, Improvisation, Monologue, Portrayal, Underlying |
| Creativity | Contrast, Imaginative, Inventive, Resulting, Whimsical |
| Wealth & Prosperity | Affluent, Asset, Boom, Flourish, Prosperity |
| Work & Careers | Absent-minded, Apprentice, Occupation, Skilful, Workforce |
| Money & Commerce | Affordable, Consumer, Investment, Supply, Transaction |
| Data & Patterns | Consistent, Finding, Insight, Pattern, Trend |
| Outcomes | Beneficial, Decline, Irreversible, Reliable, Rewarding |
| Communication | Emphasise, Forecast, Reflect, Reinforce, Ultimately |

**Implementation notes:**
- The existing 50 words (word-001 to word-050) remain unchanged for backward compatibility
- They get `source: 'eleven-plus'` and `isFree: false` added (they are advanced vocabulary)
- Consider splitting into multiple files for maintainability: `src/data/words/statutory-y3y4.ts`, `src/data/words/statutory-y5y6.ts`, `src/data/words/atom-11plus.ts`, `src/data/words/index.ts`
- Each word needs carefully chosen `trickyIndices` highlighting the genuinely tricky spelling pattern
- Definitions must be kid-friendly (Year 4-6 reading level)
- Example sentences should use 11+ exam-style language

**File structure:**
```
src/data/words/
  index.ts               # Re-exports SPELLING_WORDS and WORDS_BY_ID
  statutory-y3y4.ts      # 100 Year 3/4 words
  statutory-y5y6.ts      # 100 Year 5/6 words
  atom-11plus.ts         # 300 Atom words (can split further by theme)
  legacy.ts              # Original 50 words (renamed from words.ts)
```

The barrel `index.ts` concatenates all arrays and builds the lookup:

```typescript
import { LEGACY_WORDS } from './legacy';
import { Y34_WORDS } from './statutory-y3y4';
import { Y56_WORDS } from './statutory-y5y6';
import { ATOM_WORDS } from './atom-11plus';
import type { SpellingWord } from '../../types/spelling';

export const SPELLING_WORDS: SpellingWord[] = [
  ...Y34_WORDS,
  ...Y56_WORDS,
  ...ATOM_WORDS,
  ...LEGACY_WORDS,
];

export const WORDS_BY_ID: Record<string, SpellingWord> = Object.fromEntries(
  SPELLING_WORDS.map(w => [w.id, w])
);

export const FREE_WORDS: SpellingWord[] = SPELLING_WORDS.filter(w => w.isFree);
export const PAID_WORDS: SpellingWord[] = SPELLING_WORDS.filter(w => !w.isFree);
```

**Estimated effort:** 4-6 hours (bulk of the work is writing definitions, sentences, and trickyIndices for 450 new words)

---

### Task 2: Update types

**File:** `src/types/spelling.ts`

- [ ] Add new fields to `SpellingWord`:

```typescript
export interface SpellingWord {
  id: string
  word: string
  definition: string
  sentence: string
  trickyIndices: [number, number]
  difficulty: 1 | 2 | 3
  category?: string
  // NEW fields:
  source: 'statutory-y3y4' | 'statutory-y5y6' | 'eleven-plus'
  isFree: boolean
  theme?: string           // grouping for Atom words (e.g. 'emotions', 'nature')
  partOfSpeech?: string    // 'noun' | 'verb' | 'adjective' | 'adverb' etc.
}
```

- [ ] Ensure backward compatibility: the existing 50 words in `legacy.ts` must have `source` and `isFree` added to each object
- [ ] Add `WordSource` type alias for reuse:

```typescript
export type WordSource = 'statutory-y3y4' | 'statutory-y5y6' | 'eleven-plus';
```

- [ ] Add `TestMode` type for Phase 2:

```typescript
export type TestMode = 'type-it' | 'write-it';
export type TestWordSource = 'this-week' | 'wrong-words' | 'random-review' | 'all-words';
```

- [ ] Add `DrillState` interface:

```typescript
export interface DrillWordState {
  wordId: string
  correctStreak: number     // need 3 to "master" and exit drill
  addedAt: string           // ISO date
}
```

**Estimated effort:** 15 minutes

---

### Task 3: Update word selection logic

**File:** `src/hooks/useDailySession.ts`

Currently the hook picks 3 new + up to 5 review words from the flat `SPELLING_WORDS` array. It needs to respect difficulty progression and `isFree` gating.

- [ ] Add difficulty-based word selection:
  - Sessions 1-14 (weeks 1-2): difficulty 1 only (Year 3/4)
  - Sessions 15-28 (weeks 3-4): difficulty 1 + 2 (Year 3/4 + 5/6)
  - Sessions 29-42 (weeks 5-6): difficulty 2 only (Year 5/6)
  - Sessions 43-56 (weeks 7-8): difficulty 2 + 3 (Year 5/6 + 11+)
  - Sessions 57+ (weeks 9-12): difficulty 3 (11+ vocabulary)
  - Fallback: if pool is exhausted at current difficulty, pull from adjacent

- [ ] Change `getNewWords` in `useSpellingProgressStore.ts` to accept a `difficulty` filter:

```typescript
getNewWords: (childId: string, count: number, difficulties?: (1|2|3)[]) => string[]
```

The store method filters `SPELLING_WORDS` by `difficulties` before selecting unseen words.

- [ ] Increase session size from 3+5 to 8 words per session:
  - 3 new words (was 3 -- unchanged)
  - Up to 5 review words (unchanged)
  - This gives 8 new words exposure per week (matching the brief) since new words appear ~2-3 times in the first week via SM-2 reviews

- [ ] Add `isFree` gating: `getNewWords` and `getDueWords` must filter out `isFree: false` words when child has not paid for Spelling Bee (see Task 12 for the paywall hook)

- [ ] Calculate "current week" from session count: `Math.floor(completedSessions / 7) + 1` (same pattern as ATQ)

**File changes:**
- `src/hooks/useDailySession.ts` -- difficulty filtering, session sizing
- `src/stores/useSpellingProgressStore.ts` -- `getNewWords` signature change, `getAccessibleWords` helper

**Estimated effort:** 1 hour

---

## Phase 2: Spelling Test Mode (Tasks 4-7)

### Task 4: Create SpellingTestPage setup screen

**New file:** `src/pages/SpellingTestPage.tsx`
**Route:** `/test` (add to `App.tsx` inside the `ChildProtectedRoute` layout)

- [ ] Create test configuration screen with:
  - **Word count selector**: 5, 10, 15, or 20 words (pill buttons, default 10)
  - **Word source filter**: radio or segmented control
    - "This week's words" -- words introduced in the last 7 sessions
    - "Words I got wrong" -- words with `timesCorrect / timesAttempted < 0.7`
    - "Random review" -- random selection from all seen words
    - "All words" -- random selection from accessible words (free or paid)
  - **Mode toggle**: "Type it" (default) or "Write it" (Phase 2 -- Task 6)
  - **Start button**: honey-500 gradient, "Start Test!" with bee emoji
  - Queen Bee encouragement: `<BeeChar mood="encouraging" message="Let's see what you've learned!" />`

- [ ] Add route to `App.tsx`:

```typescript
const SpellingTestPage = lazy(() =>
  import('./pages/SpellingTestPage').then(m => ({ default: m.SpellingTestPage }))
);
// Inside ChildProtectedRoute layout routes:
<Route path="/test" element={<SpellingTestPage />} />
```

- [ ] Add to `BottomNav` in `src/data/navItems.ts`:
  - Icon: `PenLine` from lucide-react (or `Mic` if audio-first)
  - Label: "Test"
  - Path: `/test`
  - Position: between Study and Progress (4 items total now: Home, Study, Test, Progress)

**Estimated effort:** 1 hour

---

### Task 5: Test flow -- Type-it mode

**New file:** `src/components/test/SpellingTestFlow.tsx`

This is the main test interaction loop. Receives test config from SpellingTestPage and runs through words.

- [ ] State machine phases per word:
  1. **LISTEN**: Audio plays the word (see Task 10). Word is NOT shown on screen. Child sees: definition (optional toggle), "Play again" button, text input
  2. **INPUT**: Child types their answer. Submit on Enter or "Check" button
  3. **RESULT**: Instant feedback -- green check + confetti for correct, red X + correct spelling for wrong. "Next" button

- [ ] Component receives `words: SpellingWord[]` and `onTestComplete: (results: TestResult[]) => void`

- [ ] `TestResult` type (add to `src/types/spelling.ts`):

```typescript
export interface TestResult {
  wordId: string
  typed: string
  correct: boolean
  responseTimeMs: number
}
```

- [ ] Progress indicator: "Word 3 of 10" with `<ProgressBar />`

- [ ] Auto-focus text input after audio plays

- [ ] Disable autocomplete/autocorrect/spellcheck on input (same as CoverCopyCompare):
  ```
  autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false}
  ```

- [ ] Optional "Show definition" toggle (stored in component state, default: off for difficulty 3, on for difficulty 1)

- [ ] BeeChar reacts: `celebrating` for correct, `warning` for incorrect

**Estimated effort:** 2 hours

---

### Task 6: Test flow -- Write-it mode (PHASE 2 -- NOT in 24-hour sprint)

**File:** `src/components/test/SpellingTestFlow.tsx` (extend existing)

- [ ] When mode is `write-it`:
  - Audio plays word pronunciation
  - No text input shown
  - Instead: "Reveal Answer" button
  - On reveal: shows correct spelling
  - Two buttons: "I got it right" (green, meadow-500) and "I got it wrong" (red)
  - Same TestResult tracking (with `typed: ''` and `correct` set by user's self-report)

- [ ] Self-reported mode is useful for children writing on paper (offline practice)

**Estimated effort:** 30 minutes (leverages existing flow)

---

### Task 7: Test results screen

**New file:** `src/pages/TestResultsPage.tsx`
**Route:** `/test/results` (navigated to from SpellingTestFlow on completion)

- [ ] Score display: "8/10 correct" with large text and BeeChar reaction
  - 100%: `celebrating` mood, "PERFECT SPELLING!"
  - 80-99%: `happy` mood, "Brilliant work!"
  - 60-79%: `encouraging` mood, "Good effort! Keep practising!"
  - Below 60%: `thinking` mood, "Let's work on those tricky words!"

- [ ] Word-by-word breakdown list:
  - Each word shows: the word, correct/incorrect icon, what the child typed (if incorrect)
  - Incorrect words highlighted with red-50 background
  - Correct words with meadow-50 background

- [ ] Action buttons:
  - "Drill these words" (only if there were incorrect answers) -- navigates to `/drill` with the failed word IDs
  - "Take another test" -- navigates back to `/test`
  - "Back to Home" -- navigates to `/home`

- [ ] SM-2 integration: Record each test result into `useSpellingProgressStore`:
  - Correct answers: `recordAnswer(childId, wordId, gradeAnswer(true, responseTimeMs), today)`
  - Incorrect answers: `recordAnswer(childId, wordId, 1, today)` (grade 1 = incorrect)
  - This ensures wrong words surface sooner in review sessions

- [ ] Add route to `App.tsx`:

```typescript
const TestResultsPage = lazy(() =>
  import('./pages/TestResultsPage').then(m => ({ default: m.TestResultsPage }))
);
<Route path="/test/results" element={<TestResultsPage />} />
```

- [ ] Navigation: pass results via `useNavigate` state (same pattern as `/session-complete`):

```typescript
navigate('/test/results', { state: { results, testConfig } });
```

**Estimated effort:** 1.5 hours

---

## Phase 3: Drill Mode (Tasks 8-9)

### Task 8: Create DrillPage

**New file:** `src/pages/DrillPage.tsx`
**Route:** `/drill`

The drill is a focused, repetitive practice on words the child got wrong. A word exits the drill after 3 correct spellings in a row.

- [ ] Entry points:
  1. "Drill these words" button from TestResultsPage (passes failed word IDs in navigation state)
  2. "Drill" button from ProgressPage (drills all words below mastery threshold)
  3. Direct nav to `/drill` (drills all words in the `drillQueue`)

- [ ] UI flow:
  1. **Intro screen**: BeeChar "thinking" mood, "You have X words to master". Shows the words in a grid. "Start Drill" button
  2. **Drill loop** (mini-tests of 5 words at a time):
     - Uses the same `CoverCopyCompare` component (or a slimmed-down version without the "cover" phase for speed)
     - Actually, for drill mode: just the **type** and **compare** phases (skip show/cover -- child should already know the word)
     - Or: configurable. First attempt shows the word briefly (2 seconds), then covers and types. Subsequent attempts skip the show phase
  3. **Progress ring**: circular SVG showing `masteredCount / totalDrillWords` with animation
  4. **Completion**: when all words hit 3-correct streak, BeeChar "celebrating", confetti, "All words mastered!" message

- [ ] Drill word selection:
  - If navigated with word IDs in state: use those
  - Otherwise: pull from `drillQueue` in store (see Task 9)
  - Mini-batches of 5: cycle through remaining words in groups of 5
  - Words correctly spelled 3x in a row = "mastered" and removed from the active drill set
  - Words spelled wrong: streak resets to 0, word stays in the drill

- [ ] Create `DrillCoverCopyCompare` variant or add a `drillMode` prop to existing component:
  - `drillMode: true` skips the "show" phase on repeat attempts
  - Show phase auto-advances after 2 seconds (not manual "Cover it!" button)
  - Faster pacing overall

- [ ] Add route to `App.tsx`:

```typescript
const DrillPage = lazy(() =>
  import('./pages/DrillPage').then(m => ({ default: m.DrillPage }))
);
<Route path="/drill" element={<DrillPage />} />
```

**Estimated effort:** 2.5 hours

---

### Task 9: Drill integration with stores

**File:** `src/stores/useSpellingProgressStore.ts`

- [ ] Add drill state to `ChildSpellingData`:

```typescript
interface ChildSpellingData {
  wordProgress: Record<string, WordProgress>;
  sessions: SpellingSessionRecord[];
  streak: StreakData;
  // NEW:
  drillQueue: DrillWordState[];    // words awaiting drill
}
```

- [ ] Add `DrillWordState` to `src/types/spelling.ts` (already specified in Task 2):

```typescript
export interface DrillWordState {
  wordId: string
  correctStreak: number     // 0, 1, 2 -- exits at 3
  addedAt: string           // ISO date when added to drill queue
}
```

- [ ] Add store methods:

```typescript
// Add words to drill queue (from failed test results)
addToDrillQueue: (childId: string, wordIds: string[]) => void

// Record a drill attempt
recordDrillAttempt: (childId: string, wordId: string, correct: boolean) => void
// If correct: increment correctStreak. If streak hits 3: remove from queue
// If incorrect: reset correctStreak to 0

// Get current drill queue
getDrillQueue: (childId: string) => DrillWordState[]

// Remove mastered word from drill
removeDrillWord: (childId: string, wordId: string) => void
```

- [ ] Drill results also feed into SM-2 via `recordAnswer` (so the spaced repetition schedule adjusts)

- [ ] Persist drill queue to localStorage (already handled by Zustand persist)

- [ ] Supabase sync: drill state is ephemeral and local-only (no new Supabase table needed). The SM-2 state synced via `spelling_progress` captures the learning signal. This keeps it simple

- [ ] Update `createEmptyChildData()` to include `drillQueue: []`

**Estimated effort:** 45 minutes

---

## Phase 4: Audio (Tasks 10-11)

### Task 10: Browser TTS implementation

**New file:** `src/hooks/useWordAudio.ts`

- [ ] Create hook:

```typescript
interface UseWordAudio {
  speakWord: (word: string) => void
  speakDefinition: (definition: string) => void
  speaking: boolean
  supported: boolean
}

export function useWordAudio(): UseWordAudio
```

- [ ] Implementation:
  - Uses `window.speechSynthesis` API
  - Prefer British English voice: look for voice with `lang === 'en-GB'`
  - Fallback: any English voice (`lang.startsWith('en')`)
  - Final fallback: default voice
  - Rate: 0.85 (slightly slower for children)
  - Pitch: 1.0

- [ ] Voice selection logic (voices load async in some browsers):

```typescript
function getBritishVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang === 'en-GB')
    ?? voices.find(v => v.lang.startsWith('en'))
    ?? null;
}
```

- [ ] Handle `speechSynthesis.onvoiceschanged` event (Chrome loads voices lazily)

- [ ] `supported` flag: `typeof window !== 'undefined' && 'speechSynthesis' in window`

- [ ] Integration points:
  - `SpellingTestFlow.tsx`: auto-play word on each test question
  - `CoverCopyCompare.tsx`: optional "Hear it" button in show phase
  - `DrillPage.tsx`: play word at start of each drill word

- [ ] Add a "Hear it" button (speaker icon from lucide-react: `Volume2`) to:
  - [ ] `CoverCopyCompare` show phase (next to the word display)
  - [ ] `SpellingTestFlow` listen phase (primary interaction)

**Estimated effort:** 1 hour

---

### Task 11: ElevenLabs audio (LATER -- not 24-hour sprint)

**Not built now.** Plan for future:

- [ ] Batch-generate MP3 files for all ~500 words using ElevenLabs API
- [ ] Use a British child-friendly voice (or clone Rebecca's voice)
- [ ] Upload to Supabase Storage bucket `spelling-audio/`
- [ ] File naming: `{word-id}.mp3` (e.g. `y34-001.mp3`)
- [ ] Update `useWordAudio` to check for stored MP3 first:
  ```
  const audioUrl = supabase.storage.from('spelling-audio').getPublicUrl(`${wordId}.mp3`);
  // If exists: play via Audio API
  // If not: fall back to browser TTS
  ```
- [ ] Pre-cache audio files via service worker for offline use
- [ ] Estimated cost: ~$5-10 for 500 words at ElevenLabs pricing

---

## Phase 5: Paywall & Free Tier (Tasks 12-14)

### Task 12: Free tier gating

**New file:** `src/hooks/useSpellingPaywall.ts`

- [ ] Create paywall hook:

```typescript
interface SpellingPaywall {
  hasPaid: boolean
  isWordAccessible: (word: SpellingWord) => boolean
  freeWordCount: number
  totalWordCount: number
}

export function useSpellingPaywall(): SpellingPaywall
```

- [ ] Logic:
  - Check `child_profiles.has_spelling_paid` column (new column, see below)
  - If `has_spelling_paid === true`: all words accessible
  - If `has_spelling_paid === false`: only `isFree: true` words accessible
  - `isWordAccessible(word)` = `hasPaid || word.isFree`

- [ ] **Supabase migration required**:

```sql
ALTER TABLE child_profiles
  ADD COLUMN IF NOT EXISTS has_spelling_paid boolean DEFAULT false;
```

- [ ] Update `useAuthStore` to include `hasSpellingPaid` on the `User` interface:

**File:** `src/types/user.ts`
```typescript
interface User {
  // ... existing fields
  hasSpellingPaid?: boolean   // NEW
}
```

- [ ] Update child profile fetch in `useAuthStore` to read `has_spelling_paid`

- [ ] Server-side only (same pattern as ATQ): no localStorage fallback for payment status

- [ ] Gate in `useDailySession.ts`:
  - Filter `SPELLING_WORDS` through `isWordAccessible` before selecting new words
  - Review words that are already in progress remain accessible (don't lock words mid-learning)

- [ ] Gate in `SpellingTestPage.tsx`:
  - "All words" source filter only shows accessible words
  - If child tries to start a test with paid words: show upgrade prompt

- [ ] Free tier metrics: ~40-50 free words gives roughly 6-7 sessions before running out of new words. This is enough to hook the child and parent before the paywall triggers

**Estimated effort:** 1.5 hours

---

### Task 13: LemonSqueezy checkout (LATER -- not 24-hour sprint)

- [ ] Create new product in LemonSqueezy: "ATQ Spelling Bee" at GBP 9.99
- [ ] Get store ID + variant ID for the new product
- [ ] Option A: Extend `create-checkout-session` edge function to accept a `product` parameter (`'atq'` | `'spelling'`)
- [ ] Option B: Create a separate `create-spelling-checkout` edge function
- [ ] On `order_created` webhook: set `has_spelling_paid = true` on `child_profiles`
- [ ] Add Spelling Bee checkout flow in-app: new `SpellingCheckoutPage.tsx` or modal

---

### Task 14: Upgrade prompt (LATER -- not 24-hour sprint)

- [ ] Create `UpgradePrompt` component shown when:
  - Free user tries to access a paid word
  - Free user runs out of free words in daily session
  - Free user tries "All words" in test mode
- [ ] Design: frosted glass card, Queen Bee encouraging, "Unlock all 500 words for GBP 9.99"
- [ ] CTA button links to checkout

---

## Phase 6: Landing Page & Email Capture (Tasks 15-16) -- LATER

### Task 15: Landing page update
- [ ] Update `src/pages/LandingPage.tsx` with:
  - Word count badge: "500 words" (was not shown or showed 50)
  - Feature highlights: Spelling Tests, Drill Mode, Audio Pronunciation
  - Free tier CTA: "Start with 40 free words"
  - Paid CTA: "Unlock all 500 words -- GBP 9.99"

### Task 16: Email capture
- [ ] Add email input on landing page for leads
- [ ] Store in Supabase or Resend audience list
- [ ] Redirect to signup flow

---

## Phase 7: Cross-Promotion (Task 17) -- LATER

### Task 17: ATQ and Spelling Bee upsells
- [ ] ATQ checkout: "Add Spelling Bee for GBP 9.99" checkbox
- [ ] Spelling checkout: "Add ATQ for GBP 29.99" checkbox
- [ ] Bundle price: GBP 34.99 (save GBP 4.99)

---

## 24-Hour Sprint Scope

**IN SCOPE** (Tasks 1-5, 7-10, 12):

| # | Task | Est. Hours |
|---|---|---|
| 1 | Full word bank (500 words) | 5 |
| 2 | Update types | 0.25 |
| 3 | Update word selection logic | 1 |
| 4 | SpellingTestPage setup screen | 1 |
| 5 | Test flow -- type-it mode | 2 |
| 7 | Test results screen | 1.5 |
| 8 | DrillPage | 2.5 |
| 9 | Drill store integration | 0.75 |
| 10 | Browser TTS | 1 |
| 12 | Free tier gating | 1.5 |
| -- | Testing + polish + bug fixes | 2 |
| **Total** | | **~18.5 hours** |

**OUT OF SCOPE** for 24-hour sprint:
- Task 6: Write-it mode
- Task 11: ElevenLabs audio
- Tasks 13-14: LemonSqueezy checkout + upgrade prompt
- Tasks 15-16: Landing page + email capture
- Task 17: Cross-promotion

---

## New Files Summary

```
src/
  data/
    words/
      index.ts                    # Barrel export combining all word arrays
      statutory-y3y4.ts           # 100 Year 3/4 words
      statutory-y5y6.ts           # 100 Year 5/6 words
      atom-11plus.ts              # 300 Atom 11+ words
      legacy.ts                   # Original 50 words (moved from words.ts)
  components/
    test/
      SpellingTestFlow.tsx        # Type-it test flow component
  pages/
    SpellingTestPage.tsx          # Test setup + orchestration
    TestResultsPage.tsx           # Post-test results display
    DrillPage.tsx                 # Drill mode page
  hooks/
    useWordAudio.ts               # Browser TTS hook
    useSpellingPaywall.ts         # Free/paid word gating
```

## Modified Files Summary

```
src/
  types/spelling.ts               # Add source, isFree, theme, partOfSpeech, DrillWordState, TestResult, TestMode
  types/user.ts                   # Add hasSpellingPaid to User
  stores/useSpellingProgressStore.ts  # Add drillQueue, drill methods, difficulty filter on getNewWords
  hooks/useDailySession.ts        # Difficulty progression, isFree gating, session sizing
  data/navItems.ts                # Add Test nav item
  App.tsx                         # Add /test, /test/results, /drill routes
  components/study/CoverCopyCompare.tsx  # Add drillMode prop, "Hear it" TTS button
  stores/useAuthStore.ts          # Read has_spelling_paid from child profiles
```

## Supabase Migration

```sql
-- Run in shared ATQ Supabase project
ALTER TABLE child_profiles
  ADD COLUMN IF NOT EXISTS has_spelling_paid boolean DEFAULT false;
```

---

## Execution Order

For the 24-hour sprint, execute tasks in this order (dependencies flow downward):

```
Task 2 (types)
  |
  v
Task 1 (word bank) ---------> Task 3 (selection logic)
                                  |
                                  v
Task 10 (TTS) ------------> Task 4 (test setup) --> Task 5 (test flow) --> Task 7 (results)
                                                                              |
                                                                              v
Task 12 (paywall) ------> Task 9 (drill store) -----> Task 8 (drill page)
```

Start with Task 2 (types, 15 min) since everything depends on the updated type definitions. Then Task 1 (word bank) and Task 10 (TTS) can run in parallel -- Task 1 is the longest single task but has no code dependencies on other tasks. Task 10 is standalone. Once types and words exist, Tasks 3-5-7-8-9-12 can be built sequentially.

---

## Testing Checklist

Before shipping:

- [ ] All 17 SM-2 unit tests still pass (`npm test`)
- [ ] `SPELLING_WORDS.length` is approximately 500
- [ ] `WORDS_BY_ID` has no duplicate keys
- [ ] Every word has valid `trickyIndices` (start <= end, both within word length)
- [ ] Free word count is 40-50
- [ ] Daily session respects difficulty progression (manually test with fresh child profile)
- [ ] Spelling test: type-it mode completes full cycle (select words, take test, see results)
- [ ] Drill mode: word exits after 3 correct in a row
- [ ] TTS speaks in British English (test on Chrome + Safari)
- [ ] Free tier: paid words are not shown to unpaid child
- [ ] Free tier: review words for already-started paid words remain accessible
- [ ] Navigation: all new routes reachable from BottomNav or in-app links
- [ ] Mobile responsive: test all new pages on 375px width
- [ ] Supabase sync: recordAnswer during test/drill pushes to `spelling_progress`
- [ ] No TypeScript errors: `npm run build` succeeds
- [ ] No console.log left in code (stripped by esbuild, but still clean code practice)
