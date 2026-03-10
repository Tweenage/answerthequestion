import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import type { Question } from '../../types/question';
import type { WeekConfig } from '../../types/programme';
import type { QuestionResult } from '../../types/progress';
import { SUBJECT_LABELS } from '../../types/question';
import { useQuestionFlow } from '../../hooks/useQuestionFlow';
import { HighlightableText } from './HighlightableText';
import { AnswerOptions } from './AnswerOptions';
import { QuestionFeedback } from './QuestionFeedback';
import { useTimer } from '../../hooks/useTimer';
import { MascotMessage, getMascotTip } from '../celebrations/MascotMessage';
import { StepBanner } from './StepBanner';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface QuestionScreenProps {
  question: Question;
  weekConfig: WeekConfig;
  questionNumber: number;
  totalQuestions: number;
  onComplete: (result: QuestionResult) => void;
}

export function QuestionScreen({
  question,
  weekConfig,
  questionNumber,
  totalQuestions,
  onComplete,
}: QuestionScreenProps) {
  const flow = useQuestionFlow(question, weekConfig);
  const timer = useTimer(weekConfig.timePerQuestionMs);
  const { data } = flow;
  const { play } = useSoundEffects();
  const lastTickRef = useRef<number>(0);
  const [showTimesUp, setShowTimesUp] = useState(false);

  // Stable refs for functions/state used in effects to avoid stale closures
  const flowRef = useRef(flow);
  flowRef.current = flow;
  const timerRef = useRef(timer);
  timerRef.current = timer;
  const dataStateRef = useRef(data.state);
  dataStateRef.current = data.state;

  // Reset when question changes
  useEffect(() => {
    flowRef.current.reset();
    timerRef.current.reset();
    timerRef.current.start();
    setShowTimesUp(false);
  }, [question.id]);

  // Timer tick sounds
  useEffect(() => {
    if (data.state === 'FEEDBACK' || data.state === 'COMPLETE') return;
    const now = Date.now();
    if (now - lastTickRef.current < 900) return; // debounce to once per second
    if (timer.percentRemaining < 20 && timer.percentRemaining > 0) {
      play('timerUrgent');
      lastTickRef.current = now;
    } else if (timer.percentRemaining < 40 && timer.percentRemaining >= 20) {
      play('timerWarning');
      lastTickRef.current = now;
    }
  }, [timer.percentRemaining, data.state, play]);

  // Auto-submit when timer runs out — show "Time's Up!" briefly first
  useEffect(() => {
    if (timer.isExpired && dataStateRef.current !== 'FEEDBACK' && dataStateRef.current !== 'COMPLETE') {
      setShowTimesUp(true);
      const id = setTimeout(() => {
        flowRef.current.confirmAnswer(true);
        setShowTimesUp(false);
      }, 1200);
      return () => clearTimeout(id);
    }
  }, [timer.isExpired]);

  const handleComplete = useCallback(() => {
    if (!data.techniqueScore) return;

    const result: QuestionResult = {
      questionId: question.id,
      subject: question.subject,
      correct: data.isCorrect ?? false,
      techniqueScore: data.techniqueScore,
      readingTimeMs: data.readingTimeMs,
      totalTimeMs: data.timeSpentMs,
      highlightedWordIndices: data.highlightedWords,
      eliminatedOptionIndices: data.eliminatedAnswers,
      selectedOptionIndex: data.selectedAnswer ?? -1,
      timestamp: new Date().toISOString(),
    };

    onComplete(result);
  }, [data, question, onComplete]);

  // When flow state becomes COMPLETE, trigger onComplete
  useEffect(() => {
    if (data.state === 'COMPLETE') {
      handleComplete();
    }
  }, [data.state, handleComplete]);

  const subjectColours: Record<string, string> = {
    'english': 'bg-red-100 text-rainbow-red',
    'maths': 'bg-blue-100 text-rainbow-blue',
    'verbal-reasoning': 'bg-green-100 text-rainbow-green',
    'non-verbal-reasoning': 'bg-purple-100 text-rainbow-violet',
  };

  const getReadingPrompt = () => {
    if (data.state === 'READING_FIRST') {
      if (weekConfig.scaffoldingLevel === 'heavy') {
        return '🦉 Read the question carefully. Take your time — every word matters!';
      }
      if (weekConfig.scaffoldingLevel === 'medium') {
        return '🦉 Read the question carefully.';
      }
      return 'Read the question.';
    }
    if (data.state === 'READING_SECOND') {
      if (weekConfig.scaffoldingLevel === 'heavy') {
        return "🦉 Now read again. Can you say what it's asking in your own words?";
      }
      if (weekConfig.scaffoldingLevel === 'medium') {
        return '🦉 Read again. What is it really asking?';
      }
      return 'Read again.';
    }
    return '';
  };

  const canAdvanceReading = data.state === 'READING_FIRST' || data.state === 'READING_SECOND';
  const isHighlighting = data.state === 'HIGHLIGHTING';
  const isNumberExtraction = data.state === 'NUMBER_EXTRACTION';

  // Heavy scaffolding uses the big bold StepBanner for ALL technique states
  const showStepBanner = weekConfig.scaffoldingLevel === 'heavy'
    && ['READING_FIRST', 'READING_SECOND', 'NUMBER_EXTRACTION', 'HIGHLIGHTING', 'ELIMINATING', 'SELECTING'].includes(data.state);

  // Medium/light still use the subtle mascot tips for some states
  const showMascotTip = !showStepBanner
    && ['NUMBER_EXTRACTION', 'HIGHLIGHTING', 'ELIMINATING', 'SELECTING'].includes(data.state)
    && weekConfig.scaffoldingLevel !== 'light';
  const mascotTip = getMascotTip(data.state, weekConfig.scaffoldingLevel);

  const getMascotMood = () => {
    if (data.state === 'NUMBER_EXTRACTION') return 'teaching' as const;
    if (data.state === 'HIGHLIGHTING') return 'teaching' as const;
    if (data.state === 'ELIMINATING') return 'warning' as const;
    if (data.state === 'SELECTING') return 'encouraging' as const;
    return 'thinking' as const;
  };

  return (
    <div className="space-y-4" role="region" aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
      {/* Progress + Timer bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-display font-bold ${subjectColours[question.subject]}`}>
            {SUBJECT_LABELS[question.subject]}
          </span>
          <span className="text-sm text-gray-400 font-display" aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
            {questionNumber}/{totalQuestions}
          </span>
        </div>

        <div
          className={`flex items-center gap-2 text-sm px-2 py-1 rounded-lg transition-all ${
            timer.percentRemaining < 20 ? 'bg-red-50 animate-pulse' :
            timer.percentRemaining < 40 ? 'bg-amber-50' : ''
          }`}
          role="timer"
          aria-live="polite"
          aria-label={`${timer.display} remaining`}
        >
          <Clock className={`w-4 h-4 ${
            timer.percentRemaining < 20 ? 'text-rainbow-red' :
            timer.percentRemaining < 40 ? 'text-celebrate-amber' : 'text-gray-400'
          }`} aria-hidden="true" />
          <span className={`font-display font-bold ${
            timer.percentRemaining < 20 ? 'text-rainbow-red text-base' :
            timer.percentRemaining < 40 ? 'text-celebrate-amber' : 'text-gray-600'
          }`}>
            {timer.display}
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2.5 bg-focus-100 rounded-full overflow-hidden" role="progressbar" aria-label="Time remaining" aria-valuenow={Math.round(timer.percentRemaining)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timer.percentRemaining < 20 ? 'bg-rainbow-red' :
            timer.percentRemaining < 50 ? 'bg-celebrate-amber' :
            'bg-focus-400'
          }`}
          style={{ width: `${timer.percentRemaining}%` }}
        />
      </div>

      {/* Step banner — big bold instructions for heavy scaffolding */}
      {showStepBanner && (
        <StepBanner flowState={data.state} />
      )}

      {/* Mascot tip — subtler version for medium scaffolding */}
      {showMascotTip && mascotTip && (
        <MascotMessage
          message={mascotTip}
          show={true}
          mood={getMascotMood()}
        />
      )}

      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-card p-5 shadow-sm border border-focus-100"
      >
        {/* Reading prompt — only for medium/light (heavy uses StepBanner above) */}
        {canAdvanceReading && !showStepBanner && (
          <motion.div
            key={data.state}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-amber-50 border border-celebrate-amber/30"
          >
            <BookOpen className="w-5 h-5 text-celebrate-amber shrink-0" />
            <p className="font-display text-gray-700 font-semibold text-sm flex-1">
              {getReadingPrompt()}
            </p>
            {data.state === 'READING_FIRST' && (
              <span className="text-xs text-celebrate-amber font-display font-bold">Read 1 of 2</span>
            )}
            {data.state === 'READING_SECOND' && (
              <span className="text-xs text-celebrate-amber font-display font-bold">Read 2 of 2</span>
            )}
          </motion.div>
        )}

        {/* Number extraction prompt — only for medium/light */}
        {isNumberExtraction && !showStepBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-blue-50 border border-rainbow-blue/30"
          >
            <span className="text-lg shrink-0">🔢</span>
            <p className="font-display text-gray-700 font-semibold text-sm flex-1">
              {weekConfig.scaffoldingLevel === 'heavy'
                ? '🦉 Tap the number words to turn them into digits! This helps you spot all the numbers.'
                : '🦉 Convert number words to digits.'}
            </p>
          </motion.div>
        )}

        {/* Question text */}
        <HighlightableText
          tokens={question.questionTokens}
          highlightedIndices={data.highlightedWords}
          onToggleHighlight={flow.toggleHighlight}
          disabled={!isHighlighting}
          correctKeyWordIndices={data.state === 'FEEDBACK' ? question.keyWordIndices : undefined}
          showFeedback={data.state === 'FEEDBACK'}
          scaffoldingLevel={weekConfig.scaffoldingLevel}
          numberExtractionMode={isNumberExtraction}
          convertedNumberIndices={data.convertedNumberIndices}
          onConvertNumber={flow.convertNumber}
        />

        {/* Number extraction advance button */}
        {isNumberExtraction && data.canAdvance && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={flow.advanceFromNumberExtraction}
            className="mt-4 w-full py-3 rounded-button font-display font-bold text-white bg-rainbow-blue hover:bg-rainbow-indigo transition-colors flex items-center justify-center gap-2"
          >
            I've found all the numbers! 🔢
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Action buttons based on state */}
        {canAdvanceReading && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={flow.advanceReading}
            className="mt-4 w-full py-3 rounded-button font-display font-bold text-white bg-celebrate-amber hover:bg-celebrate-orange transition-colors flex items-center justify-center gap-2"
          >
            {data.state === 'READING_FIRST' ? "I've read it! 👀" : "Done — read it twice! ✅"}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {isHighlighting && data.canAdvance && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={flow.showAnswers}
            className="mt-4 w-full py-3 rounded-button font-display font-bold text-white bg-calm-500 hover:bg-calm-600 transition-colors flex items-center justify-center gap-2"
          >
            Show me the answers! 🔍
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Answer options */}
        <AnswerOptions
          options={question.options}
          eliminatedIndices={data.eliminatedAnswers}
          selectedIndex={data.selectedAnswer}
          correctIndex={question.correctOptionIndex}
          flowState={data.state}
          onEliminate={flow.toggleEliminate}
          onSelect={flow.selectAnswer}
          scaffoldingLevel={weekConfig.scaffoldingLevel}
        />

        {/* Confirm selection — appears when all wrong answers are eliminated */}
        {data.state === 'SELECTING' && data.selectedAnswer !== null && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => flow.confirmAnswer()}
            className="mt-4 w-full py-3 rounded-button font-display font-bold text-white rainbow-gradient hover:opacity-90 transition-opacity"
          >
            Lock in my answer! 🔒
          </motion.button>
        )}
      </motion.div>

      {/* Time's Up overlay */}
      <AnimatePresence>
        {showTimesUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            aria-live="assertive"
          >
            <div className="bg-white rounded-card p-8 shadow-2xl text-center">
              <span className="text-5xl block mb-3">⏰</span>
              <p className="font-display font-extrabold text-2xl text-rainbow-red">Time's Up!</p>
              <p className="font-display text-gray-500 text-sm mt-1">Don't worry — let's see how you did!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      {data.state === 'FEEDBACK' && data.techniqueScore && (
        <QuestionFeedback
          isCorrect={data.isCorrect ?? false}
          techniqueScore={data.techniqueScore}
          question={question}
          selectedAnswerIndex={data.selectedAnswer}
          onContinue={flow.complete}
        />
      )}
    </div>
  );
}
