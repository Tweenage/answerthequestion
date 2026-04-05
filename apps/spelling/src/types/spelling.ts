import type { SM2State } from '../utils/sm2';

export interface WordDefinition {
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms?: string[];
}

export interface SpellingWord {
  id: string;
  word: string;
  definitions: WordDefinition[];
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction';
  wordFamily: string[];
  trickyIndices: [number, number][];
  mnemonic?: string;
  theme: string;
  difficulty: 1 | 2 | 3;
  source: 'statutory-y3y4' | 'statutory-y5y6' | 'eleven-plus' | 'curated' | 'custom';
  isFree: boolean;
  imageUrl?: string;
  audioFile?: string;
}

export interface WordProgress {
  wordId: string;
  sm2: SM2State;
  lastSeenDate: string | null;
  timesAttempted: number;
  timesCorrect: number;
  stars: 0 | 1 | 2 | 3;
  correctSessions: number;
  lastSessionId?: string;
}

export interface SpellingSessionRecord {
  id: string;
  date: string;
  wordsStudied: string[];
  correct: number;
  total: number;
  completed: boolean;
  durationMs: number;
}
