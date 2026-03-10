import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiExplosionProps {
  trigger: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#f472b6'];
const EMOJIS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🏆', '💎'];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function ConfettiExplosion({ trigger, onComplete }: ConfettiExplosionProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    emoji?: string;
    size: number;
    rotation: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (!trigger) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: randomBetween(-150, 150),
      y: randomBetween(-300, -100),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      emoji: i < 8 ? EMOJIS[i] : undefined,
      size: randomBetween(6, 14),
      rotation: randomBetween(0, 720),
      delay: randomBetween(0, 0.3),
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {trigger && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: p.x,
                y: p.y,
                scale: p.emoji ? 1.5 : 1,
                opacity: 0,
                rotate: p.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: p.delay,
                ease: [0.2, 0.8, 0.4, 1],
              }}
              className="absolute"
              style={{
                fontSize: p.emoji ? `${p.size * 2}px` : undefined,
                width: p.emoji ? undefined : `${p.size}px`,
                height: p.emoji ? undefined : `${p.size * 0.6}px`,
                backgroundColor: p.emoji ? undefined : p.color,
                borderRadius: p.emoji ? undefined : '2px',
              }}
            >
              {p.emoji || ''}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
