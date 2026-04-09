import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { nanoid } from 'nanoid';
import { useAuthStore, useDyslexiaStore } from '@atq/shared';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useDailySession } from '../hooks/useDailySession';
import { CoverCopyCompare } from '../components/study/CoverCopyCompare';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BeeChar } from '../components/mascot/BeeChar';
import type { SpellingSessionRecord } from '../types/spelling';
import { WORDS_BY_ID } from '../data/words';

export function StudyPage() {
  const navigate = useNavigate();
  const childId = useAuthStore(s => s.currentChildId);
  const store = useSpellingProgressStore();
  const isDyslexiaMode = useDyslexiaStore(s => s.isDyslexiaMode);
  const dyslexiaMode = childId ? isDyslexiaMode(childId) : false;

  const { sessionWords, alreadyCompleted } = useDailySession();

  const today = new Date().toISOString().split('T')[0];

  // Find yesterday's completed session words for the warm-up card
  const yesterday = (() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();
  const yesterdaySession = childId
    ? store.getData(childId).sessions.find(s => s.date === yesterday && s.completed)
    : undefined;
  const yesterdayWords = yesterdaySession
    ? yesterdaySession.wordsStudied.map(id => WORDS_BY_ID[id]).filter(Boolean)
    : [];

  const [showWarmup, setShowWarmup] = useState(yesterdayWords.length > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [grades, setGrades] = useState<number[]>([]);
  // eslint-disable-next-line react-hooks/purity
  const sessionStartTime = useRef<number>(Date.now());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleWordComplete(grade: number, _responseTimeMs: number) {
    if (!childId) return;

    const word = sessionWords[currentIndex];
    store.recordAnswer(childId, word.id, grade, today);

    const newGrades = [...grades, grade];
    setGrades(newGrades);

    if (currentIndex < sessionWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete — save and navigate
      const session: SpellingSessionRecord = {
        id: nanoid(),
        date: today,
        wordsStudied: sessionWords.map(w => w.id),
        correct: newGrades.filter(g => g >= 3).length,
        total: sessionWords.length,
        completed: true,
        durationMs: Date.now() - sessionStartTime.current,
      };
      store.saveSession(childId, session);
      store.updateStreak(childId, today);
      navigate('/session-complete', { state: { session } });
    }
  }

  if (alreadyCompleted) {
    return (
      <div className="py-8 flex flex-col items-center gap-6">
        <BeeChar mood="celebrating" size="lg" message="You already finished today's session!" />
        <p className="text-white font-display text-xl font-bold text-center">
          Great job! Come back tomorrow for more practice.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (sessionWords.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center gap-6">
        <BeeChar mood="happy" size="lg" message="No words to study right now!" />
        <p className="text-white font-display text-xl font-bold text-center">
          Check back later.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (showWarmup) {
    return (
      <div className="py-8 px-4 flex flex-col items-center gap-6 max-w-md mx-auto w-full">
        <BeeChar mood="encouraging" size="lg" message="Let's warm up first!" />
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-full space-y-4">
          <p className="font-display font-bold text-gray-800 text-lg text-center">
            Remember these from yesterday?
          </p>
          <ul className="space-y-2">
            {yesterdayWords.map(w => (
              <li key={w.id} className="flex items-center gap-3 bg-honey-50 rounded-xl px-4 py-2">
                <span className="text-xl">🐝</span>
                <span className="font-display font-bold text-gray-800 text-lg">{w.word}</span>
                <span className="text-sm text-gray-500 italic ml-1">{w.definitions[0].definition}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 text-center">
            You'll practise these again in today's session.
          </p>
        </div>
        <button
          onClick={() => setShowWarmup(false)}
          className="w-full bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200"
        >
          Let's go! →
        </button>
      </div>
    );
  }

  const progressValue = (currentIndex / sessionWords.length) * 100;

  return (
    <div className="py-6 space-y-5 px-4">
      {/* Progress header */}
      <div className="max-w-md mx-auto w-full space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white/90 font-display font-bold text-sm">
            Word {currentIndex + 1} of {sessionWords.length}
          </span>
        </div>
        <ProgressBar value={progressValue} colour="honey" />
      </div>

      {/* Study component */}
      <CoverCopyCompare
        key={sessionWords[currentIndex].id}
        word={sessionWords[currentIndex]}
        onComplete={handleWordComplete}
        dyslexiaMode={dyslexiaMode}
      />
    </div>
  );
}
