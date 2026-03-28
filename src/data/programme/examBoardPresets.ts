import type { Subject } from '../../types/question';

export type ExamBoard = 'generic' | 'gl-assessment' | 'cem' | 'iseb' | 'medway';

export interface ExamBoardPreset {
  label: string;
  description: string;
  subjectDistributionOverride: Partial<Record<Subject, number>> | null;
}

export const EXAM_BOARD_PRESETS: Record<ExamBoard, ExamBoardPreset> = {
  'generic': {
    label: 'General 11+',
    description: 'Balanced across all three subjects.',
    subjectDistributionOverride: null,
  },
  'gl-assessment': {
    label: 'GL Assessment',
    description: 'Used by most grammar schools. Strong maths and verbal reasoning.',
    subjectDistributionOverride: { english: 3, maths: 3, reasoning: 4 },
  },
  'cem': {
    label: 'CEM (Durham University)',
    description: 'Used in Birmingham, Bucks, Wiltshire. Maths and verbal heavy.',
    subjectDistributionOverride: { english: 4, maths: 4, reasoning: 2 },
  },
  'iseb': {
    label: 'ISEB (Independent Schools)',
    description: 'Common pre-test for independent schools. All subjects equally weighted.',
    subjectDistributionOverride: { english: 4, maths: 3, reasoning: 3 },
  },
  'medway': {
    label: 'Medway Test',
    description: 'Kent grammar schools. Strong spatial reasoning, verbal, and maths.',
    subjectDistributionOverride: { english: 2, maths: 4, reasoning: 4 },
  },
};

export function applyExamBoardPreset(
  base: Record<Subject, number>,
  examBoard: ExamBoard,
): Record<Subject, number> {
  const override = EXAM_BOARD_PRESETS[examBoard]?.subjectDistributionOverride;
  if (!override) return base;
  return { ...base, ...override };
}
