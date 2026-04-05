// src/data/programme/fast-track.ts
//
// Fast Track mode: proportionally maps a compressed week number
// onto the full 12-week programme config array.
//
// Design principle:
//   - Week 1 of fast-track always maps to standard week 1 (gentle start — child still needs to learn the method)
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
import { differenceInCalendarDays } from 'date-fns';

/** Minimum weeks for full programme. If exam is ≥ 12 weeks away, use standard. */
export const FAST_TRACK_THRESHOLD_WEEKS = 12;

/**
 * Calculate how many calendar weeks remain until the exam date.
 * Uses whole weeks (7-day periods) floored.
 * Returns null if examDate is not set.
 * Caps at 0 (never negative).
 */
export function getWeeksUntilExam(examDate: string | null | undefined): number | null {
  if (!examDate) return null;
  const exam = new Date(examDate);
  const today = new Date();
  const days = differenceInCalendarDays(exam, today);
  const weeks = Math.floor(days / 7);
  return Math.max(0, weeks);
}

/**
 * Is the child in Fast Track mode?
 * True when examDate is set and fewer than 12 full weeks remain.
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
 * @param totalFastTrackWeeks - Total weeks in their fast-track programme (1–11)
 * @returns WeekConfig with weekNumber overridden to currentWeek
 */
export function getFastTrackWeekConfig(
  currentWeek: number,
  totalFastTrackWeeks: number,
): WeekConfig {
  // Clamp currentWeek to valid range
  const clampedWeek = Math.max(1, Math.min(currentWeek, totalFastTrackWeeks));

  // For 1 week: jump to a building-phase config (week 7 = 85s, medium, diff 2).
  // Going straight to exam pace (55s) on day 1 is too stressful when the child
  // has never seen the method — they need at least some scaffolding.
  if (totalFastTrackWeeks === 1) {
    return { ...programmeWeeks[6], weekNumber: 1 };
  }

  // Proportionally map clampedWeek → standard week index (0–11)
  //   clampedWeek = 1           → progress = 0   → standardWeekIndex = 0  (week 1)
  //   clampedWeek = totalWeeks  → progress = 1   → standardWeekIndex = 11 (week 12)
  const progress = (clampedWeek - 1) / (totalFastTrackWeeks - 1);
  const standardWeekIndex = Math.min(11, Math.round(progress * 11));

  return {
    ...programmeWeeks[standardWeekIndex],
    weekNumber: clampedWeek,
  };
}
