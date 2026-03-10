import { useMemo } from 'react';
import type { Question, Subject } from '../types/question';
import type { WeekConfig } from '../types/programme';
import { allQuestions } from '../data/questions';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useDailyQuestions(
  weekConfig: WeekConfig,
  answeredIds: string[] = [],
  focusSubject?: Subject,
  mistakeQuestionIds: string[] = [],
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
      let pool = [...shuffleArray(atLevel), ...shuffleArray(belowLevel)];

      // If still not enough unanswered, allow repeats (prefer at-level repeats)
      if (pool.length < count) {
        const atLevelAll = allQuestions.filter(q => q.subject === subject && q.difficulty === weekConfig.difficulty);
        const belowLevelAll = allQuestions.filter(q => q.subject === subject && q.difficulty < weekConfig.difficulty);
        pool = [...shuffleArray(atLevelAll), ...shuffleArray(belowLevelAll)];
      }

      selected.push(...pool.slice(0, count));
    }

    return shuffleArray([...mistakeQuestions, ...selected].slice(0, weekConfig.dailyQuestionCount));
  }, [weekConfig.weekNumber, weekConfig.difficulty, focusSubject, mistakeQuestionIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
}
