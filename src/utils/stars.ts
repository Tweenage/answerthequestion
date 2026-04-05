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
