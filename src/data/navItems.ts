import { Home, Target, Trophy, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  emoji: string;
}

/**
 * Primary navigation items shared by BottomNav (mobile) and Header (desktop).
 * Kept to 4 items for a clean, child-friendly layout.
 *
 * Removed from nav:
 * - Visualise: pre-practice tool, accessible from HomePage link
 */
export const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Home', emoji: '🏠' },
  { to: '/practice', icon: Target, label: 'Practise', emoji: '🎯' },
  { to: '/badges', icon: Trophy, label: 'Badges', emoji: '🏆' },
  { to: '/techniques', icon: BookOpen, label: 'Techniques', emoji: '📖' },
];
