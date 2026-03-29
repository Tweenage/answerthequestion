import { describe, it, expect } from 'vitest';
import { calculateTechniqueScore, calculateXpFromResult } from './scoring';
import type { Question } from '../types/question';
import type { WeekConfig } from '../types/programme';

// Minimal stub question for tests
const makeQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: 'test-q1',
  subject: 'maths',
  difficulty: 1,
  questionText: 'What is 2 + 2?',
  questionTokens: ['What', ' ', 'is', ' ', '2', ' ', '+', ' ', '2', '?'],
  keyWordIndices: [2, 4, 8], // 'is', '2', '2'
  options: [
    { text: '3', eliminationReason: 'Too small' },
    { text: '4', eliminationReason: '' },
    { text: '5', eliminationReason: 'Too large' },
    { text: '6', eliminationReason: 'Way too large' },
  ],
  correctOptionIndex: 1,
  explanation: '2 + 2 = 4',
  ...overrides,
});

const makeWeekConfig = (overrides: Partial<WeekConfig> = {}): WeekConfig => ({
  week: 1,
  phase: 'foundation',
  difficulty: 1,
  scaffoldingLevel: 'heavy',
  timePerQuestionMs: 120000,
  timerMode: 'off',
  minReadingTimeMs: 5000,
  minHighlights: 1,
  minEliminations: 1,
  subjectDistribution: { english: 4, maths: 4, reasoning: 2 },
  ...overrides,
});

describe('calculateTechniqueScore', () => {
  it('gives full score when all technique steps done correctly', () => {
    const result = calculateTechniqueScore(
      {
        readCount: 2,
        readingTimeMs: 6000,
        highlightedWordIndices: [2, 4, 8], // all 3 key words
        eliminatedOptionIndices: [0, 2, 3], // all 3 wrong answers
        selectedOptionIndex: 1,
      },
      makeQuestion(),
      makeWeekConfig(),
    );

    expect(result.readTwice).toBe(true);
    expect(result.readingTimeAdequate).toBe(true);
    expect(result.keyWordAccuracy).toBe(1);
    expect(result.eliminatedAllWrong).toBe(true);
    expect(result.eliminatedCorrectly).toBe(true);
    // 25 + 15 + 30 + 20 + 10 bonus = 100
    expect(result.overallTechniquePercent).toBe(100);
  });

  it('gives low score when no technique steps used', () => {
    const result = calculateTechniqueScore(
      {
        readCount: 1,
        readingTimeMs: 1000,
        highlightedWordIndices: [],
        eliminatedOptionIndices: [],
        selectedOptionIndex: 1,
      },
      makeQuestion(),
      makeWeekConfig(),
    );

    expect(result.readTwice).toBe(false);
    expect(result.readingTimeAdequate).toBe(false);
    expect(result.keyWordAccuracy).toBe(0);
    expect(result.eliminatedAllWrong).toBe(false);
    expect(result.overallTechniquePercent).toBe(0);
  });

  it('scores read-twice component correctly', () => {
    const base = { readingTimeMs: 6000, highlightedWordIndices: [], eliminatedOptionIndices: [], selectedOptionIndex: 1 };
    const once = calculateTechniqueScore({ ...base, readCount: 1 }, makeQuestion(), makeWeekConfig());
    const twice = calculateTechniqueScore({ ...base, readCount: 2 }, makeQuestion(), makeWeekConfig());
    const thrice = calculateTechniqueScore({ ...base, readCount: 3 }, makeQuestion(), makeWeekConfig());

    expect(once.readTwice).toBe(false);
    expect(twice.readTwice).toBe(true);
    expect(thrice.readTwice).toBe(true);
  });

  it('scores reading time adequacy against weekConfig minimum', () => {
    const base = { readCount: 1, highlightedWordIndices: [], eliminatedOptionIndices: [], selectedOptionIndex: 1 };
    const config = makeWeekConfig({ minReadingTimeMs: 5000 });

    const tooFast = calculateTechniqueScore({ ...base, readingTimeMs: 4999 }, makeQuestion(), config);
    const justRight = calculateTechniqueScore({ ...base, readingTimeMs: 5000 }, makeQuestion(), config);

    expect(tooFast.readingTimeAdequate).toBe(false);
    expect(justRight.readingTimeAdequate).toBe(true);
  });

  it('scores partial key word highlighting proportionally', () => {
    const q = makeQuestion(); // 3 key word indices
    const base = { readCount: 1, readingTimeMs: 1000, eliminatedOptionIndices: [], selectedOptionIndex: 1 };

    const none = calculateTechniqueScore({ ...base, highlightedWordIndices: [] }, q, makeWeekConfig());
    const oneOfThree = calculateTechniqueScore({ ...base, highlightedWordIndices: [2] }, q, makeWeekConfig());
    const allThree = calculateTechniqueScore({ ...base, highlightedWordIndices: [2, 4, 8] }, q, makeWeekConfig());

    expect(none.keyWordAccuracy).toBe(0);
    expect(oneOfThree.keyWordAccuracy).toBeCloseTo(1 / 3);
    expect(allThree.keyWordAccuracy).toBe(1);
  });

  it('gives partial elimination score when some (not all) wrong answers eliminated', () => {
    const q = makeQuestion(); // 3 wrong answers (indices 0, 2, 3)
    const base = { readCount: 1, readingTimeMs: 1000, highlightedWordIndices: [], selectedOptionIndex: 1 };

    const none = calculateTechniqueScore({ ...base, eliminatedOptionIndices: [] }, q, makeWeekConfig());
    const partial = calculateTechniqueScore({ ...base, eliminatedOptionIndices: [0] }, q, makeWeekConfig());
    const all = calculateTechniqueScore({ ...base, eliminatedOptionIndices: [0, 2, 3] }, q, makeWeekConfig());

    expect(none.eliminatedAllWrong).toBe(false);
    expect(partial.eliminatedAllWrong).toBe(false);
    expect(all.eliminatedAllWrong).toBe(true);
  });

  it('caps score at 100 even with bonus', () => {
    const result = calculateTechniqueScore(
      {
        readCount: 5,
        readingTimeMs: 30000,
        highlightedWordIndices: [2, 4, 8],
        eliminatedOptionIndices: [0, 2, 3],
        selectedOptionIndex: 1,
      },
      makeQuestion(),
      makeWeekConfig(),
    );

    expect(result.overallTechniquePercent).toBeLessThanOrEqual(100);
  });

  it('handles question with no key words gracefully', () => {
    const q = makeQuestion({ keyWordIndices: [] });
    const result = calculateTechniqueScore(
      { readCount: 2, readingTimeMs: 6000, highlightedWordIndices: [], eliminatedOptionIndices: [0, 2, 3], selectedOptionIndex: 1 },
      q,
      makeWeekConfig(),
    );

    expect(result.keyWordAccuracy).toBe(0);
    expect(result.keyWordsTotal).toBe(0);
  });
});

describe('calculateXpFromResult', () => {
  it('gives 80 XP for perfect technique, no correctness bonus', () => {
    expect(calculateXpFromResult(100, false)).toBe(80);
  });

  it('gives 100 XP for perfect technique + correct answer', () => {
    expect(calculateXpFromResult(100, true)).toBe(100);
  });

  it('gives 20 XP for zero technique + correct answer', () => {
    expect(calculateXpFromResult(0, true)).toBe(20);
  });

  it('gives 0 XP for zero technique + wrong answer', () => {
    expect(calculateXpFromResult(0, false)).toBe(0);
  });

  it('scales technique XP proportionally', () => {
    // 50% technique = 40 XP, +20 for correct = 60
    expect(calculateXpFromResult(50, true)).toBe(60);
    // 50% technique = 40 XP, no correctness bonus
    expect(calculateXpFromResult(50, false)).toBe(40);
  });
});
