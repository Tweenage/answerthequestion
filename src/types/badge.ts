import type { Subject } from './question';

export type BadgeCategory = 'technique' | 'streak' | 'mastery' | 'milestone';

export interface BadgeCondition {
  type: 'streak' | 'technique_score' | 'questions_answered' |
        'subject_mastery' | 'elimination_count' | 'keyword_accuracy' |
        'perfect_session' | 'week_completed';
  threshold: number;
  subject?: Subject;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  emoji: string;
  condition: BadgeCondition;
  tier?: 'bronze' | 'silver' | 'gold';
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
  seen: boolean;
}
