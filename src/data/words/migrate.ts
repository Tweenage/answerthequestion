import type { SpellingWord } from '../../types/spelling';

interface OldSpellingWord {
  id: string;
  word: string;
  definition: string;
  sentence: string;
  trickyIndices: [number, number];
  difficulty: 1 | 2 | 3;
  category?: string;
}

export function migrateWord(old: OldSpellingWord): SpellingWord {
  return {
    id: old.id,
    word: old.word,
    definitions: [{
      definition: old.definition,
      exampleSentence: old.sentence,
      synonyms: [],
    }],
    partOfSpeech: 'noun',
    wordFamily: [],
    trickyIndices: [old.trickyIndices],
    theme: old.category ?? 'Uncategorised',
    difficulty: old.difficulty,
    source: old.difficulty === 1 ? 'statutory-y3y4' : old.difficulty === 2 ? 'statutory-y5y6' : 'eleven-plus',
    isFree: false,
  };
}
