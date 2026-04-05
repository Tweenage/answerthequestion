export type Subject = 'english' | 'maths' | 'reasoning';
export type Difficulty = 1 | 2 | 3;

export interface AnswerOption {
  text: string;
  imageUrl?: string;
  isEliminatable: boolean;
  eliminationReason?: string;
}

export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  questionText: string;
  questionTokens: string[];
  keyWordIndices: number[];
  options: AnswerOption[];
  correctOptionIndex: number;
  explanation: string;
  category?: string;
  trickType?: 'number-format' | 'irrelevant-info' | 'operation-masking' | 'reverse-logic' | 'two-step' | 'unit-shift' | 'position-trap' | 'negation-trap' | 'question-at-end' | 'context-clue' | 'character-inference' | 'most-likely-inference' | 'purpose-identification' | 'tone-identification';
  imageUrl?: string;
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  'english': 'English',
  'maths': 'Maths',
  'reasoning': 'Reasoning',
};

export const SUBJECT_COLOURS: Record<Subject, string> = {
  'english': 'rainbow-red',
  'maths': 'rainbow-blue',
  'reasoning': 'rainbow-green',
};
