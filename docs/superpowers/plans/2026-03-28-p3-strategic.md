# ATQ Product Improvements — Priority 3: Strategic

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three strategic improvements: a mastery model that adapts question selection to each child's demonstrated gaps (replacing fixed week-number difficulty), paper-to-online landing page messaging targeting Bond/paper prep families, and stronger inner-journey copy on the landing page.

**Architecture:** The mastery model adds a `categoryMastery` record to `UserProgress` (persisted in Zustand + Supabase). `useDailyQuestions` reads mastery to weight question selection — mastered categories are deprioritised, struggling categories are upweighted. Landing page changes are copy-only: a new FAQ entry and an update to the GapSection.

**Dependencies:** Priority 1 and Priority 2 plans should be complete first (Bond taxonomy, category analytics infrastructure).

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Zustand with persist, Supabase.

---

## Chunk 1: Mastery model — adaptive question selection

### Task 9a: Add CategoryMastery to UserProgress type and store

**Files:**
- Modify: `src/types/progress.ts`
- Modify: `src/stores/useProgressStore.ts`

- [ ] **Step 1: Define `CategoryMastery` type**

In `src/types/progress.ts`, add:

```typescript
export interface CategoryMasteryEntry {
  recentAttempts: boolean[];   // Last 10 correct/wrong results (true = correct)
  lastSeenDate: string;        // ISO date string
}

export type CategoryMastery = Record<string, CategoryMasteryEntry>;
```

Add `categoryMastery: CategoryMastery` to `UserProgress`:

```typescript
export interface UserProgress {
  // ...existing fields...
  categoryMastery: CategoryMastery;
}
```

- [ ] **Step 2: Update useProgressStore initial state and migration**

In `src/stores/useProgressStore.ts`:

1. Add `categoryMastery: {}` to the initial state for new users.
2. Add a migration guard: when loading persisted state, if `categoryMastery` is missing, set it to `{}`. Follow the same pattern as the existing `migrateSubjectScores` migration.
3. Add an `updateCategoryMastery(childId: string, category: string, correct: boolean)` action that:
   - Finds the entry for `category` (or creates one)
   - Appends `correct` to `recentAttempts`, keeping only the last 10 entries
   - Updates `lastSeenDate` to today

```typescript
updateCategoryMastery: (childId: string, category: string, correct: boolean) => {
  set(state => {
    const progress = state.childProgress[childId];
    if (!progress) return state;
    const existing = progress.categoryMastery[category] ?? { recentAttempts: [], lastSeenDate: '' };
    const recentAttempts = [...existing.recentAttempts, correct].slice(-10);
    return {
      childProgress: {
        ...state.childProgress,
        [childId]: {
          ...progress,
          categoryMastery: {
            ...progress.categoryMastery,
            [category]: { recentAttempts, lastSeenDate: new Date().toISOString().split('T')[0] },
          },
        },
      },
    };
  });
},
```

- [ ] **Step 3: Call updateCategoryMastery when a question result is saved**

In `useProgressStore`, find the `saveQuestionResult` (or equivalent) action that records a completed question. After recording the result, call `updateCategoryMastery` with the question's category.

The question `category` needs to come from the question bank. The store action needs to either receive `category` as a parameter or look it up. Simplest: pass `category?: string` as an optional extra field on `QuestionResult` (already has it in spirit, but the type doesn't include it). Instead, call `updateCategoryMastery` from the call site (PracticePage or the hook that calls `saveQuestionResult`), where the question object is in scope.

Read `useProgressStore.ts` to find the right integration point before implementing.

- [ ] **Step 4: Commit**

```bash
git add src/types/progress.ts src/stores/useProgressStore.ts
git commit -m "feat: add CategoryMastery to UserProgress with rolling 10-attempt window"
```

---

### Task 9b: Compute mastery status and expose via hook

**Files:**
- Create: `src/utils/masteryUtils.ts`

- [ ] **Step 1: Create mastery utility functions**

Create `src/utils/masteryUtils.ts`:

```typescript
import type { CategoryMastery, CategoryMasteryEntry } from '../types/progress';

export type MasteryStatus = 'mastered' | 'struggling' | 'learning' | 'unseen';

/**
 * Returns the mastery status for a category.
 * - mastered: ≥8 of last 10 correct (≥80%)
 * - struggling: ≤3 of last 10 correct (≤30%), with at least 5 attempts
 * - learning: 4-7 of last 10 correct
 * - unseen: no attempts recorded
 */
export function getMasteryStatus(entry: CategoryMasteryEntry | undefined): MasteryStatus {
  if (!entry || entry.recentAttempts.length === 0) return 'unseen';
  const attempts = entry.recentAttempts.length;
  const correct = entry.recentAttempts.filter(Boolean).length;
  const accuracy = correct / attempts;

  if (accuracy >= 0.8 && attempts >= 5) return 'mastered';
  if (accuracy <= 0.3 && attempts >= 5) return 'struggling';
  return 'learning';
}

/**
 * Returns a weight multiplier for question selection.
 * mastered = 0.2 (rarely seen), struggling = 2.5 (prioritised), others = 1.0
 */
export function getSelectionWeight(status: MasteryStatus): number {
  switch (status) {
    case 'mastered':   return 0.2;
    case 'struggling': return 2.5;
    case 'learning':   return 1.0;
    case 'unseen':     return 1.2;  // Slight boost for unseen categories
  }
}

export function getMasteryStatusForCategory(mastery: CategoryMastery, category: string): MasteryStatus {
  return getMasteryStatus(mastery[category]);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/masteryUtils.ts
git commit -m "feat: add mastery status and selection weight utilities"
```

---

### Task 9c: Apply mastery weights to question selection

**Files:**
- Modify: `src/hooks/useDailyQuestions.ts`

`useDailyQuestions` currently selects questions based on week difficulty and subject distribution. We add a weighted selection step that biases toward struggling categories and away from mastered ones.

- [ ] **Step 1: Read useDailyQuestions.ts**

Read the full file to understand the current selection logic before modifying it.

- [ ] **Step 2: Import mastery utilities and CategoryMastery**

```typescript
import { getSelectionWeight, getMasteryStatusForCategory } from '../utils/masteryUtils';
import type { CategoryMastery } from '../types/progress';
```

- [ ] **Step 3: Add mastery-weighted filtering**

After the existing difficulty and subject filters produce a candidate pool, apply weighted selection. A weighted selection picks questions with probability proportional to their weight.

Add a helper function at the top of the file:

```typescript
function weightedSample<T>(
  items: T[],
  weightFn: (item: T) => number,
  count: number,
): T[] {
  if (items.length === 0) return [];
  const weights = items.map(weightFn);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const selected: T[] = [];
  const pool = [...items];

  for (let i = 0; i < count && pool.length > 0; i++) {
    let r = Math.random() * pool.reduce((a, item) => a + weightFn(item), 0);
    let idx = 0;
    while (idx < pool.length - 1) {
      r -= weightFn(pool[idx]);
      if (r <= 0) break;
      idx++;
    }
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return selected;
}
```

In the selection logic, replace the current random sampling of candidate questions with:

```typescript
const selected = weightedSample(
  candidateQuestions,
  (q) => getSelectionWeight(getMasteryStatusForCategory(categoryMastery, q.category ?? '')),
  targetCount,
);
```

Where `categoryMastery` comes from `useProgressStore(s => s.getProgress(childId).categoryMastery)`.

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: Zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDailyQuestions.ts
git commit -m "feat: apply mastery weights to daily question selection"
```

---

### Task 9d: Show mastery status in DashboardPage CategoryBreakdown

**Files:**
- Modify: `src/components/dashboard/CategoryBreakdown.tsx`
- Modify: `src/pages/DashboardPage.tsx`

Show "Mastered ✓" badges on categories with mastered status, and "Needs practice" on struggling ones. This makes the parent dashboard act as a genuine coaching tool.

- [ ] **Step 1: Pass categoryMastery into CategoryBreakdown**

In `DashboardPage`, read `progress.categoryMastery` and pass it to `CategoryBreakdown` as a new prop.

- [ ] **Step 2: Update CategoryBreakdown to show mastery badge**

Import `getMasteryStatusForCategory` and render a badge:

```tsx
const status = getMasteryStatusForCategory(categoryMastery, score.category);

// In the row:
{status === 'mastered' && (
  <span className="font-display text-xs text-emerald-600 font-semibold ml-1">✓ Mastered</span>
)}
{status === 'struggling' && (
  <span className="font-display text-xs text-red-500 font-semibold ml-1">Needs practice</span>
)}
```

- [ ] **Step 3: Build and commit**

```bash
git add src/components/dashboard/CategoryBreakdown.tsx src/pages/DashboardPage.tsx
git commit -m "feat: show mastered/struggling badges in category breakdown dashboard"
```

---

## Chunk 2: Landing page — paper-to-online messaging and inner journey

### Task 10a: Add paper-to-online FAQ entry

**Files:**
- Modify: `src/components/landing/FaqSection.tsx`

Add one new FAQ item targeting families currently using Bond books or paper prep:

- [ ] **Step 1: Read FaqSection.tsx**

Read the current file to understand the FAQ data structure and how items are added.

- [ ] **Step 2: Add the new FAQ item**

Add to the FAQ items array:

```typescript
{
  question: 'We\'re already using Bond books — will this work alongside them?',
  answer: 'Perfectly. Bond books are excellent for building knowledge. AnswerTheQuestion! picks up where paper can\'t: it tracks exactly which question types your child is getting wrong, adapts to focus on their gaps, and builds the technique habits that paper practice alone won\'t drill. Many families use both — Bond for content coverage, ATQ to make sure the marks reflect what the child actually knows.',
},
```

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/FaqSection.tsx
git commit -m "feat: add paper-to-online FAQ entry for Bond book families"
```

---

### Task 10b: Strengthen inner journey messaging on landing page

**Files:**
- Modify: `src/components/landing/GapSection.tsx`

The GapSection currently covers "the piece that's missing" with a focus on the reading habit. Strengthen the second paragraph to name the inner journey (mindset, calm, resilience) as ATQ's unique differentiator — not just technique but the ability to stay calm and think clearly under pressure.

- [ ] **Step 1: Read GapSection.tsx**

Read the current file.

- [ ] **Step 2: Replace the second paragraph**

Change the second paragraph from the current "The CLEAR Method trains that habit…" text to:

```tsx
<p className="text-white/85 font-display text-base md:text-lg leading-relaxed mb-10">
  AnswerTheQuestion! is the only 11+ prep tool built around this. Every session
  starts with a breathing exercise. Every question reinforces a five-step method
  that builds calm, deliberate thinking. Children don&rsquo;t just learn to answer
  questions &mdash; they learn to stay composed when it counts. That&rsquo;s the
  difference between a child who <em>knows</em> the answer and a child who
  <em>gets</em> the mark.
</p>
```

- [ ] **Step 3: Build and commit**

```bash
git add src/components/landing/GapSection.tsx
git commit -m "feat: strengthen inner journey copy in GapSection"
```

---

### Task 10c: Add inner journey callout to HeroSection subheadline

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

The hero subheadline currently focuses on the CLEAR Method and exam types. Add a one-sentence hook about the mindset/calm angle to differentiate from pure technique tools.

- [ ] **Step 1: Read HeroSection.tsx**

Read the current subheadline paragraph.

- [ ] **Step 2: Extend the subheadline card**

After the existing CLEAR Method sentence, add:

```tsx
<p className="text-white/80 font-display text-sm md:text-base leading-relaxed mt-3">
  The only 11+ programme that builds exam technique <em>and</em> exam composure
  &mdash; so your child walks in confident, not just prepared.
</p>
```

This sits inside the existing `bg-white/15 backdrop-blur-sm` card.

- [ ] **Step 3: Build and commit**

```bash
git add src/components/landing/HeroSection.tsx
git commit -m "feat: add inner journey differentiator to HeroSection subheadline"
```

---

## Final check

- [ ] **Full build clean**

Run: `npm run build`
Expected: Zero TypeScript errors, zero warnings.

- [ ] **Push**

```bash
git push origin main
```
