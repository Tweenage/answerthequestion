# ATQ Product Improvements — Priority 1: Quick Wins

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three high-impact improvements requiring no new data collection: rename "Mock Exams" to "Timed Challenges", disable the timer for Foundation weeks 1–2 (and make it visible-only for weeks 3–4), and add a per-category RAG breakdown to the parent dashboard.

**Architecture:** Each task is self-contained. Timer mode is a new `timerMode` field on `WeekConfig`. Category analytics extends the existing `analyzeWeeklyProgress` function with a `questionLookup` map derived from `allQuestions`. Dashboard UI adds one new component. No Supabase schema changes needed.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Zustand. No new dependencies.

---

## Chunk 1: Rename Mock Exams → Timed Challenges

### Task 1: Rename "Mock Exam" to "Timed Challenge" across the UI

**Files:**
- Modify: `src/components/home/MockExamCard.tsx`
- Modify: `src/pages/MockExamPage.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/UpgradePage.tsx`
- Modify: `src/pages/PaymentSuccessPage.tsx`

No type or route name changes — only user-facing display strings. The component and file names stay as `MockExam*` to avoid a disruptive refactor. Only strings visible to children and parents change.

- [ ] **Step 1: Update MockExamCard.tsx**

In `src/components/home/MockExamCard.tsx`, find and replace all user-visible strings:
- `"📝 Mock Exam Mode"` → `"📝 Timed Challenge"`
- `"Mock Exam Mode"` → `"Timed Challenge"`
- Any other visible "Mock Exam" text → "Timed Challenge"

- [ ] **Step 2: Update MockExamPage.tsx**

In `src/pages/MockExamPage.tsx`, find and replace all user-visible strings:
- `"Mock Exam"` → `"Timed Challenge"` (in headings, banners, completion screen)
- `"Mock Exam Complete!"` → `"Timed Challenge Complete!"`
- Keep internal variable names (`mockExams`, `MockExamProgress`) unchanged

- [ ] **Step 3: Update HomePage.tsx**

Search for "Mock Exam" display strings in `src/pages/HomePage.tsx` and replace with "Timed Challenge".

- [ ] **Step 4: Update UpgradePage.tsx and PaymentSuccessPage.tsx**

Same search-and-replace for user-visible strings only.

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: Zero TypeScript errors. No runtime references should break since only string literals changed.

- [ ] **Step 6: Commit**

```bash
git add src/components/home/MockExamCard.tsx src/pages/MockExamPage.tsx src/pages/HomePage.tsx src/pages/UpgradePage.tsx src/pages/PaymentSuccessPage.tsx
git commit -m "feat: rename 'Mock Exam' → 'Timed Challenge' in all user-facing strings"
```

---

## Chunk 2: Timer modes for Foundation weeks

### Task 2: Add `timerMode` to WeekConfig type and programme data

**Files:**
- Modify: `src/types/programme.ts`
- Modify: `src/data/programme/weeks.ts`

- [ ] **Step 1: Add `timerMode` to WeekConfig**

In `src/types/programme.ts`, add the field to `WeekConfig`:

```typescript
export type TimerMode = 'off' | 'visible' | 'enforced';

export interface WeekConfig {
  weekNumber: number;
  phase: Phase;
  difficulty: Difficulty;
  scaffoldingLevel: ScaffoldingLevel;
  timerMode: TimerMode;           // NEW
  timePerQuestionMs: number;
  minReadingTimeMs: number;
  minHighlights: number;
  minEliminations: number;
  dailyQuestionCount: number;
  subjectDistribution: Record<Subject, number>;
  unlockableAvatarItems?: string[];
}
```

Export `TimerMode` from the same file.

- [ ] **Step 2: Set timerMode in programme weeks**

In `src/data/programme/weeks.ts`:
- Weeks 1–2: `timerMode: 'off'` (no timer shown, no timeout)
- Weeks 3–4: `timerMode: 'visible'` (timer shown as elapsed time, no timeout)
- Weeks 5–12: `timerMode: 'enforced'` (current behaviour — countdown, warnings, auto-advance)

Add `timerMode` as the first field after `weekNumber` in each week config for readability.

- [ ] **Step 3: Build check — TypeScript will catch any WeekConfig usages that break**

Run: `npm run build`
Expected: TypeScript errors where `WeekConfig` is constructed or spread without `timerMode`. Fix any that appear (likely in `src/data/programme/fast-track.ts` or test helpers).

- [ ] **Step 4: Commit**

```bash
git add src/types/programme.ts src/data/programme/weeks.ts
git commit -m "feat: add timerMode field to WeekConfig (off/visible/enforced)"
```

---

### Task 3: Make QuestionScreen timer-mode-aware

**Files:**
- Modify: `src/components/question/QuestionScreen.tsx`
- Modify: `src/hooks/useTimer.ts`

The timer is initialised with `weekConfig.timePerQuestionMs` and started on question mount. When `timerMode === 'off'`, the timer should not start and the timer UI should not render. When `timerMode === 'visible'`, the timer starts but uses a very large duration (10 minutes) so it never expires in practice, and warning sounds are suppressed.

- [ ] **Step 1: Update useTimer to accept an optional `enabled` flag**

In `src/hooks/useTimer.ts`, add an `enabled` parameter (default `true`). When `false`, `start()` is a no-op, `isExpired` is always `false`, and `display` returns `''`:

```typescript
export function useTimer(durationMs: number, enabled = true) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remainingMs = enabled ? Math.max(0, durationMs - elapsedMs) : Infinity;
  const percentRemaining = enabled ? (remainingMs / durationMs) * 100 : 100;
  const isExpired = enabled && remainingMs <= 0;

  const totalSeconds = enabled ? Math.ceil(remainingMs / 1000) : 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = enabled && isRunning ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '';

  useEffect(() => {
    if (enabled && isRunning && !isExpired) {
      intervalRef.current = setInterval(() => {
        setElapsedMs(prev => prev + 1000);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, isRunning, isExpired]);

  const start = useCallback(() => { if (enabled) setIsRunning(true); }, [enabled]);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setElapsedMs(0);
    setIsRunning(false);
  }, []);

  return { elapsedMs, remainingMs, percentRemaining, isExpired, isRunning, display, start, pause, reset };
}
```

- [ ] **Step 2: Update QuestionScreen to pass timerMode to timer**

In `src/components/question/QuestionScreen.tsx`:

```typescript
const timerMode = weekConfig.timerMode ?? 'enforced';
const timerEnabled = timerMode === 'enforced';

// For 'visible' mode, use a 10-minute duration (won't expire in practice)
const rawDuration = timerMode === 'visible' ? 600_000 : weekConfig.timePerQuestionMs;
const timerDuration = dyslexiaMode ? Math.round(rawDuration * 1.25) : rawDuration;
const timer = useTimer(timerDuration, timerEnabled || timerMode === 'visible');
```

- [ ] **Step 3: Suppress warning sounds for non-enforced timer modes**

In QuestionScreen, find where `play('timerWarning')` and `play('timerUrgent')` are called. Wrap in a check:

```typescript
if (timerMode === 'enforced') {
  play('timerWarning');
}
```

- [ ] **Step 4: Hide timer UI when `timerMode === 'off'`**

Find the timer display element in QuestionScreen (the `<Clock>` icon + countdown). Wrap it:

```tsx
{timerMode !== 'off' && (
  <div className="...timer display...">
    ...
  </div>
)}
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Zero TypeScript errors.

Manual check: Start a dev server with `npm run dev`. The foundation week config in `weeks.ts` starts at week 1. To test untimed mode, temporarily verify the logic path is correct — when `timerMode === 'off'`, the timer hook `enabled` is `false`, so `isExpired` never fires and no timer renders.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useTimer.ts src/components/question/QuestionScreen.tsx
git commit -m "feat: implement timerMode in QuestionScreen — off hides timer, visible no-expiry"
```

---

## Chunk 3: Per-category RAG breakdown in dashboard

### Task 4: Extend dashboardAnalytics to compute per-category scores

**Files:**
- Modify: `src/utils/dashboardAnalytics.ts`
- Modify: `src/pages/DashboardPage.tsx` (consumer — passes question lookup)

`QuestionResult` stores `questionId` and `subject` but not `category`. Category lives in the question bank. The analytics function needs a lookup map `questionId → category` to group results.

- [ ] **Step 1: Add `CategoryScore` type and extend `WeeklyAnalysis`**

In `src/utils/dashboardAnalytics.ts`, add at the top:

```typescript
import type { Question, Subject } from '../types/question';

export interface CategoryScore {
  category: string;
  subject: Subject;
  attempted: number;
  correct: number;
  accuracyPct: number;  // 0-100
  rag: 'red' | 'amber' | 'green';
}
```

Add `categoryScores: CategoryScore[]` to `WeeklyAnalysis`.

- [ ] **Step 2: Update `analyzeWeeklyProgress` signature**

Add `questions: Question[]` as the fourth parameter:

```typescript
export function analyzeWeeklyProgress(
  sessions: DailySession[],
  subjectScores: Record<Subject, SubjectProgress>,
  streak: StreakData,
  questions: Question[],
): WeeklyAnalysis {
```

- [ ] **Step 3: Build the lookup and compute category scores**

Inside `analyzeWeeklyProgress`, after the existing subject analysis:

```typescript
// Build category lookup from question bank
const questionLookup = new Map(questions.map(q => [q.id, { category: q.category, subject: q.subject }]));

// Accumulate per-category stats across all sessions
const catMap = new Map<string, { subject: Subject; attempted: number; correct: number }>();

for (const session of sessions) {
  for (const result of session.questions) {
    const meta = questionLookup.get(result.questionId);
    if (!meta?.category) continue;
    const key = meta.category;
    const existing = catMap.get(key) ?? { subject: meta.subject, attempted: 0, correct: 0 };
    catMap.set(key, {
      subject: meta.subject,
      attempted: existing.attempted + 1,
      correct: existing.correct + (result.correct ? 1 : 0),
    });
  }
}

// Convert to sorted array, compute RAG
const categoryScores: CategoryScore[] = Array.from(catMap.entries())
  .filter(([, v]) => v.attempted >= 3)  // Only show categories with ≥3 attempts
  .map(([category, v]) => {
    const accuracyPct = Math.round((v.correct / v.attempted) * 100);
    const rag: CategoryScore['rag'] = accuracyPct >= 80 ? 'green' : accuracyPct >= 60 ? 'amber' : 'red';
    return { category, subject: v.subject, attempted: v.attempted, correct: v.correct, accuracyPct, rag };
  })
  .sort((a, b) => a.accuracyPct - b.accuracyPct);  // Weakest first
```

Include `categoryScores` in the return object.

- [ ] **Step 4: Update DashboardPage to pass allQuestions**

In `src/pages/DashboardPage.tsx`, import `allQuestions`:

```typescript
import { allQuestions } from '../data/questions';
```

Update the `analyzeWeeklyProgress` call:

```typescript
const analysis = analyzeWeeklyProgress(progress.sessions, progress.subjectScores, progress.streak, allQuestions);
```

- [ ] **Step 5: Build check**

Run: `npm run build`
TypeScript will catch any call-sites that haven't been updated.

- [ ] **Step 6: Commit**

```bash
git add src/utils/dashboardAnalytics.ts src/pages/DashboardPage.tsx
git commit -m "feat: compute per-category RAG scores in dashboard analytics"
```

---

### Task 5: Add CategoryBreakdown component to DashboardPage

**Files:**
- Create: `src/components/dashboard/CategoryBreakdown.tsx`
- Modify: `src/pages/DashboardPage.tsx`

- [ ] **Step 1: Create CategoryBreakdown component**

Create `src/components/dashboard/CategoryBreakdown.tsx`:

```tsx
import type { CategoryScore } from '../../utils/dashboardAnalytics';
import type { Subject } from '../../types/question';

interface CategoryBreakdownProps {
  categoryScores: CategoryScore[];
}

const SUBJECT_LABELS: Record<Subject, string> = {
  english: 'English',
  maths: 'Maths',
  reasoning: 'Reasoning',
};

const CATEGORY_LABELS: Record<string, string> = {
  'comprehension-what': 'What questions',
  'comprehension-who': 'Who questions',
  'comprehension-where': 'Where questions',
  'comprehension-when': 'When questions',
  'comprehension-why': 'Why questions',
  'comprehension-how-many': 'How many questions',
  'comprehension-inference': 'Inference',
  'vocabulary': 'Vocabulary',
  'vocabulary-synonyms': 'Synonyms',
  'vocabulary-antonyms': 'Antonyms',
  'vocabulary-in-context': 'Vocabulary in context',
  'summarising': 'Summarising',
  'figurative-language': 'Figurative language',
  'authors-purpose': "Author's purpose",
  'word-problems': 'Word problems',
  'fractions': 'Fractions',
  'percentages': 'Percentages',
  'ratio': 'Ratio',
  'algebra': 'Algebra',
  'geometry': 'Geometry',
  'averages': 'Averages',
  'sequences': 'Sequences',
  'place-value': 'Place value',
  'number-properties': 'Number properties',
  'arithmetic': 'Arithmetic',
  'decimals': 'Decimals',
  'negative-numbers': 'Negative numbers',
  'missing-digits': 'Missing digits',
  'measurement': 'Measurement',
  'time': 'Time',
  'money': 'Money',
  'data': 'Data & charts',
  'symmetry': 'Symmetry',
  'coordinates': 'Coordinates',
  'bodmas': 'BODMAS',
  'probability': 'Probability',
  'invented-operations': 'Invented operations',
  'venn-diagrams': 'Venn diagrams',
  'logic-sequence': 'Logic: sequences',
  'logic-code': 'Logic: codes',
  'logic-direction': 'Logic: directions',
  'logic-venn': 'Logic: Venn',
  'logic-grid': 'Logic: grids',
  'logic-pattern': 'Logic: patterns',
  'logic-deduction': 'Logic: deduction',
  'compass': 'Compass directions',
};

const RAG_STYLES: Record<CategoryScore['rag'], { dot: string; bg: string; text: string }> = {
  red:   { dot: 'bg-red-400',   bg: 'bg-red-50',   text: 'text-red-700' },
  amber: { dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700' },
  green: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const SUBJECT_ORDER: Subject[] = ['english', 'maths', 'reasoning'];

export function CategoryBreakdown({ categoryScores }: CategoryBreakdownProps) {
  if (categoryScores.length === 0) {
    return (
      <div className="bg-white rounded-card p-4 shadow-sm text-center">
        <p className="text-gray-400 font-display text-sm">
          Complete more sessions to see your category breakdown.
        </p>
      </div>
    );
  }

  const bySubject = SUBJECT_ORDER.map(subject => ({
    subject,
    scores: categoryScores.filter(c => c.subject === subject),
  })).filter(g => g.scores.length > 0);

  return (
    <div className="bg-white rounded-card shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-display font-bold text-sm text-gray-700">Question Type Breakdown</h3>
        <p className="font-display text-xs text-gray-400 mt-0.5">
          Categories you've tried 3+ times
        </p>
      </div>

      {bySubject.map(({ subject, scores }) => (
        <div key={subject} className="px-4 pb-3">
          <p className="font-display text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">
            {SUBJECT_LABELS[subject]}
          </p>
          <div className="space-y-1.5">
            {scores.map(score => {
              const style = RAG_STYLES[score.rag];
              const label = CATEGORY_LABELS[score.category] ?? score.category;
              return (
                <div key={score.category} className={`flex items-center justify-between rounded-lg px-3 py-2 ${style.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                    <span className="font-display text-sm text-gray-700">{label}</span>
                  </div>
                  <span className={`font-display font-bold text-sm ${style.text}`}>
                    {score.accuracyPct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add CategoryBreakdown to DashboardPage**

In `src/pages/DashboardPage.tsx`:

Import the component:
```typescript
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
```

Add it after the existing subject scores section (the three progress bars), before the streak calendar:

```tsx
{/* Category Breakdown */}
<CategoryBreakdown categoryScores={analysis.categoryScores} />
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: Zero TypeScript errors.

- [ ] **Step 4: Visual check**

Run `npm run dev`, navigate to a child's dashboard. If the child has completed sessions, the category breakdown should appear with RAG-coloured rows. If no sessions, a placeholder message shows.

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/CategoryBreakdown.tsx src/pages/DashboardPage.tsx
git commit -m "feat: add per-category RAG breakdown to parent dashboard"
```

---

## Final check

- [ ] **Full build clean**

Run: `npm run build`
Expected: Zero TypeScript errors, zero warnings about unused imports.

- [ ] **Push**

```bash
git push origin main
```
