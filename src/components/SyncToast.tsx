import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Check } from 'lucide-react';

interface SyncEvent {
  id: number;
  message: string;
  type: 'error' | 'success';
}

let nextId = 0;
const listeners: Set<(event: SyncEvent) => void> = new Set();

/** Call from anywhere (stores, etc.) to show a sync toast */
export function showSyncToast(message: string, type: 'error' | 'success' = 'error') {
  const event: SyncEvent = { id: nextId++, message, type };
  listeners.forEach(fn => fn(event));
}

export function SyncToast() {
  const [toasts, setToasts] = useState<SyncEvent[]>([]);

  useEffect(() => {
    const handler = (event: SyncEvent) => {
      setToasts(prev => [...prev, event]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== event.id));
      }, 4000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-sm text-sm font-display font-bold ${
              toast.type === 'error'
                ? 'bg-red-500/90 text-white'
                : 'bg-calm-500/90 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <WifiOff className="w-4 h-4 shrink-0" />
            ) : (
              <Check className="w-4 h-4 shrink-0" />
            )}
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
