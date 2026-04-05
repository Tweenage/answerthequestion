import { useAuthStore } from '../stores/useAuthStore';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { WORDS_BY_ID } from '../data/words';
import type { SpellingWord } from '../types/spelling';

interface DailySession {
  sessionWords: SpellingWord[];
  alreadyCompleted: boolean;
}

export function useDailySession(): DailySession {
  const childId = useAuthStore(s => s.currentChildId);
  const store = useSpellingProgressStore();

  if (!childId) {
    return { sessionWords: [], alreadyCompleted: false };
  }

  const today = new Date().toISOString().split('T')[0];

  // Check if already completed today
  const alreadyCompleted =
    store.getData(childId)?.sessions.some(s => s.date === today && s.completed) ?? false;

  // Get due words (have been seen before and are due for review)
  const dueWordProgress = store.getDueWords(childId, today)
    .sort((a, b) => {
      if (a.sm2.nextReviewDate < b.sm2.nextReviewDate) return -1;
      if (a.sm2.nextReviewDate > b.sm2.nextReviewDate) return 1;
      return 0;
    })
    .slice(0, 5);

  // Calculate how many new words to fetch
  // If ≥5 due words: add 0 new; if 4 due: add 1 new; etc.
  let newCount = Math.max(0, 3 - Math.max(0, dueWordProgress.length - 5));
  // But always try to have at least 3 total words
  if (dueWordProgress.length + newCount < 3) {
    newCount = 3 - dueWordProgress.length;
  }

  const newWordIds = store.getNewWords(childId, newCount);

  // Interleave: start with 1 familiar word (if any), then new words, then rest of due words
  const orderedWordIds: string[] = [];

  if (dueWordProgress.length > 0) {
    orderedWordIds.push(dueWordProgress[0].wordId);
  }

  for (const id of newWordIds) {
    orderedWordIds.push(id);
  }

  for (const wp of dueWordProgress.slice(1)) {
    orderedWordIds.push(wp.wordId);
  }

  // Map IDs to full SpellingWord objects (filter out any IDs not found in WORDS_BY_ID)
  const sessionWords = orderedWordIds
    .map(id => WORDS_BY_ID[id])
    .filter((w): w is SpellingWord => w != null);

  return { sessionWords, alreadyCompleted };
}
