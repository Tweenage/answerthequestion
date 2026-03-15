import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { TrendingUp, TrendingDown, Target, BookOpen, Clock, Flame, ArrowLeft, Minus, Trash2 } from 'lucide-react';
import { useProgressStore } from '../stores/useProgressStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { SUBJECT_LABELS } from '../types/question';
import type { Subject } from '../types/question';
import { programmeWeeks } from '../data/programme/weeks';
import { PHASE_LABELS } from '../types/programme';
import { analyzeWeeklyProgress } from '../utils/dashboardAnalytics';
import { supabase } from '../lib/supabase';

const subjects: Subject[] = ['english', 'maths', 'verbal-reasoning', 'non-verbal-reasoning'];
const subjectBarColours: Record<Subject, string> = {
  'english': 'bg-rainbow-red',
  'maths': 'bg-rainbow-blue',
  'verbal-reasoning': 'bg-rainbow-green',
  'non-verbal-reasoning': 'bg-rainbow-violet',
};

export function DashboardPage() {
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);
  const navigate = useNavigate();
  const logout = useAuthStore(s => s.logout);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!currentUser) return null;
  const progress = getProgress(currentUser.id);
  const weekConfig = programmeWeeks[Math.min(progress.currentWeek - 1, 11)];

  const analysis = analyzeWeeklyProgress(progress.sessions, progress.subjectScores, progress.streak);

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="text-white/80 hover:text-white">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold text-white">{currentUser.name}'s Progress</h2>
          <p className="text-white/80 text-xs font-display">
            Week {progress.currentWeek} · {PHASE_LABELS[weekConfig.phase]}
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-focus-500" />
            <span className="text-xs text-gray-500 font-display">This Week</span>
          </div>
          <p className="font-display font-bold text-2xl text-focus-700">{analysis.sessionsThisWeek}/7</p>
          <p className="text-xs text-gray-400 font-display">sessions</p>
        </div>
        <div className="bg-white rounded-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-celebrate-amber" />
            <span className="text-xs text-gray-500 font-display">Streak</span>
          </div>
          <p className="font-display font-bold text-2xl text-celebrate-amber">{progress.streak.currentStreak}</p>
          <p className="text-xs text-gray-400 font-display">days</p>
        </div>
        <div className="bg-white rounded-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-calm-500" />
            <span className="text-xs text-gray-500 font-display">Technique</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-display font-bold text-2xl text-calm-600">{analysis.techniqueThisWeek}%</p>
            {analysis.techniqueTrend === 'up' && <TrendingUp className="w-4 h-4 text-calm-500" />}
            {analysis.techniqueTrend === 'down' && <TrendingDown className="w-4 h-4 text-rainbow-red" />}
            {analysis.techniqueTrend === 'same' && <Minus className="w-4 h-4 text-gray-400" />}
          </div>
          <p className="text-xs text-gray-400 font-display">vs {analysis.techniqueLastWeek}% last week</p>
        </div>
        <div className="bg-white rounded-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-rainbow-indigo" />
            <span className="text-xs text-gray-500 font-display">Questions</span>
          </div>
          <p className="font-display font-bold text-2xl text-rainbow-indigo">{analysis.totalQuestionsThisWeek}</p>
          <p className="text-xs text-gray-400 font-display">this week</p>
        </div>
      </div>

      {/* Technique Trend Chart */}
      {analysis.recentSessions.length > 0 && (
        <div className="bg-white rounded-card p-4 shadow-sm">
          <h3 className="font-display font-bold text-sm text-gray-700 mb-3">Technique Trend</h3>
          <div className="flex items-end gap-1.5 h-24">
            {analysis.recentSessions.slice(0, 7).reverse().map((sess, i) => {
              const pct = sess.averageTechniqueScore;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`w-full rounded-t-md ${
                      pct >= 80 ? 'bg-calm-400' : pct >= 50 ? 'bg-celebrate-amber' : 'bg-rainbow-red'
                    }`}
                    style={{ minHeight: '4px' }}
                  />
                  <span className="text-[11px] text-gray-400 font-display">
                    {new Date(sess.date).toLocaleDateString('en-GB', { day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject Breakdown */}
      <div className="bg-white rounded-card p-4 shadow-sm">
        <h3 className="font-display font-bold text-sm text-gray-700 mb-3">Subjects</h3>
        <div className="space-y-3">
          {subjects.map(subject => {
            const data = progress.subjectScores[subject];
            const accuracy = data.questionsAttempted > 0
              ? Math.round((data.questionsCorrect / data.questionsAttempted) * 100) : 0;
            const isWeakest = subject === analysis.weakestSubject;

            return (
              <div key={subject} className={`rounded-xl p-3 ${isWeakest ? 'bg-amber-50 border border-amber-200' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-gray-700">
                      {SUBJECT_LABELS[subject]}
                    </span>
                    {isWeakest && (
                      <span className="text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-display font-bold">
                        Focus area
                      </span>
                    )}
                  </div>
                  <span className="font-display font-bold text-sm text-gray-600">{accuracy}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${subjectBarColours[subject]}`}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400 font-display">
                    {data.questionsAttempted} questions
                  </span>
                  <span className="text-xs text-gray-400 font-display">
                    Technique: {data.averageTechniqueScore}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="bg-white rounded-card p-4 shadow-sm">
        <h3 className="font-display font-bold text-sm text-gray-700 mb-3">Last 28 Days</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="text-center text-xs text-gray-400 font-display font-bold">{d}</span>
          ))}
          {analysis.streakCalendar.map((day, i) => (
            <div
              key={i}
              aria-label={`${day.date}: ${day.status}`}
              className={`aspect-square rounded-md flex items-center justify-center ${
                day.status === 'practised' ? 'bg-calm-400' :
                day.status === 'freeze' ? 'bg-blue-300' :
                day.status === 'future' ? 'bg-gray-50' :
                'bg-gray-200'
              }`}
            >
              <span className={`text-[10px] font-display font-bold ${
                day.status === 'missed' ? 'text-gray-400' : 'text-white'
              }`}>
                {day.status === 'practised' ? '✓' : day.status === 'freeze' ? '❄' : day.status === 'missed' ? '·' : ''}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs font-display text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-calm-400 flex items-center justify-center text-[8px] text-white font-bold">✓</span> Practised</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-200 flex items-center justify-center text-[8px] text-gray-400 font-bold">·</span> Missed</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-300 flex items-center justify-center text-[8px] text-white font-bold">❄</span> Freeze</span>
        </div>
      </div>

      {/* Session History */}
      {analysis.recentSessions.length > 0 && (
        <div className="bg-white rounded-card p-4 shadow-sm">
          <h3 className="font-display font-bold text-sm text-gray-700 mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {analysis.recentSessions.map((sess, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600 font-display">
                  {new Date(sess.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`font-display font-bold ${
                    sess.averageTechniqueScore >= 80 ? 'text-calm-500' :
                    sess.averageTechniqueScore >= 50 ? 'text-celebrate-amber' : 'text-rainbow-red'
                  }`}>
                    {sess.averageTechniqueScore}%
                  </span>
                  <span className="text-gray-400 font-display">
                    {sess.questions.filter(q => q.correct).length}/{sess.questions.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-card p-4 shadow-lg">
        <h3 className="font-display font-bold text-sm text-white mb-2">💡 Recommendations</h3>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, i) => (
            <p key={i} className="text-white/90 text-sm font-display">{rec}</p>
          ))}
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-card p-4 shadow-sm mt-6">
        <h3 className="font-display font-bold text-sm text-gray-700 mb-3">Account</h3>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-display font-bold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete my account
        </button>
        <p className="text-xs text-gray-400 font-display mt-1">
          Permanently removes your account, all child profiles, and all progress data.
        </p>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">⚠️</span>
              <h3 className="font-display font-extrabold text-lg text-gray-900 mt-2">
                Delete your account?
              </h3>
              <p className="text-sm text-gray-500 font-display mt-2">
                This will permanently delete your account, all child profiles, progress, badges, and payment records. This cannot be undone.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-xs text-gray-500 font-display font-bold block mb-1">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-display focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            {deleteError && (
              <p className="text-sm text-red-500 font-display mb-3">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
                className="flex-1 py-2.5 rounded-xl font-display font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                onClick={async () => {
                  setDeleteLoading(true);
                  setDeleteError('');
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) throw new Error('Not logged in');

                    const { error } = await supabase.functions.invoke('delete-account', {
                      body: { confirm: 'DELETE_MY_ACCOUNT' },
                    });
                    if (error) throw error;

                    // Account deleted — clear local state and redirect
                    await supabase.auth.signOut();
                    logout();
                    navigate('/');
                  } catch (err) {
                    setDeleteError(
                      err instanceof Error ? err.message : 'Something went wrong. Please try again.'
                    );
                    setDeleteLoading(false);
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm text-white transition-colors ${
                  deleteConfirmText === 'DELETE' && !deleteLoading
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete forever'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
