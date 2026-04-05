import { useState, useCallback } from 'react';
import type { SpellingWord } from '../types/spelling';
import { WORDS_BY_ID } from '../data/words';
import { gradeAnswer } from '../utils/sm2';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from './useCurrentUser';

interface DrillState {
  pool: string[];
  correctStreak: Record<string, number>;
  mastered: string[];
  currentBatch: SpellingWord[];
  batchIndex: number;
  phase: 'ready' | 'ritual' | 'typing' | 'feedback' | 'batch-complete' | 'all-complete';
}

export function useDrill(initialWordIds: string[]) {
  const user = useCurrentUser();
  const recordAnswer = useSpellingProgressStore(s => s.recordAnswer);
  const [sessionId] = useState(() => crypto.randomUUID());

  const [state, setState] = useState<DrillState>(() => {
    const pool = [...initialWordIds];
    const batch = pool.slice(0, 5).map(id => WORDS_BY_ID[id]).filter((w): w is SpellingWord => !!w);
    return {
      pool,
      correctStreak: {},
      mastered: [],
      currentBatch: batch,
      batchIndex: 0,
      phase: 'ready',
    };
  });

  const startBatch = useCallback(() => {
    setState(s => ({ ...s, batchIndex: 0, phase: 'ritual' }));
  }, []);

  const onRitualComplete = useCallback(() => {
    setState(s => ({ ...s, phase: 'typing' }));
  }, []);

  const submitAnswer = useCallback((typed: string) => {
    setState(s => {
      const word = s.currentBatch[s.batchIndex];
      if (!word) return s;

      const correct = typed.toLowerCase().trim() === word.word.toLowerCase();
      const today = new Date().toISOString().split('T')[0];
      if (user) {
        recordAnswer(user.id, word.id, gradeAnswer(correct, correct ? 8000 : 0), today, sessionId);
      }

      const newStreak = { ...s.correctStreak };
      newStreak[word.id] = correct ? (newStreak[word.id] ?? 0) + 1 : 0;

      let newPool = [...s.pool];
      let newMastered = [...s.mastered];

      if (newStreak[word.id] >= 3) {
        newPool = newPool.filter(id => id !== word.id);
        newMastered = [...newMastered, word.id];
      }

      return {
        ...s,
        correctStreak: newStreak,
        pool: newPool,
        mastered: newMastered,
        phase: 'feedback',
      };
    });
  }, [user, recordAnswer, sessionId]);

  const nextWord = useCallback(() => {
    setState(s => {
      if (s.batchIndex + 1 >= s.currentBatch.length) {
        if (s.pool.length === 0) {
          return { ...s, phase: 'all-complete' };
        }
        const nextBatch = s.pool.slice(0, 5).map(id => WORDS_BY_ID[id]).filter((w): w is SpellingWord => !!w);
        return { ...s, currentBatch: nextBatch, batchIndex: 0, phase: 'batch-complete' };
      }
      return { ...s, batchIndex: s.batchIndex + 1, phase: 'ritual' };
    });
  }, []);

  const currentWord = state.currentBatch[state.batchIndex] ?? null;
  const totalWords = state.pool.length + state.mastered.length;
  const masteredCount = state.mastered.length;

  return {
    ...state, currentWord, totalWords, masteredCount,
    startBatch, onRitualComplete, submitAnswer, nextWord,
  };
}
