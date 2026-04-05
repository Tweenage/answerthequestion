import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Target, Eye, Scissors, BookOpen, ChevronRight } from 'lucide-react';
import type { TechniqueScore } from '../../types/technique';
import type { Question } from '../../types/question';
import { ConfettiExplosion, XpPopup, useSoundEffects } from '@atq/shared';
import { calculateXpFromResult } from '../../utils/scoring';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import { getLearningCard } from '../../data/learningCards';
import { LearningCard } from '../session/LearningCard';

// Detect the type of trap from the elimination reason text
function getTrapLabel(reason: string): string {
  const lower = reason.toLowerCase();

  // Negative/reversal words
  if (/\b(not|never|except|without|unless)\b/.test(lower)) {
    return 'Watch out for negative words!';
  }
  // Confusion between similar items (names, places, objects)
  if (/mix up|confuse|wrong (person|name|one)|pick .* because (he|she|they|it) (is|are) (the first|mentioned)/.test(lower)) {
    return 'Easy to mix up!';
  }
  // Grabbing a number that appears but answers a different question
  if (/\b(total|how many|add|number|minus)\b/.test(lower) || /\b\d+\b/.test(reason)) {
    return 'Tricky numbers!';
  }
  // Cause and effect reversal
  if (/cause|effect|because|reason|why/.test(lower)) {
    return 'Cause and effect trap!';
  }
  // Picking a detail from the passage that doesn't answer the question
  if (/mentioned|appears|in the passage|in the question/.test(lower)) {
    return 'Right detail, wrong answer!';
  }
  // Rushing and grabbing the first thing
  if (/rush|first|quick/.test(lower)) {
    return 'Slow down trap!';
  }

  return 'Common trap!';
}

// Return a research-backed tip matching the trap type
function getTrapTip(reason: string): string {
  const lower = reason.toLowerCase();

  if (/\b(not|never|except|without|unless)\b/.test(lower)) {
    return 'Tip: Always underline words like NOT, never, and except. They change everything!';
  }
  if (/mix up|confuse|wrong (person|name|one)|pick .* because (he|she|they|it) (is|are) (the first|mentioned)/.test(lower)) {
    return 'Tip: When there are similar names or details, go back and check which one the question is really asking about.';
  }
  if (/\b(total|how many|add|number|minus)\b/.test(lower) || /\b\d+\b/.test(reason)) {
    return 'Tip: Check that the number you picked matches exactly what the question asks — not just any number from the passage.';
  }
  if (/cause|effect|because|reason|why/.test(lower)) {
    return 'Tip: Ask yourself "what happened first?" and "what happened because of it?" to spot cause and effect.';
  }
  if (/mentioned|appears|in the passage|in the question/.test(lower)) {
    return 'Tip: Just because something is mentioned in the passage doesn\'t mean it answers THIS question. Re-read what\'s being asked.';
  }
  if (/rush|first|quick/.test(lower)) {
    return 'Tip: The first answer that looks right isn\'t always right. Read ALL the options before choosing.';
  }

  return 'Tip: Read the question again carefully, then check each answer option one by one.';
}

const TRICK_TYPE_LABELS: Record<string, { label: string; tip: string }> = {
  'number-format': {
    label: '🔢 Number Words Trick!',
    tip: 'This question had numbers written as words. Always convert them to digits first!',
  },
  'irrelevant-info': {
    label: '🗑️ Extra Information Trick!',
    tip: "This question had extra details you didn't need. Always ask: do I need this number?",
  },
  'operation-masking': {
    label: "🔀 Hidden Operation Trick!",
    tip: "The words told you what to do — 'how many more' means subtract, 'altogether' means add!",
  },
  'reverse-logic': {
    label: '🔄 Reverse Logic Trick!',
    tip: 'Did you spot the NOT or OPPOSITE? These words flip the whole question around!',
  },
  'two-step': {
    label: '2️⃣ Two-Step Trick!',
    tip: "This question needed two steps, not one. Don't stop after the first calculation!",
  },
  'unit-shift': {
    label: '📏 Unit Trap!',
    tip: 'Watch out for mixing units! Always convert to the same unit before calculating.',
  },
  'position-trap': {
    label: '📍 Position Trap!',
    tip: "The answer wasn't where you first looked. Read ALL the way to the end!",
  },
  'negation-trap': {
    label: '🚫 Negation Trap!',
    tip: 'Words like NOT, never, and except change everything. Always circle them!',
  },
  'question-at-end': {
    label: '📄 Question-at-End Trick!',
    tip: 'The question was hiding at the end of a long passage. Try reading the question first!',
  },
};

// Check whether a question is an inference / "most likely" question
function isInferenceQuestion(question: Question): boolean {
  return (
    (question.category?.includes('inference') ?? false) ||
    question.questionText.toLowerCase().includes('most likely')
  );
}

interface QuestionFeedbackProps {
  isCorrect: boolean;
  techniqueScore: TechniqueScore;
  question: Question;
  selectedAnswerIndex?: number | null;
  onContinue: () => void;
}

export function QuestionFeedback({ isCorrect, techniqueScore, question, selectedAnswerIndex, onContinue }: QuestionFeedbackProps) {
  const [showConfetti] = useState(isCorrect && techniqueScore.overallTechniquePercent >= 70);
  const xpEarned = calculateXpFromResult(techniqueScore.overallTechniquePercent, isCorrect);
  const { play } = useSoundEffects();

  // Play sound on mount based on correctness
  useEffect(() => {
    play(isCorrect ? 'correct' : 'wrong');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get the elimination reason for the wrong answer the child picked
  const getWrongAnswerInsight = () => {
    if (isCorrect || selectedAnswerIndex == null) return null;
    const selectedOption = question.options[selectedAnswerIndex];
    if (!selectedOption?.eliminationReason) return null;
    return selectedOption.eliminationReason;
  };

  const wrongInsight = getWrongAnswerInsight();

  // Stars based on technique + correctness
  const getStars = () => {
    if (isCorrect && techniqueScore.overallTechniquePercent >= 90) return 3;
    if (isCorrect && techniqueScore.overallTechniquePercent >= 60) return 2;
    if (isCorrect || techniqueScore.overallTechniquePercent >= 70) return 1;
    return 0;
  };
  const stars = getStars();

  const getHootMessage = () => {
    if (isCorrect && techniqueScore.overallTechniquePercent >= 90) return "Owl-standing work! Perfect technique AND the right answer — you absolutely smashed it!";
    if (isCorrect && techniqueScore.overallTechniquePercent >= 60) return "Brilliant! You nailed it! Keep using the CLEAR Method like that and you'll be unstoppable!";
    if (isCorrect) return "Yes! You got it! Now imagine using your full technique too — you'd be on fire!";
    if (techniqueScore.overallTechniquePercent >= 70) return "So close! Your technique was really impressive though — that's what matters most. The right answers will follow!";
    return "Not to worry — every question is a chance to learn! Let's see what happened and you'll nail the next one.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <ConfettiExplosion trigger={showConfetti} />

      {/* Stars display */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{
              scale: i <= stars ? 1 : 0.6,
              rotate: 0,
              opacity: i <= stars ? 1 : 0.2,
            }}
            transition={{ type: 'spring', delay: i * 0.15, damping: 10 }}
            className="text-4xl"
          >
            {i <= stars ? '⭐' : '☆'}
          </motion.span>
        ))}
      </div>

      {/* XP earned popup */}
      <XpPopup
        xpEarned={xpEarned}
        isCorrect={isCorrect}
        techniquePercent={techniqueScore.overallTechniquePercent}
        show={true}
      />

      {/* Professor Hoot feedback */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ProfessorHoot
          mood={isCorrect ? 'celebrating' : 'encouraging'}
          size="md"
          message={getHootMessage()}
          showSpeechBubble={true}
          animate={true}
        />
      </motion.div>

      {/* Correct/Wrong banner */}
      <div className={`rounded-card p-4 flex items-start gap-3 ${
        isCorrect ? 'bg-calm-50 border-2 border-calm-300' : 'bg-red-50 border-2 border-red-200'
      }`}>
        {isCorrect ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle className="w-8 h-8 text-calm-500 shrink-0" />
          </motion.div>
        ) : (
          <XCircle className="w-8 h-8 text-rainbow-red shrink-0" />
        )}
        <div>
          <p className={`font-display font-bold text-lg ${isCorrect ? 'text-calm-700' : 'text-red-700'}`}>
            {isCorrect
              ? (techniqueScore.overallTechniquePercent >= 90 ? 'Nailed it!' : 'Brilliant!')
              : 'Not quite right'}
          </p>
          <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
        </div>
      </div>

      {/* Wrong answer insight - THE KEY LEARNING MOMENT */}
      {wrongInsight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-card p-4 bg-celebrate-orange/10 border-2 border-celebrate-orange/30"
        >
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">🦉</span>
            <div>
              <p className="font-display font-bold text-sm text-celebrate-orange">
                {getTrapLabel(wrongInsight)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{wrongInsight}</p>
          <p className="text-xs text-gray-500 mt-2 font-display italic">
            {getTrapTip(wrongInsight)}
          </p>
        </motion.div>
      )}

      {/* Inference / "most likely" question tip */}
      {isInferenceQuestion(question) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-card p-4 bg-blue-50 border-2 border-blue-200"
        >
          <div className="flex items-start gap-2 mb-1">
            <span className="text-lg">🔍</span>
            <p className="font-display font-bold text-sm text-blue-700">
              Inference Tip
            </p>
          </div>
          <p className="text-sm text-gray-600">
            When a question says &ldquo;most likely&rdquo;, the answer won&rsquo;t be written
            word-for-word in the text. Look for clues and think about what makes the most sense.
            Eliminate answers that are definitely wrong first &mdash; the right answer is the one
            with the most evidence.
          </p>
        </motion.div>
      )}

      {/* Trick type label */}
      {question.trickType && TRICK_TYPE_LABELS[question.trickType] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-card p-4 bg-rainbow-indigo/10 border-2 border-rainbow-indigo/30"
        >
          <p className="font-display font-bold text-sm text-rainbow-indigo mb-1">
            {TRICK_TYPE_LABELS[question.trickType].label}
          </p>
          <p className="text-sm text-gray-600">
            {TRICK_TYPE_LABELS[question.trickType].tip}
          </p>
        </motion.div>
      )}

      {/* Question-type learning card — shown only on incorrect answers */}
      {!isCorrect && (() => {
        const card = getLearningCard(question.category);
        return card ? <LearningCard card={card} /> : null;
      })()}

      {/* Technique breakdown */}
      <div className="bg-white rounded-card p-4 border border-focus-100">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-bold text-focus-700">Your Technique</p>
          <span className={`font-display font-bold text-lg ${
            techniqueScore.overallTechniquePercent >= 80 ? 'text-calm-500' :
            techniqueScore.overallTechniquePercent >= 50 ? 'text-celebrate-amber' :
            'text-rainbow-red'
          }`}>
            {techniqueScore.overallTechniquePercent}%
          </span>
        </div>

        <div className="space-y-2">
          <TechniqueRow
            icon={<BookOpen className="w-4 h-4" />}
            label="Read twice"
            achieved={techniqueScore.readTwice}
          />
          <TechniqueRow
            icon={<Eye className="w-4 h-4" />}
            label="Reading time"
            achieved={techniqueScore.readingTimeAdequate}
          />
          <TechniqueRow
            icon={<Target className="w-4 h-4" />}
            label={`Key words (${techniqueScore.keyWordsIdentified}/${techniqueScore.keyWordsTotal})`}
            achieved={techniqueScore.keyWordAccuracy >= 0.8}
            partial={techniqueScore.keyWordAccuracy >= 0.5 && techniqueScore.keyWordAccuracy < 0.8}
          />
          <TechniqueRow
            icon={<Scissors className="w-4 h-4" />}
            label="Eliminated all wrong answers"
            achieved={techniqueScore.eliminatedAllWrong && techniqueScore.eliminatedCorrectly}
          />
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-3 bg-focus-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${techniqueScore.overallTechniquePercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              techniqueScore.overallTechniquePercent >= 80 ? 'bg-calm-400' :
              techniqueScore.overallTechniquePercent >= 50 ? 'bg-celebrate-amber' :
              'bg-rainbow-red'
            }`}
          />
        </div>
      </div>

      {/* Continue button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-celebrate-amber hover:bg-celebrate-orange transition-colors flex items-center justify-center gap-2"
      >
        Next Question! ➡️
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}

function TechniqueRow({ icon, label, achieved, partial }: { icon: React.ReactNode; label: string; achieved: boolean; partial?: boolean }) {
  const color = achieved ? 'text-calm-500' : partial ? 'text-celebrate-amber' : 'text-gray-300';
  const textColor = achieved || partial ? 'text-gray-700' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-sm"
    >
      <span className={color}>{icon}</span>
      <span className={textColor}>{label}</span>
      <span className="ml-auto">
        {achieved ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-calm-500 font-bold"
          >
            &#10003;
          </motion.span>
        ) : partial ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-celebrate-amber font-bold"
          >
            &#10003;
          </motion.span>
        ) : (
          <span className="text-gray-300">&#10007;</span>
        )}
      </span>
    </motion.div>
  );
}
