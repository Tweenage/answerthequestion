import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from '@atq/shared';
import { SPELLING_WORDS } from '../data/words';

export function HomePage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const childId = user?.id ?? '';
  const today = new Date().toISOString().split('T')[0];

  const data = useSpellingProgressStore(s => s.getData(childId));
  const dueWords = useSpellingProgressStore(s => s.getDueWords(childId, today));
  const getWordsByStars = useSpellingProgressStore(s => s.getWordsByStars);

  const masteredCount = getWordsByStars(childId, 3).length;
  const learningCount = getWordsByStars(childId, 2).length;
  const seenCount = getWordsByStars(childId, 1).length;
  const totalAttempted = masteredCount + learningCount + seenCount;

  const streak = data.streak;

  return (
    <div className="p-4 space-y-5">
      {/* Welcome */}
      <div className="flex items-center gap-3">
        <BeeChar mood="happy" size="sm" animate />
        <div>
          <h2 className="font-display text-xl font-bold text-slate-800">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h2>
          <p className="text-sm text-slate-500">
            {dueWords.length > 0
              ? `${dueWords.length} words ready for review`
              : 'All caught up! Start a new test.'}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="bg-white/80 rounded-xl p-3 text-center border border-amber-200/50"
        >
          <p className="text-2xl font-bold text-amber-600">{masteredCount}</p>
          <p className="text-[10px] text-slate-500">Mastered ★★★</p>
        </motion.div>
        <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200/50">
          <p className="text-2xl font-bold text-slate-700">{totalAttempted}</p>
          <p className="text-[10px] text-slate-500">Words seen</p>
        </div>
        <div className="bg-white/80 rounded-xl p-3 text-center border border-orange-200/50">
          <p className="text-2xl font-bold text-orange-500">{streak.currentStreak}</p>
          <p className="text-[10px] text-slate-500">Day streak 🔥</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-slate-700">Quick Start</h3>

        <button
          onClick={() => navigate('/test')}
          className="w-full flex items-center gap-4 bg-amber-500 text-white rounded-xl p-4 shadow-lg active:scale-[0.98] transition-transform"
        >
          <span className="text-2xl">✏️</span>
          <div className="text-left">
            <p className="font-bold">Spelling Test</p>
            <p className="text-xs opacity-80">Test yourself on new words</p>
          </div>
        </button>

        {dueWords.length > 0 && (
          <button
            onClick={() => navigate('/drill')}
            className="w-full flex items-center gap-4 bg-white/80 text-slate-800 rounded-xl p-4 border border-amber-200/50 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl">🔄</span>
            <div className="text-left">
              <p className="font-bold">Review Due Words</p>
              <p className="text-xs text-slate-500">{dueWords.length} words ready for review</p>
            </div>
          </button>
        )}

        <button
          onClick={() => navigate('/study')}
          className="w-full flex items-center gap-4 bg-white/80 text-slate-800 rounded-xl p-4 border border-slate-200/50 active:scale-[0.98] transition-transform"
        >
          <span className="text-2xl">📖</span>
          <div className="text-left">
            <p className="font-bold">Flashcard Study</p>
            <p className="text-xs text-slate-500">Learn words with cover-copy-compare</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/bingo')}
          className="w-full flex items-center gap-4 bg-white/80 text-slate-800 rounded-xl p-4 border border-slate-200/50 active:scale-[0.98] transition-transform"
        >
          <span className="text-2xl">📊</span>
          <div className="text-left">
            <p className="font-bold">Word Grid</p>
            <p className="text-xs text-slate-500">{masteredCount}/{SPELLING_WORDS.length} mastered</p>
          </div>
        </button>
      </div>
    </div>
  );
}
