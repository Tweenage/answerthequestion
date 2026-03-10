import type { Difficulty, Subject } from './question';

export type Phase = 'foundation' | 'building' | 'exam-ready';
export type ScaffoldingLevel = 'heavy' | 'medium' | 'light';

export interface WeekConfig {
  weekNumber: number;
  phase: Phase;
  difficulty: Difficulty;
  scaffoldingLevel: ScaffoldingLevel;
  timePerQuestionMs: number;
  minReadingTimeMs: number;
  minHighlights: number;
  minEliminations: number;
  dailyQuestionCount: number;
  subjectDistribution: Record<Subject, number>;
  unlockableAvatarItems?: string[];
}

export const PHASE_LABELS: Record<Phase, string> = {
  'foundation': 'Foundation',
  'building': 'Improvers',
  'exam-ready': 'Exam Mode',
};

export const PHASE_COLOURS: Record<Phase, string> = {
  'foundation': 'calm-500',
  'building': 'focus-500',
  'exam-ready': 'rainbow-violet',
};
