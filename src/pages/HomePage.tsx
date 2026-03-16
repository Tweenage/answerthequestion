import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { usePaywall } from '../hooks/usePaywall';
import { PHASE_LABELS } from '../types/programme';
import { programmeWeeks } from '../data/programme/weeks';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { ExamCountdown } from '../components/home/ExamCountdown';
import { ExamDatePicker } from '../components/home/ExamDatePicker';
import { ReferralModal } from '../components/ReferralModal';
import { ReviewPrompt } from '../components/ReviewPrompt';
import { supabase } from '../lib/supabase';
// MockExamCard unlocks automatically at week 6 in the practice flow

const SUBJECT_CHIPS = [
  { key: null, label: 'Mix', emoji: '🎯' },
  { key: 'english', label: 'Eng', emoji: '📖' },
  { key: 'maths', label: 'Maths', emoji: '🔢' },
  { key: 'reasoning', label: 'Reasoning', emoji: '🧩' },
] as const;

export function HomePage() {
  const currentUser = useCurrentUser();
  const markOnboardingSeen = useAuthStore(s => s.markOnboardingSeen);
  const getProgress = useProgressStore(s => s.getProgress);
  const examDate = useSettingsStore(s => s.examDate);
  const setExamDate = useSettingsStore(s => s.setExamDate);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const { needsPayment } = usePaywall();
  const hasCribSheet = localStorage.getItem('atq-crib-sheet-purchased') === 'true';
  const [downloadingCribSheet, setDownloadingCribSheet] = useState(false);

  const handleDownloadCribSheet = () => {
    setDownloadingCribSheet(true);
    try {
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl('crib-sheet/CLEAR-Method-Crib-Sheet.pdf', {
          download: 'CLEAR-Method-Crib-Sheet.pdf',
        });
      window.open(data.publicUrl, '_blank');
    } catch {
      // silent fail
    } finally {
      setDownloadingCribSheet(false);
    }
  };

  // Show review prompt after 7th completed session (once per child)
  useEffect(() => {
    if (!currentUser) return;
    const progress = getProgress(currentUser.id);
    const completedSessions = progress.sessions.filter(s => s.completed).length;
    const reviewKey = `atq_review_prompted_${currentUser.id}`;
    if (completedSessions >= 7 && !localStorage.getItem(reviewKey)) {
      // Small delay so the page loads first
      const timer = setTimeout(() => {
        setShowReview(true);
        localStorage.setItem(reviewKey, 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, getProgress]);

  if (!currentUser) return null;

  if (!currentUser.hasSeenOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          markOnboardingSeen();
        }}
      />
    );
  }
  const progress = getProgress(currentUser.id);
  const weekConfig = programmeWeeks[Math.min(progress.currentWeek - 1, 11)];
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySession = progress.sessions.find(s => s.date === todayStr);
  const hasPractisedToday = !!todaySession?.completed;

  // Work out sessions completed this calendar week (Mon-Sun)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStartDate = new Date(now);
  weekStartDate.setDate(now.getDate() - mondayOffset);
  const weekStartStr = weekStartDate.toISOString().split('T')[0];
  const sessionsThisWeek = progress.sessions.filter(s => s.completed && s.date >= weekStartStr).length;
  const dayNumber = Math.min(sessionsThisWeek + (hasPractisedToday ? 0 : 1), 7);

  const getHootGreeting = () => {
    const hour = new Date().getHours();
    const name = currentUser.name;

    if (hasPractisedToday) {
      return `Hoo-ray, ${name}! You smashed today's session! Come back tomorrow for Day ${Math.min(dayNumber + 1, 7)}!`;
    }
    if (progress.streak.currentStreak >= 7) {
      return `${progress.streak.currentStreak} days in a row, ${name}! That's owl-standing!`;
    }
    if (progress.streak.currentStreak >= 3) {
      return `Your streak is growing, ${name}! Wise move practising every day!`;
    }
    if (progress.totalQuestionsAnswered === 0) {
      if (hour < 12) return `Good morning, ${name}! Welcome — you're going to do brilliantly!`;
      return `Hoo-hello, ${name}! Welcome — let's get started!`;
    }
    if (hour < 12) return `Good morning, ${name}! Let's make today count!`;
    if (hour < 17) return `Good afternoon, ${name}! Time to sharpen that technique!`;
    return `Good evening, ${name}! A quick session before bed works wonders!`;
  };

  const getHootMood = () => {
    if (hasPractisedToday) return 'celebrating' as const;
    if (progress.streak.currentStreak >= 7) return 'celebrating' as const;
    if (progress.streak.currentStreak >= 3) return 'happy' as const;
    if (progress.totalQuestionsAnswered === 0) return 'teaching' as const;
    return 'encouraging' as const;
  };


  return (
    <div className="space-y-2.5">
      {/* Floating background decorations — CSS-only for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {['🦉', '📚', '⭐', '✨', '🎯', '🌟'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-[0.12] animate-float"
            style={{
              left: `${10 + (i * 18) % 75}%`,
              top: `${8 + (i * 20) % 80}%`,
              animationDuration: `${4 + i * 0.8}s`,
              animationDelay: `${i * 0.5}s`,
              willChange: 'transform',
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Professor Hoot greeting + Title — compact header */}
      <div className="relative z-10 flex items-center gap-3 pt-1">
        <div className="shrink-0">
          <ProfessorHoot
            mood={getHootMood()}
            size="md"
            showSpeechBubble={false}
            animate={true}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-extrabold text-xl md:text-2xl text-white drop-shadow-md">
            🎯 AnswerTheQuestion!
          </h2>
          <p className="text-white/90 font-display text-sm mt-0.5">{getHootGreeting()}</p>
        </div>
      </div>

      {/* ========== CALM & FOCUS — shown before practice ========== */}
      {!hasPractisedToday && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative z-10"
        >
          <Link
            to="/visualise"
            className="block w-full rounded-card border-2 border-white/40 bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] p-4 text-center"
          >
            <p className="text-2xl mb-1">🧘</p>
            <p className="font-display font-bold text-white text-base">Before we begin&hellip;</p>
            <p className="font-display text-white/70 text-xs mt-1">
              Take a moment to calm your mind and focus
            </p>
          </Link>
        </motion.div>
      )}

      {/* ========== PRIMARY CTA — TODAY'S SESSION ========== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10"
      >
        <div
          className={`rounded-card overflow-hidden shadow-xl ${
            hasPractisedToday
              ? 'bg-gradient-to-br from-violet-400 to-purple-600'
              : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600'
          }`}
        >
          <div className="p-4">
            {/* Week & Streak badges */}
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
              <span className="bg-white/25 text-white px-2.5 py-0.5 rounded-full text-xs font-display font-bold">
                Week {progress.currentWeek} · {PHASE_LABELS[weekConfig.phase]}
              </span>
              {progress.streak.currentStreak > 0 && (
                <span className="bg-white/25 text-white px-2.5 py-0.5 rounded-full text-xs font-display font-bold">
                  🔥 {progress.streak.currentStreak} day streak
                </span>
              )}
            </div>

            {hasPractisedToday ? (
              <Link to="/practice" className="block text-center">
                <p className="font-display font-extrabold text-xl text-white mb-0.5">
                  ✅ Today's Session Complete!
                </p>
                <p className="text-white/90 font-display text-sm">
                  Score: {todaySession?.averageTechniqueScore ?? 0}% technique · Come back tomorrow!
                </p>
              </Link>
            ) : (
              <>
                <p className="font-display font-extrabold text-xl text-white mb-0.5 text-center">
                  {progress.totalQuestionsAnswered === 0
                    ? "Start Your First Session!"
                    : "Today's Practice"}
                </p>
                <p className="text-white/90 font-display text-xs text-center mb-0.5">
                  Week {progress.currentWeek}
                </p>
                <p className="text-white/90 font-display text-sm mb-2.5 text-center">
                  {weekConfig.dailyQuestionCount} questions · {Math.round(weekConfig.timePerQuestionMs / 1000)}s per question
                </p>

                {/* Subject chips */}
                <div className="flex gap-1.5 mb-3">
                  {SUBJECT_CHIPS.map(({ key, label, emoji }) => (
                    <button
                      key={label}
                      onClick={() => setSelectedSubject(key)}
                      className={`flex-1 py-1.5 rounded-full text-xs font-display font-bold transition-all backdrop-blur-sm border ${
                        selectedSubject === key
                          ? 'bg-purple-700/80 text-white shadow-lg border-purple-400/60 ring-2 ring-purple-300/50'
                          : 'bg-white/15 text-white/90 border-white/20 hover:bg-white/25'
                      }`}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>

                {/* Big start button */}
                {needsPayment ? (
                  <Link
                    to="/upgrade"
                    className="block bg-gradient-to-r from-amber-400 to-orange-400 rounded-button py-2.5 text-center hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <span className="font-display font-extrabold text-base text-white">
                      Unlock Full Access 🔓
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={selectedSubject ? `/practice?subject=${selectedSubject}` : '/practice'}
                    className="block bg-white rounded-button py-2.5 text-center hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <span className="font-display font-extrabold text-base text-purple-600">
                      {progress.totalQuestionsAnswered === 0 ? "LET'S GO! 🚀" : "START SESSION ▶"}
                    </span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ========== STATS ROW ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-3 gap-2 relative z-10"
      >
        <div className="bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30 backdrop-blur-sm rounded-card p-3 text-center border border-violet-300/40 shadow-sm">
          <p className="font-display font-extrabold text-2xl text-yellow-300 drop-shadow-sm">{progress.xp}</p>
          <p className="text-violet-100 text-sm font-display font-bold">⭐ Points</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30 backdrop-blur-sm rounded-card p-3 text-center border border-violet-300/40 shadow-sm">
          <p className="font-display font-extrabold text-2xl text-green-300 drop-shadow-sm">{progress.totalCorrect}</p>
          <p className="text-violet-100 text-sm font-display font-bold">✅ Correct</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30 backdrop-blur-sm rounded-card p-3 text-center border border-violet-300/40 shadow-sm">
          <p className="font-display font-extrabold text-2xl text-white drop-shadow-sm">{progress.averageTechniqueScore}%</p>
          <p className="text-violet-100 text-sm font-display font-bold">🎯 Technique</p>
        </div>
      </motion.div>

      {/* ========== EXAM COUNTDOWN ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10"
      >
        {examDate ? (
          <ExamCountdown examDate={examDate} childName={currentUser.name} onChangeDate={setExamDate} />
        ) : (
          <ExamDatePicker onSet={setExamDate} />
        )}
      </motion.div>

      {/* ========== 12-WEEK PROGRESS TRACKER ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="relative z-10 bg-gradient-to-br from-orange-300/25 via-pink-300/20 to-rose-300/25 backdrop-blur-sm rounded-card p-4 border border-orange-200/30"
      >
        <div className="text-center mb-3">
          <p className="font-display font-bold text-sm text-white">
            🗺️ Your 12-Week Journey
          </p>
          <p className="font-display font-bold text-xs text-white/80">
            Week {progress.currentWeek} of 12
          </p>
        </div>

        {/* Phase segments */}
        <div className="grid grid-cols-3 gap-2">
          {/* Foundation — Weeks 1-4 */}
          <div className="rounded-xl border-2 border-amber-300/50 bg-amber-400/20 backdrop-blur-sm p-2">
            <p className="text-center text-[11px] font-display font-extrabold text-white mb-1.5">
              🌱 Foundation
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 4 }, (_, i) => {
                const weekNum = i + 1;
                const isCurrent = weekNum === progress.currentWeek;
                const isComplete = weekNum < progress.currentWeek;
                return (
                  <div key={weekNum} className="flex-1 relative">
                    <div className={`h-3 rounded-full transition-all ${
                      isComplete ? 'bg-amber-400'
                        : isCurrent ? 'bg-amber-400 ring-2 ring-amber-300 ring-offset-1' : 'bg-white/20'
                    }`}>
                      {isCurrent && (
                        <motion.div
                          className="absolute -top-0.5 -bottom-0.5 -left-0.5 -right-0.5 rounded-full bg-amber-400/30"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <p className={`text-center text-[10px] mt-1 font-display font-bold ${
                      isCurrent ? 'text-white' : 'text-white/80'
                    }`}>{weekNum}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Improvers — Weeks 5-8 */}
          <div className="rounded-xl border-2 border-orange-300/50 bg-orange-400/20 backdrop-blur-sm p-2">
            <p className="text-center text-[11px] font-display font-extrabold text-white mb-1.5">
              🔥 Improvers
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 4 }, (_, i) => {
                const weekNum = i + 5;
                const isCurrent = weekNum === progress.currentWeek;
                const isComplete = weekNum < progress.currentWeek;
                return (
                  <div key={weekNum} className="flex-1 relative">
                    <div className={`h-3 rounded-full transition-all ${
                      isComplete ? 'bg-orange-400'
                        : isCurrent ? 'bg-orange-400 ring-2 ring-orange-300 ring-offset-1' : 'bg-white/20'
                    }`}>
                      {isCurrent && (
                        <motion.div
                          className="absolute -top-0.5 -bottom-0.5 -left-0.5 -right-0.5 rounded-full bg-orange-400/30"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <p className={`text-center text-[10px] mt-1 font-display font-bold ${
                      isCurrent ? 'text-white' : 'text-white/80'
                    }`}>{weekNum}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exam Mode — Weeks 9-12 */}
          <div className="rounded-xl border-2 border-rose-400/50 bg-rose-400/20 backdrop-blur-sm p-2">
            <p className="text-center text-[11px] font-display font-extrabold text-white mb-1.5">
              🚀 Exam Mode
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 4 }, (_, i) => {
                const weekNum = i + 9;
                const isCurrent = weekNum === progress.currentWeek;
                const isComplete = weekNum < progress.currentWeek;
                return (
                  <div key={weekNum} className="flex-1 relative">
                    <div className={`h-3 rounded-full transition-all ${
                      isComplete ? 'bg-rose-500'
                        : isCurrent ? 'bg-rose-500 ring-2 ring-rose-400 ring-offset-1' : 'bg-white/20'
                    }`}>
                      {isCurrent && (
                        <motion.div
                          className="absolute -top-0.5 -bottom-0.5 -left-0.5 -right-0.5 rounded-full bg-rose-500/30"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <p className={`text-center text-[10px] mt-1 font-display font-bold ${
                      isCurrent ? 'text-white' : 'text-white/80'
                    }`}>{weekNum}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========== CERTIFICATE CARD (programme complete) ========== */}
      {progress.currentWeek > 12 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="relative z-10"
        >
          <Link
            to="/certificate"
            className="block rounded-card overflow-hidden shadow-lg bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-4 text-center hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <p className="text-2xl mb-1">🎓</p>
            <p className="font-display font-extrabold text-lg text-white drop-shadow-sm">
              You completed the programme!
            </p>
            <p className="font-display text-sm text-white/90 mt-1">
              Tap to download your Certificate of Achievement
            </p>
          </Link>
        </motion.div>
      )}

      {/* ========== CRIB SHEET DOWNLOAD (if purchased) ========== */}
      {hasCribSheet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative z-10"
        >
          <button
            onClick={handleDownloadCribSheet}
            disabled={downloadingCribSheet}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-card bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
          >
            <span className="text-xl">📋</span>
            <div className="flex-1 text-left">
              <p className="font-display font-bold text-white text-sm">CLEAR Method Crib Sheet</p>
              <p className="font-display text-white/70 text-xs">Tap to download your printable one-pager</p>
            </div>
            <Download className="w-4 h-4 text-white/80" />
          </button>
        </motion.div>
      )}

      {/* ========== REFER A FRIEND ========== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10"
      >
        <button
          onClick={() => setShowReferral(true)}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-card bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
        >
          <span className="text-xl">🤝</span>
          <div className="flex-1 text-left">
            <p className="font-display font-bold text-white text-sm">Refer a Friend</p>
            <p className="font-display text-white/70 text-xs">The best outcome is they both get in.</p>
          </div>
          <span className="text-white/80 text-xs font-display">▶</span>
        </button>
      </motion.div>

      {/* ========== MODALS ========== */}
      <ReferralModal isOpen={showReferral} onClose={() => setShowReferral(false)} />
      <ReviewPrompt isOpen={showReview} onClose={() => setShowReview(false)} />

    </div>
  );
}
