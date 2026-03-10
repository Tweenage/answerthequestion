import { motion } from 'framer-motion';

export type HootMood = 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'teaching' | 'warning' | 'sleeping';
export type HootSize = 'sm' | 'md' | 'lg' | 'xl';

interface ProfessorHootProps {
  mood?: HootMood;
  size?: HootSize;
  message?: string;
  showSpeechBubble?: boolean;
  animate?: boolean;
  className?: string;
}

const MOOD_ACCESSORIES: Record<HootMood, string> = {
  happy: '✨',
  thinking: '🤔',
  celebrating: '🎉',
  encouraging: '💪',
  teaching: '📖',
  warning: '⚠️',
  sleeping: '💤',
};

const SIZE_CONFIG = {
  sm: { owl: 'text-2xl', hat: 'text-sm', accessory: 'text-xs', container: 'w-10 h-10', accessoryOffset: '-top-0.5 -right-1' },
  md: { owl: 'text-4xl', hat: 'text-lg', accessory: 'text-sm', container: 'w-16 h-16', accessoryOffset: '-top-1 -right-2' },
  lg: { owl: 'text-6xl', hat: 'text-2xl', accessory: 'text-lg', container: 'w-24 h-24', accessoryOffset: '-top-2 -right-3' },
  xl: { owl: 'text-7xl', hat: 'text-3xl', accessory: 'text-xl', container: 'w-32 h-32', accessoryOffset: '-top-3 -right-4' },
};

export function ProfessorHoot({
  mood = 'happy',
  size = 'md',
  message,
  showSpeechBubble = true,
  animate = true,
  className = '',
}: ProfessorHootProps) {
  const config = SIZE_CONFIG[size];
  const accessory = MOOD_ACCESSORIES[mood];

  const owlAnimation = animate ? {
    happy: { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } },
    thinking: { rotate: [-3, 0, -3], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const } },
    celebrating: { y: [0, -8, 0], scale: [1, 1.1, 1], transition: { duration: 0.6, repeat: 2, ease: 'easeInOut' as const } },
    encouraging: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } },
    teaching: { y: [0, -2, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } },
    warning: { x: [-2, 2, -2, 0], transition: { duration: 0.4, repeat: 2, ease: 'easeInOut' as const } },
    sleeping: { rotate: [0, 5, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } },
  }[mood] : undefined;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Professor Hoot character */}
      <motion.div
        animate={owlAnimation}
        className={`${config.container} relative shrink-0 flex items-center justify-center rounded-2xl bg-white/90 shadow-md border border-purple-200/50`}
      >
        {/* Owl */}
        <span className={config.owl} role="img" aria-label="Professor Hoot">🦉</span>

        {/* Mortar board */}
        <span
          className={`absolute -top-2 -right-1 ${config.hat} rotate-12`}
          role="img"
          aria-label="graduation cap"
        >
          🎓
        </span>

        {/* Mood accessory */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={mood}
          className={`absolute ${config.accessoryOffset} ${config.accessory}`}
        >
          {accessory}
        </motion.span>
      </motion.div>

      {/* Speech bubble */}
      {showSpeechBubble && message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-block bg-white/90 rounded-2xl px-4 py-2.5 border-2 border-purple-200/40 shadow-sm max-w-sm"
        >
          {/* Speech bubble tail (pointing up) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-[9px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[9px] border-b-purple-200/40" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-[7px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/90" />

          <p className="font-display text-sm text-gray-700 leading-relaxed text-center">{message}</p>
        </motion.div>
      )}
    </div>
  );
}

/** Compact inline version — just the owl face for tight spaces */
export function HootInline({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const owlSize = size === 'sm' ? 'text-lg' : 'text-2xl';
  const hatSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <span className="relative inline-flex items-center">
      <span className={owlSize}>🦉</span>
      <span className={`absolute -top-1 -right-1 ${hatSize} rotate-12`}>🎓</span>
    </span>
  );
}
