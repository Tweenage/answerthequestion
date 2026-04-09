import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';
import { SpellingBeeRitual } from '../components/test/SpellingBeeRitual';
import { LetterFeedback } from '../components/test/LetterFeedback';
import { useDrill } from '../hooks/useDrill';
import { speakWord } from '../utils/tts';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from '@atq/shared';

export default function DrillPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState('');
  const [lastResult, setLastResult] = useState<{ typed: string; correct: boolean } | null>(null);

  const user = useCurrentUser();

  // Get word IDs from navigation state, or fall back to weak words (stars 0-1)
  const passedWordIds = (location.state as { wordIds?: string[] })?.wordIds;
  const getWordsByStars = useSpellingProgressStore(s => s.getWordsByStars);
  const wordIds = passedWordIds ?? (user ? [
    ...getWordsByStars(user.id, 0),
    ...getWordsByStars(user.id, 1),
  ].slice(0, 20) : []);

  const {
    phase, currentWord, totalWords, masteredCount, pool,
    startBatch, onRitualComplete, submitAnswer, nextWord,
  } = useDrill(wordIds);

  useEffect(() => {
    if (phase === 'typing' && inputRef.current) {
      inputRef.current.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTyped('');
      setLastResult(null);
      if (currentWord) speakWord(currentWord.word);
    }
  }, [phase, currentWord]);

  useEffect(() => {
    if (phase === 'feedback') {
      const timer = setTimeout(nextWord, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, nextWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typed.trim() || !currentWord) return;
    const correct = typed.toLowerCase().trim() === currentWord.word.toLowerCase();
    setLastResult({ typed, correct });
    submitAnswer(typed);
  };

  if (wordIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
        <BeeChar mood="happy" size="lg" message="No words to drill right now! Try a test first." showSpeechBubble animate />
        <button
          onClick={() => navigate('/test')}
          className="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold active:scale-95 transition-transform"
        >
          Start a Test
        </button>
      </div>
    );
  }

  // Ready phase
  if (phase === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
        <BeeChar mood="encouraging" size="lg" message={`Let's master ${totalWords} words! Get each one right 3 times in a row.`} showSpeechBubble animate />

        <div className="w-full max-w-xs bg-white/80 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-slate-800">{totalWords}</p>
          <p className="text-sm text-slate-500">words to drill</p>
        </div>

        <button
          onClick={startBatch}
          className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          Let's go! 🐝
        </button>
      </div>
    );
  }

  // Ritual phase
  if (phase === 'ritual' && currentWord) {
    return <SpellingBeeRitual word={currentWord.word} onComplete={onRitualComplete} />;
  }

  // Typing phase
  if (phase === 'typing' && currentWord) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{masteredCount} mastered</span>
            <span>{pool.length} remaining</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500 rounded-full"
              initial={false}
              animate={{ width: `${totalWords > 0 ? (masteredCount / totalWords) * 100 : 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <BeeChar mood="encouraging" size="md" message="Type the word!" showSpeechBubble animate />

        <button
          onClick={() => speakWord(currentWord.word)}
          className="px-6 py-2 rounded-xl bg-amber-100 text-amber-700 font-semibold active:scale-95 transition-transform"
        >
          🔊 Hear again
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

  // Feedback phase
  if (phase === 'feedback' && currentWord && lastResult) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <BeeChar
          mood={lastResult.correct ? 'celebrating' : 'encouraging'}
          size="lg"
          message={lastResult.correct ? 'Correct! 🎉' : `It's spelled: ${currentWord.word}`}
          showSpeechBubble
          animate
        />
        <LetterFeedback target={currentWord.word} typed={lastResult.typed} />
      </div>
    );
  }

  // Batch complete
  if (phase === 'batch-complete') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
        <BeeChar mood="happy" size="lg" message={`${pool.length} words left — keep going!`} showSpeechBubble animate />
        <button
          onClick={startBatch}
          className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          Next batch →
        </button>
      </div>
    );
  }

  // All complete
  if (phase === 'all-complete') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
        <BeeChar mood="celebrating" size="xl" message="You mastered every word! 🌟🐝" showSpeechBubble animate />
        <p className="text-2xl font-bold text-slate-800">{masteredCount} words drilled</p>
        <button
          onClick={() => navigate('/home')}
          className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-lg active:scale-95 transition-transform"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return null;
}
