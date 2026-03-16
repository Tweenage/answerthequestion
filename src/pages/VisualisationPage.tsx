import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ChevronRight, ChevronLeft, Wind } from 'lucide-react';
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
  const { speak, stop: stopSpeech, isSpeaking } = useSpeech();
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

        <div className="flex flex-col items-center text-center px-4 pt-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl mb-5">
            🌅
          </div>

          <h2 className="font-display text-2xl font-bold text-purple-700 mb-2">
            Guided Visualisation
          </h2>

          <p className="text-purple-400 font-display text-sm mb-6">
            {script.durationMinutes} minutes
          </p>

          <div className="bg-white rounded-2xl p-5 w-full space-y-3 text-left shadow-sm">
            <p className="font-display text-gray-700 text-base leading-relaxed">
              This short guided exercise will help you imagine exam day going well &mdash;
              arriving calm, reading carefully, and using your technique with confidence.
            </p>
            <p className="font-display text-gray-700 text-base leading-relaxed">
              Athletes, musicians and top performers all use visualisation to prepare for big moments.
              When you rehearse something vividly in your mind, your brain treats it almost like real
              practice &mdash; so the real day already feels familiar.
            </p>
            <p className="font-display text-sm text-purple-600 font-semibold leading-relaxed mt-1">
              ✨ Try to do this 2&ndash;3 times a week, and every day in the week before your exam.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 w-full mt-4 text-left border border-white/30">
            <p className="font-display font-semibold text-white text-sm mb-2">Before you start:</p>
            <ul className="space-y-1.5 text-sm text-white/80 font-display">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🪑</span> Find a comfortable place to sit
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🤫</span> Somewhere quiet, with no distractions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🎧</span> Headphones are ideal but not essential
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">😌</span> Close your eyes when the audio begins
              </li>
            </ul>
          </div>

          <button
            onClick={() => setMode('script')}
            className="mt-8 w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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

        <div className="flex flex-col items-center text-center px-4 pt-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-5">
            <Wind className="w-10 h-10 text-violet-500" />
          </div>

          <h2 className="font-display text-2xl font-bold text-purple-700 mb-2">
            Box Breathing
          </h2>

          <p className="text-purple-400 font-display text-sm mb-6">
            Go for as long as you like
          </p>

          <div className="bg-white rounded-2xl p-5 w-full space-y-3 text-left shadow-sm">
            <p className="font-display text-gray-700 text-base leading-relaxed">
              Box breathing is a simple technique used by athletes, astronauts and even Navy SEALs to
              calm nerves and sharpen focus. Breathe in, hold, breathe out, hold &mdash; each for 4 seconds.
            </p>
            <p className="font-display text-gray-700 text-base leading-relaxed">
              Slow, steady breathing tells your nervous system that everything is OK &mdash; it lowers
              your heart rate and clears your mind so you can think properly. Even a minute or two makes
              a real difference. It&rsquo;s a brilliant tool to use just before an exam, before a practice
              paper, or any time you feel the wobbles.
            </p>
            <p className="font-display text-sm text-purple-600 font-semibold leading-relaxed mt-1">
              ✨ Practise a little every day &mdash; even just 4 or 5 cycles. The more you do it,
              the quicker it works when you need it most.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 w-full mt-4 text-left border border-white/30">
            <p className="font-display font-semibold text-white text-sm mb-2">Before you start:</p>
            <ul className="space-y-1.5 text-sm text-white/80 font-display">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🪑</span> Sit comfortably with both feet on the floor
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🙌</span> Rest your hands in your lap
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">😌</span> Close your eyes or soften your gaze
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🔵</span> Follow the circle &mdash; it will guide you
              </li>
            </ul>
          </div>

          <button
            onClick={() => setMode('breathing')}
            className="mt-8 w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            I&rsquo;m ready &mdash; let&rsquo;s breathe
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Box breathing ---------- */
  if (mode === 'breathing') {
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

        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-purple-700">Box Breathing</h2>
          <p className="text-purple-400 text-sm font-display mt-1">
            Follow the circle. Breathe when it tells you.
          </p>
        </div>

        <BoxBreathingExercise config={boxBreathingConfig} />
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

  const isExpanded = breathPhase === 'inhale' || breathPhase === 'hold-in';
  const circleScale = isExpanded ? 1.3 : 0.8;
  const phaseDuration =
    breathPhase === 'inhale' ? breathingConfig.inhaleSeconds :
    breathPhase === 'exhale' ? breathingConfig.exhaleSeconds : 0.3;

  const breathLabel =
    breathPhase === 'inhale' ? 'Breathe in\u2026' :
    breathPhase === 'hold-in' ? 'Hold\u2026' :
    breathPhase === 'exhale' ? 'Breathe out\u2026' : 'Hold\u2026';

  const breathColour =
    breathPhase === 'inhale' ? 'text-teal-300' :
    breathPhase === 'hold-in' ? 'text-indigo-300' :
    breathPhase === 'exhale' ? 'text-emerald-300' : 'text-violet-300';

  const ringBg =
    breathPhase === 'inhale' ? 'bg-teal-400/20' :
    breathPhase === 'hold-in' ? 'bg-indigo-400/20' :
    breathPhase === 'exhale' ? 'bg-emerald-400/20' : 'bg-violet-400/20';

  const innerBg =
    breathPhase === 'inhale' ? 'bg-teal-400/30' :
    breathPhase === 'hold-in' ? 'bg-indigo-400/30' :
    breathPhase === 'exhale' ? 'bg-emerald-400/30' : 'bg-violet-400/30';

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
              {/* Breathing circle */}
              <motion.div
                animate={{ scale: circleScale }}
                transition={{
                  duration: breathPhase === 'hold-in' || breathPhase === 'hold-out' ? 0.3 : phaseDuration,
                  ease: 'easeInOut',
                }}
                className={`w-40 h-40 rounded-full ${ringBg} flex items-center justify-center`}
              >
                <motion.div
                  animate={{ scale: circleScale * 0.55 }}
                  transition={{
                    duration: breathPhase === 'hold-in' || breathPhase === 'hold-out' ? 0.3 : phaseDuration,
                    ease: 'easeInOut',
                  }}
                  className={`w-24 h-24 rounded-full ${innerBg} flex items-center justify-center`}
                >
                  <span className="font-display font-black text-2xl text-white/60">
                    😌
                  </span>
                </motion.div>
              </motion.div>

              {/* Breathing phase label */}
              <motion.p
                key={breathPhase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl font-display font-bold ${breathColour}`}
              >
                {breathLabel}
              </motion.p>

              {/* Gentle instruction */}
              <p className="text-white/30 text-sm font-display text-center max-w-xs">
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

const PHASE_META: Record<BreathPhase, { label: string; colour: string; bgRing: string; innerBg: string }> = {
  'inhale':   { label: 'Breathe in…',  colour: 'text-teal-600',    bgRing: 'bg-teal-200',    innerBg: 'bg-teal-300' },
  'hold-in':  { label: 'Hold…',        colour: 'text-indigo-500',  bgRing: 'bg-indigo-200',  innerBg: 'bg-indigo-300' },
  'exhale':   { label: 'Breathe out…', colour: 'text-emerald-500', bgRing: 'bg-emerald-200', innerBg: 'bg-emerald-300' },
  'hold-out': { label: 'Hold…',        colour: 'text-violet-500',  bgRing: 'bg-violet-200',  innerBg: 'bg-violet-300' },
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

  const meta = PHASE_META[phase];
  const isExpanded = phase === 'inhale' || phase === 'hold-in';
  const circleScale = isExpanded ? 1.3 : 0.8;

  // Duration of the current phase for the animation
  const phaseDuration =
    phase === 'inhale' ? config.inhaleSeconds :
    phase === 'exhale' ? config.exhaleSeconds : 0.3;

  return (
    <div className="min-h-[340px] flex flex-col items-center justify-center gap-8">
      {/* Animated circle */}
      <motion.div
        animate={{ scale: circleScale }}
        transition={{
          duration: phase === 'hold-in' || phase === 'hold-out' ? 0.3 : phaseDuration,
          ease: 'easeInOut',
        }}
        className={`w-36 h-36 rounded-full ${meta.bgRing} flex items-center justify-center shadow-lg`}
      >
        <motion.div
          animate={{ scale: circleScale * 0.55 }}
          transition={{
            duration: phase === 'hold-in' || phase === 'hold-out' ? 0.3 : phaseDuration,
            ease: 'easeInOut',
          }}
          className={`w-20 h-20 rounded-full ${meta.innerBg} flex items-center justify-center`}
        >
          <span className="font-display font-black text-3xl text-white">
            {(phase === 'inhale' ? config.inhaleSeconds :
              phase === 'hold-in' ? config.holdInSeconds :
              phase === 'exhale' ? config.exhaleSeconds :
              config.holdOutSeconds) - countdown + 1}
          </span>
        </motion.div>
      </motion.div>

      {/* Phase label */}
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-2xl font-display font-bold ${meta.colour}`}
      >
        {meta.label}
      </motion.p>

      {/* Cycle counter */}
      <p className="text-sm text-gray-400 font-display">
        {cycles === 0 ? 'Starting\u2026' : `${cycles} cycle${cycles === 1 ? '' : 's'} completed`}
      </p>

      {/* 4-step visual indicator */}
      <div className="flex gap-3">
        {(['inhale', 'hold-in', 'exhale', 'hold-out'] as BreathPhase[]).map(p => (
          <div
            key={p}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              p === phase ? `${PHASE_META[p].innerBg} scale-125` : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
