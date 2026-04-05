import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XpPopupProps {
  xpEarned: number;
  isCorrect: boolean;
  techniquePercent: number;
  show: boolean;
}

export function XpPopup({ xpEarned, isCorrect, techniquePercent, show }: XpPopupProps) {
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    if (!show || xpEarned === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayXp(0);
      return;
    }

    // Animate the counter up
    let current = 0;
    const step = Math.max(1, Math.floor(xpEarned / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= xpEarned) {
        current = xpEarned;
        clearInterval(interval);
      }
      setDisplayXp(current);
    }, 40);

    return () => clearInterval(interval);
  }, [show, xpEarned]);

  const getMessage = () => {
    if (techniquePercent >= 90 && isCorrect) return 'OWL-STANDING! 🦉✨';
    if (techniquePercent >= 80 && isCorrect) return 'Hoo-ray! 🦉⭐';
    if (techniquePercent >= 70) return 'Wise work! 🦉💪';
    if (isCorrect) return "That's a hoot! 🦉👍";
    if (techniquePercent >= 60) return 'Good technique! 🦉📖';
    return 'Keep going! 🦉💫';
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: -20, opacity: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="flex flex-col items-center gap-1 py-3"
        >
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.2, 1] }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-lg font-display font-bold text-focus-700"
          >
            {getMessage()}
          </motion.p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl font-display font-black text-celebrate-amber">
              +{displayXp}
            </span>
            <span className="text-lg font-display font-bold text-celebrate-amber">XP</span>
          </motion.div>

          {/* XP breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 text-xs text-gray-400 font-display"
          >
            <span>Technique: +{Math.round(techniquePercent * 0.5)}</span>
            {isCorrect && <span>Correct: +30</span>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
