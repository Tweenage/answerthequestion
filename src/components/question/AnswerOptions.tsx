import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { AnswerOption } from '../../types/question';
import type { QuestionFlowState } from '../../hooks/useQuestionFlow';
import type { ScaffoldingLevel } from '../../types/programme';

interface AnswerOptionsProps {
  options: AnswerOption[];
  eliminatedIndices: number[];
  selectedIndex: number | null;
  correctIndex: number;
  flowState: QuestionFlowState;
  onEliminate: (index: number) => void;
  onSelect?: (index: number) => void;
  scaffoldingLevel: ScaffoldingLevel;
}

const optionLetters = ['A', 'B', 'C', 'D', 'E'];

export function AnswerOptions({
  options,
  eliminatedIndices,
  selectedIndex,
  correctIndex,
  flowState,
  onEliminate,
  scaffoldingLevel,
}: AnswerOptionsProps) {
  const showAnswers = !['READING_FIRST', 'READING_SECOND', 'HIGHLIGHTING'].includes(flowState);
  const isEliminating = flowState === 'ELIMINATING';
  const isSelecting = flowState === 'SELECTING';
  const isFeedback = flowState === 'FEEDBACK';

  if (!showAnswers) {
    return (
      <div className="mt-6 p-6 rounded-card bg-amber-50/50 border-2 border-dashed border-celebrate-amber/30">
        <p className="text-center text-gray-500 font-display">
          {scaffoldingLevel === 'heavy'
            ? "🦉 Professor Hoot says: Read the question first! I'm hiding the answers until you're ready..."
            : 'Answers will appear soon...'}
        </p>
      </div>
    );
  }

  const handleClick = (index: number) => {
    if (isFeedback || isSelecting) return; // Selection is now automatic
    if (isEliminating) {
      onEliminate(index);
    }
  };

  const getOptionStyle = (index: number) => {
    const isEliminated = eliminatedIndices.includes(index);
    const isSelected = selectedIndex === index;
    const isCorrect = index === correctIndex;

    if (isFeedback) {
      if (isCorrect) {
        return 'border-calm-500 bg-calm-50 border-3';
      }
      if (isSelected && !isCorrect) {
        return 'border-rainbow-red bg-red-50 border-3';
      }
      if (isEliminated) {
        return 'opacity-40 border-gray-300';
      }
      return 'border-gray-200';
    }

    if (isEliminated) {
      return 'opacity-40 border-rainbow-red';
    }
    if (isSelected) {
      return 'border-calm-500 bg-calm-50 border-3 ring-2 ring-calm-200 shadow-md';
    }
    return 'border-gray-200 hover:border-focus-300';
  };

  return (
    <div className="mt-6 space-y-3" role="group" aria-label="Answer options">
      {isEliminating && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center font-display mb-2 ${
            scaffoldingLevel === 'heavy'
              ? 'text-base text-focus-700 font-bold bg-focus-50 rounded-xl p-3 border border-focus-200'
              : scaffoldingLevel === 'medium'
              ? 'text-sm text-gray-600 font-semibold'
              : 'text-xs text-gray-400'
          }`}
        >
          {scaffoldingLevel === 'heavy'
            ? 'Cross out ALL the wrong answers! The right one will be left standing! ✂️'
            : scaffoldingLevel === 'medium'
            ? 'Eliminate all wrong answers ✂️'
            : 'Eliminate all'}
        </motion.p>
      )}

      {isSelecting && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-display text-sm text-calm-600 font-bold mb-2"
        >
          🎯 Your answer is the last one standing!
        </motion.p>
      )}

      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleClick(index)}
            disabled={isFeedback}
            aria-label={`Option ${optionLetters[index]}: ${option.text}${eliminatedIndices.includes(index) ? ' (eliminated)' : ''}${selectedIndex === index ? ' (selected)' : ''}`}
            aria-pressed={selectedIndex === index}
            className={`
              relative w-full text-left p-4 rounded-card border-2 transition-all
              flex items-center gap-3 min-h-[56px]
              focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2
              ${getOptionStyle(index)}
            `}
            style={{ touchAction: 'manipulation' }}
          >
            {/* Letter label */}
            <span className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0
              ${selectedIndex === index ? 'bg-calm-500 text-white' :
                isFeedback && index === correctIndex ? 'bg-calm-500 text-white' :
                'bg-gray-100 text-gray-500'}
            `}>
              {optionLetters[index]}
            </span>

            {/* Option text */}
            <span className="text-lg font-display flex-1">{option.text}</span>

            {/* Eliminated X */}
            {eliminatedIndices.includes(index) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute top-1/2 left-[5%] w-[90%] h-[3px] bg-rainbow-red rounded-full -rotate-2" />
              </div>
            )}

            {/* Selected tick — shows when this is the last answer standing */}
            {isSelecting && selectedIndex === index && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-7 h-7 rounded-full bg-calm-500 flex items-center justify-center shrink-0"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Feedback icons */}
            {isFeedback && index === correctIndex && (
              <Check className="w-6 h-6 text-calm-500 shrink-0" />
            )}
            {isFeedback && selectedIndex === index && index !== correctIndex && (
              <X className="w-6 h-6 text-rainbow-red shrink-0" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
