import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  examDate: string | null;
  setExamDate: (date: string | null) => void;

  techniquesViewMode: 'child' | 'parent';
  setTechniquesViewMode: (mode: 'child' | 'parent') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      examDate: null,
      setExamDate: (date) => set({ examDate: date }),

      techniquesViewMode: 'child',
      setTechniquesViewMode: (mode) => set({ techniquesViewMode: mode }),
    }),
    {
      name: 'rtq-settings',
    }
  )
);
