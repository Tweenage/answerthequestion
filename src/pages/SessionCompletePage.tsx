import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { BeeChar } from '../components/mascot/BeeChar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StreakBadge } from '../components/ui/StreakBadge';
import { MasteryStars } from '../components/ui/MasteryStars';
import { WORDS_BY_ID } from '../data/words';
import type { SpellingSessionRecord } from '../types/spelling';

interface LocationState {
  session?: SpellingSessionRecord;
}

export function SessionCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const session = state?.session;

  const childId = useAuthStore(s => s.currentChildId);
  const store = useSpellingProgressStore();

  // Fallback to /home if no session data
  useEffect(() => {
    if (!session) {
      navigate('/home', { replace: true });
    }
  }, [session, navigate]);

  if (!session || !childId) {
    return null;
  }

  const data = store.getData(childId);
  const streak = data.streak.currentStreak;
  const scorePercent = session.total > 0 ? (session.correct / session.total) * 100 : 0;
  const progressColour = scorePercent >= 60 ? 'meadow' : 'buzz';

  return (
    <div className="py-8 px-4 flex flex-col items-center gap-6 max-w-md mx-auto">
      <BeeChar mood="celebrating" size="lg" />

      <h1 className="font-display text-3xl font-bold text-white text-center">
        Session Complete! 🎉
      </h1>

      {/* Score */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg w-full space-y-3">
        <p className="font-display font-bold text-gray-700 text-center text-lg">
          {session.correct} / {session.total} words correct
        </p>
        <ProgressBar value={scorePercent} colour={progressColour} />
      </div>

      {/* Streak */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg w-full flex items-center justify-between">
        <span className="font-display font-bold text-gray-700">Current streak</span>
        <StreakBadge streak={streak} className="text-lg" />
      </div>

      {/* Words studied with mastery */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg w-full space-y-3">
        <h2 className="font-display font-bold text-gray-700 text-base">Words practised</h2>
        <ul className="space-y-2">
          {session.wordsStudied.map(id => {
            const word = WORDS_BY_ID[id];
            const progress = store.getWordProgress(childId, id);
            if (!word) return null;
            return (
              <li key={id} className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-800">{word.word}</span>
                <MasteryStars score={progress.sm2.masteryScore} size="sm" />
              </li>
            );
          })}
        </ul>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="w-full bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200"
      >
        Back to Home
      </button>
    </div>
  );
}
