import { motion } from 'framer-motion';

export type BeeMood = 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'warning';
export type BeeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BeeCharProps {
  mood?: BeeMood;
  size?: BeeSize;
  message?: string;
  showSpeechBubble?: boolean;
  animate?: boolean;
  className?: string;
}

const MOOD_ACCESSORIES: Record<BeeMood, string> = {
  happy: '✨',
  thinking: '🤔',
  celebrating: '🎉',
  encouraging: '💪',
  warning: '⚠️',
};

const SIZE_CONFIG = {
  xs: { bee: 'text-xl', crown: 'text-xs', accessory: 'text-[10px]', container: 'w-8 h-8', accessoryOffset: '-top-0.5 -right-0.5' },
  sm: { bee: 'text-2xl', crown: 'text-sm', accessory: 'text-xs', container: 'w-10 h-10', accessoryOffset: '-top-0.5 -right-1' },
  md: { bee: 'text-4xl', crown: 'text-lg', accessory: 'text-sm', container: 'w-16 h-16', accessoryOffset: '-top-1 -right-2' },
  lg: { bee: 'text-6xl', crown: 'text-2xl', accessory: 'text-lg', container: 'w-24 h-24', accessoryOffset: '-top-2 -right-3' },
  xl: { bee: 'text-7xl', crown: 'text-3xl', accessory: 'text-xl', container: 'w-32 h-32', accessoryOffset: '-top-3 -right-4' },
};

export function BeeChar({
  mood = 'happy',
  size = 'md',
  message,
  showSpeechBubble = true,
  animate = true,
  className = '',
}: BeeCharProps) {
  const config = SIZE_CONFIG[size];
  const accessory = MOOD_ACCESSORIES[mood];

  const beeAnimation = animate ? {
    happy: { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } },
    thinking: { rotate: [-3, 0, -3], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const } },
    celebrating: { y: [0, -8, 0], scale: [1, 1.1, 1], transition: { duration: 0.6, repeat: 2, ease: 'easeInOut' as const } },
    encouraging: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } },
    warning: { x: [-2, 2, -2, 0], transition: { duration: 0.4, repeat: 2, ease: 'easeInOut' as const } },
  }[mood] : undefined;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        animate={beeAnimation}
        className={`${config.container} relative shrink-0 flex items-center justify-center rounded-2xl bg-white/90 shadow-md border border-honey-200/50`}
      >
        <span className={config.bee} role="img" aria-label="Spelling Bee">🐝</span>
        <span
          className={`absolute -top-2 -right-1 ${config.crown}`}
          role="img"
          aria-label="crown"
        >
          👑
        </span>
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={mood}
          className={`absolute ${config.accessoryOffset} ${config.accessory}`}
        >
          {accessory}
        </motion.span>
      </motion.div>

      {showSpeechBubble && message && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-block bg-white/90 rounded-2xl px-5 py-2.5 border-2 border-honey-200/40 shadow-sm max-w-md w-full"
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-[9px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[9px] border-b-honey-200/40" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-[7px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white/90" />
          <p className="font-display text-base text-gray-700 leading-relaxed text-center">{message}</p>
        </motion.div>
      )}
    </div>
  );
}

/** Compact inline version for tight spaces */
export function BeeInline({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const beeSize = size === 'sm' ? 'text-lg' : 'text-2xl';
  const crownSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  return (
    <span className="relative inline-flex items-center">
      <span className={beeSize}>🐝</span>
      <span className={`absolute -top-1 -right-1 ${crownSize}`}>👑</span>
    </span>
  );
}
