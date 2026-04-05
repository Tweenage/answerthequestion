import { describe, it, expect } from 'vitest';
import { getMasteryStatus, getSelectionWeight, getMasteryStatusForCategory } from './masteryUtils';
import type { CategoryMasteryEntry } from '../types/progress';

const makeEntry = (attempts: boolean[]): CategoryMasteryEntry => ({
  recentAttempts: attempts,
  lastSeenDate: '2026-03-29',
});

describe('getMasteryStatus', () => {
  it('returns unseen for undefined entry', () => {
    expect(getMasteryStatus(undefined)).toBe('unseen');
  });

  it('returns unseen for empty attempts array', () => {
    expect(getMasteryStatus(makeEntry([]))).toBe('unseen');
  });

  it('returns mastered for ≥80% accuracy with ≥5 attempts', () => {
    // 5/5 = 100%
    expect(getMasteryStatus(makeEntry([true, true, true, true, true]))).toBe('mastered');
    // 4/5 = 80%
    expect(getMasteryStatus(makeEntry([true, true, true, true, false]))).toBe('mastered');
    // 8/10 = 80%
    expect(getMasteryStatus(makeEntry([true, true, true, true, true, true, true, true, false, false]))).toBe('mastered');
  });

  it('does NOT return mastered with <5 attempts, even at 100%', () => {
    expect(getMasteryStatus(makeEntry([true, true, true, true]))).toBe('learning');
  });

  it('returns struggling for ≤30% accuracy with ≥5 attempts', () => {
    // 0/5 = 0%
    expect(getMasteryStatus(makeEntry([false, false, false, false, false]))).toBe('struggling');
    // 1/5 = 20%
    expect(getMasteryStatus(makeEntry([true, false, false, false, false]))).toBe('struggling');
    // 3/10 = 30%
    expect(getMasteryStatus(makeEntry([true, true, true, false, false, false, false, false, false, false]))).toBe('struggling');
  });

  it('does NOT return struggling with <5 attempts', () => {
    expect(getMasteryStatus(makeEntry([false, false, false, false]))).toBe('learning');
  });

  it('returns learning for accuracy between thresholds with ≥5 attempts', () => {
    // 2/5 = 40% — between 30% and 80%
    expect(getMasteryStatus(makeEntry([true, true, false, false, false]))).toBe('learning');
    // 3/5 = 60%
    expect(getMasteryStatus(makeEntry([true, true, true, false, false]))).toBe('learning');
  });

  it('returns learning for fewer than 5 attempts regardless of accuracy', () => {
    expect(getMasteryStatus(makeEntry([true]))).toBe('learning');
    expect(getMasteryStatus(makeEntry([false]))).toBe('learning');
    expect(getMasteryStatus(makeEntry([true, true, true]))).toBe('learning');
  });

  it('boundary: exactly 79% with 5 attempts is learning, not mastered', () => {
    // Can't get exactly 79% with 5 attempts — 4/5 = 80% (mastered), 3/5 = 60% (learning)
    expect(getMasteryStatus(makeEntry([true, true, true, false, false]))).toBe('learning');
  });

  it('boundary: exactly 31% with 5+ attempts is learning, not struggling', () => {
    // Can't get exactly 31% with 5 attempts — closest is 2/5=40% (learning) or 1/5=20% (struggling)
    // With 10 attempts: 4/10 = 40% — learning
    expect(getMasteryStatus(makeEntry([true, true, true, true, false, false, false, false, false, false]))).toBe('learning');
  });
});

describe('getSelectionWeight', () => {
  it('returns 0.2 for mastered', () => {
    expect(getSelectionWeight('mastered')).toBe(0.2);
  });

  it('returns 2.5 for struggling', () => {
    expect(getSelectionWeight('struggling')).toBe(2.5);
  });

  it('returns 1.0 for learning', () => {
    expect(getSelectionWeight('learning')).toBe(1.0);
  });

  it('returns 1.2 for unseen', () => {
    expect(getSelectionWeight('unseen')).toBe(1.2);
  });

  it('struggling weight is higher than mastered weight', () => {
    expect(getSelectionWeight('struggling')).toBeGreaterThan(getSelectionWeight('mastered'));
  });

  it('unseen weight is higher than mastered weight', () => {
    expect(getSelectionWeight('unseen')).toBeGreaterThan(getSelectionWeight('mastered'));
  });
});

describe('getMasteryStatusForCategory', () => {
  it('returns status for a known category', () => {
    const mastery = {
      'maths-fractions': makeEntry([true, true, true, true, true]),
    };
    expect(getMasteryStatusForCategory(mastery, 'maths-fractions')).toBe('mastered');
  });

  it('returns unseen for an unknown category', () => {
    expect(getMasteryStatusForCategory({}, 'unknown-category')).toBe('unseen');
  });
});
