import { useCurrentUser } from './useCurrentUser';
import type { SpellingWord } from '../types/spelling';

export function useSpellingPaywall() {
  const user = useCurrentUser();
  const hasPaid = user?.hasPaidSpelling ?? false;

  const canAccessWord = (word: SpellingWord): boolean => {
    return word.isFree || hasPaid;
  };

  const filterAccessibleWords = (words: SpellingWord[]): SpellingWord[] => {
    if (hasPaid) return words;
    return words.filter(w => w.isFree);
  };

  return { hasPaid, canAccessWord, filterAccessibleWords };
}
