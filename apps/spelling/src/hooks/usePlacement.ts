import { useState, useCallback } from 'react';
import { PLACEMENT_TEST_WORD_IDS } from '../data/words/placement-test';
import { WORDS_BY_ID } from '../data/words';
import type { SpellingWord } from '../types/spelling';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from '@atq/shared';

export function usePlacement() {
  const user = useCurrentUser();
  const recordAnswer = useSpellingProgressStore(s => s.recordAnswer);
  const [sessionId] = useState(() => crypto.randomUUID());

  const words = PLACEMENT_TEST_WORD_IDS.map(id => WORDS_BY_ID[id]).filter((w): w is SpellingWord => !!w);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ wordId: string; correct: boolean; difficulty: number }[]>([]);
  const [phase, setPhase] = useState<'intro' | 'typing' | 'feedback' | 'complete'>('intro');
  const [lastTyped, setLastTyped] = useState('');

  const start = useCallback(() => setPhase('typing'), []);

  const submit = useCallback((typed: string) => {
    const word = words[index];
    if (!word) return;
    const correct = typed.toLowerCase().trim() === word.word.toLowerCase();
    const today = new Date().toISOString().split('T')[0];
    setLastTyped(typed);

    if (user) {
      recordAnswer(user.id, word.id, correct ? 5 : 1, today, sessionId);
    }

    setResults(prev => [...prev, { wordId: word.id, correct, difficulty: word.difficulty }]);
    setPhase('feedback');
  }, [words, index, user, recordAnswer, sessionId]);

  const next = useCallback(() => {
    if (index + 1 >= words.length) {
      setPhase('complete');
    } else {
      setIndex(prev => prev + 1);
      setPhase('typing');
    }
  }, [index, words.length]);

  const getRecommendedTier = useCallback((): 1 | 2 | 3 => {
    const d1Correct = results.filter(r => r.difficulty === 1 && r.correct).length;
    const d2Correct = results.filter(r => r.difficulty === 2 && r.correct).length;

    if (d1Correct >= 2 && d2Correct >= 2) return 3;
    if (d1Correct >= 2) return 2;
    return 1;
  }, [results]);

  return {
    words, index, phase, results, lastTyped,
    currentWord: words[index] ?? null,
    start, submit, next, getRecommendedTier,
    totalWords: words.length,
    correctCount: results.filter(r => r.correct).length,
  };
}
