import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WordProgress, SpellingSessionRecord } from '../types/spelling';
import type { SM2State } from '../utils/sm2';
import { applyReview, createInitialSM2State, isDueForReview } from '../utils/sm2';
import { calculateStars } from '../utils/stars';
import { supabase } from '../lib/supabase';
import { showSyncToast } from '../components/SyncToast';
import { SPELLING_WORDS } from '../data/words';

const syncError = () => showSyncToast('Progress saved locally — cloud sync failed', 'error');

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
}

interface ChildSpellingData {
  wordProgress: Record<string, WordProgress>;
  sessions: SpellingSessionRecord[];
  streak: StreakData;
  settings: {
    ritualEnabled: boolean;
  };
}

function createEmptyChildData(): ChildSpellingData {
  return {
    wordProgress: {},
    sessions: [],
    streak: { currentStreak: 0, longestStreak: 0, lastSessionDate: null },
    settings: { ritualEnabled: true },
  };
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

interface SpellingProgressState {
  dataByChild: Record<string, ChildSpellingData>;

  getData: (childId: string) => ChildSpellingData;
  getWordProgress: (childId: string, wordId: string) => WordProgress;
  getDueWords: (childId: string, today: string) => WordProgress[];
  getNewWords: (childId: string, count: number) => string[];

  recordAnswer: (childId: string, wordId: string, grade: number, today: string, sessionId?: string) => void;
  saveSession: (childId: string, session: SpellingSessionRecord) => void;
  updateStreak: (childId: string, date: string) => void;
  getWordsByStars: (childId: string, stars: 0 | 1 | 2 | 3) => string[];

  toggleRitual: (childId: string) => void;
  getRitualEnabled: (childId: string) => boolean;

  fetchFromSupabase: (childId: string) => Promise<void>;
  syncToSupabase: (childId: string) => Promise<void>;
}

async function pushWordProgressToSupabase(childId: string, wp: WordProgress) {
  const { error } = await supabase
    .from('spelling_progress')
    .upsert({
      child_id: childId,
      word_id: wp.wordId,
      sm2_ease_factor: wp.sm2.easeFactor,
      sm2_interval: wp.sm2.interval,
      sm2_repetitions: wp.sm2.repetitions,
      sm2_next_review_date: wp.sm2.nextReviewDate,
      sm2_mastery_score: wp.sm2.masteryScore,
      times_attempted: wp.timesAttempted,
      times_correct: wp.timesCorrect,
      stars: wp.stars,
      correct_sessions: wp.correctSessions,
      last_session_id: wp.lastSessionId ?? null,
      last_seen_date: wp.lastSeenDate,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'child_id,word_id' });
  if (error) throw new Error(error.message);
}

async function pushSessionToSupabase(childId: string, session: SpellingSessionRecord) {
  const { error } = await supabase
    .from('spelling_sessions')
    .insert({
      id: session.id,
      child_id: childId,
      date: session.date,
      words_studied: session.wordsStudied,
      correct: session.correct,
      total: session.total,
      completed: session.completed,
      duration_ms: session.durationMs,
    });
  if (error) throw new Error(error.message);
}

export const useSpellingProgressStore = create<SpellingProgressState>()(
  persist(
    (set, get) => ({
      dataByChild: {},

      getData: (childId) => get().dataByChild[childId] ?? createEmptyChildData(),

      getWordProgress: (childId, wordId) => {
        const data = get().getData(childId);
        const today = new Date().toISOString().split('T')[0];
        const initial: SM2State = createInitialSM2State(today);
        return data.wordProgress[wordId] ?? {
          wordId,
          sm2: initial,
          lastSeenDate: null,
          timesAttempted: 0,
          timesCorrect: 0,
          stars: 0,
          correctSessions: 0,
        };
      },

      getDueWords: (childId, today) => {
        const data = get().getData(childId);
        return Object.values(data.wordProgress).filter(
          wp => wp.timesAttempted > 0 && isDueForReview(wp.sm2, today)
        );
      },

      getNewWords: (childId, count) => {
        const data = get().getData(childId);
        const seen = new Set(Object.keys(data.wordProgress));
        return SPELLING_WORDS
          .filter(w => !seen.has(w.id))
          .slice(0, count)
          .map(w => w.id);
      },

      recordAnswer: (childId, wordId, grade, today, sessionId?) => {
        set(state => {
          const data = state.dataByChild[childId] ?? createEmptyChildData();
          const existing = data.wordProgress[wordId];
          const currentSM2: SM2State = existing?.sm2 ?? createInitialSM2State(today);
          const newSM2 = applyReview(currentSM2, grade, today);

          // Track correct sessions — only increment when session ID differs
          const isCorrect = grade >= 3;
          const isNewSession = sessionId ? (existing?.lastSessionId !== sessionId) : true;
          const newCorrectSessions = isCorrect && isNewSession
            ? (existing?.correctSessions ?? 0) + 1
            : (existing?.correctSessions ?? 0);

          const newStars = calculateStars({
            totalAttempts: (existing?.timesAttempted ?? 0) + 1,
            totalCorrectSessions: newCorrectSessions,
            intervalDays: newSM2.interval,
          });

          const updated: WordProgress = {
            wordId,
            sm2: newSM2,
            lastSeenDate: today,
            timesAttempted: (existing?.timesAttempted ?? 0) + 1,
            timesCorrect: (existing?.timesCorrect ?? 0) + (isCorrect ? 1 : 0),
            stars: newStars,
            correctSessions: newCorrectSessions,
            lastSessionId: sessionId ?? existing?.lastSessionId,
          };
          return {
            dataByChild: {
              ...state.dataByChild,
              [childId]: {
                ...data,
                wordProgress: { ...data.wordProgress, [wordId]: updated },
              },
            },
          };
        });
        const wp = get().dataByChild[childId]?.wordProgress[wordId];
        if (wp) pushWordProgressToSupabase(childId, wp).catch(syncError);
      },

      saveSession: (childId, session) => {
        set(state => {
          const data = state.dataByChild[childId] ?? createEmptyChildData();
          if (data.sessions.some(s => s.id === session.id)) return state;
          return {
            dataByChild: {
              ...state.dataByChild,
              [childId]: { ...data, sessions: [...data.sessions, session] },
            },
          };
        });
        pushSessionToSupabase(childId, session).catch(syncError);
      },

      updateStreak: (childId, date) => {
        set(state => {
          const data = state.dataByChild[childId] ?? createEmptyChildData();
          const streak = { ...data.streak };
          if (streak.lastSessionDate === date) return state;
          const yesterday = addDays(date, -1);
          if (streak.lastSessionDate === yesterday) {
            streak.currentStreak += 1;
          } else {
            streak.currentStreak = 1;
          }
          streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
          streak.lastSessionDate = date;
          return {
            dataByChild: {
              ...state.dataByChild,
              [childId]: { ...data, streak },
            },
          };
        });
      },

      getWordsByStars: (childId, stars) => {
        const data = get().getData(childId);
        return Object.entries(data.wordProgress)
          .filter(([_, wp]) => wp.stars === stars)
          .map(([wordId]) => wordId);
      },

      toggleRitual: (childId) => {
        set(state => {
          const data = state.dataByChild[childId] ?? createEmptyChildData();
          return {
            dataByChild: {
              ...state.dataByChild,
              [childId]: {
                ...data,
                settings: { ...data.settings, ritualEnabled: !data.settings.ritualEnabled },
              },
            },
          };
        });
      },

      getRitualEnabled: (childId) => {
        return get().getData(childId).settings?.ritualEnabled ?? true;
      },

      fetchFromSupabase: async (childId) => {
        try {
          // Fetch spelling_progress rows
          const { data: progressRows, error: progressError } = await supabase
            .from('spelling_progress')
            .select('*')
            .eq('child_id', childId);

          if (progressError) throw progressError;

          // Fetch spelling_sessions rows
          const { data: sessionRows, error: sessionError } = await supabase
            .from('spelling_sessions')
            .select('*')
            .eq('child_id', childId);

          if (sessionError) throw sessionError;

          // Merge: for each remote word, keep whichever has more timesAttempted
          set(state => {
            const child = state.dataByChild[childId] ?? createEmptyChildData();
            const merged = { ...child.wordProgress };

            for (const row of (progressRows ?? [])) {
              const local = merged[row.word_id];
              const remoteTimes = row.times_attempted ?? 0;
              if (!local || remoteTimes > local.timesAttempted) {
                merged[row.word_id] = {
                  wordId: row.word_id,
                  sm2: {
                    interval: row.sm2_interval,
                    repetitions: row.sm2_repetitions,
                    easeFactor: row.sm2_ease_factor,
                    nextReviewDate: row.sm2_next_review_date,
                    masteryScore: row.sm2_mastery_score,
                  },
                  lastSeenDate: row.last_seen_date,
                  timesAttempted: row.times_attempted,
                  timesCorrect: row.times_correct,
                  stars: (row.stars ?? 0) as 0 | 1 | 2 | 3,
                  correctSessions: row.correct_sessions ?? 0,
                  lastSessionId: row.last_session_id ?? undefined,
                };
              }
            }

            // Merge sessions: union by id
            const localSessions = child.sessions;
            const remoteIds = new Set((sessionRows ?? []).map((s: any) => s.id));
            const localIds = new Set(localSessions.map(s => s.id));
            const remoteSessions = (sessionRows ?? [])
              .filter((s: any) => !localIds.has(s.id))
              .map((s: any) => ({
                id: s.id,
                date: s.date,
                wordsStudied: s.words_studied ?? [],
                correct: s.correct,
                total: s.total,
                completed: s.completed,
                durationMs: s.duration_ms,
              }));
            const mergedSessions = [
              ...localSessions.filter(s => !remoteIds.has(s.id)),
              ...localSessions.filter(s => remoteIds.has(s.id)), // local wins for overlapping
              ...remoteSessions,
            ];

            return {
              dataByChild: {
                ...state.dataByChild,
                [childId]: {
                  ...child,
                  wordProgress: merged,
                  sessions: mergedSessions,
                },
              },
            };
          });
        } catch (err) {
          console.error('[ATQ Spelling] fetchFromSupabase error:', err);
        }
      },

      syncToSupabase: async (childId) => {
        try {
          const child = get().dataByChild[childId];
          if (!child) return;

          const progressRows = Object.values(child.wordProgress).map(wp => ({
            child_id: childId,
            word_id: wp.wordId,
            sm2_ease_factor: wp.sm2.easeFactor,
            sm2_interval: wp.sm2.interval,
            sm2_repetitions: wp.sm2.repetitions,
            sm2_next_review_date: wp.sm2.nextReviewDate,
            sm2_mastery_score: wp.sm2.masteryScore,
            times_attempted: wp.timesAttempted,
            times_correct: wp.timesCorrect,
            stars: wp.stars,
            correct_sessions: wp.correctSessions,
            last_session_id: wp.lastSessionId ?? null,
            last_seen_date: wp.lastSeenDate,
            updated_at: new Date().toISOString(),
          }));

          if (progressRows.length > 0) {
            const { error } = await supabase
              .from('spelling_progress')
              .upsert(progressRows, { onConflict: 'child_id,word_id' });
            if (error) throw error;
          }

          const sessionRows = child.sessions.map(s => ({
            id: s.id,
            child_id: childId,
            date: s.date,
            words_studied: s.wordsStudied,
            correct: s.correct,
            total: s.total,
            completed: s.completed,
            duration_ms: s.durationMs,
          }));

          if (sessionRows.length > 0) {
            const { error } = await supabase
              .from('spelling_sessions')
              .upsert(sessionRows, { onConflict: 'id' });
            if (error) throw error;
          }
        } catch (err) {
          console.error('[ATQ Spelling] syncToSupabase error:', err);
        }
      },
    }),
    { name: 'atq-spelling-progress' }
  )
);
