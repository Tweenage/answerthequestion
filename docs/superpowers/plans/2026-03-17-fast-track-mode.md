# Fast Track Mode Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Fast Track programme mode so children with fewer than 12 weeks until their exam still get a properly paced, effective programme — removing the "it's too late to buy" objection from the landing page.

**Architecture:** `examDate` is moved to per-child storage (Supabase `child_profiles.exam_date`). A new `useWeekConfig` hook replaces all inline `programmeWeeks[currentWeek - 1]` lookups across the app, computing Fast Track configs automatically when the exam is < 12 weeks away. A new `getFastTrackWeekConfig()` function proportionally maps the fast-track week number onto the full 12-week config array so difficulty, scaffolding, and timers still progress naturally but compressed. The landing page gains new copy addressing the "not enough time" objection.

**Tech Stack:** React 19, TypeScript 5.9, Zustand 5, Supabase PostgreSQL, Tailwind CSS 4, Framer Motion 12, `date-fns` (already in project for `differenceInCalendarDays`)

---

## Context: Current State

- `examDate` lives in `useSettingsStore` (Zustand, localStorage only, global across all children, not persisted to Supabase)
- Week configs are looked up inline in every page: `programmeWeeks[Math.min(progress.currentWeek - 1, 11)]`
- `saveSession` advances week: every 7 completed sessions = 1 week, capped at 12
- No Fast Track mode exists anywhere
- Landing page currently says "12-week programme" with no mention of shorter options

---

## File Map

| File | Status | Responsibility |
|------|--------|---------------|
| `src/data/programme/fast-track.ts` | **CREATE** | `getFastTrackWeekConfig(currentWeek, weeksUntilExam)` |
| `src/hooks/useWeekConfig.ts` | **CREATE** | Central hook — replaces all inline `programmeWeeks[...]` lookups |
| `src/types/user.ts` | **MODIFY** | Add `examDate?: string` to `User` interface |
| `src/pages/ChildPickerPage.tsx` | **MODIFY** | Add exam date field to child creation form; include in Supabase insert; map in fetchChildren response |
| `src/stores/useAuthStore.ts` | **MODIFY** | Map `exam_date` from Supabase → `examDate` on User objects |
| `src/pages/HomePage.tsx` | **MODIFY** | Use `useWeekConfig` hook; sync child's examDate into `useSettingsStore`; show Fast Track badge; update ExamCountdown handler to also write to Supabase |
| `src/pages/PracticePage.tsx` | **MODIFY** | Use `useWeekConfig` hook instead of inline lookup |
| `src/pages/MockExamPage.tsx` | **MODIFY** | Use `useWeekConfig` hook |
| `src/pages/DailyChallengePage.tsx` | **MODIFY** | Use `useWeekConfig` hook |
| `src/pages/DashboardPage.tsx` | **MODIFY** | Use `useWeekConfig` hook |
| `src/components/landing/JourneySection.tsx` | **MODIFY** | Add Fast Track section below the 3-phase display |
| `src/components/landing/PricingSection.tsx` | **MODIFY** | Add "⚡ Fast Track mode" to includes list |
| `src/components/landing/FaqSection.tsx` | **MODIFY** | Add "What if we only have a few weeks?" FAQ |

---

## Chunk 1: Data Layer + Hook

### Task 1: Supabase migration

**Files:**
- No code change — SQL to run in Supabase Dashboard SQL editor

- [ ] **Step 1: Run the migration SQL in Supabase SQL editor**

```sql
ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS exam_date TEXT;
```

> This adds a nullable text column `exam_date` (ISO date string, e.g. `"2026-05-15"`).
> Safe to run on live — `IF NOT EXISTS` prevents errors if already present.

- [ ] **Step 2: Verify in Supabase table editor**

Open `child_profiles` → confirm `exam_date` column exists with type TEXT, default null.

---

### Task 2: Add Fast Track week config logic

**Files:**
- Create: `src/data/programme/fast-track.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/data/programme/fast-track.ts
//
// Fast Track mode: proportionally maps a compressed week number
// onto the full 12-week programme config array.
//
// Design principle:
//   - Week 1 of fast-track always maps to standard week 1 (gentle start)
//   - Last week of fast-track always maps to standard week 12 (exam pace)
//   - Intermediate weeks are distributed proportionally in between
//
// Example mappings:
//   3-week fast-track:
//     Week 1 → standard week 1  (120s, heavy, difficulty 1)
//     Week 2 → standard week 6  (90s,  medium, difficulty 2)
//     Week 3 → standard week 12 (55s,  light, difficulty 3)
//
//   6-week fast-track:
//     Week 1 → standard week 1  (120s)
//     Week 3 → standard week 5  (95s)
//     Week 6 → standard week 12 (55s)

import { programmeWeeks } from './weeks';
import type { WeekConfig } from '../../types/programme';
import { differenceInCalendarWeeks } from 'date-fns';

/** Minimum weeks for standard programme. If exam is ≥ 12 weeks away, use standard. */
export const FAST_TRACK_THRESHOLD_WEEKS = 12;

/**
 * Calculate how many calendar weeks remain until the exam date.
 * Returns null if examDate is not set.
 * Caps at 0 (never negative).
 */
export function getWeeksUntilExam(examDate: string | null | undefined): number | null {
  if (!examDate) return null;
  const exam = new Date(examDate);
  const today = new Date();
  const weeks = differenceInCalendarWeeks(exam, today);
  return Math.max(0, weeks);
}

/**
 * Is the child in Fast Track mode?
 * True when examDate is set and fewer than 12 weeks remain.
 */
export function isFastTrack(examDate: string | null | undefined): boolean {
  const weeks = getWeeksUntilExam(examDate);
  return weeks !== null && weeks < FAST_TRACK_THRESHOLD_WEEKS;
}

/**
 * Return the Fast Track total weeks (1–11 clamped).
 * Returns null if not in Fast Track mode.
 */
export function getFastTrackTotalWeeks(examDate: string | null | undefined): number | null {
  const weeks = getWeeksUntilExam(examDate);
  if (weeks === null || weeks >= FAST_TRACK_THRESHOLD_WEEKS) return null;
  return Math.max(1, weeks);
}

/**
 * Get the WeekConfig for a Fast Track child.
 *
 * @param currentWeek - The child's current week (1-indexed, from progress store)
 * @param totalFastTrackWeeks - Total weeks in their fast-track (1–11)
 * @returns WeekConfig with weekNumber overridden to currentWeek
 */
export function getFastTrackWeekConfig(
  currentWeek: number,
  totalFastTrackWeeks: number,
): WeekConfig {
  // Clamp currentWeek to valid range
  const clampedWeek = Math.max(1, Math.min(currentWeek, totalFastTrackWeeks));

  // For 1 week: use a building-phase config (week 7) — jumping to exam pace day 1
  // is too stressful; they need to learn the method even if briefly
  if (totalFastTrackWeeks === 1) {
    return { ...programmeWeeks[6], weekNumber: 1 }; // week 7: 85s, medium, diff 2
  }

  // Proportionally map clampedWeek → standard week index (0–11)
  // week 1 → index 0 (standard week 1)
  // lastWeek → index 11 (standard week 12)
  const progress = (clampedWeek - 1) / (totalFastTrackWeeks - 1);
  const standardWeekIndex = Math.min(11, Math.round(progress * 11));

  return {
    ...programmeWeeks[standardWeekIndex],
    weekNumber: clampedWeek,
  };
}
```

- [ ] **Step 2: Build to check for TypeScript errors**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

Expected: `✓ built in X.XXs` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/programme/fast-track.ts
git commit -m "feat: add fast-track week config logic

getFastTrackWeekConfig proportionally maps N fast-track weeks onto the
full 12-week programme config so difficulty/timers still progress from
easy-slow to hard-fast, just compressed."
```

---

### Task 3: Create `useWeekConfig` hook

This is the centralised hook that ALL pages use. It replaces every inline `programmeWeeks[Math.min(progress.currentWeek - 1, 11)]` call.

**Files:**
- Create: `src/hooks/useWeekConfig.ts`

- [ ] **Step 1: Create the hook**

```typescript
// src/hooks/useWeekConfig.ts
//
// Central hook for getting the current WeekConfig.
// Handles both standard and Fast Track modes transparently.
//
// Usage (replaces all inline programmeWeeks[...] lookups):
//   const { weekConfig, isFastTrack, totalWeeks } = useWeekConfig();

import { useCurrentUser } from './useCurrentUser';
import { useProgressStore } from '../stores/useProgressStore';
import { programmeWeeks } from '../data/programme/weeks';
import {
  isFastTrack as checkFastTrack,
  getFastTrackWeekConfig,
  getFastTrackTotalWeeks,
} from '../data/programme/fast-track';
import type { WeekConfig } from '../types/programme';

interface WeekConfigResult {
  /** The WeekConfig appropriate for the current child's current week */
  weekConfig: WeekConfig;
  /** Whether the child is in Fast Track mode */
  isFastTrack: boolean;
  /**
   * Total weeks in the programme:
   * - Standard: 12
   * - Fast Track: 1–11 (weeks until exam)
   */
  totalWeeks: number;
  /** The child's current week number (from progress store) */
  currentWeek: number;
}

export function useWeekConfig(): WeekConfigResult {
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);

  const progress = currentUser ? getProgress(currentUser.id) : null;
  const currentWeek = progress?.currentWeek ?? 1;
  const examDate = currentUser?.examDate ?? null;

  const fastTrack = checkFastTrack(examDate);
  const fastTrackTotal = getFastTrackTotalWeeks(examDate);

  let weekConfig: WeekConfig;
  let totalWeeks: number;

  if (fastTrack && fastTrackTotal !== null) {
    weekConfig = getFastTrackWeekConfig(currentWeek, fastTrackTotal);
    totalWeeks = fastTrackTotal;
  } else {
    weekConfig = programmeWeeks[Math.min(currentWeek - 1, 11)];
    totalWeeks = 12;
  }

  return {
    weekConfig,
    isFastTrack: fastTrack,
    totalWeeks,
    currentWeek,
  };
}
```

- [ ] **Step 2: Build to check for TypeScript errors**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

Expected: `✓ built in X.XXs` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useWeekConfig.ts
git commit -m "feat: add useWeekConfig hook

Central hook that returns WeekConfig, isFastTrack flag, and totalWeeks.
Replaces all inline programmeWeeks[...] lookups. Pages will be updated
to use this hook in subsequent tasks."
```

---

## Chunk 2: Data Model + Child Creation

### Task 4: Add `examDate` to User type

**Files:**
- Modify: `src/types/user.ts`

- [ ] **Step 1: Add `examDate` field**

In `src/types/user.ts`, update the `User` interface:

```typescript
export interface User {
  id: string;
  name: string;
  avatar: AvatarConfig;
  createdAt: string;
  programmeStartDate: string;
  hasSeenOnboarding: boolean;
  hasSeenTutorial?: boolean;
  hasPaid?: boolean;
  referralCode?: string;
  examDate?: string | null;  // ← ADD THIS LINE
}
```

- [ ] **Step 2: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 3: Commit**

```bash
git add src/types/user.ts
git commit -m "types: add examDate to User interface"
```

---

### Task 5: Map `exam_date` from Supabase in ChildPickerPage and auth stores

`exam_date` needs to be included in every place that reads `child_profiles` from Supabase and constructs a `User` object.

**Files:**
- Modify: `src/pages/ChildPickerPage.tsx` (three mapping locations)
- Modify: `src/stores/useAuthStore.ts` (check if it maps child profiles)

- [ ] **Step 1: Check useAuthStore for child profile mapping**

Read `src/stores/useAuthStore.ts`. Find all places that construct User objects from Supabase data and add `examDate: p.exam_date ?? null`.

```bash
grep -n "programmeStartDate\|programme_start_date" src/stores/useAuthStore.ts
```

- [ ] **Step 2: Update `ChildPickerPage.tsx` — add `exam_date` to `ChildProfile` interface**

In `ChildPickerPage.tsx`, the local `ChildProfile` interface (line ~29):

```typescript
interface ChildProfile {
  id: string;
  name: string;
  avatar: AvatarConfig;
  programme_start_date: string;
  exam_date?: string | null;   // ← ADD THIS LINE
  has_seen_onboarding: boolean;
  has_seen_tutorial?: boolean;
  has_paid?: boolean;
  referral_code?: string;
  created_at: string;
}
```

- [ ] **Step 3: Update both `fetchChildren` mappings in ChildPickerPage**

There are two places that map a `ChildProfile` to a `User` object. Both need `examDate: p.exam_date ?? null`:

First occurrence (inside `fetchChildren`, around line 96):
```typescript
{
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  createdAt: p.created_at,
  programmeStartDate: p.programme_start_date,
  examDate: p.exam_date ?? null,          // ← ADD
  hasSeenOnboarding: p.has_seen_onboarding || localStorage.getItem(`atq_onboarding_seen_${p.id}`) === 'true',
  hasSeenTutorial: (p.has_seen_tutorial ?? false) || localStorage.getItem(`atq_tutorial_seen_${p.id}`) === 'true',
  hasPaid: (p.has_paid ?? false) || localStorage.getItem(`atq_has_paid_${p.id}`) === 'true',
  referralCode: p.referral_code ?? undefined,
}
```

Second occurrence (inside `handleCreateChild`, around line 185):
```typescript
{
  id: p.id,
  name: p.name,
  avatar: p.avatar,
  createdAt: p.created_at,
  programmeStartDate: p.programme_start_date,
  examDate: p.exam_date ?? null,          // ← ADD
  hasSeenOnboarding: p.has_seen_onboarding,
  hasSeenTutorial: p.has_seen_tutorial ?? false,
  hasPaid: claimedPayment || (p.has_paid ?? false),
  referralCode: p.referral_code ?? undefined,
}
```

Also update the newly created child mapping (around line 196):
```typescript
{
  id: newChild.id,
  name: newChild.name,
  avatar: newChild.avatar,
  createdAt: newChild.created_at,
  programmeStartDate: newChild.programme_start_date,
  examDate: newChild.exam_date ?? null,   // ← ADD
  hasSeenOnboarding: newChild.has_seen_onboarding,
  hasSeenTutorial: newChild.has_seen_tutorial ?? false,
  hasPaid: (newChild.has_paid ?? false) || localStorage.getItem(`atq_has_paid_${newChild.id}`) === 'true',
  referralCode: newChild.referral_code ?? undefined,
}
```

- [ ] **Step 4: Update useAuthStore.ts if it maps child profiles**

If `useAuthStore.ts` has mappings (check with grep in step 1), add `examDate: p.exam_date ?? null` in the same pattern.

- [ ] **Step 5: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/ChildPickerPage.tsx src/stores/useAuthStore.ts src/types/user.ts
git commit -m "feat: map exam_date from Supabase into User.examDate"
```

---

### Task 6: Add exam date step to child creation form

Currently, child creation has: Name input → Avatar character selector → Colour selector → Save button.

Add a new optional field: "When is the exam? (optional)" date input. If date is set and it's < 12 weeks away, show a Fast Track notice. Store the date in the Supabase insert.

**Files:**
- Modify: `src/pages/ChildPickerPage.tsx`

- [ ] **Step 1: Add exam date state to ChildPickerPage component state**

After the existing state declarations (near `const [saving, setSaving] = useState(false);`), add:

```typescript
const [examDate, setExamDate] = useState<string>('');
```

- [ ] **Step 2: Import `isFastTrack` and `getWeeksUntilExam`**

At the top of the file:

```typescript
import { isFastTrack, getWeeksUntilExam } from '../data/programme/fast-track';
```

- [ ] **Step 3: Compute Fast Track info from exam date**

In the component body (before the return):

```typescript
const weeksUntil = getWeeksUntilExam(examDate || null);
const willBeFastTrack = isFastTrack(examDate || null);
```

- [ ] **Step 4: Add exam date field to the form JSX**

In the creation form, after the colour selector section and before the Save button, add:

```tsx
{/* Exam date (optional) */}
<div className="space-y-1.5">
  <label className="block text-sm font-display font-semibold text-gray-600">
    📅 When is the exam? <span className="text-gray-400 font-normal">(optional)</span>
  </label>
  <input
    type="date"
    value={examDate}
    min={new Date().toISOString().split('T')[0]}
    onChange={e => setExamDate(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-display focus:outline-none focus:ring-2 focus:ring-purple-300"
  />
  {willBeFastTrack && weeksUntil !== null && (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-xl p-3"
    >
      <p className="text-xs font-display font-bold text-amber-700">
        ⚡ Fast Track mode — {weeksUntil} week{weeksUntil !== 1 ? 's' : ''} to go!
      </p>
      <p className="text-xs font-display text-amber-600 mt-0.5">
        We'll compress the programme so {name.trim() || 'your child'} reaches exam pace in time. Every session counts!
      </p>
    </motion.div>
  )}
  {!willBeFastTrack && weeksUntil !== null && (
    <p className="text-xs text-gray-400 font-display">
      ✅ {weeksUntil} weeks — plenty of time for the full 12-week programme!
    </p>
  )}
</div>
```

- [ ] **Step 5: Include `exam_date` in the Supabase insert**

In `handleCreateChild`, find the `.insert({...})` call and add `exam_date`:

```typescript
const { data, error: insertError } = await supabase
  .from('child_profiles')
  .insert({
    parent_id: user.id,
    name: name.trim(),
    avatar,
    programme_start_date: new Date().toISOString().split('T')[0],
    exam_date: examDate || null,         // ← ADD
    referral_code: referralCode,
    ...(referredBy ? { referred_by: referredBy } : {}),
  })
  .select()
  .single();
```

- [ ] **Step 6: Build and manually test flow**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

Run dev server (`npm run dev`), go to `/select-child`, create a new child. Confirm exam date field appears, Fast Track notice shows for dates < 12 weeks away, and the form submits without errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/ChildPickerPage.tsx
git commit -m "feat: add exam date field to child creation form

Shows Fast Track notice when exam is < 12 weeks away. Persists
exam_date to Supabase child_profiles so Fast Track mode auto-activates."
```

---

## Chunk 3: Replace Inline lookups with useWeekConfig Hook

### Task 7: Update PracticePage

**Files:**
- Modify: `src/pages/PracticePage.tsx`

- [ ] **Step 1: Replace the inline lookup**

Find in `PracticePage.tsx` (around line 29):
```typescript
const weekConfig = programmeWeeks[Math.min((progress?.currentWeek ?? 1) - 1, 11)];
```

Replace with:
```typescript
const { weekConfig, isFastTrack: isOnFastTrack, totalWeeks } = useWeekConfig();
```

Add the import at the top:
```typescript
import { useWeekConfig } from '../hooks/useWeekConfig';
```

Remove the `programmeWeeks` import if it's no longer used in this file (check with grep).

- [ ] **Step 2: Update the week note display to show total weeks**

Find the week intro card that shows "Week X". Update it to show context:

```tsx
// Find text like `Week ${currentWeek}` and update to:
Week {weekConfig.weekNumber} of {totalWeeks}
{isOnFastTrack && (
  <span className="ml-1 text-amber-400 text-xs font-display font-bold">⚡ Fast Track</span>
)}
```

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/PracticePage.tsx
git commit -m "refactor: PracticePage uses useWeekConfig hook"
```

---

### Task 8: Update MockExamPage

**Files:**
- Modify: `src/pages/MockExamPage.tsx`

- [ ] **Step 1: Find the inline lookup**

```bash
grep -n "programmeWeeks" src/pages/MockExamPage.tsx
```

It's in a `useMemo` (around line 31-44):
```typescript
const examConfig: WeekConfig = useMemo(() => {
  const baseWeek = programmeWeeks[Math.min((progress?.currentWeek ?? 1) - 1, 11)];
  return {
    ...baseWeek,
    timePerQuestionMs: baseWeek.timePerQuestionMs * 0.9,
    ...
  };
}, [progress?.currentWeek]);
```

- [ ] **Step 2: Replace with useWeekConfig**

```typescript
import { useWeekConfig } from '../hooks/useWeekConfig';

// In component body, replace the useMemo:
const { weekConfig: baseWeekConfig } = useWeekConfig();
const examConfig: WeekConfig = useMemo(() => ({
  ...baseWeekConfig,
  timePerQuestionMs: Math.round(baseWeekConfig.timePerQuestionMs * 0.9),
  minReadingTimeMs: Math.round(baseWeekConfig.minReadingTimeMs * 0.9),
  minHighlights: Math.max(1, baseWeekConfig.minHighlights - 1),
}), [baseWeekConfig]);
```

Remove the `programmeWeeks` import if no longer used.

- [ ] **Step 3: Also update the mock exam unlock check**

Currently `isUnlocked = currentWeek >= 6`. For Fast Track, mock exam should unlock from week 2 (since they may only have 3 weeks total):

```typescript
const { currentWeek, isFastTrack: isOnFastTrack, totalWeeks } = useWeekConfig();
const isUnlocked = isOnFastTrack ? currentWeek >= Math.ceil(totalWeeks / 3) : currentWeek >= 6;
```

- [ ] **Step 4: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/MockExamPage.tsx
git commit -m "refactor: MockExamPage uses useWeekConfig hook

Also adjusts mock exam unlock threshold for Fast Track users
(unlocks after 1/3 of their programme instead of week 6)."
```

---

### Task 9: Update DailyChallengePage and DashboardPage

**Files:**
- Modify: `src/pages/DailyChallengePage.tsx`
- Modify: `src/pages/DashboardPage.tsx`

- [ ] **Step 1: Update DailyChallengePage**

Find the lookup (around line 60-68):
```typescript
const challengeConfig: WeekConfig = useMemo(() => {
  const baseWeek = programmeWeeks[Math.min((progress?.currentWeek ?? 1) - 1, 11)];
  ...
}, [progress?.currentWeek]);
```

Replace with:
```typescript
import { useWeekConfig } from '../hooks/useWeekConfig';

const { weekConfig: baseWeekConfig } = useWeekConfig();
const challengeConfig: WeekConfig = useMemo(() => ({
  ...baseWeekConfig,
  timePerQuestionMs: Math.round(baseWeekConfig.timePerQuestionMs * 0.85),
  minHighlights: Math.max(1, baseWeekConfig.minHighlights - 1),
}), [baseWeekConfig]);
```

- [ ] **Step 2: Update DashboardPage**

Find (around line 26):
```typescript
const weekConfig = programmeWeeks[Math.min(progress.currentWeek - 1, 11)];
```

Replace with:
```typescript
import { useWeekConfig } from '../hooks/useWeekConfig';

const { weekConfig, isFastTrack: isOnFastTrack, totalWeeks } = useWeekConfig();
```

Update the "Week X · Phase" display to show total weeks:
```tsx
// Find: Week {progress.currentWeek} · {PHASE_LABELS[weekConfig.phase]}
// Replace with:
Week {weekConfig.weekNumber} of {totalWeeks} · {isOnFastTrack ? '⚡ Fast Track' : PHASE_LABELS[weekConfig.phase]}
```

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/DailyChallengePage.tsx src/pages/DashboardPage.tsx
git commit -m "refactor: DailyChallengePage and DashboardPage use useWeekConfig"
```

---

### Task 10: Update HomePage

This is the most significant page update. Changes:
1. Use `useWeekConfig` hook
2. Sync `currentUser.examDate` into `useSettingsStore` when child changes
3. When user updates exam date via `ExamCountdown.onChangeDate`, also write to `child_profiles` in Supabase
4. Show Fast Track badge on the week progress section
5. Show "Week X of Y" correctly for Fast Track

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Add useWeekConfig import and replace inline lookup**

```typescript
import { useWeekConfig } from '../hooks/useWeekConfig';

// Remove: const weekConfig = programmeWeeks[Math.min(progress.currentWeek - 1, 11)];
// Add:
const { weekConfig, isFastTrack: isOnFastTrack, totalWeeks } = useWeekConfig();
```

- [ ] **Step 2: Sync child's examDate into useSettingsStore**

In the `useEffect` that runs when `currentUser` changes (or create one if absent), sync the exam date:

```typescript
// Add this useEffect near the top of the component:
useEffect(() => {
  if (currentUser?.examDate) {
    setExamDate(currentUser.examDate);
  }
}, [currentUser?.id, currentUser?.examDate, setExamDate]);
```

- [ ] **Step 3: Update exam date change handler to write to Supabase**

Currently `onChangeDate={setExamDate}` just updates the Zustand store. Wrap it in a handler that also persists to Supabase:

```typescript
const handleExamDateChange = useCallback(async (date: string | null) => {
  setExamDate(date);
  if (currentUser) {
    // Update child profile in Supabase (fire-and-forget)
    await supabase
      .from('child_profiles')
      .update({ exam_date: date })
      .eq('id', currentUser.id);
    // Update local User object in auth store
    updateChildLocally(currentUser.id, { examDate: date });
  }
}, [currentUser, setExamDate, updateChildLocally]);
```

Replace `onChangeDate={setExamDate}` with `onChangeDate={handleExamDateChange}`.

Import `useCallback` and `supabase` if not already imported:
```typescript
import { supabase } from '../lib/supabase';
import { useCallback } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
const updateChildLocally = useAuthStore(s => s.updateChildLocally);
```

- [ ] **Step 4: Update "Week X of 12" display**

Find all instances of `Week {progress.currentWeek} of 12` and update:

```tsx
// Before:
Week {progress.currentWeek} of 12
// After:
Week {weekConfig.weekNumber} of {totalWeeks}
{isOnFastTrack && <span className="text-amber-300 ml-1">⚡</span>}
```

Similarly update the week pill in the progress header:
```tsx
// Before:
Week {progress.currentWeek} · {PHASE_LABELS[weekConfig.phase]}
// After:
Week {weekConfig.weekNumber} · {isOnFastTrack ? '⚡ Fast Track' : PHASE_LABELS[weekConfig.phase]}
```

- [ ] **Step 5: Update certificate condition for Fast Track**

Find:
```typescript
{progress.currentWeek > 12 && (
```

Replace:
```typescript
{progress.currentWeek > totalWeeks && (
```

- [ ] **Step 6: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: HomePage uses useWeekConfig, syncs examDate to Supabase

- useWeekConfig replaces inline programmeWeeks lookup
- Child's examDate syncs into useSettingsStore on load
- ExamCountdown changes now persist to child_profiles
- Fast Track badge shown on week progress indicator
- Certificate card triggers at correct programme end week"
```

---

## Chunk 4: Landing Page Updates

### Task 11: Update JourneySection

Add a Fast Track panel below the existing 3-phase display.

**Files:**
- Modify: `src/components/landing/JourneySection.tsx`

- [ ] **Step 1: Read the current file**

```bash
cat src/components/landing/JourneySection.tsx
```

- [ ] **Step 2: Add the Fast Track section after the "Every session" line**

After the line about "Every session: 10 questions…", add a Fast Track panel:

```tsx
{/* Fast Track callout */}
<div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
  <div className="flex items-start gap-3">
    <span className="text-3xl shrink-0">⚡</span>
    <div>
      <h3 className="font-display font-extrabold text-lg text-amber-800 mb-1">
        Exam in less than 12 weeks? Fast Track has you covered.
      </h3>
      <p className="text-amber-700 font-display text-sm leading-relaxed">
        Set your exam date when you create your profile and the app automatically
        compresses the programme — moving from technique-learning to exam pace faster.
        Even one week of daily practice with the CLEAR Method will make a difference.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { weeks: '1–2 weeks', note: 'Straight to exam pace' },
          { weeks: '3–6 weeks', note: 'Accelerated ramp-up' },
          { weeks: '7–11 weeks', note: 'Most of the programme' },
        ].map(item => (
          <div key={item.weeks} className="bg-white rounded-xl p-2 border border-amber-200">
            <p className="font-display font-extrabold text-amber-800 text-xs">{item.weeks}</p>
            <p className="font-display text-amber-600 text-[10px] leading-tight mt-0.5">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/JourneySection.tsx
git commit -m "feat: landing — add Fast Track callout to JourneySection"
```

---

### Task 12: Update PricingSection and FaqSection

**Files:**
- Modify: `src/components/landing/PricingSection.tsx`
- Modify: `src/components/landing/FaqSection.tsx`

- [ ] **Step 1: Add Fast Track to PricingSection INCLUDES list**

In `PricingSection.tsx`, find the `INCLUDES` array:
```typescript
const INCLUDES = [
  ['📚', '12-week CLEAR Method programme'],
  ...
```

Add Fast Track entry after the first item:
```typescript
const INCLUDES = [
  ['📚', '12-week CLEAR Method programme'],
  ['⚡', 'Fast Track mode — works even with just 1 week to go'],
  ...
```

Also update the "over 12 weeks" copy in the pricing card body. Find:
```
over 12 weeks, builds focus and exam technique.
```

Replace:
```
builds exam technique in 12 weeks — or 1, if that's all you have.
```

- [ ] **Step 2: Add Fast Track FAQ to FaqSection**

In `FaqSection.tsx`, find the `FAQS` array and add a new entry:

```typescript
{
  q: "What if the exam is only a few weeks away?",
  a: "That's exactly why we built Fast Track mode. Set your child's exam date when you create their profile and the app automatically adjusts the programme — compressing the difficulty and timer progression so they reach exam pace before the big day. Even 7 sessions of daily CLEAR Method practice can break the habit of rushing. It won't be the full 12-week journey, but it will make a real difference.",
},
```

Add it near the top of the FAQ list (second or third question, where objection-handling is most useful).

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/PricingSection.tsx src/components/landing/FaqSection.tsx
git commit -m "feat: landing — mention Fast Track in pricing and FAQ

Directly addresses the 'not enough time' purchase objection."
```

---

## Chunk 5: Final Polish + Verification

### Task 13: Update `updateChildLocally` to accept `examDate`

The `handleExamDateChange` handler in Task 10 calls `updateChildLocally(currentUser.id, { examDate: date })`. This needs `updateChildLocally` to accept partial User updates including `examDate`.

**Files:**
- Modify: `src/stores/useAuthStore.ts`

- [ ] **Step 1: Check current signature of updateChildLocally**

```bash
grep -n "updateChildLocally" src/stores/useAuthStore.ts | head -20
```

- [ ] **Step 2: Ensure `examDate` is in the partial update type**

If `updateChildLocally` accepts `Partial<User>`, `examDate` is already included after Task 4. If it has a custom type listing explicit fields, add `examDate?: string | null` to that type.

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | grep -E "error|✓ built"
```

---

### Task 14: Full build verification and push

- [ ] **Step 1: Clean build**

```bash
npm run build 2>&1
```

Expected: `✓ built in X.XXs` with zero TypeScript errors.

- [ ] **Step 2: Manual smoke test checklist**

Run `npm run dev`, then verify:

| Test | Expected |
|------|----------|
| Create child with exam date 2 weeks away | Fast Track notice shown |
| Create child with exam date 6 months away | "✅ plenty of time" shown |
| Create child with no exam date | No notice, standard programme |
| HomePage with Fast Track child | "Week 1 of 3 · ⚡ Fast Track" shown |
| HomePage with standard child | "Week 1 of 12 · Foundation" shown |
| PracticePage | Uses fast-track week config (shorter timers if close to exam) |
| Landing page `/` JourneySection | Fast Track callout visible |
| Landing page FAQ | "What if the exam is only a few weeks away?" visible |
| Exam date change on HomePage | Persists across page reload (check Supabase table) |

- [ ] **Step 3: Update CLAUDE.md**

Add to "What's Working":
```
- Fast Track mode: when examDate is set and exam is < 12 weeks away, getFastTrackWeekConfig proportionally maps the child's current week onto the full 12-week config so difficulty/timers still progress correctly but compressed. useWeekConfig hook centralises all weekConfig lookups. Child creation form now asks for exam date and shows Fast Track notice.
```

Add to Key Decisions:
```
33. **Fast Track mode auto-activation**: Fast Track activates automatically when examDate is set and weeksUntilExam < 12. No explicit mode selection needed — the mode is derived from the exam date. isFastTrack(), getWeeksUntilExam(), getFastTrackTotalWeeks() in fast-track.ts are pure functions. useWeekConfig hook is the single integration point that all pages use. Week advancement (7 sessions = 1 week) is unchanged — only the week configs are different. Mock exam unlock is proportional for Fast Track: 1/3 of total weeks rather than fixed at week 6.
```

- [ ] **Step 4: Final commit and push**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with Fast Track mode"
git push origin main
```

---

## Exam Date: Current SettingsPage Situation

**Important note for the developer:** The current `SettingsPage.tsx` has NO exam date management. The exam date is set only via `ExamDatePicker`/`ExamCountdown` on `HomePage`. This is intentional in the current design.

After this plan is implemented, the `SettingsPage` could optionally gain an exam date editor (to allow the parent to update it without going to the home screen). This is out of scope for this plan but is a good follow-up item.

---

## Database Migration Note

The SQL migration in Task 1 must be run BEFORE any code that writes `exam_date` to Supabase is deployed. The order is:
1. Run SQL migration in Supabase dashboard
2. Deploy code changes

Since Vercel auto-deploys from git, run the migration BEFORE pushing any code changes in Chunk 2+.

---

## Appendix: Fast Track Mapping Examples

| Total Fast Track Weeks | Child is on Week | Maps to Standard Week | Config |
|---|---|---|---|
| 1 | 1 | 7 (hardcoded) | 85s, medium, diff 2 |
| 2 | 1 | 1 | 120s, heavy, diff 1 |
| 2 | 2 | 12 | 55s, light, diff 3 |
| 3 | 1 | 1 | 120s, heavy, diff 1 |
| 3 | 2 | 6 | 90s, medium, diff 2 |
| 3 | 3 | 12 | 55s, light, diff 3 |
| 6 | 1 | 1 | 120s, heavy, diff 1 |
| 6 | 3 | 5 | 95s, medium, diff 2 |
| 6 | 6 | 12 | 55s, light, diff 3 |
| 11 | 1 | 1 | 120s, heavy, diff 1 |
| 11 | 6 | 6 | 90s, medium, diff 2 |
| 11 | 11 | 12 | 55s, light, diff 3 |
