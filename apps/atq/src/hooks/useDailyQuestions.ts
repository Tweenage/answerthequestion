import { useMemo } from 'react';
import type { Question, Subject } from '../types/question';
import type { WeekConfig } from '../types/programme';
import type { CategoryMastery } from '../types/progress';
import { allQuestions } from '../data/questions';
import { getSelectionWeight, getMasteryStatusForCategory } from '../utils/masteryUtils';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function weightedSample<T>(
  items: T[],
  weightFn: (item: T) => number,
  count: number,
): T[] {
  if (items.length === 0) return [];
  const selected: T[] = [];
  const pool = [...items];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce((a, item) => a + weightFn(item), 0);
    let r = Math.random() * totalWeight;
    let idx = 0;
    while (idx < pool.length - 1) {
      r -= weightFn(pool[idx]);
      if (r <= 0) break;
      idx++;
    }
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return selected;
}

export function useDailyQuestions(
  weekConfig: WeekConfig,
  answeredIds: string[] = [],
  focusSubject?: Subject,
  mistakeQuestionIds: string[] = [],
  categoryMastery: CategoryMastery = {},
): Question[] {
  return useMemo(() => {
    const selected: Question[] = [];

    // Inject up to 2 mistake-review questions first
    const mistakeQuestions: Question[] = [];
    for (const mId of mistakeQuestionIds) {
      if (mistakeQuestions.length >= 2) break;
      const q = allQuestions.find(q => q.id === mId);
      if (q) mistakeQuestions.push(q);
    }

    // Build subject distribution — if focused, all questions from one subject
    const distribution = focusSubject
      ? { [focusSubject]: weekConfig.dailyQuestionCount } as Record<Subject, number>
      : weekConfig.subjectDistribution;

    const remainingCount = weekConfig.dailyQuestionCount - mistakeQuestions.length;
    const subjects = Object.entries(distribution) as [Subject, number][];

    // Scale down subject counts to fit remaining slots
    const totalDist = subjects.reduce((s, [, c]) => s + c, 0);
    const scaledSubjects = subjects.map(([subj, count]) => [
      subj,
      Math.max(1, Math.round((count / totalDist) * remainingCount)),
    ] as [Subject, number]);

    for (const [subject, count] of scaledSubjects) {
      // Prefer questions at the current difficulty level
      const atLevel = allQuestions.filter(q =>
        q.subject === subject &&
        q.difficulty === weekConfig.difficulty &&
        !answeredIds.includes(q.id)
      );

      // Fall back to easier questions only if we don't have enough at-level
      const belowLevel = allQuestions.filter(q =>
        q.subject === subject &&
        q.difficulty < weekConfig.difficulty &&
        !answeredIds.includes(q.id)
      );

      // Prioritise at-level, then fill with below-level if needed
      let candidateQuestions = [...atLevel, ...belowLevel];

      // If still not enough unanswered, allow repeats (prefer at-level repeats)
      if (candidateQuestions.length < count) {
        const atLevelAll = allQuestions.filter(q => q.subject === subject && q.difficulty === weekConfig.difficulty);
        const belowLevelAll = allQuestions.filter(q => q.subject === subject && q.difficulty < weekConfig.difficulty);
        candidateQuestions = [...atLevelAll, ...belowLevelAll];
      }

      // Use weighted sampling to favour struggling categories over mastered ones
      const weightFn = (q: Question) =>
        getSelectionWeight(getMasteryStatusForCategory(categoryMastery, q.category ?? ''));

      const sampled = weightedSample(candidateQuestions, weightFn, count);
      selected.push(...sampled);
    }

    return shuffleArray([...mistakeQuestions, ...selected].slice(0, weekConfig.dailyQuestionCount));
  // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, [weekConfig.weekNumber, weekConfig.difficulty, focusSubject, mistakeQuestionIds.join(','), categoryMastery]);
}
