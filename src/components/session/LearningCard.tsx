import { motion } from 'framer-motion';
import type { LearningCard as LearningCardData } from '../../data/learningCards';

interface LearningCardProps {
  card: LearningCardData;
}

export function LearningCard({ card }: LearningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4"
    >
      <p className="font-display font-bold text-sm text-indigo-800 mb-1">{card.title}</p>
      <p className="font-display text-sm text-indigo-700 leading-relaxed">{card.tip}</p>
      {card.example && (
        <p className="font-display text-xs text-indigo-500 mt-2 italic">{card.example}</p>
      )}
    </motion.div>
  );
}
