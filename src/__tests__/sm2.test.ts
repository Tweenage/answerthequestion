import { describe, it, expect } from 'vitest';
import { applyReview, createInitialSM2State, isDueForReview, gradeAnswer } from '../utils/sm2';

describe('createInitialSM2State', () => {
  it('creates state with ease factor 2.5', () => {
    const s = createInitialSM2State('2026-03-17');
    expect(s.easeFactor).toBe(2.5);
    expect(s.repetitions).toBe(0);
    expect(s.masteryScore).toBe(0);
    expect(s.nextReviewDate).toBe('2026-03-17');
  });
});

describe('applyReview', () => {
  it('sets interval to 1 after first correct answer', () => {
    const s1 = applyReview(createInitialSM2State('2026-03-17'), 4, '2026-03-17');
    expect(s1.interval).toBe(1);
    expect(s1.repetitions).toBe(1);
    expect(s1.nextReviewDate).toBe('2026-03-18');
  });

  it('sets interval to 6 after second correct answer', () => {
    const s1 = applyReview(createInitialSM2State('2026-03-17'), 4, '2026-03-17');
    const s2 = applyReview(s1, 4, '2026-03-18');
    expect(s2.interval).toBe(6);
    expect(s2.repetitions).toBe(2);
  });

  it('multiplies interval by easeFactor on third correct answer', () => {
    const s1 = applyReview(createInitialSM2State('2026-03-17'), 5, '2026-03-17');
    const s2 = applyReview(s1, 5, '2026-03-18');
    const s3 = applyReview(s2, 5, '2026-03-24');
    expect(s3.interval).toBe(Math.round(6 * s2.easeFactor));
  });

  it('resets repetitions to 0 on incorrect answer (grade < 3)', () => {
    const s1 = applyReview(createInitialSM2State('2026-03-17'), 5, '2026-03-17');
    const s2 = applyReview(s1, 5, '2026-03-18');
    const s3 = applyReview(s2, 1, '2026-03-24');
    expect(s3.repetitions).toBe(0);
    expect(s3.interval).toBe(1);
  });

  it('never drops easeFactor below 1.3', () => {
    let state = createInitialSM2State('2026-03-17');
    for (let i = 0; i < 20; i++) {
      state = applyReview(state, 0, '2026-03-17');
    }
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('caps masteryScore at 5', () => {
    let state = createInitialSM2State('2026-01-01');
    const dates = ['2026-01-01','2026-01-02','2026-01-08','2026-01-22','2026-02-19','2026-04-18','2026-09-13','2027-04-09','2027-11-24','2028-07-11'];
    for (const d of dates) {
      state = applyReview(state, 5, d);
    }
    expect(state.masteryScore).toBe(5);
  });

  it('clamps grade input to 0-5 range', () => {
    const s0 = createInitialSM2State('2026-03-17');
    const s_high = applyReview(s0, 10, '2026-03-17');
    const s_ref = applyReview(s0, 5, '2026-03-17');
    expect(s_high.easeFactor).toBeCloseTo(s_ref.easeFactor, 10);
    expect(s_high.interval).toBe(s_ref.interval);
  });

  it('updates masteryScore based on repetitions (min of repetitions, 5)', () => {
    let state = createInitialSM2State('2026-03-17');
    state = applyReview(state, 4, '2026-03-17');
    expect(state.masteryScore).toBe(1);
    state = applyReview(state, 4, '2026-03-18');
    expect(state.masteryScore).toBe(2);
    state = applyReview(state, 4, '2026-03-24');
    expect(state.masteryScore).toBe(3);
  });
});

describe('isDueForReview', () => {
  it('returns true when nextReviewDate is today', () => {
    const s = { ...createInitialSM2State('2026-03-17'), nextReviewDate: '2026-03-17' };
    expect(isDueForReview(s, '2026-03-17')).toBe(true);
  });

  it('returns true when nextReviewDate is in the past', () => {
    const s = { ...createInitialSM2State('2026-03-17'), nextReviewDate: '2026-03-10' };
    expect(isDueForReview(s, '2026-03-17')).toBe(true);
  });

  it('returns false when nextReviewDate is in the future', () => {
    const s = { ...createInitialSM2State('2026-03-17'), nextReviewDate: '2026-03-20' };
    expect(isDueForReview(s, '2026-03-17')).toBe(false);
  });
});

describe('gradeAnswer', () => {
  it('returns 5 for fast correct answer (< 5s)', () => expect(gradeAnswer(true, 3000)).toBe(5));
  it('returns 4 for slow correct answer (5-15s)', () => expect(gradeAnswer(true, 10000)).toBe(4));
  it('returns 3 for very slow correct answer (> 15s)', () => expect(gradeAnswer(true, 20000)).toBe(3));
  it('returns 1 for incorrect answer', () => expect(gradeAnswer(false, 1000)).toBe(1));
  it('returns 1 for fast incorrect answer', () => expect(gradeAnswer(false, 100)).toBe(1));
});
