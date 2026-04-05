import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechniqueCardProps {
  emoji: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function TechniqueCard({ emoji, title, children, defaultOpen = false }: TechniqueCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-card border border-white/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3.5 text-left"
      >
        <span className="text-xl shrink-0">{emoji}</span>
        <span className="font-display font-bold text-gray-800 text-sm flex-1">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-sm"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 space-y-2.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
