import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@supabase/supabase-js';
import type { User } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthState {
  // Whether the initial session check has completed
  authReady: boolean;

  // Supabase parent session
  parentSession: Session | null;
  setParentSession: (session: Session | null) => void;

  // Password recovery mode — prevents redirect while resetting password
  isPasswordRecovery: boolean;
  setPasswordRecovery: (value: boolean) => void;

  // Child profiles (fetched from Supabase)
  children: User[];
  setChildren: (children: User[]) => void;

  // Selected child
  currentChildId: string | null;
  selectChild: (childId: string) => void;

  // Convenience getter
  currentUser: () => User | null;

  // Legacy compat — keep working for onboarding etc.
  markOnboardingSeen: () => void;
  markTutorialSeen: () => void;
  updateChildLocally: (childId: string, updates: Partial<User>) => void;

  // Auth actions
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authReady: false,
      parentSession: null,
      isPasswordRecovery: false,
      children: [],
      currentChildId: null,

      setPasswordRecovery: (value) => set({ isPasswordRecovery: value }),

      setParentSession: (session) => {
        const prev = get().parentSession;
        set({ parentSession: session, authReady: true });

        if (!session) {
          // Logged out — clear child selection
          set({ children: [], currentChildId: null });
        } else if (prev && prev.user.id !== session.user.id) {
          // Different user logged in — clear stale child selection from previous account
          set({ children: [], currentChildId: null });
        }
      },

      setChildren: (children) => {
        set({ children });
      },

      selectChild: (childId) => {
        set({ currentChildId: childId });
      },

      currentUser: () => {
        const { children, currentChildId } = get();
        return children.find(u => u.id === currentChildId) ?? null;
      },

      markOnboardingSeen: () => {
        const childId = get().currentChildId;
        if (!childId) return;
        // Update Zustand state immediately
        set(state => ({
          children: state.children.map(u =>
            u.id === childId ? { ...u, hasSeenOnboarding: true } : u
          ),
        }));
        // Persist to localStorage as fallback (survives failed Supabase writes)
        try { localStorage.setItem(`atq_onboarding_seen_${childId}`, 'true'); } catch { /* intentional */ }
        // Also update in Supabase
        supabase
          .from('child_profiles')
          .update({ has_seen_onboarding: true })
          .eq('id', childId)
          .then(() => {});
      },

      markTutorialSeen: () => {
        const childId = get().currentChildId;
        if (!childId) return;
        set(state => ({
          children: state.children.map(u =>
            u.id === childId ? { ...u, hasSeenTutorial: true } : u
          ),
        }));
        try { localStorage.setItem(`atq_tutorial_seen_${childId}`, 'true'); } catch { /* intentional */ }
        supabase
          .from('child_profiles')
          .update({ has_seen_tutorial: true })
          .eq('id', childId)
          .then(() => {});
      },

      updateChildLocally: (childId, updates) => {
        set(state => ({
          children: state.children.map(u =>
            u.id === childId ? { ...u, ...updates } : u
          ),
        }));
      },

      logout: () => {
        set({
          parentSession: null,
          children: [],
          currentChildId: null,
          isPasswordRecovery: false,
        });

        // Clear all app-specific localStorage keys for privacy on shared devices
        try {
          localStorage.removeItem('rtq-progress');
          localStorage.removeItem('rtq-settings');
          // Remove any review-prompted flags (atq_review_prompted_week_*)
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('atq_review_prompted_') || key?.startsWith('atq_has_paid_')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch {
          // localStorage may be unavailable in some environments
        }
      },

    }),
    {
      name: 'rtq-auth',
      partialize: (state) => ({
        // Persist child selection AND children array so hasPaid survives refresh
        currentChildId: state.currentChildId,
        children: state.children,
      }),
    }
  )
);
