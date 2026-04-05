import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { boxBreathingConfig } from '../../data/visualisation-scripts';

interface PreSessionBreathingProps {
  onComplete: () => void;
}

const TOTAL_CYCLES = 4;

const affirmations = [
  "I am calm, focused, and ready to do my best.",
  "I read carefully and think before I answer.",
  "Mistakes help me learn and grow stronger.",
  "I take my time because I know that's how I succeed.",
  "I am smart enough to solve any question.",
  "I trust my brain — it knows more than I think.",
  "Every question is a chance to show what I can do.",
  "I breathe, I focus, I succeed.",
  "I don't rush — I use my CLEAR Method.",
  "I am getting better every single day.",
  "I believe in myself and my abilities.",
  "I stay calm even when questions are tricky.",
  "I am prepared and I am ready.",
  "My best is always good enough.",
  "I can do hard things.",
  "I am brave, I am strong, I am capable.",
  "I learn something new every time I practise.",
  "I read the question twice because I'm smart like that.",
  "I don't need to be perfect — I just need to try my best.",
  "I am proud of how hard I've worked.",
  "Tricky questions don't scare me — they challenge me.",
  "I take a breath and give my brain time to think.",
  "I trust the process and enjoy the journey.",
  "I notice the key words because I read with purpose.",
  "Every practice session makes me stronger.",
  "I am focused and nothing can distract me.",
  "I choose my answers carefully and with confidence.",
  "I've got this — one question at a time.",
  "My mind is sharp and ready to work.",
  "I eliminate wrong answers like a detective.",
  "I am a brilliant thinker and problem solver.",
  "When I slow down, I speed up my success.",
  "I have the skills to tackle any question.",
  "I feel calm, I feel confident, I feel ready.",
  "Today I will show what I can do.",
];

type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe in…',
  holdIn: 'Hold…',
  exhale: 'Breathe out…',
  holdOut: 'Hold…',
};

const phaseDurations: Record<BreathPhase, number> = {
  inhale: boxBreathingConfig.inhaleSeconds,
  holdIn: boxBreathingConfig.holdInSeconds,
  exhale: boxBreathingConfig.exhaleSeconds,
  holdOut: boxBreathingConfig.holdOutSeconds,
};

const phaseOrder: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];

const phaseScale: Record<BreathPhase, number> = {
  inhale: 1.6,
  holdIn: 1.6,
  exhale: 1.0,
  holdOut: 1.0,
};

function getDailyAffirmation(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return affirmations[dayOfYear % affirmations.length];
}

export function PreSessionBreathing({ onComplete }: PreSessionBreathingProps) {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const affirmation = getDailyAffirmation();
  const circleGradient = 'radial-gradient(circle at 35% 35%, rgba(147,197,253,0.95) 0%, rgba(59,130,246,0.75) 45%, rgba(29,78,216,0.55) 100%)';
  const glowBase = 'rgba(59,130,246,0.5)';

  const advancePhase = useCallback(() => {
    setPhase(prev => {
      const currentIdx = phaseOrder.indexOf(prev);
      if (currentIdx === phaseOrder.length - 1) {
        setCycle(prevCycle => {
          const nextCycle = prevCycle + 1;
          if (nextCycle >= TOTAL_CYCLES) {
            setIsComplete(true);
            return prevCycle;
          }
          return nextCycle;
        });
        return 'inhale';
      }
      return phaseOrder[currentIdx + 1];
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started || isComplete) return;
    const duration = phaseDurations[phase] * 1000;
    const timer = setTimeout(advancePhase, duration);
    return () => clearTimeout(timer);
  }, [phase, started, isComplete, advancePhase, cycle]);

  const circleDuration = phase === 'inhale' || phase === 'exhale' ? phaseDurations[phase] : 0.4;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 18%, #7c3aed 36%, #c026d3 56%, #db2777 76%, #be123c 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-28 -left-28 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.4) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-36 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-60 h-60 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute -top-10 right-6 w-48 h-48 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3.5 }}
        />
        {/* Twinkling star dots */}
        {[
          { l: '12%', t: '18%', d: 2.5 },
          { l: '28%', t: '55%', d: 4.1 },
          { l: '70%', t: '22%', d: 1.8 },
          { l: '85%', t: '60%', d: 3.3 },
          { l: '45%', t: '88%', d: 5.0 },
          { l: '60%', t: '10%', d: 2.0 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-white"
            style={{ left: dot.l, top: dot.t }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: dot.d + 1.5, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Skip */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-white/35 hover:text-white/70 text-sm font-display transition-colors z-10"
      >
        Skip
      </button>

      {/* Affirmation */}
      <motion.div
        className="relative z-10 text-center px-8 mb-10 max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p className="text-white/90 text-xl sm:text-2xl font-display font-bold leading-relaxed">
          ✨ <em>"{affirmation}"</em>
        </p>
      </motion.div>

      {/* Breathing circle */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hue-rotate wrapper cycles: blue → indigo → fuchsia → pink → blue */}
        <motion.div
          className="relative w-44 h-44 flex items-center justify-center"
          animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(105deg)', 'hue-rotate(0deg)'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Outermost ambient pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${glowBase} 0%, transparent 70%)` }}
            animate={{
              scale: started && !isComplete ? phaseScale[phase] * 1.3 : 1,
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              scale: { duration: circleDuration, ease: 'easeInOut' },
              opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* Soft glow halo */}
          <motion.div
            className="absolute inset-3 rounded-full"
            style={{ boxShadow: `0 0 60px ${glowBase}, 0 0 120px ${glowBase}` }}
            animate={{ scale: started && !isComplete ? phaseScale[phase] : 1 }}
            transition={{ duration: circleDuration, ease: 'easeInOut' }}
          />

          {/* Main circle */}
          <motion.div
            className="relative w-32 h-32 rounded-full overflow-hidden"
            style={{
              background: circleGradient,
              boxShadow: `0 0 60px ${glowBase}, 0 0 120px ${glowBase}, inset 0 0 30px rgba(255,255,255,0.2)`,
            }}
            animate={{ scale: started && !isComplete ? phaseScale[phase] : 1 }}
            transition={{ duration: circleDuration, ease: 'easeInOut' }}
          >
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 55%, rgba(255,255,255,0.1) 100%)',
              }}
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          {started && !isComplete && (
            <motion.div
              key={phase + cycle}
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-2xl font-display font-bold tracking-wide text-white">
                {phaseLabels[phase]}
              </p>
              <p className="text-white/60 text-xs font-display mt-1">
                {phaseDurations[phase]}s
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cycle progress pills */}
        {started && !isComplete && (
          <div className="flex gap-2 mt-6">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === cycle ? 28 : 8,
                  height: 8,
                  background: i < cycle
                    ? 'rgba(255,255,255,0.85)'
                    : i === cycle
                    ? 'rgba(255,255,255,0.55)'
                    : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ready state */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="relative z-10 mt-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', bounce: 0.4 }}
          >
            <p className="text-white/75 font-display text-base font-semibold tracking-wide">
              You're calm. You're focused. 🌟
            </p>
            <button
              onClick={onComplete}
              className="px-10 py-4 font-display font-bold text-xl rounded-full text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                boxShadow: '0 0 40px rgba(236,72,153,0.55), 0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              I'm Ready! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-start message */}
      <AnimatePresence>
        {!started && (
          <motion.p
            className="relative z-10 mt-8 text-white/45 text-sm font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            Get comfortable and relax…
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
