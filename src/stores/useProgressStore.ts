import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Subject } from '../types/question';
import type { DailySession, QuestionResult, StreakData, SubjectProgress, UserProgress, MistakeQueueItem, CategoryMastery } from '../types/progress';
import type { EarnedBadge } from '../types/badge';
import { supabase } from '../lib/supabase';
import { showSyncToast } from '../components/SyncToast';

const syncError = () => showSyncToast('Progress saved locally — cloud sync failed', 'error');

const createEmptySubjectProgress = (): SubjectProgress => ({
  questionsAttempted: 0,
  questionsCorrect: 0,
  averageTechniqueScore: 0,
  averageTimeMs: 0,
});

// Migrate old VR/NVR subject scores to 'reasoning' for users who had progress before the merge
const migrateSubjectScores = (scores: Record<string, SubjectProgress>): Record<Subject, SubjectProgress> => {
  const result: Record<Subject, SubjectProgress> = {
    english: scores['english'] ?? createEmptySubjectProgress(),
    maths: scores['maths'] ?? createEmptySubjectProgress(),
    reasoning: scores['reasoning'] ?? createEmptySubjectProgress(),
  };
  // Merge old VR + NVR into reasoning if they exist
  const vr = scores['verbal-reasoning'];
  const nvr = scores['non-verbal-reasoning'];
  if ((vr || nvr) && !scores['reasoning']) {
    const vrAttempted = vr?.questionsAttempted ?? 0;
    const nvrAttempted = nvr?.questionsAttempted ?? 0;
    const totalAttempted = vrAttempted + nvrAttempted;
    result.reasoning = {
      questionsAttempted: totalAttempted,
      questionsCorrect: (vr?.questionsCorrect ?? 0) + (nvr?.questionsCorrect ?? 0),
      averageTechniqueScore: totalAttempted > 0
        ? Math.round(((vr?.averageTechniqueScore ?? 0) * vrAttempted + (nvr?.averageTechniqueScore ?? 0) * nvrAttempted) / totalAttempted)
        : 0,
      averageTimeMs: totalAttempted > 0
        ? Math.round(((vr?.averageTimeMs ?? 0) * vrAttempted + (nvr?.averageTimeMs ?? 0) * nvrAttempted) / totalAttempted)
        : 0,
    };
  }
  return result;
};

const createEmptyProgress = (userId: string): UserProgress => ({
  userId,
  currentWeek: 1,
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    freezesAvailable: 3,
    freezesUsed: [],
  },
  sessions: [],
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  averageTechniqueScore: 0,
  subjectScores: {
    'english': createEmptySubjectProgress(),
    'maths': createEmptySubjectProgress(),
    'reasoning': createEmptySubjectProgress(),
  },
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  mistakeQueue: [],
  dailyChallenge: { lastCompletedDate: null, streak: 0, totalCompleted: 0, totalCorrect: 0 },
  mockExams: { totalAttempted: 0, bestScore: 0, lastAttemptDate: null },
  categoryMastery: {},
});

interface ProgressState {
  progressByUser: Record<string, UserProgress>;
  badgesByUser: Record<string, EarnedBadge[]>;

  getProgress: (userId: string) => UserProgress;
  getBadges: (userId: string) => EarnedBadge[];

  saveSession: (userId: string, session: DailySession) => void;
  updateStreak: (userId: string, date: string) => void;
  addXp: (userId: string, amount: number) => void;
  earnBadge: (userId: string, badgeId: string) => void;
  markBadgeSeen: (userId: string, badgeId: string) => void;
  updateWeek: (userId: string, week: number) => void;
  addToMistakeQueue: (userId: string, questionId: string) => void;
  updateMistakeQueue: (userId: string, questionId: string, gotCorrect: boolean) => void;
  completeDailyChallenge: (userId: string, date: string, correct: boolean, xpEarned: number) => void;
  saveMockExam: (userId: string, score: number, date: string) => void;
  updateCategoryMastery: (childId: string, category: string, correct: boolean) => void;

  // Supabase sync
  syncProgressToSupabase: (userId: string) => Promise<void>;
  syncBadgesToSupabase: (userId: string) => Promise<void>;
  fetchProgressFromSupabase: (userId: string) => Promise<void>;
  fetchBadgesFromSupabase: (userId: string) => Promise<void>;
}

// ---- Supabase sync helpers (fire-and-forget) ----

async function pushProgressToSupabase(progress: UserProgress) {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      child_id: progress.userId,
      current_week: progress.currentWeek,
      streak: progress.streak,
      total_questions_answered: progress.totalQuestionsAnswered,
      total_correct: progress.totalCorrect,
      average_technique_score: progress.averageTechniqueScore,
      subject_scores: progress.subjectScores,
      level: progress.level,
      xp: progress.xp,
      xp_to_next_level: progress.xpToNextLevel,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'child_id' });

  if (error) console.warn('Failed to sync progress to Supabase:', error.message);
}

async function pushSessionToSupabase(userId: string, session: DailySession) {
  // Insert the daily session
  const { data: sessionData, error: sessionError } = await supabase
    .from('daily_sessions')
    .insert({
      child_id: userId,
      date: session.date,
      average_technique_score: session.averageTechniqueScore,
      average_correctness: session.averageCorrectness,
      total_time_ms: session.totalTimeMs,
      completed: session.completed,
    })
    .select('id')
    .single();

  if (sessionError) {
    console.warn('Failed to sync session to Supabase:', sessionError.message);
    return;
  }

  // Insert all question results for this session
  if (session.questions.length > 0 && sessionData) {
    const questionRows = session.questions.map(q => ({
      session_id: sessionData.id,
      child_id: userId,
      question_id: q.questionId,
      subject: q.subject,
      correct: q.correct,
      technique_score: q.techniqueScore,
      reading_time_ms: q.readingTimeMs,
      total_time_ms: q.totalTimeMs,
      highlighted_word_indices: q.highlightedWordIndices,
      eliminated_option_indices: q.eliminatedOptionIndices,
      selected_option_index: q.selectedOptionIndex,
      timestamp: q.timestamp,
    }));

    const { error: qError } = await supabase
      .from('question_results')
      .insert(questionRows);

    if (qError) console.warn('Failed to sync question results:', qError.message);
  }
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progressByUser: {},
      badgesByUser: {},

      getProgress: (userId) => {
        const p = get().progressByUser[userId] ?? createEmptyProgress(userId);
        // Ensure subjectScores has 'reasoning' (migrates old VR/NVR data)
        if (!p.subjectScores['reasoning'] || (p.subjectScores as Record<string, SubjectProgress>)['verbal-reasoning']) {
          p.subjectScores = migrateSubjectScores(p.subjectScores as Record<string, SubjectProgress>);
        }
        // Ensure categoryMastery exists for users who had progress before this field was added
        if (!p.categoryMastery) {
          p.categoryMastery = {};
        }
        return p;
      },

      getBadges: (userId) => {
        return get().badgesByUser[userId] ?? [];
      },

      saveSession: (userId, session) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);

          // Prevent duplicate sessions on the same date
          if (progress.sessions.some(s => s.date === session.date && s.completed)) {
            return state;
          }

          const newSessions = [...progress.sessions, session];

          const totalAnswered = progress.totalQuestionsAnswered + session.questions.length;
          const totalCorrect = progress.totalCorrect + session.questions.filter(q => q.correct).length;
          const allTechniqueScores = newSessions.map(s => s.averageTechniqueScore);
          const avgTechnique = allTechniqueScores.reduce((a, b) => a + b, 0) / allTechniqueScores.length;

          // Update subject scores
          const subjectScores = { ...progress.subjectScores };
          for (const result of session.questions) {
            const subj = subjectScores[result.subject];
            const newAttempted = subj.questionsAttempted + 1;
            const newCorrect = subj.questionsCorrect + (result.correct ? 1 : 0);
            const newAvgTechnique = (subj.averageTechniqueScore * subj.questionsAttempted + result.techniqueScore.overallTechniquePercent) / newAttempted;
            const newAvgTime = (subj.averageTimeMs * subj.questionsAttempted + result.totalTimeMs) / newAttempted;

            subjectScores[result.subject] = {
              questionsAttempted: newAttempted,
              questionsCorrect: newCorrect,
              averageTechniqueScore: Math.round(newAvgTechnique),
              averageTimeMs: Math.round(newAvgTime),
            };
          }

          // Auto-advance week: every 7 completed sessions = 1 week, capped at 12
          const completedSessions = newSessions.filter(s => s.completed).length;
          const calculatedWeek = Math.min(Math.floor(completedSessions / 7) + 1, 12);

          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: {
                ...progress,
                sessions: newSessions,
                totalQuestionsAnswered: totalAnswered,
                totalCorrect: totalCorrect,
                averageTechniqueScore: Math.round(avgTechnique),
                subjectScores,
                currentWeek: Math.max(progress.currentWeek, calculatedWeek),
              },
            },
          };
        });

        // Background sync to Supabase
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) {
          pushProgressToSupabase(updatedProgress).catch(syncError);
          pushSessionToSupabase(userId, session).catch(syncError);
        }
      },

      updateStreak: (userId, date) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          const streak = { ...progress.streak };
          const lastDate = streak.lastPracticeDate;

          if (lastDate === date) return state; // Already practised today

          const yesterday = new Date(date);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate === yesterdayStr) {
            streak.currentStreak += 1;
          } else if (lastDate && lastDate !== date) {
            // Check if a freeze can cover the gap
            const missedDate = yesterdayStr;
            if (streak.freezesAvailable > 0 && lastDate === new Date(new Date(date).setDate(new Date(date).getDate() - 2)).toISOString().split('T')[0]) {
              streak.freezesAvailable -= 1;
              streak.freezesUsed.push(missedDate);
              streak.currentStreak += 1;
            } else {
              streak.currentStreak = 1;
            }
          } else {
            streak.currentStreak = 1;
          }

          streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
          streak.lastPracticeDate = date;

          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: { ...progress, streak },
            },
          };
        });

        // Background sync
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      addXp: (userId, amount) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          let newXp = progress.xp + amount;
          let newLevel = progress.level;
          let xpToNext = progress.xpToNextLevel;

          while (newXp >= xpToNext) {
            newXp -= xpToNext;
            newLevel += 1;
            xpToNext = Math.round(xpToNext * 1.2); // Each level requires 20% more XP
          }

          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: { ...progress, xp: newXp, level: newLevel, xpToNextLevel: xpToNext },
            },
          };
        });

        // Background sync
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      earnBadge: (userId, badgeId) => {
        set(state => {
          const existing = state.badgesByUser[userId] ?? [];
          if (existing.some(b => b.badgeId === badgeId)) return state;

          return {
            badgesByUser: {
              ...state.badgesByUser,
              [userId]: [...existing, { badgeId, earnedAt: new Date().toISOString(), seen: false }],
            },
          };
        });

        // Sync badge to Supabase
        supabase
          .from('earned_badges')
          .upsert({ child_id: userId, badge_id: badgeId }, { onConflict: 'child_id,badge_id' })
          .then(({ error }) => {
            if (error) console.warn('Failed to sync badge:', error.message);
          });
      },

      markBadgeSeen: (userId, badgeId) => {
        set(state => {
          const existing = state.badgesByUser[userId] ?? [];
          return {
            badgesByUser: {
              ...state.badgesByUser,
              [userId]: existing.map(b => b.badgeId === badgeId ? { ...b, seen: true } : b),
            },
          };
        });

        // Sync to Supabase
        supabase
          .from('earned_badges')
          .update({ seen: true })
          .match({ child_id: userId, badge_id: badgeId })
          .then(({ error }) => {
            if (error) console.warn('Failed to sync badge seen:', error.message);
          });
      },

      updateWeek: (userId, week) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: { ...progress, currentWeek: week },
            },
          };
        });

        // Background sync
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      addToMistakeQueue: (userId, questionId) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          const queue = progress.mistakeQueue ?? [];
          if (queue.some(m => m.questionId === questionId)) return state;
          const today = new Date().toISOString().split('T')[0];
          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: {
                ...progress,
                mistakeQueue: [...queue, {
                  questionId,
                  firstWrongDate: today,
                  lastSeenDate: today,
                  interval: 1,
                  timesWrong: 1,
                }],
              },
            },
          };
        });
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      updateMistakeQueue: (userId, questionId, gotCorrect) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          const queue = (progress.mistakeQueue ?? []).map(m => {
            if (m.questionId !== questionId) return m;
            const today = new Date().toISOString().split('T')[0];
            if (gotCorrect) {
              const newInterval = m.interval * 2;
              if (newInterval >= 16) return null; // Remove — mastered
              return { ...m, interval: newInterval, lastSeenDate: today };
            }
            return { ...m, interval: 1, lastSeenDate: today, timesWrong: m.timesWrong + 1 };
          }).filter(Boolean) as MistakeQueueItem[];
          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: { ...progress, mistakeQueue: queue },
            },
          };
        });
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      completeDailyChallenge: (userId, date, correct, xpEarned) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          const dc = progress.dailyChallenge ?? { lastCompletedDate: null, streak: 0, totalCompleted: 0, totalCorrect: 0 };
          const yesterday = new Date(date);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          const newStreak = dc.lastCompletedDate === yesterdayStr ? dc.streak + 1 : 1;
          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: {
                ...progress,
                dailyChallenge: {
                  lastCompletedDate: date,
                  streak: newStreak,
                  totalCompleted: dc.totalCompleted + 1,
                  totalCorrect: dc.totalCorrect + (correct ? 1 : 0),
                },
              },
            },
          };
        });
        // Also add XP
        get().addXp(userId, xpEarned);
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      saveMockExam: (userId, score, date) => {
        set(state => {
          const progress = state.progressByUser[userId] ?? createEmptyProgress(userId);
          const me = progress.mockExams ?? { totalAttempted: 0, bestScore: 0, lastAttemptDate: null };
          return {
            progressByUser: {
              ...state.progressByUser,
              [userId]: {
                ...progress,
                mockExams: {
                  totalAttempted: me.totalAttempted + 1,
                  bestScore: Math.max(me.bestScore, score),
                  lastAttemptDate: date,
                },
              },
            },
          };
        });
        const updatedProgress = get().progressByUser[userId];
        if (updatedProgress) pushProgressToSupabase(updatedProgress).catch(syncError);
      },

      updateCategoryMastery: (childId, category, correct) => {
        set(state => {
          const progress = state.progressByUser[childId];
          if (!progress) return state;
          const existing = progress.categoryMastery[category] ?? { recentAttempts: [], lastSeenDate: '' };
          const recentAttempts = [...existing.recentAttempts, correct].slice(-10);
          return {
            progressByUser: {
              ...state.progressByUser,
              [childId]: {
                ...progress,
                categoryMastery: {
                  ...progress.categoryMastery,
                  [category]: { recentAttempts, lastSeenDate: new Date().toISOString().split('T')[0] },
                },
              },
            },
          };
        });
      },

      // ---- Supabase fetch/sync methods ----

      syncProgressToSupabase: async (userId) => {
        const progress = get().progressByUser[userId];
        if (progress) await pushProgressToSupabase(progress);
      },

      syncBadgesToSupabase: async (userId) => {
        const badges = get().badgesByUser[userId] ?? [];
        for (const badge of badges) {
          await supabase
            .from('earned_badges')
            .upsert(
              { child_id: userId, badge_id: badge.badgeId, earned_at: badge.earnedAt, seen: badge.seen },
              { onConflict: 'child_id,badge_id' }
            );
        }
      },

      fetchProgressFromSupabase: async (userId) => {
        try {
          // Fetch aggregate progress
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('child_id', userId)
            .maybeSingle();

          // Fetch sessions
          const { data: sessionsData } = await supabase
            .from('daily_sessions')
            .select('*')
            .eq('child_id', userId)
            .order('created_at', { ascending: true });

          // Fetch question results for all sessions
          const sessionIds = (sessionsData ?? []).map(s => s.id);
          const questionResults: Record<string, QuestionResult[]> = {};

          if (sessionIds.length > 0) {
            const { data: resultsData } = await supabase
              .from('question_results')
              .select('*')
              .in('session_id', sessionIds);

            for (const r of (resultsData ?? [])) {
              if (!questionResults[r.session_id]) questionResults[r.session_id] = [];
              questionResults[r.session_id].push({
                questionId: r.question_id,
                subject: r.subject as Subject,
                correct: r.correct,
                techniqueScore: r.technique_score,
                readingTimeMs: r.reading_time_ms,
                totalTimeMs: r.total_time_ms,
                highlightedWordIndices: r.highlighted_word_indices ?? [],
                eliminatedOptionIndices: r.eliminated_option_indices ?? [],
                selectedOptionIndex: r.selected_option_index,
                timestamp: r.timestamp,
              });
            }
          }

          // Reconstruct sessions with their questions
          const sessions: DailySession[] = (sessionsData ?? []).map(s => ({
            date: s.date,
            questions: questionResults[s.id] ?? [],
            averageTechniqueScore: s.average_technique_score,
            averageCorrectness: s.average_correctness,
            totalTimeMs: s.total_time_ms,
            completed: s.completed,
          }));

          const localProgress = get().progressByUser[userId];
          const remoteProgress: UserProgress | null = progressData ? {
            userId,
            currentWeek: progressData.current_week,
            streak: progressData.streak as StreakData,
            sessions,
            totalQuestionsAnswered: progressData.total_questions_answered,
            totalCorrect: progressData.total_correct,
            averageTechniqueScore: progressData.average_technique_score,
            subjectScores: migrateSubjectScores(progressData.subject_scores as Record<string, SubjectProgress>),
            level: progressData.level,
            xp: progressData.xp,
            xpToNextLevel: progressData.xp_to_next_level,
            mistakeQueue: (progressData as Record<string, unknown>).mistake_queue as MistakeQueueItem[] ?? [],
            dailyChallenge: (progressData as Record<string, unknown>).daily_challenge as UserProgress['dailyChallenge'] ?? { lastCompletedDate: null, streak: 0, totalCompleted: 0, totalCorrect: 0 },
            mockExams: (progressData as Record<string, unknown>).mock_exams as UserProgress['mockExams'] ?? { totalAttempted: 0, bestScore: 0, lastAttemptDate: null },
            // categoryMastery is local-only (not stored in Supabase); preserve local data when merging
            categoryMastery: (get().progressByUser[userId]?.categoryMastery ?? {}) as CategoryMastery,
          } : null;

          // Merge: use whichever has more data
          let merged: UserProgress;
          if (!remoteProgress) {
            merged = localProgress ?? createEmptyProgress(userId);
          } else if (!localProgress) {
            merged = remoteProgress;
          } else {
            // Take the one with more questions answered
            merged = remoteProgress.totalQuestionsAnswered >= localProgress.totalQuestionsAnswered
              ? remoteProgress
              : localProgress;
          }

          set(state => ({
            progressByUser: {
              ...state.progressByUser,
              [userId]: merged,
            },
          }));
        } catch (err) {
          console.warn('Failed to fetch progress from Supabase:', err);
        }
      },

      fetchBadgesFromSupabase: async (userId) => {
        try {
          const { data } = await supabase
            .from('earned_badges')
            .select('*')
            .eq('child_id', userId);

          const remoteBadges: EarnedBadge[] = (data ?? []).map(b => ({
            badgeId: b.badge_id,
            earnedAt: b.earned_at,
            seen: b.seen,
          }));

          const localBadges = get().badgesByUser[userId] ?? [];

          // Merge: union of both sets (by badgeId)
          const badgeMap = new Map<string, EarnedBadge>();
          for (const b of localBadges) badgeMap.set(b.badgeId, b);
          for (const b of remoteBadges) badgeMap.set(b.badgeId, b); // remote wins for dupes

          set(state => ({
            badgesByUser: {
              ...state.badgesByUser,
              [userId]: Array.from(badgeMap.values()),
            },
          }));
        } catch (err) {
          console.warn('Failed to fetch badges from Supabase:', err);
        }
      },
    }),
    {
      name: 'rtq-progress',
    }
  )
);
