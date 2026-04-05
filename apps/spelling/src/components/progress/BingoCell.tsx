import { motion } from 'framer-motion';

interface BingoCellProps {
  word: string;
  stars: 0 | 1 | 2 | 3;
  onClick?: () => void;
}

const STAR_STYLES = {
  0: 'bg-slate-100 text-slate-400 border-slate-200',
  1: 'bg-amber-50 text-amber-800 border-amber-200',
  2: 'bg-amber-100 text-amber-900 border-amber-300',
  3: 'bg-yellow-200 text-yellow-900 border-yellow-400 shadow-sm shadow-yellow-300/50',
} as const;

const STAR_ICONS = { 0: '☆', 1: '★', 2: '★★', 3: '★★★' } as const;

export function BingoCell({ word, stars, onClick }: BingoCellProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-1 rounded text-[10px] leading-tight font-medium
        border text-center truncate
        ${STAR_STYLES[stars]}
      `}
      title={`${word} — ${STAR_ICONS[stars]}`}
    >
      <div className="truncate">{word}</div>
      <div className="text-[8px] opacity-70">{STAR_ICONS[stars]}</div>
    </motion.button>
  );
}
