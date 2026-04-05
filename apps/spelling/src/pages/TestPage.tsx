import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';
import { SpellingBeeRitual } from '../components/test/SpellingBeeRitual';
import { LetterFeedback } from '../components/test/LetterFeedback';
import { TestProgress } from '../components/test/TestProgress';
import { useSpellingTest } from '../hooks/useSpellingTest';
import { SPELLING_WORDS } from '../data/words';
import { speakWord } from '../utils/tts';

export default function TestPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState('');

  const {
    phase, currentWord, currentIndex, wordCount,
    results, resultFlags, correctCount, incorrectWords,
    startTest, onRitualComplete, submitAnswer, nextWord,
  } = useSpellingTest(SPELLING_WORDS);

  // Auto-focus input in typing phase
  useEffect(() => {
    if (phase === 'typing' && inputRef.current) {
      inputRef.current.focus();
      setTyped('');
      if (currentWord) speakWord(currentWord.word);
    }
  }, [phase, currentWord]);

  // Auto-advance after feedback
  useEffect(() => {
    if (phase === 'feedback') {
      const timer = setTimeout(nextWord, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, nextWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typed.trim()) submitAnswer(typed);
  };

  // Select count phase
  if (phase === 'select-count') {
    return (
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-12">
        <BeeChar mood="happy" size="lg" message="How many words shall we practise?" showSpeechBubble animate />
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {[5, 10, 15, 20].map(count => (
            <button
              key={count}
              onClick={() => startTest(count)}
              className="py-4 rounded-xl bg-white/80 text-slate-800 font-bold text-xl shadow-sm hover:bg-white active:scale-95 transition-transform border border-amber-200/50"
            >
              {count}
            </button>
          ))}
        </div>
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
        <TestProgress total={wordCount} results={resultFlags} />
        <p className="text-sm text-slate-500">Word {currentIndex + 1} of {wordCount}</p>

        <BeeChar mood="encouraging" size="md" message="Type the word you heard!" showSpeechBubble animate />

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
            className="py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg hover:bg-amber-600 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check ✓
          </button>
        </form>
      </div>
    );
  }

  // Feedback phase
  if (phase === 'feedback' && currentWord) {
    const lastResult = results[results.length - 1];
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <TestProgress total={wordCount} results={resultFlags} />

        <BeeChar
          mood={lastResult?.correct ? 'celebrating' : 'encouraging'}
          size="lg"
          message={lastResult?.correct ? 'Brilliant! 🎉' : `The correct spelling is "${currentWord.word}"`}
          showSpeechBubble
          animate
        />

        {lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <LetterFeedback target={currentWord.word} typed={lastResult.typed} />
          </motion.div>
        )}
      </div>
    );
  }

  // Complete phase
  if (phase === 'complete') {
    const percentage = wordCount > 0 ? Math.round((correctCount / wordCount) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        <BeeChar
          mood={percentage >= 80 ? 'celebrating' : percentage >= 50 ? 'happy' : 'encouraging'}
          size="xl"
          message={percentage >= 80 ? 'Amazing work! 🌟' : percentage >= 50 ? 'Good effort!' : 'Keep practising!'}
          showSpeechBubble
          animate
        />

        <div className="text-center">
          <p className="text-4xl font-bold font-display text-slate-800">{correctCount}/{wordCount}</p>
          <p className="text-slate-500 mt-1">{percentage}% correct</p>
        </div>

        {incorrectWords.length > 0 && (
          <div className="w-full max-w-sm bg-white/80 rounded-xl p-4 border border-red-200/50">
            <h3 className="font-bold text-slate-700 mb-2">Words to practise:</h3>
            <ul className="space-y-1">
              {incorrectWords.map(r => (
                <li key={r.wordId} className="text-sm text-slate-600">
                  <span className="line-through text-red-400">{r.typed}</span>
                  {' → '}
                  <span className="font-semibold text-emerald-600">{r.word}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 rounded-xl bg-white/80 text-slate-700 font-semibold border border-slate-200"
          >
            Home
          </button>
          {incorrectWords.length > 0 && (
            <button
              onClick={() => navigate('/drill', { state: { wordIds: incorrectWords.map(w => w.wordId) } })}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-lg active:scale-95 transition-transform"
            >
              Drill these words
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
