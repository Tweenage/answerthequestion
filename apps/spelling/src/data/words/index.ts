import type { SpellingWord } from '../../types/spelling';
import { STATUTORY_Y3Y4 } from './statutory-y3y4';
import { STATUTORY_Y5Y6 } from './statutory-y5y6';
import { ELEVEN_PLUS_A_D } from './eleven-plus-a-d';
import { ELEVEN_PLUS_E_L } from './eleven-plus-e-l';
import { ELEVEN_PLUS_M_R } from './eleven-plus-m-r';
import { ELEVEN_PLUS_S_Z } from './eleven-plus-s-z';
import { LEGACY_WORDS } from './legacy';

// Deduplicate: new word bank takes priority over legacy words
const NEW_WORD_IDS = new Set([
  ...STATUTORY_Y3Y4, ...STATUTORY_Y5Y6,
  ...ELEVEN_PLUS_A_D, ...ELEVEN_PLUS_E_L,
  ...ELEVEN_PLUS_M_R, ...ELEVEN_PLUS_S_Z,
].map(w => w.word.toLowerCase()));

const uniqueLegacy = LEGACY_WORDS.filter(w => !NEW_WORD_IDS.has(w.word.toLowerCase()));

export const ALL_WORDS: SpellingWord[] = [
  ...STATUTORY_Y3Y4,
  ...STATUTORY_Y5Y6,
  ...ELEVEN_PLUS_A_D,
  ...ELEVEN_PLUS_E_L,
  ...ELEVEN_PLUS_M_R,
  ...ELEVEN_PLUS_S_Z,
  ...uniqueLegacy, // legacy words not already in new bank
];

export const WORDS_BY_ID: Record<string, SpellingWord> = Object.fromEntries(
  ALL_WORDS.map(w => [w.id, w])
);

export const FREE_WORDS: SpellingWord[] = ALL_WORDS.filter(w => w.isFree);

export const WORDS_BY_DIFFICULTY: Record<1 | 2 | 3, SpellingWord[]> = {
  1: ALL_WORDS.filter(w => w.difficulty === 1),
  2: ALL_WORDS.filter(w => w.difficulty === 2),
  3: ALL_WORDS.filter(w => w.difficulty === 3),
};

export const WORDS_BY_THEME: Record<string, SpellingWord[]> = ALL_WORDS.reduce(
  (acc, w) => {
    if (!acc[w.theme]) acc[w.theme] = [];
    acc[w.theme].push(w);
    return acc;
  },
  {} as Record<string, SpellingWord[]>
);

export type { SpellingWord, WordDefinition } from '../../types/spelling';
