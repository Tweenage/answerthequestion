import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(durationMs: number, enabled = true) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remainingMs = enabled ? Math.max(0, durationMs - elapsedMs) : durationMs;
  const percentRemaining = enabled ? (remainingMs / durationMs) * 100 : 100;
  const isExpired = enabled ? remainingMs <= 0 : false;

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = enabled ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '';

  useEffect(() => {
    if (!enabled) return;
    if (isRunning && !isExpired) {
      intervalRef.current = setInterval(() => {
        setElapsedMs(prev => prev + 1000);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, isRunning, isExpired]);

  const start = useCallback(() => {
    if (enabled) setIsRunning(true);
  }, [enabled]);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setElapsedMs(0);
    setIsRunning(false);
  }, []);

  return {
    elapsedMs,
    remainingMs,
    percentRemaining,
    isExpired,
    isRunning,
    display,
    start,
    pause,
    reset,
  };
}
