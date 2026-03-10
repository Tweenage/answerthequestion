import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@supabase/supabase-js';
import type { User } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthState {
  // Supabase parent session
  parentSession: Session | null;
  setParentSession: (session: Session | null) => void;

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
      parentSession: null,
      children: [],
      currentChildId: null,

      setParentSession: (session) => {
        set({ parentSession: session });
        // Clear child selection on logout
        if (!session) {
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
        set(state => ({
          children: state.children.map(u =>
            u.id === childId ? { ...u, hasSeenOnboarding: true } : u
          ),
        }));
        // Also update in Supabase (fire-and-forget)
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
        });
      },

    }),
    {
      name: 'rtq-auth',
      partialize: (state) => ({
        // Only persist the child selection, not the session (Supabase handles that)
        currentChildId: state.currentChildId,
      }),
    }
  )
);
