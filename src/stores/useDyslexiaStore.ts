import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DyslexiaState {
  /** Map of childId -> dyslexia mode enabled */
  enabledByChild: Record<string, boolean>;
  /** Check if dyslexia mode is on for a given child */
  isDyslexiaMode: (childId: string) => boolean;
  /** Toggle dyslexia mode for a given child */
  toggleDyslexiaMode: (childId: string) => void;
}

export const useDyslexiaStore = create<DyslexiaState>()(
  persist(
    (set, get) => ({
      enabledByChild: {},

      isDyslexiaMode: (childId: string) => {
        return get().enabledByChild[childId] ?? false;
      },

      toggleDyslexiaMode: (childId: string) => {
        set(state => ({
          enabledByChild: {
            ...state.enabledByChild,
            [childId]: !(state.enabledByChild[childId] ?? false),
          },
        }));
      },
    }),
    {
      name: 'rtq-dyslexia',
    }
  )
);
