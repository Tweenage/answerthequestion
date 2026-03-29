import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, Wind } from 'lucide-react';
import { visualisationScripts, boxBreathingConfig } from '../data/visualisation-scripts';
import type { VisualisationScript, VisualisationSection, BoxBreathingConfig } from '../data/visualisation-scripts';

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Browser speech synthesis with onEnd callback for syncing */
function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndRef = useRef<(() => void) | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    onEndRef.current = onEnd ?? null;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.55;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => v.name.includes('Samantha')) ??
      voices.find(v => v.name.includes('Google UK English Female')) ??
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ??
      voices.find(v => v.lang.startsWith('en-GB')) ??
      voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Small pause after speech ends before advancing
      if (onEndRef.current) {
        const cb = onEndRef.current;
        onEndRef.current = null;
        setTimeout(cb, 1500);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    onEndRef.current = null;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  return { speak, stop, isSpeaking };
}

/** HTML audio player (for pre-recorded files) */
function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((src: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().catch(() => setIsPlaying(false));
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return { play, stop, isPlaying };
}

/* ------------------------------------------------------------------ */
/*  Breathing sound — synthesised with Web Audio API                    */
/* ------------------------------------------------------------------ */

function useBreathingSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /** Fade volume in to simulate inhale */
  const inhale = useCallback((durationSec: number) => {
    const ctx = getCtx();
    // Stop any previous oscillator
    oscRef.current?.stop();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // soft low tone
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + durationSec);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
  }, [getCtx]);

  /** Fade volume out to simulate exhale */
  const exhale = useCallback((durationSec: number) => {
    const ctx = getCtx();
    if (gainRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);
    }
  }, [getCtx]);

  /** Hold at current level (do nothing, just sustain) */
  const hold = useCallback(() => {
    // intentionally empty — sustain current gain level
  }, []);

  /** Silence — hold with no sound between exhale and inhale */
  const silence = useCallback(() => {
    oscRef.current?.stop();
    oscRef.current = null;
  }, []);

  const stopAll = useCallback(() => {
    oscRef.current?.stop();
    oscRef.current = null;
  }, []);

  useEffect(() => () => { oscRef.current?.stop(); ctxRef.current?.close(); }, []);

  return useMemo(() => ({ inhale, exhale, hold, silence, stopAll }), [inhale, exhale, hold, silence, stopAll]);
}

/* ------------------------------------------------------------------ */
/*  Mode type                                                          */
/* ------------------------------------------------------------------ */

type Mode = null | 'script-intro' | 'script' | 'breathing-intro' | 'breathing';

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function VisualisationPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [selectedScript, setSelectedScript] = useState<VisualisationScript | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { speak, stop: stopSpeech } = useSpeech();
  const { play: playAudio, stop: stopAudio, isPlaying: isAudioPlaying } = useAudioPlayer();

  useEffect(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
  }, []);

  const stopAllAudio = useCallback(() => {
    stopSpeech();
    stopAudio();
  }, [stopSpeech, stopAudio]);

  // Does this script have a single full audio file?
  const hasFullAudio = selectedScript?.audioSrc != null;

  const speakSection = useCallback((section: VisualisationSection, onEnd?: () => void) => {
    if (!audioEnabled || hasFullAudio) return; // skip per-section TTS if full audio exists
    stopAllAudio();
    if (section.audioSrc) { playAudio(section.audioSrc); return; }
    if (section.type === 'text' && section.content) speak(section.content, onEnd);
    else if (section.type === 'pause' && onEnd) {
      // For pause sections, wait the displayDuration then advance
      setTimeout(onEnd, section.displayDurationMs);
    }
  }, [audioEnabled, hasFullAudio, speak, playAudio, stopAllAudio]);

  // Per-section TTS with auto-advance when speech ends (only when no full audio)
  useEffect(() => {
    if (mode !== 'script' || !selectedScript || !audioEnabled || hasFullAudio) return;
    const section = selectedScript.sections[currentSectionIndex];
    const isLast = currentSectionIndex === selectedScript.sections.length - 1;
    const advanceNext = isLast ? undefined : () => {
      setCurrentSectionIndex(i => Math.min(selectedScript.sections.length - 1, i + 1));
    };
    speakSection(section, advanceNext);
    return () => { stopAllAudio(); };
  }, [mode, currentSectionIndex, selectedScript, audioEnabled, hasFullAudio, speakSection, stopAllAudio]);

  // Start full audio when script mode begins
  useEffect(() => {
    if (mode === 'script' && selectedScript?.audioSrc && audioEnabled) {
      playAudio(selectedScript.audioSrc);
    }
    return () => { if (hasFullAudio) stopAudio(); };
    // Only run when entering/leaving script mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Auto-advance sections on a timer (when full audio is playing)
  useEffect(() => {
    if (mode !== 'script' || !selectedScript || !hasFullAudio) return;
    const section = selectedScript.sections[currentSectionIndex];
    if (!section) return;
    const isLast = currentSectionIndex === selectedScript.sections.length - 1;
    if (isLast) return;

    const timer = setTimeout(() => {
      setCurrentSectionIndex(i => Math.min(selectedScript.sections.length - 1, i + 1));
    }, section.displayDurationMs);

    return () => clearTimeout(timer);
  }, [mode, selectedScript, currentSectionIndex, hasFullAudio]);

  const handleBack = () => {
    stopAllAudio();
    setSelectedScript(null);
    setMode(null);
  };

  /* ---------- Landing ---------- */
  if (mode === null) {
    const script = visualisationScripts[0]; // "Your Exam Day"
    return (
      <div className="space-y-6 py-2">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-purple-700">Calm &amp; Focus</h2>
          <p className="text-purple-400 mt-1 font-display">
            Close your eyes and listen — we&rsquo;ll guide you through it
          </p>
        </div>

        {/* Audio toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-display font-semibold text-sm transition-all ${
              audioEnabled
                ? 'bg-purple-100 text-purple-600 border-2 border-purple-300'
                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {audioEnabled ? 'Read aloud: ON' : 'Read aloud: OFF'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Guided visualisation */}
          <button
            onClick={() => {
              setSelectedScript(script);
              setCurrentSectionIndex(0);
              setMode('script-intro');
            }}
            className="w-full bg-white rounded-card p-5 shadow-sm border-2 border-purple-100 hover:border-purple-300 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl">
                {script.emoji}
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-lg text-gray-800">{script.title}</p>
                <p className="text-sm text-gray-600">{script.description}</p>
                <p className="text-xs text-purple-400 mt-1">
                  {script.durationMinutes} minutes {audioEnabled ? '· with audio' : ''}
                </p>
              </div>
            </div>
          </button>

          {/* Box breathing */}
          <button
            onClick={() => setMode('breathing-intro')}
            className="w-full bg-white rounded-card p-5 shadow-sm border-2 border-purple-100 hover:border-purple-300 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                <Wind className="w-7 h-7 text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-lg text-gray-800">Box Breathing</p>
                <p className="text-sm text-gray-600">
                  A simple breathing exercise to calm your body and focus your mind.
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  Breathe in · Hold · Breathe out · Hold — press Back when you&rsquo;re done
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Visualisation intro ---------- */
  if (mode === 'script-intro') {
    const script = selectedScript ?? visualisationScripts[0];
    return (
      <div className="space-y-6 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-sm text-purple-500 font-display font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="flex flex-col items-center text-center px-4 pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl mb-4">
            🌅
          </div>

          <h2 className="font-display text-xl font-bold text-purple-700 mb-1">
            Guided Visualisation
          </h2>

          <p className="text-purple-400 font-display text-sm mb-5">
            {script.durationMinutes} min &middot; Close your eyes and listen
          </p>

          <div className="bg-white rounded-2xl p-4 w-full text-left shadow-sm mb-5">
            <p className="font-display font-semibold text-purple-700 text-sm mb-2">Before you start:</p>
            <ul className="space-y-1.5 text-sm text-gray-700 font-display">
              <li className="flex items-start gap-2"><span>🪑</span> Sit somewhere comfortable and quiet</li>
              <li className="flex items-start gap-2"><span>🎧</span> Headphones are ideal but not essential</li>
              <li className="flex items-start gap-2"><span>😌</span> Close your eyes when the audio begins</li>
              <li className="flex items-start gap-2"><span>✨</span> Try 2–3 times a week — and every day the week before your exam</li>
            </ul>
          </div>

          <button
            onClick={() => setMode('script')}
            className="w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            I&rsquo;m ready &mdash; play
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Breathing intro ---------- */
  if (mode === 'breathing-intro') {
    return (
      <div className="space-y-6 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-sm text-purple-500 font-display font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="flex flex-col items-center text-center px-4 pt-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
            <Wind className="w-8 h-8 text-violet-500" />
          </div>

          <h2 className="font-display text-xl font-bold text-purple-700 mb-1">
            Box Breathing
          </h2>

          <p className="text-purple-400 font-display text-sm mb-5">
            Breathe in · Hold · Breathe out · Hold — go for as long as you like
          </p>

          <div className="bg-white rounded-2xl p-4 w-full text-left shadow-sm mb-5">
            <p className="font-display font-semibold text-purple-700 text-sm mb-2">Before you start:</p>
            <ul className="space-y-1.5 text-sm text-gray-700 font-display">
              <li className="flex items-start gap-2"><span>🪑</span> Sit comfortably, both feet on the floor</li>
              <li className="flex items-start gap-2"><span>🙌</span> Rest your hands in your lap</li>
              <li className="flex items-start gap-2"><span>😌</span> Close your eyes or soften your gaze</li>
              <li className="flex items-start gap-2"><span>🔵</span> Follow the circle — it will guide you</li>
            </ul>
          </div>

          <button
            onClick={() => setMode('breathing')}
            className="w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            I&rsquo;m ready &mdash; let&rsquo;s breathe
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Box breathing — immersive full-screen ---------- */
  if (mode === 'breathing') {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 18%, #7c3aed 36%, #c026d3 56%, #db2777 76%, #be123c 100%)' }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-28 -left-28 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.35) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-36 -right-24 w-96 h-96 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white"
              style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full px-5 py-6 safe-area-inset">
          <button
            onClick={handleBack}
            className="text-sm text-white/70 font-display font-semibold flex items-center gap-1 hover:text-white transition-colors self-start"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mt-4 mb-6">
            <h2 className="font-display text-xl font-bold text-white">Box Breathing</h2>
            <p className="text-white/60 text-sm font-display mt-1">
              Follow the circle. Breathe when it tells you.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <BoxBreathingExercise config={boxBreathingConfig} />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Guided script (immersive) ---------- */
  if (!selectedScript) return null;

  const totalDurationMs = selectedScript.sections.reduce((sum, s) => sum + s.displayDurationMs, 0);

  return (
    <VisualisationPlayer
      script={selectedScript}
      totalDurationMs={totalDurationMs}
      audioEnabled={audioEnabled}
      isAudioPlaying={isAudioPlaying}
      onToggleAudio={() => {
        if (audioEnabled) stopAllAudio();
        setAudioEnabled(!audioEnabled);
      }}
      onPlayPause={() => {
        if (isAudioPlaying) stopAudio();
        else if (selectedScript.audioSrc) playAudio(selectedScript.audioSrc);
      }}
      onBack={handleBack}
      breathingConfig={boxBreathingConfig}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Visualisation Player — countdown timer + breathing visual          */
/* ------------------------------------------------------------------ */

function VisualisationPlayer({
  script,
  totalDurationMs,
  audioEnabled,
  isAudioPlaying,
  onToggleAudio,
  onPlayPause,
  onBack,
  breathingConfig,
}: {
  script: VisualisationScript;
  totalDurationMs: number;
  audioEnabled: boolean;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onPlayPause: () => void;
  onBack: () => void;
  breathingConfig: BoxBreathingConfig;
}) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finished, setFinished] = useState(false);
  const sound = useBreathingSound();

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedMs(prev => {
        const next = prev + 1000;
        if (next >= totalDurationMs) {
          setFinished(true);
          clearInterval(interval);
          return totalDurationMs;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalDurationMs]);

  // Breathing cycle for the visual
  const cycleDuration = (breathingConfig.inhaleSeconds + breathingConfig.holdInSeconds + breathingConfig.exhaleSeconds + breathingConfig.holdOutSeconds) * 1000;
  const posInCycle = elapsedMs % cycleDuration;
  const inhaleDur = breathingConfig.inhaleSeconds * 1000;
  const holdInDur = breathingConfig.holdInSeconds * 1000;
  const exhaleDur = breathingConfig.exhaleSeconds * 1000;

  let breathPhase: 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
  if (posInCycle < inhaleDur) breathPhase = 'inhale';
  else if (posInCycle < inhaleDur + holdInDur) breathPhase = 'hold-in';
  else if (posInCycle < inhaleDur + holdInDur + exhaleDur) breathPhase = 'exhale';
  else breathPhase = 'hold-out';

  // Trigger breathing sounds
  const prevPhaseRef = useRef(breathPhase);
  useEffect(() => {
    if (finished) { sound.stopAll(); return; }
    if (prevPhaseRef.current !== breathPhase) {
      prevPhaseRef.current = breathPhase;
      if (breathPhase === 'inhale') sound.inhale(breathingConfig.inhaleSeconds);
      else if (breathPhase === 'exhale') sound.exhale(breathingConfig.exhaleSeconds);
      else if (breathPhase === 'hold-in') sound.hold();
      else sound.silence();
    }
  }, [breathPhase, finished, sound, breathingConfig]);

  useEffect(() => () => { sound.stopAll(); }, [sound]);

  const circleScale = (breathPhase === 'inhale' || breathPhase === 'hold-in') ? 1.3 : 0.8;
  const phaseDuration =
    breathPhase === 'inhale' ? breathingConfig.inhaleSeconds :
    breathPhase === 'exhale' ? breathingConfig.exhaleSeconds : 0.3;

  const breathLabel =
    breathPhase === 'inhale' ? 'Breathe in\u2026' :
    breathPhase === 'hold-in' ? 'Hold\u2026' :
    breathPhase === 'exhale' ? 'Breathe out\u2026' : 'Hold\u2026';

  const remainingMs = Math.max(0, totalDurationMs - elapsedMs);
  const remainingMin = Math.floor(remainingMs / 60000);
  const remainingSec = Math.floor((remainingMs % 60000) / 1000);
  const progressPercent = (elapsedMs / totalDurationMs) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        {/* Soft animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-indigo-400/8 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle stars / dots */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              top: `${10 + (i * 37) % 80}%`,
              left: `${5 + (i * 53) % 90}%`,
            }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-full px-5 py-6 safe-area-inset">
        {/* Top bar: back + audio controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-sm text-white/70 font-display font-semibold flex items-center gap-1 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {script.audioSrc && (
              <button
                onClick={onPlayPause}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 font-display font-semibold text-xs transition-all hover:bg-white/20"
              >
                {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAudioPlaying ? 'Pause' : 'Play'}
              </button>
            )}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-full transition-all ${
                audioEnabled ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/30'
              }`}
              aria-label={audioEnabled ? 'Mute audio' : 'Enable audio'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="font-display text-lg font-bold text-white/90">{script.title}</h2>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-teal-400/60 rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Time remaining */}
        <p className="text-center text-white/50 text-sm font-display mb-4">
          {remainingMin}:{remainingSec.toString().padStart(2, '0')} remaining
        </p>

        {/* Central breathing visual */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {finished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-5xl mb-4">✨</p>
              <h3 className="font-display text-2xl font-bold text-white mb-2">Well done</h3>
              <p className="font-display text-white/60 text-base">
                You&rsquo;re calm, focused, and ready
              </p>
              <button
                onClick={onBack}
                className="mt-8 px-8 py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Continue
              </button>
            </motion.div>
          ) : (
            <>
              {/* Breathing circle — hue-rotate cycles blue → indigo → fuchsia → pink → blue */}
              <motion.div
                animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(105deg)', 'hue-rotate(0deg)'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ scale: circleScale }}
                  transition={{
                    duration: breathPhase === 'hold-in' || breathPhase === 'hold-out' ? 0.3 : phaseDuration,
                    ease: 'easeInOut',
                  }}
                  className="w-40 h-40 rounded-full bg-blue-400/20 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: circleScale * 0.55 }}
                    transition={{
                      duration: breathPhase === 'hold-in' || breathPhase === 'hold-out' ? 0.3 : phaseDuration,
                      ease: 'easeInOut',
                    }}
                    className="w-24 h-24 rounded-full bg-blue-400/30 flex items-center justify-center"
                  >
                    <span className="text-2xl text-white/60">😌</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Breathing phase label */}
              <motion.p
                key={breathPhase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-display font-bold text-white"
              >
                {breathLabel}
              </motion.p>

              {/* Gentle instruction */}
              <p className="text-white/70 text-sm font-display text-center max-w-xs">
                Close your eyes and listen. Follow the breathing if it helps.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Box Breathing — standalone exercise                                */
/* ------------------------------------------------------------------ */

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

// Hue-rotate wrapper cycles circle colour: blue → indigo → fuchsia → pink → blue
const PHASE_LABELS: Record<BreathPhase, string> = {
  'inhale':   'Breathe in…',
  'hold-in':  'Hold…',
  'exhale':   'Breathe out…',
  'hold-out': 'Hold…',
};

function BoxBreathingExercise({ config }: { config: BoxBreathingConfig }) {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(config.inhaleSeconds);
  const [cycles, setCycles] = useState(0);
  const sound = useBreathingSound();

  useEffect(() => {
    const order: { phase: BreathPhase; dur: number }[] = [
      { phase: 'inhale',   dur: config.inhaleSeconds },
      { phase: 'hold-in',  dur: config.holdInSeconds },
      { phase: 'exhale',   dur: config.exhaleSeconds },
      { phase: 'hold-out', dur: config.holdOutSeconds },
    ];

    let cancelled = false;
    let stepIdx = 0;
    let secondsLeft = order[0].dur;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(order[0].phase);
    setCountdown(order[0].dur);

    // Trigger initial sound
    sound.inhale(config.inhaleSeconds);

    const interval = setInterval(() => {
      if (cancelled) return;
      secondsLeft -= 1;

      if (secondsLeft <= 0) {
        // Move to next phase
        stepIdx = (stepIdx + 1) % order.length;
        if (stepIdx === 0) setCycles(c => c + 1);

        const next = order[stepIdx];
        secondsLeft = next.dur;
        setPhase(next.phase);
        setCountdown(next.dur);

        // Trigger sound for new phase
        if (next.phase === 'inhale') sound.inhale(next.dur);
        else if (next.phase === 'exhale') sound.exhale(next.dur);
        else if (next.phase === 'hold-in') sound.hold();
        else sound.silence();
      } else {
        setCountdown(secondsLeft);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      sound.stopAll();
    };
  }, [config, sound]);

  const circleScale = (phase === 'inhale' || phase === 'hold-in') ? 1.3 : 0.8;

  // Duration of the current phase for the animation
  const phaseDuration =
    phase === 'inhale' ? config.inhaleSeconds :
    phase === 'exhale' ? config.exhaleSeconds : 0.3;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Hue-rotate wrapper — cycles blue → indigo → fuchsia → pink → blue */}
      <motion.div
        animate={{ filter: ['hue-rotate(0deg)', 'hue-rotate(105deg)', 'hue-rotate(0deg)'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ scale: circleScale }}
          transition={{
            duration: phase === 'hold-in' || phase === 'hold-out' ? 0.3 : phaseDuration,
            ease: 'easeInOut',
          }}
          className="w-36 h-36 rounded-full bg-blue-400/25 flex items-center justify-center"
          style={{ boxShadow: '0 0 40px rgba(59,130,246,0.4)' }}
        >
          <motion.div
            animate={{ scale: circleScale * 0.55 }}
            transition={{
              duration: phase === 'hold-in' || phase === 'hold-out' ? 0.3 : phaseDuration,
              ease: 'easeInOut',
            }}
            className="w-20 h-20 rounded-full bg-blue-400/40 flex items-center justify-center"
          >
            <span className="font-display font-black text-3xl text-white">
              {(phase === 'inhale' ? config.inhaleSeconds :
                phase === 'hold-in' ? config.holdInSeconds :
                phase === 'exhale' ? config.exhaleSeconds :
                config.holdOutSeconds) - countdown + 1}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Phase label */}
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-display font-bold text-white"
      >
        {PHASE_LABELS[phase]}
      </motion.p>

      {/* Cycle counter */}
      <p className="text-sm text-white/60 font-display">
        {cycles === 0 ? 'Starting\u2026' : `${cycles} cycle${cycles === 1 ? '' : 's'} completed`}
      </p>

      {/* 4-step visual indicator */}
      <div className="flex gap-3">
        {(['inhale', 'hold-in', 'exhale', 'hold-out'] as BreathPhase[]).map(p => (
          <div
            key={p}
            className={`rounded-full transition-all duration-300 ${
              p === phase ? 'bg-white/60 scale-125 w-3 h-3' : 'bg-white/20 w-3 h-3'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
