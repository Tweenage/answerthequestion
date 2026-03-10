import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(durationMs: number) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const remainingMs = Math.max(0, durationMs - elapsedMs);
  const percentRemaining = (remainingMs / durationMs) * 100;
  const isExpired = remainingMs <= 0;

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    if (isRunning && !isExpired) {
      intervalRef.current = setInterval(() => {
        setElapsedMs(prev => prev + 1000);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isExpired]);

  const start = useCallback(() => setIsRunning(true), []);
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
