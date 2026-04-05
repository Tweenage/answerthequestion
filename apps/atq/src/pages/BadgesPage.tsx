import { motion } from 'framer-motion';
import { useProgressStore } from '../stores/useProgressStore';
import { useCurrentUser } from '@atq/shared';
import { badgeDefinitions } from '../data/badges';
import type { BadgeCategory } from '../types/badge';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';

const categoryLabels: Record<BadgeCategory, string> = {
  technique: 'Technique',
  streak: 'Streaks',
  mastery: 'Subject Mastery',
  milestone: 'Milestones',
};

const categoryOrder: BadgeCategory[] = ['technique', 'streak', 'mastery', 'milestone'];

export function BadgesPage() {
  const currentUser = useCurrentUser();
  const getBadges = useProgressStore(s => s.getBadges);

  if (!currentUser) return null;

  const earnedBadges = getBadges(currentUser.id);
  const earnedIds = new Set(earnedBadges.map(b => b.badgeId));

  return (
    <div className="space-y-4 py-1">
      {/* Professor Hoot header */}
      <ProfessorHoot
        mood={earnedIds.size > 0 ? 'happy' : 'encouraging'}
        size="md"
        message={
          earnedIds.size === 0
            ? "Collect all my special badges! Complete challenges to earn them. I know you can do it!"
            : `Hoo-ray! You've earned ${earnedIds.size} badge${earnedIds.size === 1 ? '' : 's'} so far! Can you collect them all?`
        }
        showSpeechBubble={true}
        animate={true}
      />

      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-focus-800">Badge Collection</h2>
        <p className="text-gray-500 mt-1 font-display">
          {earnedIds.size} of {badgeDefinitions.length} earned
        </p>
      </div>

      {categoryOrder.map(category => {
        const badges = badgeDefinitions.filter(b => b.category === category);
        return (
          <div key={category}>
            <h3 className="font-display font-bold text-focus-700 mb-2">{categoryLabels[category]}</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {badges.map((badge, i) => {
                const isEarned = earnedIds.has(badge.id);
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative bg-white rounded-card p-3 shadow-sm border text-center ${
                      isEarned ? 'border-celebrate-amber' : 'border-gray-100'
                    }`}
                  >
                    <div role="img" aria-label={badge.name} className={`text-3xl mb-1 ${isEarned ? '' : 'grayscale opacity-30'}`}>{badge.emoji}</div>
                    <p className={`font-display font-bold text-xs leading-tight ${isEarned ? 'text-focus-800' : 'text-gray-400'}`}>{badge.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{badge.description}</p>
                    {!isEarned && (
                      <div className="absolute top-1 right-1 text-sm opacity-40" aria-label="Locked" role="img">🔒</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
