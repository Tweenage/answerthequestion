import { useNavigate } from 'react-router';
import { BeeChar } from '../components/mascot/BeeChar';
import { useSpellingProgressStore } from '../stores/useSpellingProgressStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { SPELLING_WORDS } from '../data/words';

export function ProgressPage() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const childId = user?.id ?? '';
  const today = new Date().toISOString().split('T')[0];

  const data = useSpellingProgressStore(s => s.getData(childId));
  const getWordsByStars = useSpellingProgressStore(s => s.getWordsByStars);
  const dueWords = useSpellingProgressStore(s => s.getDueWords(childId, today));

  const mastered = getWordsByStars(childId, 3).length;
  const learning = getWordsByStars(childId, 2).length;
  const seen = getWordsByStars(childId, 1).length;
  const unseen = SPELLING_WORDS.length - mastered - learning - seen;

  const totalSessions = data.sessions.length;
  const streak = data.streak;

  return (
    <div className="p-4 space-y-5">
      <h2 className="font-display text-2xl font-bold text-slate-800">Progress</h2>

      <BeeChar mood="happy" size="sm" message="Look how far you've come!" showSpeechBubble animate />

      {/* Mastery breakdown */}
      <div className="bg-white/80 rounded-xl p-5 border border-slate-200 space-y-3">
        <h3 className="font-display font-bold text-slate-700">Word Mastery</h3>
        <div className="space-y-2">
          <ProgressRow label="Mastered" emoji="⭐⭐⭐" count={mastered} total={SPELLING_WORDS.length} colour="bg-amber-400" />
          <ProgressRow label="Learning" emoji="⭐⭐" count={learning} total={SPELLING_WORDS.length} colour="bg-amber-300" />
          <ProgressRow label="Seen" emoji="⭐" count={seen} total={SPELLING_WORDS.length} colour="bg-slate-300" />
          <ProgressRow label="Unseen" emoji="—" count={unseen} total={SPELLING_WORDS.length} colour="bg-slate-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200">
          <p className="text-2xl font-bold text-amber-600">{totalSessions}</p>
          <p className="text-[10px] text-slate-500">Sessions</p>
        </div>
        <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200">
          <p className="text-2xl font-bold text-orange-500">{streak.currentStreak}</p>
          <p className="text-[10px] text-slate-500">Streak 🔥</p>
        </div>
        <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200">
          <p className="text-2xl font-bold text-slate-700">{dueWords.length}</p>
          <p className="text-[10px] text-slate-500">Due today</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('/bingo')}
          className="w-full py-3 bg-white/80 rounded-xl border border-amber-200 text-slate-700 font-bold active:scale-[0.98] transition-transform"
        >
          📊 View Word Grid
        </button>
        {dueWords.length > 0 && (
          <button
            onClick={() => navigate('/drill')}
            className="w-full py-3 bg-amber-500 rounded-xl text-white font-bold active:scale-[0.98] transition-transform"
          >
            🔄 Review {dueWords.length} Due Words
          </button>
        )}
      </div>
    </div>
  );
}

function ProgressRow({ label, emoji, count, total, colour }: {
  label: string; emoji: string; count: number; total: number; colour: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-16 text-slate-600">{label}</span>
      <span className="w-10 text-center">{emoji}</span>
      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${colour} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-slate-500 text-xs">{count}</span>
    </div>
  );
}
