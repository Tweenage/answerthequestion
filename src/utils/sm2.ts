export interface SM2State {
  interval: number        // days until next review
  repetitions: number     // successful reviews in a row
  easeFactor: number      // difficulty multiplier, default 2.5
  nextReviewDate: string  // ISO date string 'YYYY-MM-DD'
  masteryScore: number    // 0–5, capped at 5 (derived from repetitions)
}

export function createInitialSM2State(today: string): SM2State {
  return { interval: 0, repetitions: 0, easeFactor: 2.5, nextReviewDate: today, masteryScore: 0 };
}

export function applyReview(state: SM2State, grade: number, today: string): SM2State {
  const g = Math.max(0, Math.min(5, Math.round(grade)));
  let { interval, repetitions, easeFactor } = state;

  if (g >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - g) * (0.08 + (5 - g) * 0.02));
  const masteryScore = Math.min(5, repetitions);
  const nextReviewDate = addDays(today, interval);
  return { interval, repetitions, easeFactor, nextReviewDate, masteryScore };
}

export function isDueForReview(state: SM2State, today: string): boolean {
  return state.nextReviewDate <= today;
}

/**
 * Convert a correct/incorrect answer + response time to SM-2 grade.
 * Fast correct (<5s) → 5 | Slow correct (5-15s) → 4 | Very slow → 3 | Incorrect → 1
 */
export function gradeAnswer(correct: boolean, responseTimeMs: number): number {
  if (!correct) return 1;
  if (responseTimeMs < 5_000) return 5;
  if (responseTimeMs < 15_000) return 4;
  return 3;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
