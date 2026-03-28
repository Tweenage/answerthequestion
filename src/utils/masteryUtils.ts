import type { CategoryMastery, CategoryMasteryEntry } from '../types/progress';

export type MasteryStatus = 'mastered' | 'struggling' | 'learning' | 'unseen';

/**
 * Returns the mastery status for a category.
 * - mastered: >=80% correct with at least 5 attempts
 * - struggling: <=30% correct with at least 5 attempts
 * - learning: between those thresholds, or fewer than 5 attempts
 * - unseen: no attempts recorded
 */
export function getMasteryStatus(entry: CategoryMasteryEntry | undefined): MasteryStatus {
  if (!entry || entry.recentAttempts.length === 0) return 'unseen';
  const attempts = entry.recentAttempts.length;
  const correct = entry.recentAttempts.filter(Boolean).length;
  const accuracy = correct / attempts;

  if (accuracy >= 0.8 && attempts >= 5) return 'mastered';
  if (accuracy <= 0.3 && attempts >= 5) return 'struggling';
  return 'learning';
}

/**
 * Returns a weight multiplier for question selection.
 * mastered = 0.2, struggling = 2.5, learning = 1.0, unseen = 1.2
 */
export function getSelectionWeight(status: MasteryStatus): number {
  switch (status) {
    case 'mastered':   return 0.2;
    case 'struggling': return 2.5;
    case 'learning':   return 1.0;
    case 'unseen':     return 1.2;
  }
}

export function getMasteryStatusForCategory(mastery: CategoryMastery, category: string): MasteryStatus {
  return getMasteryStatus(mastery[category]);
}
