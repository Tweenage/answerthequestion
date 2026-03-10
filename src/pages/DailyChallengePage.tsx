import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { useProgressStore } from '../stores/useProgressStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { programmeWeeks } from '../data/programme/weeks';
import { allQuestions } from '../data/questions';
import { QuestionScreen } from '../components/question/QuestionScreen';
import { ConfettiExplosion } from '../components/celebrations/ConfettiExplosion';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { calculateXpFromResult } from '../utils/scoring';
import type { QuestionResult } from '../types/progress';
import type { WeekConfig } from '../types/programme';

// Deterministic daily question selection based on date
function getDailyChallengeQuestion(dateStr: string, answeredIds: string[]) {
  const hard = allQuestions.filter(q => q.difficulty === 3);
  if (hard.length === 0) return allQuestions[0];

  // Simple hash of date string for consistent daily selection
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % hard.length;
  }

  // Try the hashed index first, then cycle through if answered
  for (let offset = 0; offset < hard.length; offset++) {
    const idx = (hash + offset) % hard.length;
    if (!answeredIds.includes(hard[idx].id)) return hard[idx];
  }
  return hard[hash]; // All answered — repeat
}

export function DailyChallengePage() {
  const currentUser = useCurrentUser();
  const { getProgress, completeDailyChallenge } = useProgressStore();
  const navigate = useNavigate();
  const { play } = useSoundEffects();

  const progress = currentUser ? getProgress(currentUser.id) : null;
  const todayStr = new Date().toISOString().split('T')[0];

  // Check if already completed today
  const alreadyCompleted = progress?.dailyChallenge?.lastCompletedDate === todayStr;

  const answeredIds = progress?.sessions.flatMap(s => s.questions.map(q => q.questionId)) ?? [];
  const question = useMemo(
    () => getDailyChallengeQuestion(todayStr, answeredIds),
    [todayStr] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [result, setResult] = useState<QuestionResult | null>(null);
  const [animatedXp, setAnimatedXp] = useState(0);

  // Create a synthetic week config for the challenge (no scaffolding)
  const challengeConfig: WeekConfig = useMemo(() => {
    const baseWeek = programmeWeeks[Math.min((progress?.currentWeek ?? 1) - 1, 11)];
    return {
      ...baseWeek,
      scaffoldingLevel: 'light' as const,
      timePerQuestionMs: 90_000,
      dailyQuestionCount: 1,
    };
  }, [progress?.currentWeek]);

  const handleComplete = useCallback((res: QuestionResult) => {
    setResult(res);
    if (currentUser) {
      const baseXp = calculateXpFromResult(res.techniqueScore.overallTechniquePercent, res.correct);
      const doubleXp = baseXp * 2;
      completeDailyChallenge(currentUser.id, todayStr, res.correct, doubleXp);
    }
  }, [currentUser, completeDailyChallenge, todayStr]);

  // Animate XP counter
  useEffect(() => {
    if (!result) return;
    const baseXp = calculateXpFromResult(result.techniqueScore.overallTechniquePercent, result.correct);
    const totalXp = baseXp * 2;
    play('sessionComplete');
    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setAnimatedXp(Math.round(p * totalXp));
      if (p < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), 400);
  }, [result, play]);

  if (!currentUser || !progress) return null;

  if (alreadyCompleted && !result) {
    return (
      <div className="text-center py-12 space-y-4">
        <ProfessorHoot mood="celebrating" size="lg" message="You've already completed today's challenge! Come back tomorrow for a new one!" showSpeechBubble animate />
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-button font-display font-bold text-white rainbow-gradient">
          Back to the Nest! 🦉
        </button>
      </div>
    );
  }

  if (result) {
    const baseXp = calculateXpFromResult(result.techniqueScore.overallTechniquePercent, result.correct);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 py-4">
        <ConfettiExplosion trigger={result.correct} />

        <div className="text-center">
          <span className="text-5xl">{result.correct ? '🌟' : '💪'}</span>
          <h2 className="font-display font-extrabold text-2xl text-white mt-2">
            {result.correct ? 'Challenge Complete!' : 'Nice Try!'}
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center bg-gradient-to-r from-yellow-400 to-amber-500 rounded-card p-5 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-6 h-6 text-white" />
            <span className="font-display font-bold text-3xl text-white">+{animatedXp} XP</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-white/80 text-sm font-display">
            <Star className="w-4 h-4" />
            <span>2× Daily Challenge Bonus!</span>
          </div>
        </motion.div>

        <ProfessorHoot
          mood={result.correct ? 'celebrating' : 'encouraging'}
          size="lg"
          message={result.correct
            ? `Brilliant, ${currentUser.name}! You nailed the challenge! That's ${baseXp * 2} bonus XP!`
            : `Great effort on the challenge, ${currentUser.name}! These tricky questions help you grow stronger!`
          }
          showSpeechBubble
          animate
        />

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-button font-display font-bold text-white text-lg rainbow-gradient hover:opacity-90 transition-opacity"
        >
          Back to the Nest! 🦉
        </button>
      </motion.div>
    );
  }

  return (
    <div className="py-2">
      <div className="mb-4 text-center">
        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-5 py-2 rounded-full text-sm font-display font-bold shadow-md">
          <Star className="w-4 h-4" />
          Daily Challenge · 2× XP
        </span>
      </div>
      <QuestionScreen
        key={question.id}
        question={question}
        weekConfig={challengeConfig}
        questionNumber={1}
        totalQuestions={1}
        onComplete={handleComplete}
      />
    </div>
  );
}
