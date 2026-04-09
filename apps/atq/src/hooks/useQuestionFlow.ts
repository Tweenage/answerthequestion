import { useState, useCallback, useRef } from 'react';
import type { Question } from '../types/question';
import type { WeekConfig } from '../types/programme';
import type { TechniqueScore } from '../types/technique';
import { calculateTechniqueScore } from '../utils/scoring';
import { findNumberWordIndices } from '../utils/numberWords';

export type QuestionFlowState =
  | 'READING_FIRST'
  | 'READING_SECOND'
  | 'NUMBER_EXTRACTION'
  | 'HIGHLIGHTING'
  | 'SHOWING_ANSWERS'
  | 'ELIMINATING'
  | 'SELECTING'
  | 'REVIEWING'
  | 'FEEDBACK'
  | 'COMPLETE';

export interface QuestionFlowData {
  state: QuestionFlowState;
  readCount: number;
  readingTimeMs: number;
  highlightedWords: number[];
  eliminatedAnswers: number[];
  selectedAnswer: number | null;
  techniqueScore: TechniqueScore | null;
  isCorrect: boolean | null;
  timeSpentMs: number;
  canAdvance: boolean;
  convertedNumberIndices: number[];
  numberWordIndices: number[];
}

const INITIAL_DATA: QuestionFlowData = {
  state: 'READING_FIRST',
  readCount: 0,
  readingTimeMs: 0,
  highlightedWords: [],
  eliminatedAnswers: [],
  selectedAnswer: null,
  techniqueScore: null,
  isCorrect: null,
  timeSpentMs: 0,
  canAdvance: false,
  convertedNumberIndices: [],
  numberWordIndices: [],
};

export function useQuestionFlow(question: Question | null, weekConfig: WeekConfig) {
  const [data, setData] = useState<QuestionFlowData>(INITIAL_DATA);
  // eslint-disable-next-line react-hooks/purity
  const startTimeRef = useRef<number>(Date.now());
  // eslint-disable-next-line react-hooks/purity
  const readingStartRef = useRef<number>(Date.now());

  const reset = useCallback(() => {
    startTimeRef.current = Date.now();
    readingStartRef.current = Date.now();
    setData(INITIAL_DATA);
  }, []);

  const advanceReading = useCallback(() => {
    const readingTime = Date.now() - readingStartRef.current;

    setData(prev => {
      if (prev.state === 'READING_FIRST') {
        // Check if they've spent enough time reading
        if (readingTime < weekConfig.minReadingTimeMs / 2) {
          return prev; // Don't advance if they haven't read long enough
        }
        readingStartRef.current = Date.now();
        return {
          ...prev,
          state: 'READING_SECOND',
          readCount: 1,
          readingTimeMs: readingTime,
        };
      }
      if (prev.state === 'READING_SECOND') {
        const totalReadingTime = prev.readingTimeMs + readingTime;

        // Check if question has number words and scaffolding is not light
        // Only run number extraction for maths questions — English/reasoning "number words"
        // are almost always idiomatic (e.g. "odd one out", "one of the greatest", "a hundred times")
        const numberWordIdxs = question && question.subject === 'maths'
          ? findNumberWordIndices(question.questionTokens)
          : [];
        const shouldExtractNumbers = numberWordIdxs.length > 0 && weekConfig.scaffoldingLevel !== 'light';

        // If question has no defined key words, skip highlighting entirely
        const noKeyWords = !question?.keyWordIndices?.length;
        const nextState = shouldExtractNumbers
          ? 'NUMBER_EXTRACTION'
          : noKeyWords
            ? 'SHOWING_ANSWERS'
            : 'HIGHLIGHTING';
        return {
          ...prev,
          state: nextState,
          readCount: 2,
          readingTimeMs: totalReadingTime,
          numberWordIndices: numberWordIdxs,
          canAdvance: false,
        };
      }
      return prev;
    });
  }, [question, weekConfig.minReadingTimeMs, weekConfig.scaffoldingLevel]);

  const convertNumber = useCallback((wordIndex: number) => {
    setData(prev => {
      if (prev.state !== 'NUMBER_EXTRACTION') return prev;
      if (prev.convertedNumberIndices.includes(wordIndex)) return prev;
      if (!prev.numberWordIndices.includes(wordIndex)) return prev;

      const newConverted = [...prev.convertedNumberIndices, wordIndex];
      const allConverted = newConverted.length >= prev.numberWordIndices.length;

      return {
        ...prev,
        convertedNumberIndices: newConverted,
        canAdvance: allConverted,
      };
    });
  }, []);

  const advanceFromNumberExtraction = useCallback(() => {
    setData(prev => {
      if (prev.state !== 'NUMBER_EXTRACTION') return prev;
      const noKeyWords = !question?.keyWordIndices?.length;
      return { ...prev, state: noKeyWords ? 'SHOWING_ANSWERS' : 'HIGHLIGHTING', canAdvance: false };
    });
  }, [question]);

  const toggleHighlight = useCallback((wordIndex: number) => {
    setData(prev => {
      if (prev.state !== 'HIGHLIGHTING') return prev;
      const isHighlighted = prev.highlightedWords.includes(wordIndex);
      const newHighlighted = isHighlighted
        ? prev.highlightedWords.filter(i => i !== wordIndex)
        : [...prev.highlightedWords, wordIndex];

      return {
        ...prev,
        highlightedWords: newHighlighted,
        canAdvance: newHighlighted.length >= weekConfig.minHighlights,
      };
    });
  }, [weekConfig.minHighlights]);

  const showAnswers = useCallback(() => {
    setData(prev => {
      if (prev.state !== 'HIGHLIGHTING') return prev;
      if (prev.highlightedWords.length < weekConfig.minHighlights) return prev;
      return { ...prev, state: 'SHOWING_ANSWERS', canAdvance: false };
    });

    // Auto-advance to eliminating after a brief moment
    setTimeout(() => {
      setData(prev => {
        if (prev.state === 'SHOWING_ANSWERS') {
          return { ...prev, state: 'ELIMINATING' };
        }
        return prev;
      });
    }, 800);
  }, [weekConfig.minHighlights]);

  const toggleEliminate = useCallback((optionIndex: number) => {
    if (!question) return;

    setData(prev => {
      if (prev.state !== 'ELIMINATING') return prev;

      const isEliminated = prev.eliminatedAnswers.includes(optionIndex);
      let newEliminated: number[];

      if (isEliminated) {
        newEliminated = prev.eliminatedAnswers.filter(i => i !== optionIndex);
      } else {
        // Must leave at least 1 answer — eliminate up to options.length - 1
        if (prev.eliminatedAnswers.length >= question.options.length - 1) return prev;
        newEliminated = [...prev.eliminatedAnswers, optionIndex];
      }

      // When all wrong answers are eliminated, move to SELECTING state
      // but do NOT auto-select — the child must tap the remaining answer
      const allWrongEliminated = newEliminated.length === question.options.length - 1;

      return {
        ...prev,
        eliminatedAnswers: newEliminated,
        selectedAnswer: prev.selectedAnswer,
        canAdvance: false,
        state: allWrongEliminated ? 'SELECTING' : 'ELIMINATING',
      };
    });
  }, [question]);

  const startSelecting = useCallback(() => {
    // Kept for compatibility — selection now auto-triggers when all wrong answers are eliminated
    setData(prev => {
      if (prev.state !== 'ELIMINATING') return prev;
      return prev;
    });
  }, []);

  const selectAnswer = useCallback((optionIndex: number) => {
    setData(prev => {
      if (prev.state !== 'SELECTING') return prev;
      if (prev.eliminatedAnswers.includes(optionIndex)) return prev;
      return { ...prev, selectedAnswer: optionIndex, canAdvance: true };
    });
  }, []);

  // R — Review: transition from SELECTING to REVIEWING before confirming
  const startReview = useCallback(() => {
    setData(prev => {
      if (prev.state !== 'SELECTING' || prev.selectedAnswer === null) return prev;
      return { ...prev, state: 'REVIEWING', canAdvance: false };
    });
  }, []);

  // Cancel review — return to SELECTING so child can change their answer
  const cancelReview = useCallback(() => {
    setData(prev => {
      if (prev.state !== 'REVIEWING') return prev;
      return { ...prev, state: 'SELECTING', selectedAnswer: null, canAdvance: false };
    });
  }, []);

  const confirmAnswer = useCallback((forceTimeout = false) => {
    if (!question) return;

    setData(prev => {
      // Normal confirm: must be in SELECTING or REVIEWING with an answer chosen
      if (!forceTimeout && ((prev.state !== 'SELECTING' && prev.state !== 'REVIEWING') || prev.selectedAnswer === null)) return prev;
      // Timeout confirm: can trigger from any pre-feedback state
      if (forceTimeout && (prev.state === 'FEEDBACK' || prev.state === 'COMPLETE')) return prev;

      const totalTime = Date.now() - startTimeRef.current;
      const selectedAnswer = prev.selectedAnswer ?? -1;
      const isCorrect = selectedAnswer === question.correctOptionIndex;

      const techniqueScore = calculateTechniqueScore(
        {
          readCount: prev.readCount,
          readingTimeMs: prev.readingTimeMs,
          highlightedWordIndices: prev.highlightedWords,
          eliminatedOptionIndices: prev.eliminatedAnswers,
          selectedOptionIndex: selectedAnswer,
        },
        question,
        weekConfig,
      );

      return {
        ...prev,
        state: 'FEEDBACK',
        selectedAnswer,
        isCorrect,
        techniqueScore,
        timeSpentMs: totalTime,
        canAdvance: false,
      };
    });
  }, [question, weekConfig]);

  const complete = useCallback(() => {
    setData(prev => {
      if (prev.state !== 'FEEDBACK') return prev;
      return { ...prev, state: 'COMPLETE' };
    });
  }, []);

  return {
    data,
    reset,
    advanceReading,
    convertNumber,
    advanceFromNumberExtraction,
    toggleHighlight,
    showAnswers,
    toggleEliminate,
    startSelecting,
    selectAnswer,
    startReview,
    cancelReview,
    confirmAnswer,
    complete,
  };
}
