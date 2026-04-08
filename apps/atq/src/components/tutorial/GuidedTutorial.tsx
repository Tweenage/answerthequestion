import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import { TUTORIAL_QUESTION, TUTORIAL_STEPS } from '../../data/tutorialQuestion';

interface GuidedTutorialProps {
  onComplete: () => void;
}

export function GuidedTutorial({ onComplete }: GuidedTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [userEliminated, setUserEliminated] = useState<number[]>([]);
  const [eliminationFeedback, setEliminationFeedback] = useState<{ index: number; reason: string } | null>(null);
  const [allDoneFlash, setAllDoneFlash] = useState(false);

  const step = TUTORIAL_STEPS[stepIndex];
  const isLast = stepIndex === TUTORIAL_STEPS.length - 1;

  // Reset interactive state whenever the step changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserEliminated([]);
    setEliminationFeedback(null);
    setAllDoneFlash(false);
  }, [stepIndex]);

  const isInteractiveElimination = 'interactive' in step && step.interactive === true;
  const eliminateIndices: number[] = 'eliminateIndices' in step ? (step.eliminateIndices as number[]) : [];

  const handleOptionTap = (optIndex: number) => {
    if (!isInteractiveElimination) return;
    if (!eliminateIndices.includes(optIndex)) return; // correct answer — don't eliminate
    if (userEliminated.includes(optIndex)) return; // already eliminated

    const newEliminated = [...userEliminated, optIndex];
    setUserEliminated(newEliminated);

    // Show the reason for this specific answer
    const reason = TUTORIAL_QUESTION.options[optIndex].eliminationReason ?? 'That one can go!';
    setEliminationFeedback({ index: optIndex, reason });

    // If that was the last one, flash celebration then auto-advance after a beat
    if (eliminateIndices.every(i => newEliminated.includes(i))) {
      setAllDoneFlash(true);
      setTimeout(() => {
        setEliminationFeedback(null);
        setStepIndex(si => si + 1);
      }, 1800);
    } else {
      setTimeout(() => setEliminationFeedback(null), 2800);
    }
  };

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const remaining = eliminateIndices.filter(i => !userEliminated.includes(i)).length;

  return (
    <div className="space-y-4 py-2">
      {/* Tutorial badge */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/30">
          <span className="text-sm">🎓</span>
          <span className="font-display font-bold text-white text-sm tracking-wide">Tutorial</span>
          <span className="text-white/50 text-xs font-display">· one quick practice question</span>
        </div>

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
          {/* Use feedback message during interactive elimination, otherwise step message */}
          <ProfessorHoot
            mood={allDoneFlash ? 'celebrating' : (eliminationFeedback ? 'teaching' : step.hootMood)}
            size="md"
            message={
              allDoneFlash
                ? "All wrong answers eliminated! Now you can choose! 🎉"
                : eliminationFeedback
                ? `✅ Correct! ${eliminationFeedback.reason}`
                : step.message
            }
            showSpeechBubble={true}
            animate={true}
          />

          {/* Step title */}
          <h3 className="font-display font-bold text-white text-center text-lg drop-shadow-md">
            {allDoneFlash ? '✅ All eliminated!' : step.title}
          </h3>

          {/* Interactive elimination counter */}
          {isInteractiveElimination && !allDoneFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-sm font-display font-bold text-white/90 bg-white/20 rounded-full px-3 py-1">
                {remaining === 0
                  ? '🎉 All done!'
                  : remaining === eliminateIndices.length
                  ? `Tap ${remaining} wrong answers ✂️`
                  : `${remaining} more to go ✂️`}
              </span>
            </motion.div>
          )}

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
                    // For interactive elimination step: child taps to eliminate
                    if (isInteractiveElimination) {
                      const isEliminatable = eliminateIndices.includes(i);
                      const isEliminated = userEliminated.includes(i);
                      const isJustEliminated = eliminationFeedback?.index === i;
                      const isCorrectAnswer = !isEliminatable;

                      return (
                        <motion.button
                          key={i}
                          onClick={() => handleOptionTap(i)}
                          disabled={isEliminated || isCorrectAnswer || allDoneFlash}
                          animate={isJustEliminated ? { scale: [1, 1.04, 0.97, 1] } : {}}
                          transition={{ duration: 0.35 }}
                          className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg border text-sm text-left transition-all ${
                            isEliminated
                              ? 'bg-red-50/60 border-red-200 text-gray-300 line-through opacity-60 cursor-default'
                              : isCorrectAnswer
                              ? 'bg-gray-100/80 border-gray-200 text-gray-400 cursor-default opacity-60'
                              : 'bg-white border-purple-200 text-gray-700 hover:bg-red-50 hover:border-red-300 active:scale-[0.98] cursor-pointer shadow-sm'
                          }`}
                        >
                          <span className="font-display font-bold text-xs w-5 shrink-0 text-gray-500">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {isEliminated && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto shrink-0"
                            >
                              ❌
                            </motion.span>
                          )}
                          {isCorrectAnswer && !allDoneFlash && (
                            <span className="ml-auto text-gray-300 text-xs font-display">?</span>
                          )}
                          {isEliminatable && !isEliminated && !allDoneFlash && (
                            <span className="ml-auto text-purple-300 text-xs font-display">tap ✂️</span>
                          )}
                        </motion.button>
                      );
                    }

                    // For non-interactive steps (lock-in, review): static display
                    const isEliminated = eliminateIndices.includes(i);
                    const isCorrect = 'correctIndex' in step && step.correctIndex === i;
                    const hasCorrectOnThisStep = 'correctIndex' in step && step.correctIndex !== undefined;

                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 py-2 px-3 rounded-lg border text-sm ${
                          isCorrect
                            ? 'bg-green-50 border-green-300 text-green-700 font-bold'
                            : isEliminated && hasCorrectOnThisStep
                            ? 'bg-red-50/40 border-red-200/40 text-gray-300 line-through opacity-50'
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
                          <span className={`ml-auto text-xs ${hasCorrectOnThisStep ? 'text-red-300 opacity-50' : 'text-red-400'}`}>❌</span>
                        )}
                        {isCorrect && (
                          <span className="ml-auto text-green-500 text-lg">✅</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Blurred answers placeholder when hidden */}
              {!step.showAnswers && step.showQuestion && (
                <div className="mt-3 space-y-2">
                  {TUTORIAL_QUESTION.options.map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 bg-gray-100"
                    >
                      <span className="font-display font-bold text-xs text-gray-400 w-5">{String.fromCharCode(65 + i)}</span>
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

      {/* Action buttons — hidden during interactive elimination (auto-advances on completion) */}
      {!isInteractiveElimination && (
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
      )}

      {/* During interactive elimination: show hint text instead of button */}
      {isInteractiveElimination && !allDoneFlash && (
        <p className="text-center text-white/70 text-xs font-display">
          Tap the wrong answers above to cross them out
        </p>
      )}

      {/* Skip link */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="block mx-auto text-white/50 text-xs font-display hover:text-white/70 transition-colors"
        >
          Already know how it works? Skip
        </button>
      )}
    </div>
  );
}
