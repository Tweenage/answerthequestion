import { useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

export type SoundEffect =
  | 'correct'
  | 'wrong'
  | 'timerWarning'
  | 'timerUrgent'
  | 'sessionComplete'
  | 'levelUp'
  | 'badgeEarned'
  | 'streakMilestone'
  | 'click';

type OscType = OscillatorType;

interface Note {
  freq: number;
  duration: number;
  type: OscType;
  volume?: number;
  delay?: number;
}

const SOUND_DEFINITIONS: Record<SoundEffect, Note[]> = {
  correct: [
    { freq: 523, duration: 0.12, type: 'sine', volume: 0.25 },
    { freq: 659, duration: 0.18, type: 'sine', volume: 0.3, delay: 0.1 },
  ],
  wrong: [
    { freq: 392, duration: 0.1, type: 'triangle', volume: 0.15 },
    { freq: 330, duration: 0.15, type: 'triangle', volume: 0.12, delay: 0.08 },
  ],
  timerWarning: [
    { freq: 440, duration: 0.04, type: 'square', volume: 0.08 },
  ],
  timerUrgent: [
    { freq: 880, duration: 0.03, type: 'square', volume: 0.12 },
  ],
  sessionComplete: [
    { freq: 523, duration: 0.2, type: 'sine', volume: 0.25 },
    { freq: 659, duration: 0.2, type: 'sine', volume: 0.28, delay: 0.18 },
    { freq: 784, duration: 0.35, type: 'sine', volume: 0.3, delay: 0.36 },
  ],
  levelUp: [
    { freq: 262, duration: 0.12, type: 'sine', volume: 0.2 },
    { freq: 330, duration: 0.12, type: 'sine', volume: 0.22, delay: 0.1 },
    { freq: 392, duration: 0.12, type: 'sine', volume: 0.25, delay: 0.2 },
    { freq: 523, duration: 0.3, type: 'sine', volume: 0.3, delay: 0.3 },
  ],
  badgeEarned: [
    { freq: 1319, duration: 0.08, type: 'sine', volume: 0.2 },
    { freq: 1568, duration: 0.08, type: 'sine', volume: 0.22, delay: 0.07 },
    { freq: 1319, duration: 0.12, type: 'sine', volume: 0.2, delay: 0.14 },
  ],
  streakMilestone: [
    { freq: 523, duration: 0.15, type: 'sine', volume: 0.2 },
    { freq: 659, duration: 0.15, type: 'sine', volume: 0.22, delay: 0.13 },
    { freq: 784, duration: 0.15, type: 'sine', volume: 0.25, delay: 0.26 },
    { freq: 1047, duration: 0.4, type: 'sine', volume: 0.3, delay: 0.39 },
  ],
  click: [
    { freq: 600, duration: 0.02, type: 'sine', volume: 0.1 },
  ],
};

function playNotes(ctx: AudioContext, notes: Note[]) {
  const now = ctx.currentTime;
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = note.type;
    osc.frequency.value = note.freq;
    const vol = note.volume ?? 0.2;
    const startTime = now + (note.delay ?? 0);
    const endTime = startTime + note.duration;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    gain.gain.setValueAtTime(vol, endTime - 0.03);
    gain.gain.linearRampToValueAtTime(0, endTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(endTime + 0.01);
  }
}

export function useSoundEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundEnabled = useSettingsStore(s => s.soundEnabled);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, []);

  const play = useCallback((effect: SoundEffect) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const notes = SOUND_DEFINITIONS[effect];
      if (notes) {
        playNotes(ctx, notes);
      }
    } catch {
      // Audio not available
    }
  }, [soundEnabled]);

  return { play };
}
