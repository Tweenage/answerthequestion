import { useState, useCallback } from 'react';
import type { SpellingWord } from '../types/spelling';
import { gradeAnswer } from '../utils/sm2';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from './useCurrentUser';
import { useSpellingPaywall } from './useSpellingPaywall';

export type TestPhase = 'select-count' | 'ritual' | 'typing' | 'feedback' | 'complete';

interface TestResult {
  wordId: string;
  word: string;
  typed: string;
  correct: boolean;
  timeMs: number;
}

export function useSpellingTest(words: SpellingWord[]) {
  const user = useCurrentUser();
  const recordAnswer = useSpellingProgressStore(s => s.recordAnswer);
  const { filterAccessibleWords } = useSpellingPaywall();

  const [wordCount, setWordCount] = useState(10);
  const [testWords, setTestWords] = useState<SpellingWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<TestPhase>('select-count');
  const [results, setResults] = useState<TestResult[]>([]);
  const [typingStartTime, setTypingStartTime] = useState(0);
  const [ritualEnabled, setRitualEnabled] = useState(true);
  const [sessionId] = useState(() => crypto.randomUUID());

  const startTest = useCallback((count: number) => {
    setWordCount(count);
    const accessible = filterAccessibleWords(words);
    const shuffled = [...accessible].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    setTestWords(selected);
    setCurrentIndex(0);
    setResults([]);
    setPhase(ritualEnabled ? 'ritual' : 'typing');
  }, [words, ritualEnabled, filterAccessibleWords]);

  const onRitualComplete = useCallback(() => {
    setTypingStartTime(Date.now());
    setPhase('typing');
  }, []);

  const submitAnswer = useCallback((typed: string) => {
    const word = testWords[currentIndex];
    if (!word) return;
    const timeMs = Date.now() - typingStartTime;
    const correct = typed.toLowerCase().trim() === word.word.toLowerCase();
    const grade = gradeAnswer(correct, timeMs);

    const today = new Date().toISOString().split('T')[0];
    if (user) {
      recordAnswer(user.id, word.id, grade, today, sessionId);
    }

    const result: TestResult = { wordId: word.id, word: word.word, typed, correct, timeMs };
    setResults(prev => [...prev, result]);
    setPhase('feedback');
  }, [testWords, currentIndex, typingStartTime, user, recordAnswer, sessionId]);

  const nextWord = useCallback(() => {
    if (currentIndex + 1 >= testWords.length) {
      setPhase('complete');
    } else {
      setCurrentIndex(prev => prev + 1);
      setPhase(ritualEnabled ? 'ritual' : 'typing');
    }
  }, [currentIndex, testWords.length, ritualEnabled]);

  const currentWord = testWords[currentIndex] ?? null;
  const resultFlags: (boolean | null)[] = Array.from({ length: wordCount }, (_, i) =>
    i < results.length ? results[i].correct : null
  );
  const correctCount = results.filter(r => r.correct).length;
  const incorrectWords = results.filter(r => !r.correct);

  return {
    phase, currentWord, currentIndex, wordCount, testWords,
    results, resultFlags, correctCount, incorrectWords,
    startTest, onRitualComplete, submitAnswer, nextWord,
    ritualEnabled, setRitualEnabled,
  };
}
