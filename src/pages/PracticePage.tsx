import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router';
import { useProgressStore } from '../stores/useProgressStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { usePaywall } from '../hooks/usePaywall';
import { useWeekConfig } from '../hooks/useWeekConfig';
import { useDailyQuestions } from '../hooks/useDailyQuestions';
import { calculateXpFromResult } from '../utils/scoring';
import { QuestionScreen } from '../components/question/QuestionScreen';
import { SessionCompleteScreen } from '../components/session/SessionCompleteScreen';
import { GuidedTutorial } from '../components/tutorial/GuidedTutorial';
import { PreSessionBreathing } from '../components/session/PreSessionBreathing';
import type { QuestionResult } from '../types/progress';
import type { DailySession } from '../types/progress';
import type { Subject } from '../types/question';
import { SUBJECT_LABELS } from '../types/question';

export function PracticePage() {
  const currentUser = useCurrentUser();
  const { getProgress, saveSession, updateStreak, addXp, addToMistakeQueue, updateMistakeQueue } = useProgressStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const VALID_SUBJECTS: Subject[] = ['english', 'maths', 'reasoning'];
  const rawSubject = searchParams.get('subject');
  const focusSubject = rawSubject && VALID_SUBJECTS.includes(rawSubject as Subject) ? rawSubject as Subject : null;

  const progress = currentUser ? getProgress(currentUser.id) : null;
  const { weekConfig, isFastTrack: isOnFastTrack, totalWeeks } = useWeekConfig();
  const answeredIds = useMemo(
    () => progress?.sessions.flatMap(s => s.questions.map(q => q.questionId)) ?? [],
    [progress?.sessions]
  );

  // Get due mistake questions
  const mistakeQuestionIds = useMemo(
    () => (progress?.mistakeQueue ?? [])
      .filter(m => {
        const sessionsSinceSeen = (progress?.sessions ?? []).filter(s => s.date > m.lastSeenDate).length;
        return sessionsSinceSeen >= m.interval;
      })
      .map(m => m.questionId)
      .slice(0, 2),
    [progress?.mistakeQueue, progress?.sessions]
  );

  const questions = useDailyQuestions(weekConfig, answeredIds, focusSubject ?? undefined, mistakeQuestionIds);

  const [showBreathing, setShowBreathing] = useState(true);
  const currentWeek = progress?.currentWeek ?? 1;
  const [showWeekNote, setShowWeekNote] = useState(() => {
    // Show once per week at the start of the first session of that week
    return localStorage.getItem(`atq_week_note_${currentWeek}`) !== 'true';
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const sessionSavedRef = useRef(false);

  // Save session as a side effect when all questions are answered
  useEffect(() => {
    if (results.length < questions.length || results.length === 0 || sessionSavedRef.current) return;
    sessionSavedRef.current = true;

    const avgTechnique = Math.round(
      results.reduce((sum, r) => sum + r.techniqueScore.overallTechniquePercent, 0) / results.length
    );
    const avgCorrectness = Math.round(
      (results.filter(r => r.correct).length / results.length) * 100
    );

    const session: DailySession = {
      date: new Date().toISOString().split('T')[0],
      questions: results,
      averageTechniqueScore: avgTechnique,
      averageCorrectness: avgCorrectness,
      totalTimeMs: results.reduce((sum, r) => sum + r.totalTimeMs, 0),
      completed: true,
    };

    if (currentUser) {
      saveSession(currentUser.id, session);
      updateStreak(currentUser.id, session.date);

      const totalXp = results.reduce((sum, r) =>
        sum + calculateXpFromResult(r.techniqueScore.overallTechniquePercent, r.correct), 0
      );
      addXp(currentUser.id, totalXp);

      for (const r of results) {
        if (!r.correct) {
          addToMistakeQueue(currentUser.id, r.questionId);
        } else if (mistakeQuestionIds.includes(r.questionId)) {
          updateMistakeQueue(currentUser.id, r.questionId, true);
        }
      }
    }

    setSessionComplete(true);
  }, [results, questions.length, currentUser, saveSession, updateStreak, addXp, addToMistakeQueue, updateMistakeQueue, mistakeQuestionIds]);

  const handleQuestionComplete = useCallback((result: QuestionResult) => {
    setResults(prev => {
      const newResults = [...prev, result];
      if (newResults.length < questions.length) {
        setCurrentIndex(newResults.length);
      }
      return newResults;
    });
  }, [questions.length]);

  const markTutorialSeen = useAuthStore(s => s.markTutorialSeen);
  const { needsPayment } = usePaywall();

  if (!currentUser || !progress) return null;

  // Show guided tutorial for first-time users
  if (currentUser.hasSeenTutorial !== true) {
    return (
      <GuidedTutorial
        onComplete={() => {
          markTutorialSeen();
        }}
      />
    );
  }

  // Paywall: redirect to upgrade if past week 1 and unpaid
  if (needsPayment) {
    return <Navigate to="/upgrade" replace />;
  }

  // Pre-session breathing exercise (skip if session already complete)
  if (showBreathing && !sessionComplete) {
    return <PreSessionBreathing onComplete={() => setShowBreathing(false)} />;
  }

  // Weekly start card — shown once at the start of each new week
  if (showWeekNote) {
    const targetMinutes = Math.round(weekConfig.timePerQuestionMs * weekConfig.dailyQuestionCount / 60000);
    const phaseLabel = weekConfig.phase === 'foundation' ? 'Foundation' : weekConfig.phase === 'building' ? 'Building' : 'Exam Ready';
    const phaseEmoji = weekConfig.phase === 'foundation' ? '🌱' : weekConfig.phase === 'building' ? '🏗️' : '🎯';
    const weekGoals: Record<string, string[]> = {
      foundation: ['Learn every step of the CLEAR Method', 'Read every question twice before looking at answers', 'Highlight the key words that tell you what to do'],
      building: ['Apply the technique without prompts', 'Speed up — aim for the target time below', 'Spot danger words on your own'],
      'exam-ready': ['Match real exam pace', 'Trust your technique under pressure', 'Finish all 10 questions with time to check'],
    };
    const goals = weekGoals[weekConfig.phase] ?? weekGoals.foundation;

    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 max-w-md shadow-lg border border-purple-200/50 space-y-3">
          <div className="text-center">
            <p className="text-4xl mb-2">🦉</p>
            <p className="font-display font-black text-xl text-purple-700">
            {isOnFastTrack && <span className="text-amber-500">⚡ Fast Track · </span>}
            Week {weekConfig.weekNumber}{isOnFastTrack ? ` of ${totalWeeks}` : ''} — {phaseLabel} {phaseEmoji}
          </p>
          </div>

          {/* Timing target */}
          <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-2xl p-4 text-center text-white">
            <p className="font-display font-bold text-sm opacity-90">⏱️ This week's target time</p>
            <p className="font-display font-black text-3xl">{targetMinutes} minutes</p>
            <p className="font-display text-xs opacity-80">for all 10 questions</p>
          </div>

          {/* Goals */}
          <div className="space-y-2">
            {goals.map((goal, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-purple-500 font-bold text-sm mt-0.5">✓</span>
                <p className="font-display text-sm text-gray-700">{goal}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              localStorage.setItem(`atq_week_note_${currentWeek}`, 'true');
              setShowWeekNote(false);
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-display font-bold rounded-button shadow-md hover:shadow-lg transition-all"
          >
            Let's go! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    const avgTechnique = Math.round(
      results.reduce((sum, r) => sum + r.techniqueScore.overallTechniquePercent, 0) / results.length
    );
    const correctCount = results.filter(r => r.correct).length;
    const totalTimeSeconds = Math.round(
      results.reduce((sum, r) => sum + r.totalTimeMs, 0) / 1000
    );
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    const totalXp = results.reduce((sum, r) =>
      sum + calculateXpFromResult(r.techniqueScore.overallTechniquePercent, r.correct), 0
    );

    // Stars: 3 = great technique + mostly correct, 2 = decent, 1 = participated
    const accuracy = correctCount / results.length;
    const sessionStars = (avgTechnique >= 80 && accuracy >= 0.8) ? 3
      : (avgTechnique >= 60 && accuracy >= 0.5) ? 2
      : 1;

    const getHootMessage = () => {
      if (sessionStars === 3) return `Owl-standing, ${currentUser.name}! Your technique is absolutely superb! You're becoming a true exam expert!`;
      if (sessionStars === 2) return `Hoo-ray, ${currentUser.name}! Great work today! Your technique is really improving — keep it up!`;
      if (avgTechnique >= 50) return `Good effort, ${currentUser.name}! Every practice session makes you stronger. Keep building those skills!`;
      return `Well done for finishing, ${currentUser.name}! Remember to read carefully next time — I know you can do it!`;
    };

    // Find the previous session for comparison
    const previousSession = progress.sessions.length > 0
      ? progress.sessions[progress.sessions.length - 1]
      : null;

    return (
      <SessionCompleteScreen
        currentUser={currentUser}
        results={results}
        avgTechnique={avgTechnique}
        correctCount={correctCount}
        minutes={minutes}
        seconds={seconds}
        totalXp={totalXp}
        sessionStars={sessionStars}
        message={getHootMessage()}
        onGoHome={() => navigate('/home')}
        previousSession={previousSession}
        focusSubject={focusSubject}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="py-8 text-center space-y-4">
        <span className="text-5xl">🦉</span>
        <h2 className="font-display font-bold text-xl text-white">No Questions Available</h2>
        <p className="text-white/70 font-display text-sm max-w-sm mx-auto">
          {focusSubject
            ? `We don't have enough ${SUBJECT_LABELS[focusSubject]} questions at this level yet. Try a different subject!`
            : "You've answered all the questions at this level! Try again tomorrow for new ones."}
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-6 py-3 bg-white/90 text-purple-600 font-display font-bold rounded-button shadow-md hover:bg-white transition-colors"
        >
          Back to the Nest 🏠
        </button>
      </div>
    );
  }

  return (
    <div className="py-2">
      {focusSubject && (
        <div className="mb-3 text-center">
          <span className="inline-block bg-white/90 text-purple-700 px-4 py-1.5 rounded-full text-sm font-display font-bold shadow-sm">
            Focusing on: {SUBJECT_LABELS[focusSubject]}
          </span>
        </div>
      )}
      <QuestionScreen
        key={currentQuestion.id}
        question={currentQuestion}
        weekConfig={weekConfig}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        sessionsCompleted={progress.sessions.length}
        onComplete={handleQuestionComplete}
      />
    </div>
  );
}
