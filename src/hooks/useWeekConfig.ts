// src/hooks/useWeekConfig.ts
//
// Central hook for getting the current child's WeekConfig.
// Handles Standard and Fast Track modes transparently.
//
// Usage — replaces ALL inline programmeWeeks[...] lookups:
//   const { weekConfig, isFastTrack, totalWeeks, currentWeek } = useWeekConfig();

import { useCurrentUser } from './useCurrentUser';
import { useProgressStore } from '../stores/useProgressStore';
import { programmeWeeks } from '../data/programme/weeks';
import {
  isFastTrack as checkFastTrack,
  getFastTrackWeekConfig,
  getFastTrackTotalWeeks,
} from '../data/programme/fast-track';
import type { WeekConfig } from '../types/programme';

export interface WeekConfigResult {
  /** The WeekConfig appropriate for the current child's current week */
  weekConfig: WeekConfig;
  /** Whether the child is in Fast Track mode */
  isFastTrack: boolean;
  /**
   * Total weeks in the programme:
   *   Standard:   12
   *   Fast Track: 1–11 (whole weeks until exam when child was enrolled)
   */
  totalWeeks: number;
  /** The child's current week number (from progress store, 1-indexed) */
  currentWeek: number;
}

export function useWeekConfig(): WeekConfigResult {
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);

  const progress = currentUser ? getProgress(currentUser.id) : null;
  const currentWeek = progress?.currentWeek ?? 1;
  const examDate = currentUser?.examDate ?? null;

  const fastTrack = checkFastTrack(examDate);
  const fastTrackTotal = getFastTrackTotalWeeks(examDate);

  let weekConfig: WeekConfig;
  let totalWeeks: number;

  if (fastTrack && fastTrackTotal !== null) {
    weekConfig = getFastTrackWeekConfig(currentWeek, fastTrackTotal);
    totalWeeks = fastTrackTotal;
  } else {
    weekConfig = programmeWeeks[Math.min(currentWeek - 1, 11)];
    totalWeeks = 12;
  }

  return {
    weekConfig,
    isFastTrack: fastTrack,
    totalWeeks,
    currentWeek,
  };
}
