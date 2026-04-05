export interface NavItem {
  to: string;
  label: string;
  emoji: string;
}

export const navItems: NavItem[] = [
  { to: '/home', label: 'Home', emoji: '🏠' },
  { to: '/test', label: 'Test', emoji: '✏️' },
  { to: '/bingo', label: 'Grid', emoji: '📊' },
  { to: '/progress', label: 'Progress', emoji: '⭐' },
];
