export interface NavItem {
  to: string;
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
  { to: '/home', label: 'Home', emoji: '🏠' },
  { to: '/practice', label: 'Practise', emoji: '🎯' },
  { to: '/badges', label: 'Badges', emoji: '🏆' },
  { to: '/techniques', label: 'Techniques', emoji: '📖' },
];
