import type { DailySession, SubjectProgress, StreakData } from '../types/progress';
import type { Subject } from '../types/question';

export interface WeeklyAnalysis {
  sessionsThisWeek: number;
  sessionsLastWeek: number;
  techniqueThisWeek: number;
  techniqueLastWeek: number;
  techniqueTrend: 'up' | 'down' | 'same';
  totalQuestionsThisWeek: number;
  weakestSubject: Subject | null;
  strongestSubject: Subject | null;
  recommendations: string[];
  streakCalendar: { date: string; status: 'practised' | 'missed' | 'freeze' | 'future' }[];
  recentSessions: DailySession[];
}

export function analyzeWeeklyProgress(
  sessions: DailySession[],
  subjectScores: Record<Subject, SubjectProgress>,
  streak: StreakData,
): WeeklyAnalysis {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Last 7 days and previous 7 days
  const last7 = sessions.filter(s => {
    const d = new Date(s.date);
    const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && s.completed;
  });
  const prev7 = sessions.filter(s => {
    const d = new Date(s.date);
    const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7 && diff <= 14 && s.completed;
  });

  const techniqueThisWeek = last7.length > 0
    ? Math.round(last7.reduce((s, sess) => s + sess.averageTechniqueScore, 0) / last7.length)
    : 0;
  const techniqueLastWeek = prev7.length > 0
    ? Math.round(prev7.reduce((s, sess) => s + sess.averageTechniqueScore, 0) / prev7.length)
    : 0;

  const techniqueTrend = techniqueThisWeek > techniqueLastWeek + 2 ? 'up'
    : techniqueThisWeek < techniqueLastWeek - 2 ? 'down' : 'same';

  // Subject analysis
  const subjects: Subject[] = ['english', 'maths', 'verbal-reasoning', 'non-verbal-reasoning'];
  let weakest: Subject | null = null;
  let weakestScore = Infinity;
  let strongest: Subject | null = null;
  let strongestScore = -1;

  for (const subj of subjects) {
    const s = subjectScores[subj];
    if (s.questionsAttempted === 0) continue;
    const accuracy = s.questionsCorrect / s.questionsAttempted;
    if (accuracy < weakestScore) { weakestScore = accuracy; weakest = subj; }
    if (accuracy > strongestScore) { strongestScore = accuracy; strongest = subj; }
  }

  // Recommendations
  const recommendations: string[] = [];
  if (last7.length < prev7.length && prev7.length > 0) {
    recommendations.push(`Practice sessions dropped from ${prev7.length} to ${last7.length} this week. Try to practise every day!`);
  }
  if (techniqueTrend === 'down') {
    recommendations.push(`Technique scores dipped this week. Focus on reading twice and highlighting keywords.`);
  }
  if (weakest && weakestScore < 0.6) {
    const labels: Record<Subject, string> = {
      'english': 'English', 'maths': 'Maths',
      'verbal-reasoning': 'Verbal Reasoning', 'non-verbal-reasoning': 'Non-Verbal Reasoning'
    };
    recommendations.push(`${labels[weakest]} needs attention (${Math.round(weakestScore * 100)}% accuracy). Try a focused session!`);
  }
  if (recommendations.length === 0) {
    recommendations.push('Great consistency! Keep up the daily practice to stay on track.');
  }

  // Streak calendar — last 28 days
  const freezeSet = new Set(streak.freezesUsed);
  const sessionDates = new Set(sessions.filter(s => s.completed).map(s => s.date));
  const calendar: WeeklyAnalysis['streakCalendar'] = [];

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    if (dateStr > todayStr) {
      calendar.push({ date: dateStr, status: 'future' });
    } else if (sessionDates.has(dateStr)) {
      calendar.push({ date: dateStr, status: 'practised' });
    } else if (freezeSet.has(dateStr)) {
      calendar.push({ date: dateStr, status: 'freeze' });
    } else {
      calendar.push({ date: dateStr, status: 'missed' });
    }
  }

  // Recent sessions (last 14)
  const recentSessions = [...sessions]
    .filter(s => s.completed)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  return {
    sessionsThisWeek: last7.length,
    sessionsLastWeek: prev7.length,
    techniqueThisWeek,
    techniqueLastWeek,
    techniqueTrend,
    totalQuestionsThisWeek: last7.reduce((s, sess) => s + sess.questions.length, 0),
    weakestSubject: weakest,
    strongestSubject: strongest,
    recommendations,
    streakCalendar: calendar,
    recentSessions,
  };
}
