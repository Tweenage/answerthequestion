import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BeeChar } from '../mascot/BeeChar';
import { speakWord } from '../../utils/tts';

interface SpellingBeeRitualProps {
  word: string;
  onComplete: () => void;
}

const STEPS = [
  { prompt: 'Say the word out loud', beeMessage: 'Listen carefully...', beeMood: 'thinking' as const },
  { prompt: 'Now spell it out loud, letter by letter', beeMessage: 'Nice and clear!', beeMood: 'encouraging' as const },
  { prompt: 'Say the word one more time', beeMessage: 'One more time!', beeMood: 'happy' as const },
];

export function SpellingBeeRitual({ word, onComplete }: SpellingBeeRitualProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const handleDone = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleReplay = () => {
    speakWord(word);
  };

  const step = STEPS[stepIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-8">
      <BeeChar mood={step.beeMood} size="lg" message={step.beeMessage} showSpeechBubble animate />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <p className="text-2xl font-display font-bold text-slate-800 mb-2">
            {step.prompt}
          </p>
          <p className="text-sm text-slate-500">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4">
        <button
          onClick={handleReplay}
          className="px-6 py-3 rounded-xl bg-amber-100 text-amber-700 font-semibold active:scale-95 transition-transform"
        >
          🔊 Hear again
        </button>
        <button
          onClick={handleDone}
          className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-lg hover:bg-amber-600 active:scale-95 transition-transform"
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}
