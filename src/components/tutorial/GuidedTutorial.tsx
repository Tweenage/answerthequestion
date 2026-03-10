import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import { TUTORIAL_QUESTION, TUTORIAL_STEPS } from '../../data/tutorialQuestion';

interface GuidedTutorialProps {
  onComplete: () => void;
}

export function GuidedTutorial({ onComplete }: GuidedTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = TUTORIAL_STEPS[stepIndex];
  const isLast = stepIndex === TUTORIAL_STEPS.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <div className="space-y-4 py-2">
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {TUTORIAL_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === stepIndex
                ? 'w-6 bg-white'
                : i < stepIndex
                ? 'w-1.5 bg-white/60'
                : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Professor Hoot */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          <ProfessorHoot
            mood={step.hootMood}
            size="md"
            message={step.message}
            showSpeechBubble={true}
            animate={true}
          />

          {/* Step title */}
          <h3 className="font-display font-bold text-white text-center text-lg drop-shadow-md">
            {step.title}
          </h3>

          {/* Question display */}
          {step.showQuestion && (
            <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 border border-white/30">
              <p className="font-display font-bold text-purple-600 text-xs mb-2">
                The Question:
              </p>
              <p className="text-gray-800 text-sm leading-relaxed">
                {'highlightKeyWords' in step && step.highlightKeyWords
                  ? TUTORIAL_QUESTION.questionTokens.map((token, i) => {
                      const isKey = TUTORIAL_QUESTION.keyWordIndices.includes(i);
                      return (
                        <span
                          key={i}
                          className={isKey ? 'bg-yellow-200 text-red-600 font-bold px-0.5 rounded' : ''}
                        >
                          {token}
                        </span>
                      );
                    })
                  : TUTORIAL_QUESTION.questionText
                }
              </p>

              {/* Answers */}
              {step.showAnswers && (
                <div className="mt-3 space-y-2">
                  {TUTORIAL_QUESTION.options.map((opt, i) => {
                    const isEliminated = 'eliminateIndices' in step &&
                      (step.eliminateIndices as number[])?.includes(i);
                    const isCorrect = 'correctIndex' in step && step.correctIndex === i;

                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg border text-sm ${
                          isCorrect
                            ? 'bg-green-50 border-green-300 text-green-700 font-bold'
                            : isEliminated
                            ? 'bg-red-50 border-red-200 text-gray-400 line-through'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="font-display font-bold text-xs w-5 shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt.text}
                        {isEliminated && (
                          <span className="ml-auto text-red-400 text-xs">❌</span>
                        )}
                        {isCorrect && (
                          <span className="ml-auto text-green-500 text-xs">✅</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Blurred answers placeholder when hidden */}
              {!step.showAnswers && step.showQuestion && (
                <div className="mt-3 space-y-2">
                  {['A', 'B', 'C', 'D'].map(letter => (
                    <div
                      key={letter}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 bg-gray-100"
                    >
                      <span className="font-display font-bold text-xs text-gray-400 w-5">{letter}</span>
                      <div className="h-3 bg-gray-200 rounded-full flex-1 blur-[3px]" />
                    </div>
                  ))}
                  <p className="text-center text-gray-400 text-xs font-display">
                    🙈 Answers hidden — no peeking!
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-3">
        {stepIndex > 0 && !isLast && (
          <button
            onClick={() => setStepIndex(stepIndex - 1)}
            className="flex-1 py-3 rounded-card bg-white/20 backdrop-blur-sm text-white font-display font-bold text-sm border border-white/30 hover:bg-white/30 transition-all"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          className={`flex-1 py-3 rounded-card font-display font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] ${
            isLast
              ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 text-white shadow-lg'
              : 'bg-white text-purple-600 shadow-sm hover:shadow-md'
          }`}
        >
          {isLast ? "LET'S GO! 🚀" : 'Next →'}
        </button>
      </div>

      {/* Skip link */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="block mx-auto text-white/50 text-xs font-display hover:text-white/70 transition-colors"
        >
          Skip tutorial
        </button>
      )}
    </div>
  );
}
