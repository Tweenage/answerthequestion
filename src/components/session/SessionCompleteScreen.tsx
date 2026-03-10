import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Minus, Clock, Star, Zap, BookOpen, Highlighter, XCircle, Eye } from 'lucide-react';
import { ConfettiExplosion } from '../celebrations/ConfettiExplosion';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { calculateTechniqueBreakdown } from '../../utils/scoring';
import type { QuestionResult, DailySession } from '../../types/progress';
import type { TechniqueBreakdown } from '../../utils/scoring';

interface SessionCompleteScreenProps {
  currentUser: { name: string };
  results: QuestionResult[];
  avgTechnique: number;
  correctCount: number;
  minutes: number;
  seconds: number;
  totalXp: number;
  sessionStars: number;
  message: string;
  onGoHome: () => void;
  previousSession?: DailySession | null;
  focusSubject?: string | null;
}

function TechniqueBar({ label, icon, value, total, isPercent }: {
  label: string;
  icon: React.ReactNode;
  value: number;
  total: number;
  isPercent?: boolean;
}) {
  const pct = isPercent ? value : (total > 0 ? Math.round((value / total) * 100) : 0);
  const colour = pct >= 80 ? 'bg-calm-400' : pct >= 50 ? 'bg-celebrate-amber' : 'bg-rainbow-red';
  const textColour = pct >= 80 ? 'text-calm-600' : pct >= 50 ? 'text-celebrate-amber' : 'text-rainbow-red';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-display font-bold text-gray-600">{label}</span>
        </div>
        <span className={`text-xs font-display font-bold ${textColour}`}>
          {isPercent ? `${value}%` : `${value}/${total}`}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full rounded-full ${colour}`}
        />
      </div>
    </div>
  );
}

function ComparisonArrow({ current, previous, label }: {
  current: number;
  previous: number;
  label: string;
}) {
  const diff = current - previous;
  if (diff === 0) return (
    <div className="flex items-center gap-1 text-xs text-gray-400 font-display">
      <Minus className="w-3 h-3" /> {label}: same
    </div>
  );
  const isUp = diff > 0;
  return (
    <div className={`flex items-center gap-1 text-xs font-display font-bold ${isUp ? 'text-calm-500' : 'text-rainbow-red'}`}>
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {label}: {isUp ? '+' : ''}{diff}{label === 'Technique' ? '%' : ''}
    </div>
  );
}

export function SessionCompleteScreen({
  currentUser,
  results,
  avgTechnique,
  correctCount,
  minutes,
  seconds,
  totalXp,
  sessionStars,
  message,
  onGoHome,
  previousSession,
}: SessionCompleteScreenProps) {
  const [animatedXp, setAnimatedXp] = useState(0);
  const showConfetti = sessionStars >= 2;
  const { play } = useSoundEffects();
  const navigate = useNavigate();

  const breakdown: TechniqueBreakdown = calculateTechniqueBreakdown(results);
  const wrongResults = results.filter(r => !r.correct);

  // Play session complete sound
  useEffect(() => {
    play('sessionComplete');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Animate XP counter
  useEffect(() => {
    if (totalXp === 0) return;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedXp(Math.round(progress * totalXp));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const timeout = setTimeout(() => requestAnimationFrame(tick), 600);
    return () => clearTimeout(timeout);
  }, [totalXp]);

  const hootMood = sessionStars >= 3 ? 'celebrating' as const
    : sessionStars >= 2 ? 'happy' as const
    : 'encouraging' as const;

  // Professor Hoot technique insight
  const getHootInsight = () => {
    const { readTwice, readingTime, keyWords, elimination } = breakdown;
    const readTwicePct = readTwice.total > 0 ? (readTwice.score / readTwice.total) * 100 : 0;
    const readingTimePct = readingTime.total > 0 ? (readingTime.score / readingTime.total) * 100 : 0;
    const eliminationPct = elimination.total > 0 ? (elimination.score / elimination.total) * 100 : 0;

    const scores = [
      { name: 'reading twice', pct: readTwicePct },
      { name: 'reading time', pct: readingTimePct },
      { name: 'finding key words', pct: keyWords.score },
      { name: 'eliminating wrong answers', pct: eliminationPct },
    ];

    const strongest = scores.reduce((a, b) => a.pct >= b.pct ? a : b);
    const weakest = scores.reduce((a, b) => a.pct <= b.pct ? a : b);

    if (strongest.pct === weakest.pct && strongest.pct >= 80) {
      return `Brilliant all-round technique, ${currentUser.name}! You're using every step like a pro!`;
    }
    if (weakest.pct < 50) {
      return `Great ${strongest.name}! Try focusing on ${weakest.name} next time — it'll boost your score even more!`;
    }
    return `Strongest skill: ${strongest.name}. Keep practising ${weakest.name} to level up further!`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-5 py-4"
    >
      <ConfettiExplosion trigger={showConfetti} />

      {/* Stars display */}
      <div className="flex justify-center gap-3 pt-2">
        {[1, 2, 3].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{
              scale: i <= sessionStars ? 1 : 0.5,
              rotate: 0,
              opacity: i <= sessionStars ? 1 : 0.15,
            }}
            transition={{ type: 'spring', delay: 0.3 + i * 0.2, damping: 10 }}
            className="text-5xl"
          >
            {i <= sessionStars ? '\u2B50' : '\u2606'}
          </motion.span>
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <h2 className="font-display text-2xl font-bold text-focus-800">Quest Complete!</h2>
      </motion.div>

      {/* XP earned */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', damping: 12 }}
        className="text-center bg-white rounded-card p-5 shadow-sm border-2 border-celebrate-amber/30"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Zap className="w-6 h-6 text-celebrate-amber" />
          <span className="font-display font-bold text-3xl text-celebrate-amber">
            +{animatedXp} XP
          </span>
        </div>
        <div className="flex justify-center gap-4 text-xs text-gray-500 font-display">
          <span>Technique: +{results.reduce((s, r) => s + Math.round(r.techniqueScore.overallTechniquePercent * 0.5), 0)}</span>
          <span>Correct: +{correctCount * 30}</span>
        </div>
      </motion.div>

      {/* Professor Hoot message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <ProfessorHoot
          mood={hootMood}
          size="lg"
          message={message}
          showSpeechBubble={true}
          animate={true}
        />
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="bg-white rounded-card p-4 shadow-sm border border-focus-100 text-center">
          <Target className="w-6 h-6 text-focus-500 mx-auto mb-1" />
          <p className="font-display font-bold text-xl text-focus-700">{avgTechnique}%</p>
          <p className="text-xs text-gray-500">Technique</p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-sm border border-focus-100 text-center">
          <Star className="w-6 h-6 text-calm-500 mx-auto mb-1" />
          <p className="font-display font-bold text-xl text-calm-600">{correctCount}/{results.length}</p>
          <p className="text-xs text-gray-500">Correct</p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-sm border border-focus-100 text-center">
          <Clock className="w-6 h-6 text-celebrate-amber mx-auto mb-1" />
          <p className="font-display font-bold text-xl text-gray-700">{minutes}:{seconds.toString().padStart(2, '0')}</p>
          <p className="text-xs text-gray-500">Time</p>
        </div>
      </motion.div>

      {/* Technique Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-white rounded-card p-4 shadow-sm border border-focus-100"
      >
        <h3 className="font-display font-bold text-sm text-gray-700 mb-3">Technique Breakdown</h3>
        <div className="space-y-3">
          <TechniqueBar
            label="Read twice"
            icon={<BookOpen className="w-3.5 h-3.5 text-celebrate-amber" />}
            value={breakdown.readTwice.score}
            total={breakdown.readTwice.total}
          />
          <TechniqueBar
            label="Reading time"
            icon={<Clock className="w-3.5 h-3.5 text-rainbow-blue" />}
            value={breakdown.readingTime.score}
            total={breakdown.readingTime.total}
          />
          <TechniqueBar
            label="Key words found"
            icon={<Highlighter className="w-3.5 h-3.5 text-calm-500" />}
            value={breakdown.keyWords.score}
            total={breakdown.keyWords.total}
            isPercent
          />
          <TechniqueBar
            label="Eliminated correctly"
            icon={<XCircle className="w-3.5 h-3.5 text-rainbow-red" />}
            value={breakdown.elimination.score}
            total={breakdown.elimination.total}
          />
        </div>

        {/* Comparison to previous session */}
        {previousSession ? (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-display font-bold mb-1.5">VS LAST SESSION</p>
            <div className="flex flex-wrap gap-3">
              <ComparisonArrow
                current={avgTechnique}
                previous={previousSession.averageTechniqueScore}
                label="Technique"
              />
              <ComparisonArrow
                current={correctCount}
                previous={previousSession.questions.filter(q => q.correct).length}
                label="Correct"
              />
            </div>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-display font-bold">
              🎉 First session!
            </span>
          </div>
        )}
      </motion.div>

      {/* Professor Hoot technique insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-purple-50 rounded-card p-4 border border-purple-200"
      >
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-display font-bold text-purple-700 mb-1">Hoot's Insight</p>
            <p className="text-sm text-purple-600 font-display">{getHootInsight()}</p>
          </div>
        </div>
      </motion.div>

      {/* Question-by-question results */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-white rounded-card p-4 shadow-sm border border-focus-100"
      >
        <h3 className="font-display font-bold text-focus-700 mb-3">Your Answers</h3>
        <div className="space-y-2">
          {results.map((result, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                result.correct ? 'bg-calm-500' : 'bg-rainbow-red'
              }`}>
                {result.correct ? '\u2713' : '\u2717'}
              </span>
              <span className="text-sm text-gray-600 flex-1">
                Q{i + 1}
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-gray-400" />
                <span className={`text-sm font-display font-bold ${
                  result.techniqueScore.overallTechniquePercent >= 80 ? 'text-calm-500' :
                  result.techniqueScore.overallTechniquePercent >= 50 ? 'text-celebrate-amber' :
                  'text-rainbow-red'
                }`}>
                  {result.techniqueScore.overallTechniquePercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Review Mistakes button */}
      {wrongResults.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/review-mistakes', { state: { results: wrongResults } })}
          className="w-full py-3.5 rounded-button font-display font-bold text-purple-700 text-base bg-purple-100 hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 border border-purple-200"
        >
          Review Mistakes ({wrongResults.length}) 🔍
        </motion.button>
      )}

      {/* Go home button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        whileTap={{ scale: 0.97 }}
        onClick={onGoHome}
        className="w-full py-4 rounded-button font-display font-bold text-white text-lg rainbow-gradient hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        Back to the Nest! 🦉
      </motion.button>
    </motion.div>
  );
}
