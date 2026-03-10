import { Link } from 'react-router';
import type { MockExamProgress } from '../../types/progress';

interface MockExamCardProps {
  currentWeek: number;
  mockExams?: MockExamProgress;
}

export function MockExamCard({ currentWeek, mockExams }: MockExamCardProps) {
  const isUnlocked = currentWeek >= 6;
  const me = mockExams ?? { totalAttempted: 0, bestScore: 0, lastAttemptDate: null };

  if (!isUnlocked) {
    return (
      <div className="rounded-card p-4 bg-gray-400/30 border border-white/10">
        <div className="flex items-center gap-3 opacity-60">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-display font-bold text-sm text-white">📝 Mock Exam Mode</p>
            <p className="text-xs font-display text-white/70">
              Unlocks in Week 6 — {6 - currentWeek} week{6 - currentWeek !== 1 ? 's' : ''} to go!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to="/mock-exam">
      <div className="rounded-card p-4 bg-gradient-to-r from-violet-500 to-indigo-600 shadow-md border border-violet-400/30 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-display font-bold text-sm text-white">Mock Exam Mode</p>
              <p className="text-xs font-display text-white/70">
                20 questions · exam conditions
              </p>
            </div>
          </div>
          <div className="text-right">
            {me.totalAttempted > 0 && (
              <p className="text-xs font-display font-bold text-white/80">
                Best: {me.bestScore}%
              </p>
            )}
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-display font-bold">
              GO →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
