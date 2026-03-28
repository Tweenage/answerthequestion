import type { ExamBoard } from '../data/programme/examBoardPresets';

export type { ExamBoard };

export interface AvatarConfig {
  baseCharacter: string;
  colour: string;
  accessories: string[];
  background: string;
}

export interface User {
  id: string;
  name: string;
  avatar: AvatarConfig;
  createdAt: string;
  programmeStartDate: string;
  hasSeenOnboarding: boolean;
  hasSeenTutorial?: boolean;
  hasPaid?: boolean;
  referralCode?: string;
  examDate?: string | null;
  examBoard?: ExamBoard;
}

export const AVATAR_CHARACTERS = ['cat', 'owl', 'robot', 'unicorn', 'dragon', 'fox'] as const;

export const AVATAR_COLOURS = [
  '#3b82f6', '#22c55e', '#f97316', '#8b5cf6',
  '#ef4444', '#eab308', '#f472b6', '#06b6d4',
] as const;

export const AVATAR_BACKGROUNDS = [
  'bg-focus-100', 'bg-calm-100', 'bg-purple-100',
  'bg-orange-100', 'bg-pink-100', 'bg-cyan-100',
] as const;
