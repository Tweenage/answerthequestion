import { motion } from 'framer-motion';

export interface StepConfig {
  step: number;
  label: string;
  instruction: string;
  bgColour: string;
  borderColour: string;
  textColour: string;
  badgeColour: string;
  emoji: string;
  showDownArrows?: boolean;
}

const STEP_CONFIGS: Record<string, StepConfig> = {
  READING_FIRST: {
    step: 1,
    label: 'READ THE QUESTION',
    instruction: 'Read every single word. Don\'t rush!',
    bgColour: 'bg-amber-100',
    borderColour: 'border-amber-400',
    textColour: 'text-amber-900',
    badgeColour: 'bg-amber-500',
    emoji: '📖',
    showDownArrows: true,
  },
  READING_SECOND: {
    step: 2,
    label: 'READ IT AGAIN!',
    instruction: 'What is it REALLY asking? Say it in your head!',
    bgColour: 'bg-orange-100',
    borderColour: 'border-orange-400',
    textColour: 'text-orange-900',
    badgeColour: 'bg-orange-500',
    emoji: '📖',
    showDownArrows: true,
  },
  NUMBER_EXTRACTION: {
    step: 3,
    label: 'CHECK THE NUMBERS',
    instruction: 'Tap any number words to turn them into digits!',
    bgColour: 'bg-blue-100',
    borderColour: 'border-blue-400',
    textColour: 'text-blue-900',
    badgeColour: 'bg-blue-500',
    emoji: '🔢',
    showDownArrows: true,
  },
  HIGHLIGHTING: {
    step: 4,
    label: 'FIND THE KEY WORDS',
    instruction: 'Tap the fewest words that tell you what to find — always get danger words!',
    bgColour: 'bg-purple-100',
    borderColour: 'border-purple-400',
    textColour: 'text-purple-900',
    badgeColour: 'bg-purple-500',
    emoji: '🔍',
    showDownArrows: true,
  },
  ELIMINATING: {
    step: 5,
    label: 'CROSS OUT WRONG ANSWERS',
    instruction: 'Tap the answers you KNOW are wrong!',
    bgColour: 'bg-red-100',
    borderColour: 'border-red-400',
    textColour: 'text-red-900',
    badgeColour: 'bg-red-500',
    emoji: '✂️',
    showDownArrows: true,
  },
  SELECTING: {
    step: 6,
    label: 'LOCK YOUR ANSWER!',
    instruction: 'Tap the answer you think is correct, then lock it in!',
    bgColour: 'bg-emerald-100',
    borderColour: 'border-emerald-400',
    textColour: 'text-emerald-900',
    badgeColour: 'bg-emerald-500',
    emoji: '🔒',
    showDownArrows: false,
  },
  REVIEWING: {
    step: 7,
    label: 'REVIEW YOUR ANSWER',
    instruction: 'Read the question one more time. Does your answer make sense?',
    bgColour: 'bg-teal-100',
    borderColour: 'border-teal-400',
    textColour: 'text-teal-900',
    badgeColour: 'bg-teal-500',
    emoji: '✅',
    showDownArrows: false,
  },
};

const TOTAL_STEPS = 7;

interface StepBannerProps {
  flowState: string;
  sessionsCompleted?: number;
}

export function StepBanner({ flowState, sessionsCompleted = 0 }: StepBannerProps) {
  const config = STEP_CONFIGS[flowState];
  if (!config) return null;

  // After 3 completed sessions the child knows the steps — drop the flashy animations
  const showAnimations = sessionsCompleted < 3;

  return (
    <motion.div
      key={flowState}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      className="space-y-2"
    >
      {/* Step progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const stepNum = i + 1;
          const isCurrent = stepNum === config.step;
          const isDone = stepNum < config.step;
          return (
            <div
              key={stepNum}
              className={`rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-7 h-3 ' + config.badgeColour
                  : isDone
                  ? 'w-3 h-3 bg-gray-400'
                  : 'w-3 h-3 bg-gray-200'
              }`}
            />
          );
        })}
      </div>

      {/* Main banner */}
      <div className={`relative rounded-2xl border-3 ${config.borderColour} ${config.bgColour} p-4 overflow-hidden`}>
        {/* Pulsing glow behind banner — only in first 3 sessions */}
        {showAnimations && (
          <motion.div
            className={`absolute inset-0 ${config.bgColour} opacity-50`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <div className="relative flex items-center gap-3">
          {/* Step number badge */}
          <motion.div
            className={`shrink-0 w-14 h-14 rounded-full ${config.badgeColour} flex items-center justify-center shadow-lg`}
            animate={showAnimations ? { scale: [1, 1.08, 1] } : {}}
            transition={showAnimations ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
          >
            <span className="font-display font-black text-white text-xl leading-none">
              {config.step}
            </span>
          </motion.div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{config.emoji}</span>
              <p className={`font-display font-black text-base uppercase tracking-wide ${config.textColour}`}>
                Step {config.step}: {config.label}
              </p>
            </div>
            <p className={`font-display font-bold text-sm mt-0.5 ${config.textColour} opacity-80`}>
              {config.instruction}
            </p>
          </div>
        </div>

        {/* Bouncing arrows pointing down — only in first 3 sessions */}
        {config.showDownArrows && showAnimations && (
          <div className="flex justify-center gap-4 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-2xl"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              >
                👇
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
