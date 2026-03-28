# ATQ Product Improvements — Priority 2: Medium Effort

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three features that require new data structures but no backend changes: a Bond taxonomy mapping layer, exam-board presets that adjust subject distribution, and question-type learning cards shown when a child keeps getting the same category wrong.

**Architecture:** Bond taxonomy is a pure data file mapping ATQ categories to Bond's standard names — used for display only, no question changes required. Exam-board presets override `subjectDistribution` in `WeekConfig` via a new user setting stored in `child_profiles` (new column). Learning cards are static content keyed by category, surfaced from `QuestionFeedback` when the mistake queue shows a repeat pattern.

**Dependencies:** Priority 1 plan must be complete first (uses `CategoryScore` from dashboardAnalytics, uses `timerMode` in WeekConfig).

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Zustand, Supabase.

---

## Chunk 1: Bond taxonomy mapping

### Task 6: Create Bond taxonomy mapping file and use it in CategoryBreakdown

**Files:**
- Create: `src/data/bondTaxonomy.ts`
- Modify: `src/components/dashboard/CategoryBreakdown.tsx`

Bond's standard 11+ taxonomy groups question types into named categories. This file maps ATQ's internal `category` strings to Bond's published names, so parents can cross-reference with Bond books.

- [ ] **Step 1: Create `src/data/bondTaxonomy.ts`**

```typescript
export interface BondCategory {
  bondName: string;       // Bond's published name
  subject: 'english' | 'maths' | 'verbal-reasoning' | 'non-verbal-reasoning';
  description: string;    // Brief parent-facing description
}

export const BOND_TAXONOMY: Record<string, BondCategory> = {
  // English
  'comprehension-what':   { bondName: 'Comprehension — Facts',       subject: 'english', description: 'Retrieving specific facts from a passage' },
  'comprehension-who':    { bondName: 'Comprehension — Characters',  subject: 'english', description: 'Identifying characters and their roles' },
  'comprehension-where':  { bondName: 'Comprehension — Setting',     subject: 'english', description: 'Identifying where events take place' },
  'comprehension-when':   { bondName: 'Comprehension — Time',        subject: 'english', description: 'Identifying when events occur' },
  'comprehension-why':    { bondName: 'Comprehension — Reasons',     subject: 'english', description: 'Explaining causes and motivations' },
  'comprehension-how-many': { bondName: 'Comprehension — Numbers',   subject: 'english', description: 'Identifying numerical information' },
  'comprehension-inference': { bondName: 'Inference',                subject: 'english', description: 'Reading between the lines' },
  'vocabulary':           { bondName: 'Vocabulary — Meaning',        subject: 'english', description: 'Understanding word meanings in context' },
  'vocabulary-synonyms':  { bondName: 'Vocabulary — Synonyms',       subject: 'english', description: 'Words with similar meanings' },
  'vocabulary-antonyms':  { bondName: 'Vocabulary — Antonyms',       subject: 'english', description: 'Words with opposite meanings' },
  'vocabulary-in-context': { bondName: 'Vocabulary in Context',      subject: 'english', description: 'Meaning from surrounding text' },
  'summarising':          { bondName: 'Summarising',                  subject: 'english', description: 'Identifying the main idea' },
  'figurative-language':  { bondName: 'Figurative Language',         subject: 'english', description: 'Metaphor, simile, personification' },
  'authors-purpose':      { bondName: "Author's Purpose",            subject: 'english', description: 'Why the author wrote this' },

  // Maths
  'word-problems':        { bondName: 'Problem Solving',             subject: 'maths', description: 'Multi-step real-world problems' },
  'fractions':            { bondName: 'Fractions',                    subject: 'maths', description: 'Working with fractions' },
  'percentages':          { bondName: 'Percentages',                  subject: 'maths', description: 'Percentages and their applications' },
  'ratio':                { bondName: 'Ratio & Proportion',           subject: 'maths', description: 'Comparing quantities' },
  'algebra':              { bondName: 'Algebra',                      subject: 'maths', description: 'Unknown values and equations' },
  'geometry':             { bondName: 'Shape & Space',                subject: 'maths', description: 'Properties of 2D and 3D shapes' },
  'averages':             { bondName: 'Averages',                     subject: 'maths', description: 'Mean, median, mode, range' },
  'sequences':            { bondName: 'Number Sequences',             subject: 'maths', description: 'Patterns in number lists' },
  'place-value':          { bondName: 'Place Value',                  subject: 'maths', description: 'Understanding number place value' },
  'number-properties':    { bondName: 'Number Properties',            subject: 'maths', description: 'Factors, multiples, primes, squares' },
  'arithmetic':           { bondName: 'Mental Arithmetic',            subject: 'maths', description: 'Fast calculation skills' },
  'decimals':             { bondName: 'Decimals',                     subject: 'maths', description: 'Working with decimal numbers' },
  'negative-numbers':     { bondName: 'Negative Numbers',             subject: 'maths', description: 'Numbers below zero' },
  'missing-digits':       { bondName: 'Missing Digits',               subject: 'maths', description: 'Find the hidden number in a calculation' },
  'measurement':          { bondName: 'Measures',                     subject: 'maths', description: 'Length, mass, capacity' },
  'time':                 { bondName: 'Time',                         subject: 'maths', description: 'Clocks, calendars, duration' },
  'money':                { bondName: 'Money',                        subject: 'maths', description: 'Currency calculations' },
  'data':                 { bondName: 'Data Handling',                subject: 'maths', description: 'Charts, graphs, tables' },
  'symmetry':             { bondName: 'Symmetry',                     subject: 'maths', description: 'Lines of symmetry, reflection' },
  'coordinates':          { bondName: 'Coordinates',                  subject: 'maths', description: 'Grid positions' },
  'bodmas':               { bondName: 'Order of Operations',          subject: 'maths', description: 'BODMAS / BIDMAS rules' },
  'probability':          { bondName: 'Probability',                  subject: 'maths', description: 'Likelihood and chance' },
  'invented-operations':  { bondName: 'Non-Standard Operations',      subject: 'maths', description: 'Made-up rules applied to numbers' },
  'venn-diagrams':        { bondName: 'Venn Diagrams',                subject: 'maths', description: 'Set membership and overlap' },

  // Verbal Reasoning
  'logic-sequence':       { bondName: 'VR — Letter/Number Series',   subject: 'verbal-reasoning', description: 'Complete the pattern in a sequence' },
  'logic-code':           { bondName: 'VR — Codes',                  subject: 'verbal-reasoning', description: 'Crack the letter or number code' },
  'logic-direction':      { bondName: 'VR — Directions',             subject: 'verbal-reasoning', description: 'Follow directional instructions' },
  'logic-venn':           { bondName: 'VR — Logic Problems',         subject: 'verbal-reasoning', description: 'Work out who/what fits where' },
  'logic-grid':           { bondName: 'VR — Grid Logic',             subject: 'verbal-reasoning', description: 'Deduce from a grid of clues' },
  'logic-pattern':        { bondName: 'VR — Pattern Recognition',    subject: 'verbal-reasoning', description: 'Identify the rule in a pattern' },
  'logic-deduction':      { bondName: 'VR — Deduction',              subject: 'verbal-reasoning', description: 'Reach a conclusion from given facts' },
  'compass':              { bondName: 'VR — Directions',             subject: 'verbal-reasoning', description: 'Compass and map-based questions' },
};

/** Returns the Bond name for a category, falling back to the raw category string. */
export function getBondName(category: string): string {
  return BOND_TAXONOMY[category]?.bondName ?? category;
}
```

- [ ] **Step 2: Update CategoryBreakdown to show Bond name and description**

In `src/components/dashboard/CategoryBreakdown.tsx`:
- Remove the inline `CATEGORY_LABELS` constant (it's now redundant)
- Import `getBondName` and `BOND_TAXONOMY` from `src/data/bondTaxonomy`
- Replace `CATEGORY_LABELS[score.category] ?? score.category` with `getBondName(score.category)`
- Add a small description line under the category name using `BOND_TAXONOMY[score.category]?.description`

The row becomes:
```tsx
<div className="flex flex-col">
  <span className="font-display text-sm text-gray-700">{getBondName(score.category)}</span>
  {BOND_TAXONOMY[score.category]?.description && (
    <span className="font-display text-xs text-gray-400">{BOND_TAXONOMY[score.category].description}</span>
  )}
</div>
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/bondTaxonomy.ts src/components/dashboard/CategoryBreakdown.tsx
git commit -m "feat: add Bond taxonomy mapping and display in category breakdown"
```

---

## Chunk 2: Exam-board presets

### Task 7: Add exam-board setting and apply subject distribution preset

**Files:**
- Create: `src/data/programme/examBoardPresets.ts`
- Modify: `src/types/user.ts`
- Modify: `src/hooks/useWeekConfig.ts`
- Modify: `src/pages/SettingsPage.tsx`
- Supabase migration: `ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS exam_board TEXT;`

**Note:** The `exam_board` column must be added to Supabase before deploying. Run the migration in the Supabase dashboard SQL editor.

- [ ] **Step 1: Create exam board presets file**

Create `src/data/programme/examBoardPresets.ts`:

```typescript
import type { Subject } from '../../types/question';

export type ExamBoard = 'generic' | 'gl-assessment' | 'cem' | 'iseb' | 'medway';

export interface ExamBoardPreset {
  label: string;
  description: string;
  subjectDistributionOverride: Partial<Record<Subject, number>> | null;
  // null = use the week's default distribution
}

export const EXAM_BOARD_PRESETS: Record<ExamBoard, ExamBoardPreset> = {
  'generic': {
    label: 'General 11+',
    description: 'Balanced across all three subjects.',
    subjectDistributionOverride: null,
  },
  'gl-assessment': {
    label: 'GL Assessment',
    description: 'Used by most grammar schools. Strong maths and verbal reasoning.',
    subjectDistributionOverride: { english: 3, maths: 3, reasoning: 4 },
  },
  'cem': {
    label: 'CEM (Durham University)',
    description: 'Used in Birmingham, Bucks, Wiltshire. Maths and verbal heavy, no NVR.',
    subjectDistributionOverride: { english: 4, maths: 4, reasoning: 2 },
  },
  'iseb': {
    label: 'ISEB (Independent Schools)',
    description: 'Common pre-test for independent schools. All subjects equally weighted.',
    subjectDistributionOverride: { english: 4, maths: 3, reasoning: 3 },
  },
  'medway': {
    label: 'Medway Test',
    description: 'Kent grammar schools. Strong spatial reasoning, verbal, and maths.',
    subjectDistributionOverride: { english: 2, maths: 4, reasoning: 4 },
  },
};

/** Merges a preset's distribution override into a base distribution. */
export function applyExamBoardPreset(
  base: Record<Subject, number>,
  examBoard: ExamBoard,
): Record<Subject, number> {
  const override = EXAM_BOARD_PRESETS[examBoard]?.subjectDistributionOverride;
  if (!override) return base;
  return { ...base, ...override };
}
```

- [ ] **Step 2: Add `examBoard` to the User type**

In `src/types/user.ts`, add `examBoard?: ExamBoard` to the child profile / `User` interface (wherever `examDate` lives). Import `ExamBoard` from the presets file.

- [ ] **Step 3: Update `useWeekConfig` to apply exam board preset**

In `src/hooks/useWeekConfig.ts`, read `currentUser?.examBoard` and call `applyExamBoardPreset` on `weekConfig.subjectDistribution` before returning. The hook already has the `weekConfig` in scope.

```typescript
import { applyExamBoardPreset } from '../data/programme/examBoardPresets';

// Inside the hook, after getting weekConfig:
const examBoard = currentUser?.examBoard ?? 'generic';
const adjustedConfig: WeekConfig = {
  ...weekConfig,
  subjectDistribution: applyExamBoardPreset(weekConfig.subjectDistribution, examBoard),
};
return { weekConfig: adjustedConfig, isFastTrack, totalWeeks, currentWeek };
```

- [ ] **Step 4: Add exam board selector to SettingsPage**

In `src/pages/SettingsPage.tsx`, add a new setting below the exam date picker:

- Label: "Which exam is your child preparing for?"
- A set of radio buttons or a select dropdown showing `EXAM_BOARD_PRESETS` labels and descriptions
- On change, save to Supabase `child_profiles.exam_board` and update local auth store

Follow the same save pattern as `handleSetExamDate` in `HomePage.tsx`.

- [ ] **Step 5: Run Supabase migration**

In Supabase dashboard → SQL Editor, run:
```sql
ALTER TABLE child_profiles ADD COLUMN IF NOT EXISTS exam_board TEXT DEFAULT 'generic';
```

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: Zero TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/programme/examBoardPresets.ts src/types/user.ts src/hooks/useWeekConfig.ts src/pages/SettingsPage.tsx
git commit -m "feat: add exam-board presets — adjusts subject distribution by exam type"
```

---

## Chunk 3: Question-type learning cards

### Task 8: Show a learning tip when a child keeps getting the same category wrong

**Files:**
- Create: `src/data/learningCards.ts`
- Create: `src/components/session/LearningCard.tsx`
- Modify: `src/components/question/QuestionFeedback.tsx`

When a child answers a question incorrectly, the `QuestionFeedback` component shows the explanation. If the same category has appeared ≥ 2 times in the mistake queue, show a "learning card" with a technique tip specific to that question type.

- [ ] **Step 1: Create learning cards data**

Create `src/data/learningCards.ts`:

```typescript
export interface LearningCard {
  title: string;
  tip: string;
  example?: string;
}

export const LEARNING_CARDS: Record<string, LearningCard> = {
  'comprehension-inference': {
    title: '🔍 Inference questions',
    tip: 'The answer isn\'t stated directly — you have to work it out from clues in the text. Ask yourself: "What does the author want me to understand here?"',
    example: 'If the passage says "She slammed the door", you infer she\'s angry — even though the word "angry" isn\'t used.',
  },
  'comprehension-why': {
    title: '❓ "Why" questions',
    tip: 'Go back to the text. The reason is usually in the same paragraph as the event. Look for "because", "so", "since", or "as a result".',
  },
  'comprehension-how-many': {
    title: '🔢 "How many" questions',
    tip: 'The question is asking for a number. Read carefully — it might ask how many times something happened, how many characters, or how many days. Don\'t answer with a name or description.',
  },
  'vocabulary-in-context': {
    title: '📖 Vocabulary in context',
    tip: 'Cover the word and read the sentence. What word would make sense there? Then look at the options. The answer matches the meaning of the sentence, not just the word itself.',
  },
  'comprehension-inference': {
    title: '🔍 Inference questions',
    tip: 'The answer won\'t be a direct quote. Look for evidence in the text that points toward the answer, then choose the option that is best supported.',
  },
  'word-problems': {
    title: '📐 Word problems',
    tip: 'Underline the numbers and the question word (how many, how much, how far). Decide what operation is needed before you calculate.',
    example: '"If 3 bags hold 12 apples each, how many apples in total?" — multiply, not add.',
  },
  'fractions': {
    title: '½ Fractions',
    tip: 'Check what the question is asking: simplify, compare, add, subtract, or find a fraction of a number? Each needs a different method.',
  },
  'ratio': {
    title: '⚖️ Ratio & proportion',
    tip: 'Find the total number of parts first. Then divide the total by the number of parts to find one part. Multiply to find any other part.',
  },
  'logic-code': {
    title: '🔐 Code questions',
    tip: 'Find the pattern by lining up the word and its code. Look at each letter\'s position in the alphabet. Does each letter shift by the same amount?',
  },
  'logic-direction': {
    title: '🧭 Direction questions',
    tip: 'Draw a quick sketch. Mark North at the top. Move step by step — don\'t try to hold the whole route in your head.',
  },
  'logic-sequence': {
    title: '🔢 Sequence questions',
    tip: 'Find the rule: is it adding, multiplying, or alternating? Check if it applies consistently before choosing an answer.',
  },
  'algebra': {
    title: '🔣 Algebra',
    tip: 'Replace the letter with a number and check. Work backwards from the answer if the equation is simple enough.',
  },
  'geometry': {
    title: '📐 Shapes',
    tip: 'Read the question carefully — angles in a triangle always add up to 180°, angles on a straight line add up to 180°, angles in a quadrilateral add up to 360°.',
  },
};

export function getLearningCard(category: string | undefined): LearningCard | null {
  if (!category) return null;
  return LEARNING_CARDS[category] ?? null;
}
```

- [ ] **Step 2: Create LearningCard component**

Create `src/components/session/LearningCard.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { LearningCard as LearningCardData } from '../../data/learningCards';

interface LearningCardProps {
  card: LearningCardData;
}

export function LearningCard({ card }: LearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4"
    >
      <p className="font-display font-bold text-sm text-indigo-800 mb-1">{card.title}</p>
      <p className="font-display text-sm text-indigo-700 leading-relaxed">{card.tip}</p>
      {card.example && (
        <p className="font-display text-xs text-indigo-500 mt-2 italic">{card.example}</p>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Show LearningCard in QuestionFeedback when answer is wrong**

In `src/components/question/QuestionFeedback.tsx`:

Import:
```typescript
import { getLearningCard } from '../../data/learningCards';
import { LearningCard } from '../session/LearningCard';
```

The component receives the `question` prop (which has `question.category`). When `correct === false`, look up the learning card and render it below the explanation:

```tsx
{!correct && (() => {
  const card = getLearningCard(question.category);
  return card ? <LearningCard card={card} /> : null;
})()}
```

Read `QuestionFeedback.tsx` first to find the right insertion point (after the explanation text, before the "Next question" button).

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: Zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/data/learningCards.ts src/components/session/LearningCard.tsx src/components/question/QuestionFeedback.tsx
git commit -m "feat: show question-type learning card on incorrect answers"
```

---

## Final check

- [ ] **Full build clean**

Run: `npm run build`
Expected: Zero errors.

- [ ] **Push**

```bash
git push origin main
```
