# Spelling Bee v2 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the ATQ Spelling Bee app from 50 words to ~500, add spelling test mode, drill mode, placement test, Spelling Bee oral ritual, bingo grid progress, and freemium gating.

**Architecture:** Static TypeScript word bank expanded to ~500 words across 7 data files. New pages/components for test, drill, placement, and bingo grid. Existing SM-2 algorithm reused with a new 0–3 star mapping layer. Existing Zustand stores extended (not replaced). New Supabase tables for sessions/results. LemonSqueezy checkout for £19.99 payment.

**Tech Stack:** React 19, Vite 7, TypeScript, Tailwind CSS 4, Framer Motion, Zustand 5, Supabase, Vitest, Web Speech API (TTS), LemonSqueezy.

**Spec:** `docs/superpowers/specs/2026-04-04-spelling-bee-v2-design.md`

**Existing codebase:** `src/` has 50 words, SM-2 algorithm (17 tests passing), Cover-Copy-Compare study flow, BeeChar mascot, 3 Zustand stores, 8 pages, Supabase auth.

---

## Chunk 1: Word Data & Types

### Task 1: Update SpellingWord type and User type in-place

**Files:**
- Modify: `src/types/spelling.ts` (the authoritative type file — all existing code imports from here)
- Modify: `src/types/user.ts` (add `hasPaidSpelling` field)

The existing `SpellingWord` in `src/types/spelling.ts` has single `definition`/`sentence` string fields. We update it in-place to the new format with `definitions` array, word families, themes, etc. We also update `WordProgress` to add star tracking fields.

**IMPORTANT:** Do NOT create a parallel types file at `src/data/words/types.ts`. The single source of truth for types is `src/types/spelling.ts`.

- [ ] **Step 1: Update SpellingWord interface**

In `src/types/spelling.ts`, replace the existing `SpellingWord` with:

```typescript
import type { SM2State } from '../utils/sm2';

export interface WordDefinition {
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms?: string[];
}

export interface SpellingWord {
  id: string;
  word: string;
  definitions: WordDefinition[];
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  wordFamily: string[];
  trickyIndices: [number, number][];  // multiple tricky ranges (was single range)
  mnemonic?: string;
  theme: string;
  difficulty: 1 | 2 | 3;
  source: 'statutory-y3y4' | 'statutory-y5y6' | 'eleven-plus' | 'curated' | 'custom';
  isFree: boolean;
  imageUrl?: string;   // Phase 2
  audioFile?: string;  // Phase 2
}
```

- [ ] **Step 2: Update WordProgress interface**

In the same file, update `WordProgress` to add star tracking:

```typescript
export interface WordProgress {
  wordId: string;
  sm2: SM2State;
  lastSeenDate: string | null;
  timesAttempted: number;
  timesCorrect: number;
  // New fields for star system
  stars: 0 | 1 | 2 | 3;
  correctSessions: number;    // correct answers across different sessions
  lastSessionId?: string;     // tracks which session last correct was in
}
```

- [ ] **Step 3: Update User type**

In `src/types/user.ts`, add `hasPaidSpelling` to the `User` interface:

```typescript
export interface User {
  // ... existing fields ...
  hasPaidSpelling?: boolean;
}
```

- [ ] **Step 4: Create a migration helper for the old 50 words**

Create `src/data/words/migrate.ts`:

```typescript
import type { SpellingWord, WordDefinition } from '../../types/spelling';

/**
 * Convert an old-format word (single definition/sentence string fields)
 * into the new SpellingWord format with definitions array.
 * Used to migrate the existing 50 words into the new format.
 */
interface OldSpellingWord {
  id: string;
  word: string;
  definition: string;
  sentence: string;
  trickyIndices: [number, number];
  difficulty: 1 | 2 | 3;
  category?: string;
}

export function migrateWord(old: OldSpellingWord): SpellingWord {
  return {
    id: old.id,
    word: old.word,
    definitions: [{
      definition: old.definition,
      exampleSentence: old.sentence,
      synonyms: [],
    }],
    partOfSpeech: 'noun', // default — will be corrected per word in data files
    wordFamily: [],
    trickyIndices: [old.trickyIndices],
    theme: old.category ?? 'Uncategorised',
    difficulty: old.difficulty,
    source: old.difficulty === 1 ? 'statutory-y3y4' : old.difficulty === 2 ? 'statutory-y5y6' : 'eleven-plus',
    isFree: false,
  };
}
```

- [ ] **Step 5: Fix all existing code that uses old SpellingWord fields**

The `CoverCopyCompare.tsx` component and `useDailySession.ts` hook reference `word.definition` and `word.sentence` (old single-string fields). Update these to use `word.definitions[0].definition` and `word.definitions[0].exampleSentence`. Also update `trickyIndices` usage from `[start, end]` to `trickyIndices[0]` (array of ranges).

Files to check and update:
- `src/components/study/CoverCopyCompare.tsx`
- `src/hooks/useDailySession.ts`
- `src/pages/StudyPage.tsx`
- `src/pages/SessionCompletePage.tsx`
- `src/stores/useSpellingProgressStore.ts` (ensure `WordProgress` default includes new fields: `stars: 0, correctSessions: 0`)

- [ ] **Step 6: Run existing tests to ensure no breakage**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm test`
Expected: All 17 SM-2 tests pass. Type errors may surface — fix any that appear.

- [ ] **Step 7: Run type-check**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 8: Commit**

```bash
git add src/types/spelling.ts src/types/user.ts src/data/words/migrate.ts src/components/study/CoverCopyCompare.tsx src/hooks/useDailySession.ts src/pages/ src/stores/
git commit -m "feat: expand SpellingWord type with definitions array, word families, star tracking"
```

---

### Task 2: Create Year 3/4 statutory word bank (100 words, D1)

**Files:**
- Create: `src/data/words/statutory-y3y4.ts`

These are the 100 DfE National Curriculum Year 3/4 statutory spellings. Each word needs: definitions array, part of speech, word family (3–5 forms), tricky indices, theme, and `isFree` flag (~25 marked as free).

- [ ] **Step 1: Create the file with all 100 words**

Create `src/data/words/statutory-y3y4.ts` with the full list. The DfE Year 3/4 statutory spellings are: accident(ally), actual(ly), address, answer, appear, arrive, believe, bicycle, breath, breathe, build, busy/business, calendar, caught, centre, century, certain, circle, complete, consider, continue, decide, describe, different, difficult, disappear, early, earth, eight/eighth, enough, exercise, experience, experiment, extreme, famous, favourite, February, forward(s), fruit, grammar, group, guard, guide, heard, heart, height, history, imagine, increase, important, interest, island, knowledge, learn, length, library, material, medicine, mention, minute, natural, naughty, notice, occasion(ally), often, opposite, ordinary, particular, peculiar, perhaps, popular, position, possess(ion), possible, potatoes, pressure, probably, promise, purpose, quarter, question, recent, regular, reign, remember, sentence, separate, special, straight, strange, strength, suppose, surprise, therefore, though/although, thought, through, various, weight, woman/women.

Each word entry follows this pattern:

```typescript
import type { SpellingWord } from './types';

export const STATUTORY_Y3Y4: SpellingWord[] = [
  {
    id: 'y34-accident',
    word: 'accident',
    definitions: [{
      definition: 'Something bad that happens that is not planned or intended.',
      exampleSentence: 'The car accident blocked the road for two hours.',
      synonyms: ['mishap', 'incident', 'collision'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['accidental', 'accidentally', 'accidents'],
    trickyIndices: [[4, 6]], // 'den' — double-c often missed
    theme: 'Everyday Tricky',
    difficulty: 1,
    source: 'statutory-y3y4',
    isFree: true,
  },
  // ... 99 more words
];
```

Mark ~25 words as `isFree: true` — spread across easy wins and tricky ones.

- [ ] **Step 2: Verify the file compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/words/statutory-y3y4.ts
git commit -m "feat: add 100 Year 3/4 statutory spelling words (D1)"
```

---

### Task 3: Create Year 5/6 statutory word bank (100 words, D2)

**Files:**
- Create: `src/data/words/statutory-y5y6.ts`

Same structure as Task 2 but for Year 5/6 DfE statutory spellings. These are harder: accommodate, accompany, according, achieve, aggressive, amateur, ancient, apparent, appreciate, attached, available, average, awkward, bargain, bruise, category, cemetery, committee, communicate, community, competition, conscience, conscious, controversy, convenience, correspond, criticise, curiosity, definite, desperate, determined, develop, dictionary, disastrous, embarrass, environment, equip(ped/ment), especially, exaggerate, excellent, existence, explanation, familiar, foreign, forty, frequently, government, guarantee, harass, hindrance, identity, immediate(ly), individual, interfere, interrupt, language, leisure, lightning, marvellous, mischievous, muscle, necessary, neighbour, nuisance, occupy, occur, opportunity, parliament, persuade, physical, prejudice, privilege, profession, programme, pronunciation, queue, recognise, recommend, relevant, restaurant, rhyme, rhythm, sacrifice, secretary, shoulder, signature, sincere(ly), soldier, stomach, sufficient, suggest, symbol, system, temperature, thorough, twelfth, variety, vegetable, vehicle, yacht.

Mark ~15–20 words as `isFree: true`.

- [ ] **Step 1: Create the file with all 100 words**

Create `src/data/words/statutory-y5y6.ts` following the same pattern as Task 2.

- [ ] **Step 2: Verify the file compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/data/words/statutory-y5y6.ts
git commit -m "feat: add 100 Year 5/6 statutory spelling words (D2)"
```

---

### Task 4: Create 11+ vocabulary word bank (~300 words, D3)

**Files:**
- Create: `src/data/words/eleven-plus-a-d.ts`
- Create: `src/data/words/eleven-plus-e-l.ts`
- Create: `src/data/words/eleven-plus-m-r.ts`
- Create: `src/data/words/eleven-plus-s-z.ts`

Split alphabetically across 4 files for manageable file sizes. Words from the Atom Learning 300 word list grouped by theme. All `isFree: false`. All `difficulty: 3`. All `source: 'eleven-plus'`.

Themes from the spec: Emotions & Character, Heroes & Courage, Intelligence & Learning, Urban Life, Nature & Forests, Sea & Water, Weather, Light & Glow, Fast Movement, Slow Movement, Strength & Effort, Unsteady Movement, Body Language, Tone of Voice, Speaking Verbs, Agreement & Disagreement, Persuasion, Criticism, Exploration, Competition, Mystery, Science & Discovery, Scientific Character, Technology, Environment & Biology, Health & Wellbeing, Culture & Heritage, Community Types, Belonging, History, Cause & Effect, Diplomacy, Social Change, Environment Action, Argument & Evidence.

- [ ] **Step 1: Create the 4 word files**

Each file exports an array: `ELEVEN_PLUS_A_D`, `ELEVEN_PLUS_E_L`, `ELEVEN_PLUS_M_R`, `ELEVEN_PLUS_S_Z`.

- [ ] **Step 2: Verify all files compile**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/data/words/eleven-plus-*.ts
git commit -m "feat: add ~300 Atom 11+ vocabulary words (D3)"
```

---

### Task 5: Create word bank index and placement test words

**Files:**
- Create: `src/data/words/index.ts`
- Create: `src/data/words/placement-test.ts`
- Modify: `src/data/words.ts` (re-export from new location)
- Modify: `vite.config.ts` (update manual chunks)

- [ ] **Step 1: Create the index file**

Create `src/data/words/index.ts`:

```typescript
import type { SpellingWord } from '../../types/spelling';
import { STATUTORY_Y3Y4 } from './statutory-y3y4';
import { STATUTORY_Y5Y6 } from './statutory-y5y6';
import { ELEVEN_PLUS_A_D } from './eleven-plus-a-d';
import { ELEVEN_PLUS_E_L } from './eleven-plus-e-l';
import { ELEVEN_PLUS_M_R } from './eleven-plus-m-r';
import { ELEVEN_PLUS_S_Z } from './eleven-plus-s-z';
import { LEGACY_WORDS } from './legacy';

// Deduplicate: new word bank takes priority over legacy words
const NEW_WORD_IDS = new Set([
  ...STATUTORY_Y3Y4, ...STATUTORY_Y5Y6,
  ...ELEVEN_PLUS_A_D, ...ELEVEN_PLUS_E_L,
  ...ELEVEN_PLUS_M_R, ...ELEVEN_PLUS_S_Z,
].map(w => w.word.toLowerCase()));

const uniqueLegacy = LEGACY_WORDS.filter(w => !NEW_WORD_IDS.has(w.word.toLowerCase()));

export const ALL_WORDS: SpellingWord[] = [
  ...STATUTORY_Y3Y4,
  ...STATUTORY_Y5Y6,
  ...ELEVEN_PLUS_A_D,
  ...ELEVEN_PLUS_E_L,
  ...ELEVEN_PLUS_M_R,
  ...ELEVEN_PLUS_S_Z,
  ...uniqueLegacy, // legacy words not already in new bank
];

export const WORDS_BY_ID: Record<string, SpellingWord> = Object.fromEntries(
  ALL_WORDS.map(w => [w.id, w])
);

export const FREE_WORDS: SpellingWord[] = ALL_WORDS.filter(w => w.isFree);

export const WORDS_BY_DIFFICULTY: Record<1 | 2 | 3, SpellingWord[]> = {
  1: ALL_WORDS.filter(w => w.difficulty === 1),
  2: ALL_WORDS.filter(w => w.difficulty === 2),
  3: ALL_WORDS.filter(w => w.difficulty === 3),
};

export const WORDS_BY_THEME: Record<string, SpellingWord[]> = ALL_WORDS.reduce(
  (acc, w) => {
    if (!acc[w.theme]) acc[w.theme] = [];
    acc[w.theme].push(w);
    return acc;
  },
  {} as Record<string, SpellingWord[]>
);

export type { SpellingWord, WordDefinition } from '../../types/spelling';
```

- [ ] **Step 2: Create placement test words**

Create `src/data/words/placement-test.ts`:

```typescript
/**
 * 10 words for the placement test: 3 from D1, 3 from D2, 4 from D3.
 * Selected to cover a range of difficulty within each tier.
 */
export const PLACEMENT_TEST_WORD_IDS: string[] = [
  // D1 — Year 3/4 (easy, medium, hard within tier)
  'y34-describe',
  'y34-separate',
  'y34-knowledge',
  // D2 — Year 5/6
  'y56-accommodate',
  'y56-conscience',
  'y56-rhythm',
  // D3 — 11+
  'atom-benevolent',
  'atom-metropolis',
  'atom-tenacious',
  'atom-resilient',
];
```

- [ ] **Step 3: Migrate old 50 words and update words.ts**

The existing 50 words in `src/data/words.ts` use the old single-string format. Create `src/data/words/legacy.ts` that imports the old array and migrates each word using `migrateWord()`. Then update `src/data/words.ts` to re-export from the new index:

Create `src/data/words/legacy.ts`:
```typescript
import { migrateWord } from './migrate';
import type { SpellingWord } from '../../types/spelling';

// Old words in old format — migrate each to new format
const OLD_WORDS = [/* paste existing SPELLING_WORDS array here */];
export const LEGACY_WORDS: SpellingWord[] = OLD_WORDS.map(migrateWord);
```

Then replace `src/data/words.ts`:
```typescript
// Re-export everything from the new word module structure
// The old 50 words are included via legacy.ts migration
export { ALL_WORDS as SPELLING_WORDS, WORDS_BY_ID, FREE_WORDS, WORDS_BY_DIFFICULTY, WORDS_BY_THEME } from './words/index';
export type { SpellingWord, WordDefinition } from '../types/spelling';
```

**IMPORTANT:** The old 50 words must be included in the `ALL_WORDS` array (via `LEGACY_WORDS` in the index). Do NOT delete them — they are valid words that users may already have progress on.

- [ ] **Step 4: Update Vite manual chunks**

In `vite.config.ts`, change the words chunk to point to the new index:

```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router'],
  'framer': ['framer-motion'],
  'words': ['./src/data/words/index.ts'],
},
```

- [ ] **Step 5: Run tests and type-check**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm test && npx tsc --noEmit`
Expected: All tests pass, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/data/words/index.ts src/data/words/placement-test.ts src/data/words.ts vite.config.ts
git commit -m "feat: create word bank index with ~500 words, placement test selection"
```

---

## Chunk 2: Star System & Store Updates

### Task 6: Add star calculation utility

**Files:**
- Create: `src/utils/stars.ts`
- Create: `src/__tests__/stars.test.ts`

The 3-star system maps SM-2 state to visual progress. This is a pure function — easy to test.

- [ ] **Step 1: Write the failing tests**

Create `src/__tests__/stars.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateStars } from '../utils/stars';

describe('calculateStars', () => {
  it('returns 0 for a word never attempted', () => {
    expect(calculateStars({ totalAttempts: 0, totalCorrectSessions: 0, intervalDays: 0 })).toBe(0);
  });

  it('returns 1 for a word attempted at least once', () => {
    expect(calculateStars({ totalAttempts: 1, totalCorrectSessions: 0, intervalDays: 0 })).toBe(1);
  });

  it('returns 1 for a word correct once (not yet 2 sessions)', () => {
    expect(calculateStars({ totalAttempts: 2, totalCorrectSessions: 1, intervalDays: 0 })).toBe(1);
  });

  it('returns 2 for a word correct in 2 separate sessions with interval >= 1', () => {
    expect(calculateStars({ totalAttempts: 3, totalCorrectSessions: 2, intervalDays: 1 })).toBe(2);
  });

  it('returns 2 for a word correct in 2 sessions but interval still 0', () => {
    expect(calculateStars({ totalAttempts: 3, totalCorrectSessions: 2, intervalDays: 0 })).toBe(1);
  });

  it('returns 3 for a word correct in 3+ sessions with interval >= 8', () => {
    expect(calculateStars({ totalAttempts: 5, totalCorrectSessions: 3, intervalDays: 8 })).toBe(3);
  });

  it('returns 2 for a word correct in 3 sessions but interval < 8', () => {
    expect(calculateStars({ totalAttempts: 5, totalCorrectSessions: 3, intervalDays: 6 })).toBe(2);
  });

  it('returns 3 for high interval and many correct sessions', () => {
    expect(calculateStars({ totalAttempts: 10, totalCorrectSessions: 8, intervalDays: 30 })).toBe(3);
  });

  it('drops from 3 to 2 when interval resets after incorrect answer (SM-2 resets interval to 1)', () => {
    // A word was previously mastered (3+ correct sessions) but SM-2 reset interval to 1 after an error
    expect(calculateStars({ totalAttempts: 8, totalCorrectSessions: 4, intervalDays: 1 })).toBe(2);
  });

  it('drops from 2 to 1 when interval resets to 0', () => {
    expect(calculateStars({ totalAttempts: 5, totalCorrectSessions: 2, intervalDays: 0 })).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx vitest run src/__tests__/stars.test.ts`
Expected: FAIL — `calculateStars` not found.

- [ ] **Step 3: Implement the star calculation**

Create `src/utils/stars.ts`:

```typescript
export interface StarInput {
  totalAttempts: number;
  totalCorrectSessions: number; // correct answers in separate sessions
  intervalDays: number;         // current SM-2 interval
}

/**
 * Calculate 0–3 star rating from SM-2 state.
 * 0 = not attempted, 1 = seen, 2 = getting there, 3 = mastered.
 *
 * Stars can DROP: if a 3-star word is answered incorrectly, SM-2 resets
 * interval to 1 day, which causes it to fall back to 2 stars (interval < 8).
 * This is handled automatically by the interval check — no special regression logic needed.
 */
export function calculateStars(input: StarInput): 0 | 1 | 2 | 3 {
  const { totalAttempts, totalCorrectSessions, intervalDays } = input;

  if (totalAttempts === 0) return 0;
  if (totalCorrectSessions >= 3 && intervalDays >= 8) return 3;
  if (totalCorrectSessions >= 2 && intervalDays >= 1) return 2;
  return 1;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx vitest run src/__tests__/stars.test.ts`
Expected: All 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/stars.ts src/__tests__/stars.test.ts
git commit -m "feat: add star calculation utility with tests (0-3 mastery rating)"
```

---

### Task 7: Update SpellingProgressStore for star tracking

**Files:**
- Modify: `src/stores/useSpellingProgressStore.ts`

The `WordProgress` type was already updated in Task 1 (in `src/types/spelling.ts`). Now we update the store to:
1. Set default values for new fields when creating new `WordProgress` entries (`stars: 0, correctSessions: 0`)
2. Update `recordAnswer` to recalculate stars after each attempt
3. Add `getWordsByStars` selector for the bingo grid

- [ ] **Step 1: Update default WordProgress creation**

In `src/stores/useSpellingProgressStore.ts`, find where new `WordProgress` objects are created (likely in `getWordProgress` or `recordAnswer`) and add the new default fields:

```typescript
// When creating a new WordProgress:
const newProgress: WordProgress = {
  wordId,
  sm2: createInitialSM2State(today),
  lastSeenDate: null,
  timesAttempted: 0,
  timesCorrect: 0,
  stars: 0,
  correctSessions: 0,
};
```

- [ ] **Step 2: Update recordAnswer to recalculate stars**

After calling `applyReview` on the SM-2 state, call `calculateStars` and update the `stars` field. Track `correctSessions` — only increment when the current session ID differs from `lastSessionId`.

```typescript
import { calculateStars } from '../utils/stars';

// Inside recordAnswer:
const isNewSession = progress.lastSessionId !== currentSessionId;
const newCorrectSessions = correct && isNewSession
  ? progress.correctSessions + 1
  : progress.correctSessions;

const newStars = calculateStars({
  totalAttempts: progress.totalAttempts + 1,
  totalCorrectSessions: newCorrectSessions,
  intervalDays: newSm2State.interval,
});
```

- [ ] **Step 3: Add getWordsByStars selector**

```typescript
getWordsByStars: (childId: string, stars: 0 | 1 | 2 | 3) => {
  const data = get().getData(childId);
  return Object.entries(data.wordProgress)
    .filter(([_, wp]) => wp.stars === stars)
    .map(([wordId]) => wordId);
},
```

- [ ] **Step 4: Run existing tests**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm test`
Expected: All existing tests still pass (store changes are additive).

- [ ] **Step 5: Commit**

```bash
git add src/stores/useSpellingProgressStore.ts
git commit -m "feat: add star tracking and correctSessions to progress store"
```

---

### Task 8: Add TTS audio utility

**Files:**
- Create: `src/utils/tts.ts`
- Create: `src/__tests__/tts.test.ts`

Browser Web Speech API wrapper for Phase 1 audio. Says the word, definition, and example sentence.

- [ ] **Step 1: Write the TTS utility**

Create `src/utils/tts.ts`:

```typescript
const PREFERRED_VOICES = [
  'Google UK English Female',
  'Google UK English Male',
  'Daniel',          // macOS UK voice
  'Kate',            // macOS UK voice
];

let cachedVoice: SpeechSynthesisVoice | null = null;

function getUKVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = speechSynthesis.getVoices();

  // Try preferred voices first
  for (const name of PREFERRED_VOICES) {
    const match = voices.find(v => v.name === name);
    if (match) { cachedVoice = match; return match; }
  }

  // Fall back to any en-GB voice
  const enGB = voices.find(v => v.lang === 'en-GB');
  if (enGB) { cachedVoice = enGB; return enGB; }

  // Fall back to any English voice
  const en = voices.find(v => v.lang.startsWith('en'));
  if (en) { cachedVoice = en; return en; }

  return null;
}

function speak(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) { resolve(); return; }

    speechSynthesis.cancel(); // stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = 'en-GB';

    const voice = getUKVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      resolve(); // don't block on TTS failure
    };

    speechSynthesis.speak(utterance);
  });
}

export async function speakWord(word: string): Promise<void> {
  await speak(word, 0.8);
}

export async function speakDefinition(definition: string): Promise<void> {
  await speak(`It means: ${definition}`, 0.85);
}

export async function speakSentence(sentence: string): Promise<void> {
  await speak(sentence, 0.85);
}

export async function speakWordFull(word: string, definition: string, sentence: string): Promise<void> {
  await speakWord(word);
  await new Promise(r => setTimeout(r, 500));
  await speakDefinition(definition);
  await new Promise(r => setTimeout(r, 500));
  await speakSentence(sentence);
}

/**
 * Pre-warm the voices list. Call once on app load.
 * Some browsers (Chrome) load voices asynchronously.
 */
export function preloadVoices(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoice = null; // re-select on voice list change
    });
  }
}
```

- [ ] **Step 2: Write a basic test**

Create `src/__tests__/tts.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

// TTS depends on browser APIs not available in jsdom.
// We test the module can be imported without errors.
describe('tts module', () => {
  it('exports speakWord function', async () => {
    const tts = await import('../utils/tts');
    expect(typeof tts.speakWord).toBe('function');
  });

  it('exports preloadVoices function', async () => {
    const tts = await import('../utils/tts');
    expect(typeof tts.preloadVoices).toBe('function');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx vitest run`
Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/utils/tts.ts src/__tests__/tts.test.ts
git commit -m "feat: add TTS utility with UK English voice selection"
```

---

## Chunk 3: Spelling Bee Ritual & Test Mode

### Task 9: Create the Spelling Bee Ritual component

**Files:**
- Create: `src/components/test/SpellingBeeRitual.tsx`

The oral ritual prompts the child through: say the word → spell it aloud → say it again → then type. Each step shows a prompt + Done button. Queen Bee watches throughout.

- [ ] **Step 1: Create the component**

Create `src/components/test/SpellingBeeRitual.tsx`:

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BeeChar } from '../mascot/BeeChar';
import { speakWord } from '../../utils/tts';

interface SpellingBeeRitualProps {
  word: string;
  onComplete: () => void;
}

const STEPS = [
  { prompt: 'Say the word out loud', beeMessage: 'Listen carefully...', beeMood: 'thinking' as const },
  { prompt: 'Now spell it out loud, letter by letter', beeMessage: 'Nice and clear!', beeMood: 'encouraging' as const },
  { prompt: 'Say the word one more time', beeMessage: 'One more time!', beeMood: 'happy' as const },
];

export function SpellingBeeRitual({ word, onComplete }: SpellingBeeRitualProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const handleDone = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleReplay = () => {
    speakWord(word);
  };

  const step = STEPS[stepIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-8">
      <BeeChar mood={step.beeMood} size="lg" message={step.beeMessage} showSpeechBubble animate />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <p className="text-2xl font-display font-bold text-slate-800 mb-2">
            {step.prompt}
          </p>
          <p className="text-sm text-slate-500">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4">
        <button
          onClick={handleReplay}
          className="px-6 py-3 rounded-button bg-honey-100 text-honey-700 font-semibold hover-wiggle"
        >
          🔊 Hear again
        </button>
        <button
          onClick={handleDone}
          className="px-8 py-3 rounded-button bg-honey-500 text-white font-bold shadow-lg hover:bg-honey-600 active:scale-95 transition-transform"
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/test/SpellingBeeRitual.tsx
git commit -m "feat: add Spelling Bee ritual component (say → spell → say → type)"
```

---

### Task 10: Create the Spelling Test (Type It) page

**Files:**
- Create: `src/components/test/LetterFeedback.tsx`
- Create: `src/components/test/TestProgress.tsx`
- Create: `src/pages/TestPage.tsx`
- Create: `src/hooks/useSpellingTest.ts`

This is the core test mode: Spelling Bee ritual → type the word → letter-by-letter feedback → next word → score summary.

- [ ] **Step 1: Create the letter feedback component**

Create `src/components/test/LetterFeedback.tsx`:

```typescript
interface LetterFeedbackProps {
  target: string;
  typed: string;
}

export function LetterFeedback({ target, typed }: LetterFeedbackProps) {
  const maxLen = Math.max(target.length, typed.length);

  return (
    <div className="flex justify-center gap-0.5 font-mono text-2xl">
      {Array.from({ length: maxLen }, (_, i) => {
        const targetChar = target[i] ?? '';
        const typedChar = typed[i] ?? '';
        const isCorrect = targetChar.toLowerCase() === typedChar.toLowerCase();
        const isMissing = i >= typed.length;
        const isExtra = i >= target.length;

        return (
          <span
            key={i}
            className={`w-8 h-10 flex items-center justify-center rounded ${
              isExtra ? 'bg-red-100 text-red-600' :
              isMissing ? 'bg-amber-100 text-amber-600' :
              isCorrect ? 'bg-meadow-100 text-meadow-700' :
              'bg-red-100 text-red-600'
            }`}
          >
            {isExtra ? typedChar : isMissing ? targetChar : isCorrect ? typedChar : targetChar}
          </span>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create the test progress dots component**

Create `src/components/test/TestProgress.tsx`:

```typescript
interface TestProgressProps {
  total: number;
  results: (boolean | null)[]; // true = correct, false = incorrect, null = upcoming
}

export function TestProgress({ total, results }: TestProgressProps) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const result = results[i];
        return (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              result === true ? 'bg-meadow-500' :
              result === false ? 'bg-red-400' :
              'bg-slate-300'
            }`}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create the test orchestration hook**

Create `src/hooks/useSpellingTest.ts`:

```typescript
import { useState, useCallback } from 'react';
import type { SpellingWord } from '../data/words/types';
import { gradeAnswer } from '../utils/sm2';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from './useCurrentUser';

export type TestPhase = 'select-count' | 'ritual' | 'typing' | 'feedback' | 'complete';

interface TestResult {
  wordId: string;
  word: string;
  typed: string;
  correct: boolean;
  timeMs: number;
}

export function useSpellingTest(words: SpellingWord[]) {
  const user = useCurrentUser();
  const recordAnswer = useSpellingProgressStore(s => s.recordAnswer);

  const [wordCount, setWordCount] = useState(10);
  const [testWords, setTestWords] = useState<SpellingWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<TestPhase>('select-count');
  const [results, setResults] = useState<TestResult[]>([]);
  const [typingStartTime, setTypingStartTime] = useState(0);
  const [ritualEnabled, setRitualEnabled] = useState(true);

  const startTest = useCallback((count: number) => {
    setWordCount(count);
    const selected = words.slice(0, count); // TODO: proper word selection algorithm
    setTestWords(selected);
    setCurrentIndex(0);
    setResults([]);
    setPhase(ritualEnabled ? 'ritual' : 'typing');
  }, [words, ritualEnabled]);

  const onRitualComplete = useCallback(() => {
    setTypingStartTime(Date.now());
    setPhase('typing');
  }, []);

  const submitAnswer = useCallback((typed: string) => {
    const word = testWords[currentIndex];
    const timeMs = Date.now() - typingStartTime;
    const correct = typed.toLowerCase().trim() === word.word.toLowerCase();
    const grade = gradeAnswer(correct, timeMs);

    const today = new Date().toISOString().split('T')[0];
    if (user) {
      recordAnswer(user.id, word.id, grade, today);
    }

    const result: TestResult = { wordId: word.id, word: word.word, typed, correct, timeMs };
    setResults(prev => [...prev, result]);
    setPhase('feedback');
  }, [testWords, currentIndex, typingStartTime, user, recordAnswer]);

  const nextWord = useCallback(() => {
    if (currentIndex + 1 >= testWords.length) {
      setPhase('complete');
    } else {
      setCurrentIndex(prev => prev + 1);
      setPhase(ritualEnabled ? 'ritual' : 'typing');
    }
  }, [currentIndex, testWords.length, ritualEnabled]);

  const currentWord = testWords[currentIndex] ?? null;
  const resultFlags = results.map(r => r.correct);
  const correctCount = results.filter(r => r.correct).length;
  const incorrectWords = results.filter(r => !r.correct);

  return {
    phase, currentWord, currentIndex, wordCount, testWords,
    results, resultFlags, correctCount, incorrectWords,
    startTest, onRitualComplete, submitAnswer, nextWord,
    ritualEnabled, setRitualEnabled,
  };
}
```

- [ ] **Step 4: Create the TestPage**

Create `src/pages/TestPage.tsx` that orchestrates the full flow:
- `select-count` phase: buttons for 5, 10, 15, 20 words
- `ritual` phase: renders `<SpellingBeeRitual>`
- `typing` phase: input field + Hear Again + Next button + progress dots
- `feedback` phase: renders `<LetterFeedback>` with 1.5s auto-advance
- `complete` phase: score summary, incorrect word list, "Drill these words" button

```typescript
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';
import { SpellingBeeRitual } from '../components/test/SpellingBeeRitual';
import { LetterFeedback } from '../components/test/LetterFeedback';
import { TestProgress } from '../components/test/TestProgress';
import { useSpellingTest } from '../hooks/useSpellingTest';
import { ALL_WORDS } from '../data/words';
import { speakWord } from '../utils/tts';

export default function TestPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    phase, currentWord, currentIndex, wordCount,
    results, resultFlags, correctCount, incorrectWords,
    startTest, onRitualComplete, submitAnswer, nextWord,
    ritualEnabled,
  } = useSpellingTest(ALL_WORDS);

  // Auto-focus input in typing phase
  useEffect(() => {
    if (phase === 'typing' && inputRef.current) {
      inputRef.current.focus();
      if (currentWord) speakWord(currentWord.word);
    }
  }, [phase, currentWord]);

  // Auto-advance after feedback
  useEffect(() => {
    if (phase === 'feedback') {
      const timer = setTimeout(nextWord, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, nextWord]);

  // ... render each phase
  // (Full JSX implementation for each phase)
}
```

- [ ] **Step 5: Add route for /test**

In `src/App.tsx`, add the lazy-loaded TestPage:

```typescript
const TestPage = lazy(() => import('./pages/TestPage'));
// Add inside ChildProtectedRoute:
<Route path="test" element={<TestPage />} />
```

- [ ] **Step 6: Add navigation item**

In `src/data/navItems.ts`, add a "Test" tab to the bottom navigation.

- [ ] **Step 7: Verify it compiles and renders**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit && npm run dev`
Navigate to `/test` in the browser to verify basic rendering.

- [ ] **Step 8: Commit**

```bash
git add src/components/test/ src/hooks/useSpellingTest.ts src/pages/TestPage.tsx src/App.tsx src/data/navItems.ts
git commit -m "feat: add Spelling Test (Type It) mode with Spelling Bee ritual"
```

---

## Chunk 4: Drill Mode & Bingo Grid

### Task 11: Create Drill Mode

**Files:**
- Create: `src/hooks/useDrill.ts`
- Create: `src/pages/DrillPage.tsx`

Drill takes a pool of words, tests 5 at a time, removes words after 3 correct in a row. Visual progress bar shows pool shrinking.

- [ ] **Step 1: Create the drill hook**

Create `src/hooks/useDrill.ts`:

```typescript
import { useState, useCallback } from 'react';
import type { SpellingWord } from '../data/words/types';
import { WORDS_BY_ID } from '../data/words';
import { gradeAnswer } from '../utils/sm2';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from './useCurrentUser';

interface DrillState {
  pool: string[];                    // word IDs remaining
  correctStreak: Record<string, number>; // word ID -> consecutive correct count
  mastered: string[];                // word IDs removed from pool
  currentBatch: SpellingWord[];      // current 5 words being drilled
  batchIndex: number;
  phase: 'ready' | 'ritual' | 'typing' | 'feedback' | 'batch-complete' | 'all-complete';
}

export function useDrill(initialWordIds: string[]) {
  const user = useCurrentUser();
  const recordAnswer = useSpellingProgressStore(s => s.recordAnswer);

  const [state, setState] = useState<DrillState>(() => {
    const pool = [...initialWordIds];
    const batch = pool.slice(0, 5).map(id => WORDS_BY_ID[id]).filter(Boolean);
    return {
      pool,
      correctStreak: {},
      mastered: [],
      currentBatch: batch,
      batchIndex: 0,
      phase: 'ready',
    };
  });

  const startBatch = useCallback(() => {
    setState(s => ({ ...s, batchIndex: 0, phase: 'ritual' }));
  }, []);

  const onRitualComplete = useCallback(() => {
    setState(s => ({ ...s, phase: 'typing' }));
  }, []);

  const submitAnswer = useCallback((typed: string) => {
    setState(s => {
      const word = s.currentBatch[s.batchIndex];
      if (!word) return s;

      const correct = typed.toLowerCase().trim() === word.word.toLowerCase();
      const today = new Date().toISOString().split('T')[0];
      if (user) {
        recordAnswer(user.id, word.id, gradeAnswer(correct, correct ? 8000 : 0), today);
      }

      const newStreak = { ...s.correctStreak };
      newStreak[word.id] = correct ? (newStreak[word.id] ?? 0) + 1 : 0;

      let newPool = [...s.pool];
      let newMastered = [...s.mastered];

      // Remove from pool after 3 correct in a row
      if (newStreak[word.id] >= 3) {
        newPool = newPool.filter(id => id !== word.id);
        newMastered = [...newMastered, word.id];
      }

      return {
        ...s,
        correctStreak: newStreak,
        pool: newPool,
        mastered: newMastered,
        phase: 'feedback',
      };
    });
  }, [user, recordAnswer]);

  const nextWord = useCallback(() => {
    setState(s => {
      if (s.batchIndex + 1 >= s.currentBatch.length) {
        // Batch complete — check if all done
        if (s.pool.length === 0) {
          return { ...s, phase: 'all-complete' };
        }
        // Prepare next batch from remaining pool
        const nextBatch = s.pool.slice(0, 5).map(id => WORDS_BY_ID[id]).filter(Boolean);
        return { ...s, currentBatch: nextBatch, batchIndex: 0, phase: 'batch-complete' };
      }
      return { ...s, batchIndex: s.batchIndex + 1, phase: 'ritual' };
    });
  }, []);

  const currentWord = state.currentBatch[state.batchIndex] ?? null;
  const totalWords = state.pool.length + state.mastered.length;
  const masteredCount = state.mastered.length;

  return {
    ...state, currentWord, totalWords, masteredCount,
    startBatch, onRitualComplete, submitAnswer, nextWord,
  };
}
```

- [ ] **Step 2: Create DrillPage**

Create `src/pages/DrillPage.tsx` with:
- Progress bar showing `mastered / total` words
- "X words left to master" heading
- Same typing/feedback/ritual UI as TestPage (reuse components)
- Celebration screen with confetti when pool reaches 0

- [ ] **Step 3: Add route for /drill**

In `src/App.tsx`:

```typescript
const DrillPage = lazy(() => import('./pages/DrillPage'));
<Route path="drill" element={<DrillPage />} />
```

- [ ] **Step 4: Verify it compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDrill.ts src/pages/DrillPage.tsx src/App.tsx
git commit -m "feat: add Drill mode with diminishing word pool"
```

---

### Task 12: Create the Bingo Grid component and page

**Files:**
- Create: `src/components/progress/BingoGrid.tsx`
- Create: `src/components/progress/BingoCell.tsx`
- Create: `src/pages/BingoPage.tsx`

The bingo grid is a 10×10 grid of words showing 0–3 star mastery. Tapping a cell could later open the flashcard.

- [ ] **Step 1: Create BingoCell component**

Create `src/components/progress/BingoCell.tsx`:

```typescript
import { motion } from 'framer-motion';

interface BingoCellProps {
  word: string;
  stars: 0 | 1 | 2 | 3;
  onClick?: () => void;
}

const STAR_STYLES = {
  0: 'bg-slate-100 text-slate-400',
  1: 'bg-amber-100 text-amber-800 border-amber-300',
  2: 'bg-slate-200 text-slate-800 border-slate-400',
  3: 'bg-yellow-200 text-yellow-900 border-yellow-400 shadow-sm shadow-yellow-300/50',
} as const;

const STAR_ICONS = { 0: '☆', 1: '★', 2: '★★', 3: '★★★' } as const;

export function BingoCell({ word, stars, onClick }: BingoCellProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-1 rounded text-[10px] leading-tight font-medium
        border text-center truncate
        ${STAR_STYLES[stars]}
      `}
      title={`${word} — ${STAR_ICONS[stars]}`}
    >
      <div className="truncate">{word}</div>
      <div className="text-[8px] opacity-70">{STAR_ICONS[stars]}</div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Create BingoGrid component**

Create `src/components/progress/BingoGrid.tsx`:

```typescript
import type { SpellingWord } from '../../data/words/types';
import { BingoCell } from './BingoCell';
import { useSpellingProgressStore } from '../../stores/useSpellingProgressStore';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { calculateStars } from '../../utils/stars';

interface BingoGridProps {
  words: SpellingWord[];
  title: string;
}

export function BingoGrid({ words, title }: BingoGridProps) {
  const user = useCurrentUser();
  const getWordProgress = useSpellingProgressStore(s => s.getWordProgress);

  const cols = 10;

  const masteredCount = words.filter(w => {
    if (!user) return false;
    return getWordProgress(user.id, w.id).stars === 3;
  }).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display font-bold text-lg text-slate-800">{title}</h3>
        <span className="text-sm text-slate-500">
          {masteredCount}/{words.length} mastered
        </span>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {words.map(word => {
          const progress = user ? getWordProgress(user.id, word.id) : null;
          const stars = progress?.stars ?? 0;
          return <BingoCell key={word.id} word={word.word} stars={stars} />;
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create BingoPage with block tabs**

Create `src/pages/BingoPage.tsx`:

```typescript
import { useState } from 'react';
import { WORDS_BY_DIFFICULTY } from '../data/words';
import { BingoGrid } from '../components/progress/BingoGrid';

const BLOCKS = [
  { key: 1 as const, label: 'Year 3/4', subtitle: 'D1 — Foundation' },
  { key: 2 as const, label: 'Year 5/6', subtitle: 'D2 — Building' },
  { key: 3 as const, label: '11+', subtitle: 'D3 — Advanced' },
];

export default function BingoPage() {
  const [activeBlock, setActiveBlock] = useState<1 | 2 | 3>(1);

  const words = WORDS_BY_DIFFICULTY[activeBlock];
  // D3 words split into grids of 100
  const grids = activeBlock === 3
    ? Array.from({ length: Math.ceil(words.length / 100) }, (_, i) =>
        words.slice(i * 100, (i + 1) * 100)
      )
    : [words];

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-display text-2xl font-bold text-slate-800">Word Grid</h2>

      {/* Block tabs */}
      <div className="flex gap-2">
        {BLOCKS.map(b => (
          <button
            key={b.key}
            onClick={() => setActiveBlock(b.key)}
            className={`flex-1 py-2 px-3 rounded-button text-sm font-semibold transition-colors ${
              activeBlock === b.key
                ? 'bg-honey-500 text-white'
                : 'bg-white/60 text-slate-600'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Grids */}
      {grids.map((gridWords, i) => (
        <BingoGrid
          key={`${activeBlock}-${i}`}
          words={gridWords}
          title={activeBlock === 3 ? `11+ Vocabulary (${i + 1}/${grids.length})` : BLOCKS.find(b => b.key === activeBlock)!.label}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Add route for /bingo**

In `src/App.tsx`:

```typescript
const BingoPage = lazy(() => import('./pages/BingoPage'));
<Route path="bingo" element={<BingoPage />} />
```

- [ ] **Step 5: Update bottom navigation**

In `src/data/navItems.ts`, add Bingo tab (grid icon from lucide-react).

- [ ] **Step 6: Verify it compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 7: Commit**

```bash
git add src/components/progress/ src/pages/BingoPage.tsx src/App.tsx src/data/navItems.ts
git commit -m "feat: add Bingo Grid progress view with 0-3 star cells"
```

---

## Chunk 5: Placement Test & Freemium Gating

### Task 13: Create Placement Test flow

**Files:**
- Create: `src/pages/PlacementPage.tsx`
- Create: `src/hooks/usePlacement.ts`

10 words, no Spelling Bee ritual (keep it quick), results pre-populate SM-2 state.

- [ ] **Step 1: Create the placement hook**

Create `src/hooks/usePlacement.ts`:

```typescript
import { useState, useCallback } from 'react';
import { PLACEMENT_TEST_WORD_IDS } from '../data/words/placement-test';
import { WORDS_BY_ID } from '../data/words';
import type { SpellingWord } from '../data/words/types';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from './useCurrentUser';

export function usePlacement() {
  const user = useCurrentUser();
  const recordAnswer = useSpellingProgressStore(s => s.recordAnswer);

  const words = PLACEMENT_TEST_WORD_IDS.map(id => WORDS_BY_ID[id]).filter(Boolean) as SpellingWord[];
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ wordId: string; correct: boolean; difficulty: number }[]>([]);
  const [phase, setPhase] = useState<'intro' | 'typing' | 'feedback' | 'complete'>('intro');

  const start = useCallback(() => setPhase('typing'), []);

  const submit = useCallback((typed: string) => {
    const word = words[index];
    if (!word) return;
    const correct = typed.toLowerCase().trim() === word.word.toLowerCase();
    const today = new Date().toISOString().split('T')[0];

    // Grade highly if correct (pre-populate as known)
    if (user) {
      recordAnswer(user.id, word.id, correct ? 5 : 1, today);
    }

    setResults(prev => [...prev, { wordId: word.id, correct, difficulty: word.difficulty }]);
    setPhase('feedback');
  }, [words, index, user, recordAnswer]);

  const next = useCallback(() => {
    if (index + 1 >= words.length) {
      setPhase('complete');
    } else {
      setIndex(prev => prev + 1);
      setPhase('typing');
    }
  }, [index, words.length]);

  // Determine recommended starting tier
  const getRecommendedTier = useCallback((): 1 | 2 | 3 => {
    const d1Correct = results.filter(r => r.difficulty === 1 && r.correct).length;
    const d2Correct = results.filter(r => r.difficulty === 2 && r.correct).length;

    if (d1Correct >= 2 && d2Correct >= 2) return 3; // knows D1+D2, start at D3
    if (d1Correct >= 2) return 2; // knows D1, start at D2
    return 1; // start at D1
  }, [results]);

  return {
    words, index, phase, results, currentWord: words[index] ?? null,
    start, submit, next, getRecommendedTier,
  };
}
```

- [ ] **Step 2: Create PlacementPage**

Create `src/pages/PlacementPage.tsx` with intro screen, typing phase (simplified — no ritual), feedback, and results with recommended tier.

- [ ] **Step 3: Add route and guard**

In `src/App.tsx`, add `/placement` route. In `HomePage.tsx`, check if placement has been completed (store a flag in the progress store) and redirect to `/placement` if not.

- [ ] **Step 4: Verify it compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/hooks/usePlacement.ts src/pages/PlacementPage.tsx src/App.tsx
git commit -m "feat: add placement test (10 words) to determine starting tier"
```

---

### Task 14: Add freemium gating

**Files:**
- Create: `src/hooks/useSpellingPaywall.ts`
- Create: `src/pages/UpgradePage.tsx`
- Modify: `src/hooks/useSpellingTest.ts` (filter words by access)

Content gating: free-tier users see only words where `isFree: true`. All features remain accessible.

- [ ] **Step 1: Create the paywall hook**

Create `src/hooks/useSpellingPaywall.ts`:

```typescript
import { useCurrentUser } from './useCurrentUser';
import type { SpellingWord } from '../data/words/types';

export function useSpellingPaywall() {
  const user = useCurrentUser();
  // has_paid_spelling sourced from Supabase-fetched child profile
  const hasPaid = user?.hasPaidSpelling ?? false;

  const canAccessWord = (word: SpellingWord): boolean => {
    return word.isFree || hasPaid;
  };

  return { hasPaid, canAccessWord };
}
```

- [ ] **Step 2: Create the UpgradePage**

Create `src/pages/UpgradePage.tsx` with pricing info (£19.99), feature list, and checkout button.

- [ ] **Step 3: Filter words in test/drill hooks**

In `useSpellingTest.ts` and `useDrill.ts`, filter the word pool through `canAccessWord` before starting a test/drill.

- [ ] **Step 4: Add route for /upgrade**

In `src/App.tsx`:

```typescript
const UpgradePage = lazy(() => import('./pages/UpgradePage'));
<Route path="upgrade" element={<UpgradePage />} />
```

- [ ] **Step 5: Verify it compiles**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useSpellingPaywall.ts src/pages/UpgradePage.tsx src/hooks/useSpellingTest.ts src/hooks/useDrill.ts src/App.tsx
git commit -m "feat: add freemium content gating (isFree flag on words)"
```

---

## Chunk 6: Landing Page, Checkout & Deployment

### Task 15: Update landing page with email capture

**Files:**
- Modify: `src/pages/LandingPage.tsx`

Add email capture form ("Get 40 free spelling words"), feature highlights, pricing section (£19.99), and Queen Bee branding.

- [ ] **Step 1: Add email capture form to landing page**

Add an email input + submit button. On submit, store email in Supabase `spelling_leads` table (fire-and-forget upsert). Then navigate to `/signup`.

- [ ] **Step 2: Add pricing section**

Show £19.99 pricing with feature comparison (free vs paid).

- [ ] **Step 3: Verify it renders**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm run dev`
Navigate to `/` and verify the landing page looks correct.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: update landing page with email capture and pricing"
```

---

### Task 16: Add LemonSqueezy checkout integration

**Files:**
- Create: `src/pages/CheckoutPage.tsx`
- Create: `src/pages/PaymentSuccessPage.tsx`

Mirror ATQ's checkout pattern with LemonSqueezy. The edge functions (`create-spelling-checkout`, `spelling-webhook`, `claim-spelling-payment`) will be deployed separately.

- [ ] **Step 1: Create CheckoutPage**

Create `src/pages/CheckoutPage.tsx` with discount code input, checkout button that calls `create-spelling-checkout` edge function.

- [ ] **Step 2: Create PaymentSuccessPage**

Create `src/pages/PaymentSuccessPage.tsx` that shows confirmation and triggers `claim-spelling-payment`.

- [ ] **Step 3: Add routes**

In `src/App.tsx`:

```typescript
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
<Route path="checkout" element={<CheckoutPage />} />
<Route path="payment-success" element={<PaymentSuccessPage />} />
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/CheckoutPage.tsx src/pages/PaymentSuccessPage.tsx src/App.tsx
git commit -m "feat: add LemonSqueezy checkout and payment success pages"
```

---

### Task 17: Create Supabase migration for new tables

**Files:**
- Create: `supabase/migrations/005_spelling_v2.sql`

The existing `004_spelling.sql` created initial tables with a different schema. This migration adds new tables and alters existing ones to match the v2 spec. Check what `004_spelling.sql` already created and only add what's missing or needs changing.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/005_spelling_v2.sql` with:
- All 6 table CREATE statements from the spec
- ALTER TABLE for `has_paid_spelling`
- RLS policies (enable RLS, create policies matching ATQ pattern)
- Indexes on `child_id` columns

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/005_spelling_v2.sql
git commit -m "feat: add Supabase migration for spelling v2 tables and RLS policies"
```

---

### Task 18: Update HomePage dashboard

**Files:**
- Modify: `src/pages/HomePage.tsx`

Add dashboard cards for: daily review count, words mastered ring, quick actions (Test, Drill, Bingo), and placement test redirect.

- [ ] **Step 1: Add dashboard cards**

- "Quick Review" card showing words due for SM-2 review
- "Words Mastered" progress ring
- "Start Test" / "Drill Weak Words" action buttons
- Redirect to `/placement` if placement not yet completed

- [ ] **Step 2: Verify it renders**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm run dev`

- [ ] **Step 3: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: update dashboard with test, drill, and progress cards"
```

---

### Task 19: Update bottom navigation

**Files:**
- Modify: `src/data/navItems.ts`
- Modify: `src/components/layout/BottomNav.tsx`

Final navigation: Home, Test, Grid, Settings (4 tabs).

- [ ] **Step 1: Update nav items**

```typescript
export const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: 'Home' },
  { path: '/test', label: 'Test', icon: 'PenLine' },
  { path: '/bingo', label: 'Grid', icon: 'LayoutGrid' },
  { path: '/progress', label: 'Progress', icon: 'BarChart3' },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/navItems.ts src/components/layout/BottomNav.tsx
git commit -m "feat: update bottom navigation with Test and Grid tabs"
```

---

### Task 20: Create Settings page with Spelling Bee mode toggle

**Files:**
- Create: `src/pages/SettingsPage.tsx`
- Modify: `src/stores/useSpellingProgressStore.ts` (add `ritualEnabled` per-child setting)

The spec requires a Settings page at `/settings` with Spelling Bee mode toggle and dyslexia mode toggle (already in `useDyslexiaStore`).

- [ ] **Step 1: Add ritualEnabled to the progress store**

In `src/stores/useSpellingProgressStore.ts`, add a `settings` object to `ChildSpellingData`:

```typescript
settings: {
  ritualEnabled: boolean; // default: true
}
```

Add `toggleRitual(childId: string)` action.

- [ ] **Step 2: Create SettingsPage**

Create `src/pages/SettingsPage.tsx` with:
- Spelling Bee Mode toggle (on/off, default on) — "Say the word out loud before typing"
- Dyslexia Mode toggle (from existing `useDyslexiaStore`)
- About section

- [ ] **Step 3: Add route and nav**

In `src/App.tsx`, add `/settings` route. Update `src/data/navItems.ts` — the 4 tabs become: Home, Test, Grid, Settings (replace Progress with Settings; Progress is accessible from Home).

- [ ] **Step 4: Update useSpellingTest to read ritual setting from store**

Replace the local `ritualEnabled` state in `useSpellingTest.ts` with the persisted store value.

- [ ] **Step 5: Commit**

```bash
git add src/pages/SettingsPage.tsx src/stores/useSpellingProgressStore.ts src/App.tsx src/data/navItems.ts src/hooks/useSpellingTest.ts
git commit -m "feat: add Settings page with Spelling Bee mode and dyslexia toggles"
```

---

### Task 21: Edge Function stubs (checkout, webhook, claim, lead capture)

**Files:**
- Create: `supabase/functions/create-spelling-checkout/index.ts`
- Create: `supabase/functions/spelling-webhook/index.ts`
- Create: `supabase/functions/claim-spelling-payment/index.ts`
- Create: `supabase/functions/capture-spelling-lead/index.ts`

These mirror the ATQ Edge Functions. Copy the ATQ patterns from the parent project at `/Users/rebeccaeverton/11+ Read the Question/supabase/functions/`.

- [ ] **Step 1: Copy and adapt create-checkout-session**

Copy from ATQ's `create-checkout-session/index.ts`. Change:
- Product variant ID to the Spelling Bee LemonSqueezy variant
- Price to £19.99 (1999 in pence)
- Success URL to Spelling Bee domain

- [ ] **Step 2: Copy and adapt lemonsqueezy-webhook**

Copy from ATQ's `lemonsqueezy-webhook/index.ts`. Change:
- Update `has_paid_spelling` instead of `has_paid` on `child_profiles`
- Insert into `spelling_payments` table

- [ ] **Step 3: Copy and adapt claim-payment**

Copy from ATQ's `claim-payment/index.ts`. Change to match on `spelling_payments` table.

- [ ] **Step 4: Create capture-spelling-lead**

Simple function: receives `{ email }` in body, upserts into `spelling_leads` table using service role key (no auth required — this is for the landing page email capture). Rate limited to 10/min.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/
git commit -m "feat: add Edge Functions for spelling checkout, webhook, claim, and lead capture"
```

---

### Task 22: Final build verification and deployment prep

**Files:**
- Modify: `vite.config.ts` (verify chunks)
- Verify: `vercel.json` (security headers, SPA rewrites)

- [ ] **Step 1: Run full build**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm run build`
Expected: Clean build, no errors, chunks split correctly.

- [ ] **Step 2: Run all tests**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm test`
Expected: All tests pass (SM-2 + stars + TTS).

- [ ] **Step 3: Preview locally**

Run: `cd "/Users/rebeccaeverton/ATQ Spelling" && npm run preview`
Verify: Landing page, test mode, drill mode, bingo grid all render correctly.

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final build verification and deployment prep"
```

- [ ] **Step 5: Deploy**

Push to main for Vercel auto-deploy, then run Supabase migration in the SQL editor.

---

## Task Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Update SpellingWord/WordProgress/User types in-place | None |
| 2 | Year 3/4 statutory words (100) | Task 1 |
| 3 | Year 5/6 statutory words (100) | Task 1 |
| 4 | 11+ vocabulary words (~300) | Task 1 |
| 5 | Word bank index + legacy migration + placement words | Tasks 2-4 |
| 6 | Star calculation utility + tests | None |
| 7 | Update progress store for stars | Tasks 1, 6 |
| 8 | TTS audio utility | None |
| 9 | Spelling Bee Ritual component | Task 8 |
| 10 | Spelling Test (Type It) page | Tasks 5, 7, 8, 9 |
| 11 | Drill Mode | Tasks 5, 7, 9 |
| 12 | Bingo Grid | Tasks 5, 7 |
| 13 | Placement Test | Tasks 5, 7 |
| 14 | Freemium gating | Tasks 1, 5 |
| 15 | Landing page + email capture | None |
| 16 | LemonSqueezy checkout | Task 14 |
| 17 | Supabase migration (v2 schema) | None |
| 18 | HomePage dashboard | Tasks 10, 11, 12 |
| 19 | Bottom navigation | Tasks 10, 12 |
| 20 | Settings page + Spelling Bee mode toggle | Task 7 |
| 21 | Edge Functions (checkout, webhook, claim, lead) | Task 17 |
| 22 | Final build + deploy | All |

**Parallelisable:** Tasks 1 + 6 + 8 + 15 + 17 can all run in parallel (no dependencies on each other). Tasks 2, 3, 4 can run in parallel after Task 1.
