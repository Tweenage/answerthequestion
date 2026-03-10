import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Clock, BarChart3 } from 'lucide-react';
import { useProgressStore } from '../stores/useProgressStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { programmeWeeks } from '../data/programme/weeks';
import { useDailyQuestions } from '../hooks/useDailyQuestions';
import { calculateXpFromResult } from '../utils/scoring';
import { QuestionScreen } from '../components/question/QuestionScreen';
import { ConfettiExplosion } from '../components/celebrations/ConfettiExplosion';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { SUBJECT_LABELS } from '../types/question';
import type { QuestionResult } from '../types/progress';
import type { WeekConfig } from '../types/programme';
import type { Subject } from '../types/question';

export function MockExamPage() {
  const currentUser = useCurrentUser();
  const { getProgress, addXp, saveMockExam } = useProgressStore();
  const navigate = useNavigate();
  const { play } = useSoundEffects();

  const progress = currentUser ? getProgress(currentUser.id) : null;
  const isUnlocked = (progress?.currentWeek ?? 1) >= 6;

  // Create exam-conditions week config
  const examConfig: WeekConfig = useMemo(() => {
    const baseWeek = programmeWeeks[Math.min((progress?.currentWeek ?? 1) - 1, 11)];
    return {
      ...baseWeek,
      scaffoldingLevel: 'light' as const,
      timePerQuestionMs: 60_000,
      dailyQuestionCount: 20,
      subjectDistribution: {
        'english': 5,
        'maths': 5,
        'verbal-reasoning': 5,
        'non-verbal-reasoning': 5,
      },
    };
  }, [progress?.currentWeek]);

  const answeredIds = progress?.sessions.flatMap(s => s.questions.map(q => q.questionId)) ?? [];
  const questions = useDailyQuestions(examConfig, answeredIds);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [examComplete, setExamComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const handleQuestionComplete = useCallback((result: QuestionResult) => {
    setResults(prev => {
      const newResults = [...prev, result];
      if (newResults.length >= questions.length) {
        const correctCount = newResults.filter(r => r.correct).length;
        const score = Math.round((correctCount / newResults.length) * 100);
        const todayStr = new Date().toISOString().split('T')[0];

        if (currentUser) {
          const totalXp = newResults.reduce((sum, r) =>
            sum + calculateXpFromResult(r.techniqueScore.overallTechniquePercent, r.correct), 0
          );
          addXp(currentUser.id, totalXp);
          saveMockExam(currentUser.id, score, todayStr);
        }

        setTimeout(() => setExamComplete(true), 100);
      } else {
        setCurrentIndex(newResults.length);
      }
      return newResults;
    });
  }, [questions.length, currentUser, addXp, saveMockExam]);

  if (!currentUser || !progress) return null;

  if (!isUnlocked) {
    return (
      <div className="text-center py-12 space-y-4">
        <ProfessorHoot
          mood="teaching"
          size="lg"
          message={`Mock exams unlock in Week 6, ${currentUser.name}! You're on Week ${progress.currentWeek} — keep building your technique!`}
          showSpeechBubble
          animate
        />
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-button font-display font-bold text-white rainbow-gradient">
          Back to the Nest! 🦉
        </button>
      </div>
    );
  }

  if (examComplete) {
    const correctCount = results.filter(r => r.correct).length;
    const score = Math.round((correctCount / results.length) * 100);
    const totalTimeMs = Date.now() - startTime;
    const totalMinutes = Math.floor(totalTimeMs / 60000);
    const totalSeconds = Math.floor((totalTimeMs % 60000) / 1000);

    // Subject breakdown
    const subjectResults: Record<Subject, { correct: number; total: number }> = {
      'english': { correct: 0, total: 0 },
      'maths': { correct: 0, total: 0 },
      'verbal-reasoning': { correct: 0, total: 0 },
      'non-verbal-reasoning': { correct: 0, total: 0 },
    };
    for (const r of results) {
      subjectResults[r.subject].total++;
      if (r.correct) subjectResults[r.subject].correct++;
    }

    const getMessage = () => {
      if (score >= 90) return `Exam confidence: HIGH! You're absolutely ready, ${currentUser.name}!`;
      if (score >= 75) return `Great exam practice, ${currentUser.name}! A few more mocks and you'll be flying!`;
      if (score >= 50) return `Good effort, ${currentUser.name}! Focus on your weaker subjects before the next mock.`;
      return `Every mock exam helps you learn, ${currentUser.name}. You're building strength!`;
    };

    return (
      <MockExamResultScreen
        score={score}
        correctCount={correctCount}
        totalQuestions={results.length}
        totalMinutes={totalMinutes}
        totalSeconds={totalSeconds}
        subjectResults={subjectResults}
        message={getMessage()}
        onGoHome={() => navigate('/')}
        onTryAgain={() => { setResults([]); setCurrentIndex(0); setExamComplete(false); }}
        play={play}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="py-2">
      <div className="mb-3 text-center">
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-5 py-2 rounded-full text-sm font-display font-bold shadow-md">
          <BarChart3 className="w-4 h-4" />
          Mock Exam · {currentIndex + 1}/{questions.length}
        </span>
      </div>
      <QuestionScreen
        key={currentQuestion.id}
        question={currentQuestion}
        weekConfig={examConfig}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onComplete={handleQuestionComplete}
      />
    </div>
  );
}

function MockExamResultScreen({
  score, correctCount, totalQuestions, totalMinutes, totalSeconds, subjectResults, message, onGoHome, onTryAgain, play,
}: {
  score: number;
  correctCount: number;
  totalQuestions: number;
  totalMinutes: number;
  totalSeconds: number;
  subjectResults: Record<Subject, { correct: number; total: number }>;
  message: string;
  onGoHome: () => void;
  onTryAgain: () => void;
  play: (effect: 'sessionComplete') => void;
}) {
  useEffect(() => {
    play('sessionComplete');
  }, [play]);

  const showConfetti = score >= 75;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 py-4">
      <ConfettiExplosion trigger={showConfetti} />

      <div className="text-center pt-2">
        <h2 className="font-display font-extrabold text-2xl text-white">Mock Exam Complete!</h2>
      </div>

      {/* Big score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="text-center bg-white rounded-card p-6 shadow-lg"
      >
        <p className={`font-display font-extrabold text-5xl ${
          score >= 80 ? 'text-calm-500' : score >= 60 ? 'text-celebrate-amber' : 'text-rainbow-red'
        }`}>
          {correctCount}/{totalQuestions}
        </p>
        <p className="text-gray-500 font-display text-sm mt-1">{score}% correct</p>
        <div className="flex items-center justify-center gap-1 mt-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-display">{totalMinutes}:{totalSeconds.toString().padStart(2, '0')}</span>
        </div>
      </motion.div>

      {/* Subject breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-card p-4 shadow-sm"
      >
        <h3 className="font-display font-bold text-gray-700 mb-3">Subject Breakdown</h3>
        <div className="space-y-2.5">
          {(Object.entries(subjectResults) as [Subject, { correct: number; total: number }][]).map(([subj, data]) => {
            const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={subj} className="flex items-center gap-3">
                <span className="font-display text-sm text-gray-600 w-12 shrink-0">{SUBJECT_LABELS[subj].split(' ')[0]}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={`h-full rounded-full ${
                      pct >= 80 ? 'bg-calm-400' : pct >= 50 ? 'bg-celebrate-amber' : 'bg-rainbow-red'
                    }`}
                  />
                </div>
                <span className="font-display font-bold text-sm text-gray-700 w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Professor Hoot */}
      <ProfessorHoot
        mood={score >= 75 ? 'celebrating' : score >= 50 ? 'encouraging' : 'teaching'}
        size="lg"
        message={message}
        showSpeechBubble
        animate
      />

      {/* Action buttons */}
      <div className="space-y-3">
        <button onClick={onTryAgain} className="w-full py-3.5 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 transition-opacity">
          Try Another Mock 📝
        </button>
        <button onClick={onGoHome} className="w-full py-3.5 rounded-button font-display font-bold text-white text-lg rainbow-gradient hover:opacity-90 transition-opacity">
          Back to the Nest! 🦉
        </button>
      </div>
    </motion.div>
  );
}
