import type { Question } from '../types/question';
import type { WeekConfig } from '../types/programme';
import type { TechniqueScore } from '../types/technique';

interface ScoreInput {
  readCount: number;
  readingTimeMs: number;
  highlightedWordIndices: number[];
  eliminatedOptionIndices: number[];
  selectedOptionIndex: number;
}

export function calculateTechniqueScore(
  result: ScoreInput,
  question: Question,
  weekConfig: WeekConfig,
): TechniqueScore {
  // 1. Read twice? (25% of score)
  const readTwice = result.readCount >= 2;

  // 2. Reading time adequate? (15% of score)
  const readingTimeAdequate = result.readingTimeMs >= weekConfig.minReadingTimeMs;

  // 3. Key word identification (30% of score)
  const correctHighlights = result.highlightedWordIndices.filter(
    i => question.keyWordIndices.includes(i)
  );
  const keyWordsIdentified = correctHighlights.length;
  const keyWordsTotal = question.keyWordIndices.length;
  const keyWordAccuracy = keyWordsTotal > 0 ? keyWordsIdentified / keyWordsTotal : 0;

  // 4. Elimination (20% of score)
  const wrongOptionCount = question.options.length - 1;
  const eliminatedAllWrong = result.eliminatedOptionIndices.length >= wrongOptionCount;
  const eliminatedCorrectly = result.eliminatedOptionIndices.every(
    i => i !== question.correctOptionIndex
  );

  // 5. Composite score
  const readTwiceScore = readTwice ? 25 : 0;
  const readingTimeScore = readingTimeAdequate ? 15 : 0;
  const keyWordScore = Math.round(keyWordAccuracy * 30);
  const eliminationScore = eliminatedAllWrong
    ? (eliminatedCorrectly ? 20 : 10)
    : (result.eliminatedOptionIndices.length > 0 ? 5 : 0);

  // Bonus: did they use all the steps?
  const allStepsUsed = readTwice && eliminatedAllWrong && keyWordsIdentified > 0;
  const processBonus = allStepsUsed ? 10 : 0;

  const overallTechniquePercent = Math.min(100,
    readTwiceScore + readingTimeScore + keyWordScore + eliminationScore + processBonus
  );

  return {
    readTwice,
    readingTimeAdequate,
    keyWordsIdentified,
    keyWordsTotal,
    keyWordAccuracy,
    eliminatedAllWrong,
    eliminatedCorrectly,
    overallTechniquePercent,
  };
}

export function calculateXpFromResult(techniquePercent: number, correct: boolean): number {
  let xp = Math.round(techniquePercent * 0.8); // Up to 80 XP for technique
  if (correct) xp += 20; // Bonus for correct answer
  return xp;
}

export interface TechniqueBreakdown {
  readTwice: { score: number; total: number };
  readingTime: { score: number; total: number };
  keyWords: { score: number; total: number };
  elimination: { score: number; total: number };
}

export function calculateTechniqueBreakdown(
  results: { techniqueScore: TechniqueScore }[]
): TechniqueBreakdown {
  const total = results.length;
  if (total === 0) {
    return {
      readTwice: { score: 0, total: 0 },
      readingTime: { score: 0, total: 0 },
      keyWords: { score: 0, total: 0 },
      elimination: { score: 0, total: 0 },
    };
  }

  const readTwiceCount = results.filter(r => r.techniqueScore.readTwice).length;
  const readingTimeCount = results.filter(r => r.techniqueScore.readingTimeAdequate).length;
  const keyWordAvg = Math.round(
    (results.reduce((sum, r) => sum + r.techniqueScore.keyWordAccuracy, 0) / total) * 100
  );
  const eliminationCount = results.filter(r => r.techniqueScore.eliminatedAllWrong && r.techniqueScore.eliminatedCorrectly).length;

  return {
    readTwice: { score: readTwiceCount, total },
    readingTime: { score: readingTimeCount, total },
    keyWords: { score: keyWordAvg, total: 100 },
    elimination: { score: eliminationCount, total },
  };
}
