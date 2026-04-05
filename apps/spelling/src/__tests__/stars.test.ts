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
    expect(calculateStars({ totalAttempts: 8, totalCorrectSessions: 4, intervalDays: 1 })).toBe(2);
  });

  it('drops from 2 to 1 when interval resets to 0', () => {
    expect(calculateStars({ totalAttempts: 5, totalCorrectSessions: 2, intervalDays: 0 })).toBe(1);
  });
});
