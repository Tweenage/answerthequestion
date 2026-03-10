import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Star, Check } from 'lucide-react';
import type { UserProgress } from '../../types/progress';

interface DailyChallengeCardProps {
  progress: UserProgress;
}

export function DailyChallengeCard({ progress }: DailyChallengeCardProps) {
  const dc = progress.dailyChallenge ?? { lastCompletedDate: null, streak: 0, totalCompleted: 0, totalCorrect: 0 };
  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = dc.lastCompletedDate === todayStr;

  return (
    <Link to="/daily-challenge" aria-label={completedToday ? 'Daily challenge completed' : 'Start daily challenge'}>
      <motion.div
        whileTap={completedToday ? undefined : { scale: 0.98 }}
        className={`rounded-card p-4 shadow-md border-2 transition-all ${
          completedToday
            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200'
            : 'bg-gradient-to-r from-yellow-400 to-amber-500 border-yellow-300 hover:shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              completedToday ? 'bg-amber-100' : 'bg-white/30'
            }`}>
              {completedToday ? (
                <Check className="w-5 h-5 text-amber-600" />
              ) : (
                <Star className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <p className={`font-display font-bold text-sm ${
                completedToday ? 'text-amber-700' : 'text-white'
              }`}>
                {completedToday ? 'Daily Challenge Complete!' : 'Daily Challenge'}
              </p>
              <p className={`text-xs font-display ${
                completedToday ? 'text-amber-500' : 'text-white/80'
              }`}>
                {completedToday
                  ? `${dc.streak} day${dc.streak !== 1 ? 's' : ''} in a row!`
                  : 'One tricky question · 2× bonus XP!'
                }
              </p>
            </div>
          </div>
          {!completedToday && (
            <span className="bg-white/30 text-white px-3 py-1 rounded-full text-xs font-display font-bold">
              GO →
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
