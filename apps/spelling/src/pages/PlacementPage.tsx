import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';
import { usePlacement } from '../hooks/usePlacement';
import { speakWord } from '../utils/tts';

const TIER_LABELS: Record<1 | 2 | 3, { name: string; description: string }> = {
  1: { name: 'Year 3/4 Foundation', description: 'Starting with the basics — we\'ll build up from here!' },
  2: { name: 'Year 5/6 Building', description: 'You already know the basics — let\'s step it up!' },
  3: { name: '11+ Advanced', description: 'You\'re ready for the challenging words — impressive!' },
};

export default function PlacementPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState('');

  const {
    phase, currentWord, index, totalWords,
    correctCount, results, lastTyped,
    start, submit, next, getRecommendedTier,
  } = usePlacement();

  useEffect(() => {
    if (phase === 'typing' && inputRef.current) {
      inputRef.current.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTyped('');
      if (currentWord) speakWord(currentWord.word);
    }
  }, [phase, currentWord]);

  useEffect(() => {
    if (phase === 'feedback') {
      const timer = setTimeout(next, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, next]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typed.trim()) submit(typed);
  };

  // Intro
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-12">
        <BeeChar
          mood="thinking"
          size="xl"
          message="Let me see what you already know! I'll give you 10 words — just do your best."
          showSpeechBubble
          animate
        />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-800">Quick Placement Test</h2>
          <p className="text-slate-500 text-sm">10 words • No pressure • Takes 2 minutes</p>
        </div>
        <button
          onClick={start}
          className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          I'm ready! 🐝
        </button>
      </div>
    );
  }

  // Typing
  if (phase === 'typing' && currentWord) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        {/* Progress */}
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: totalWords }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < results.length
                  ? results[i].correct ? 'bg-emerald-500' : 'bg-red-400'
                  : i === index ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-slate-500">Word {index + 1} of {totalWords}</p>

        <BeeChar mood="encouraging" size="md" message="Spell this word!" showSpeechBubble animate />

        <button
          onClick={() => currentWord && speakWord(currentWord.word)}
          className="px-6 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold active:scale-95 transition-transform"
        >
          🔊 Hear the word
        </button>

        <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full text-center text-2xl font-mono py-3 px-4 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none bg-white/90"
            placeholder="Type here..."
          />
          <button
            type="submit"
            disabled={!typed.trim()}
            className="py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            Check ✓
          </button>
        </form>
      </div>
    );
  }

  // Feedback
  if (phase === 'feedback' && currentWord) {
    const lastCorrect = results[results.length - 1]?.correct;
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <BeeChar
          mood={lastCorrect ? 'celebrating' : 'encouraging'}
          size="lg"
          message={lastCorrect ? 'Got it! ✨' : `It's spelled: ${currentWord.word}`}
          showSpeechBubble
          animate
        />
        <div className="flex flex-wrap justify-center gap-0.5 font-mono text-2xl">
          {Array.from({ length: Math.max(currentWord.word.length, lastTyped.length) }, (_, i) => {
            const target = currentWord.word[i] ?? '';
            const actual = lastTyped[i] ?? '';
            const isCorrect = target.toLowerCase() === actual.toLowerCase();
            const isMissing = i >= lastTyped.length;
            return (
              <span
                key={i}
                className={`w-8 h-10 flex items-center justify-center rounded ${
                  isMissing ? 'bg-amber-100 text-amber-600' :
                  isCorrect ? 'bg-emerald-100 text-emerald-700' :
                  'bg-red-100 text-red-600'
                }`}
              >
                {isMissing ? target : isCorrect ? actual : target}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // Complete
  if (phase === 'complete') {
    const tier = getRecommendedTier();
    const tierInfo = TIER_LABELS[tier];

    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <BeeChar
          mood="celebrating"
          size="xl"
          message="All done! Here's what I recommend:"
          showSpeechBubble
          animate
        />

        <div className="text-center">
          <p className="text-lg text-slate-500">{correctCount}/{totalWords} correct</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white/90 rounded-xl p-6 border-2 border-amber-300 text-center"
        >
          <p className="text-sm text-slate-500 mb-1">Recommended starting level:</p>
          <p className="text-2xl font-display font-bold text-amber-600">{tierInfo.name}</p>
          <p className="text-sm text-slate-500 mt-2">{tierInfo.description}</p>
        </motion.div>

        <button
          onClick={() => navigate('/home')}
          className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          Let's start! 🐝
        </button>
      </div>
    );
  }

  return null;
}
