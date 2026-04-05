// Re-export everything from the new word module structure.
// The old 50 words are included via legacy.ts migration in the index.
export { ALL_WORDS as SPELLING_WORDS, WORDS_BY_ID, FREE_WORDS, WORDS_BY_DIFFICULTY, WORDS_BY_THEME } from './words/index';
export type { SpellingWord, WordDefinition } from '../types/spelling';
