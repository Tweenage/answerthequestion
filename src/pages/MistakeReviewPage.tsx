import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { allQuestions } from '../data/questions';
import { useProgressStore } from '../stores/useProgressStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import type { QuestionResult } from '../types/progress';

export function MistakeReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const getProgress = useProgressStore(s => s.getProgress);

  const { results: locationResults, questions: questionIds } = (location.state ?? {}) as {
    results?: QuestionResult[];
    questions?: string[];
  };

  // Fallback: if location.state is missing (page refresh), derive from the most recent session
  const mistakeData = useMemo(() => {
    let results = locationResults;
    let ids = questionIds;

    if (!results && !ids && currentUser) {
      const progress = getProgress(currentUser.id);
      const latestSession = [...progress.sessions]
        .filter(s => s.completed)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      if (latestSession) {
        results = latestSession.questions;
      }
    }

    const wrongResults = (results ?? []).filter(r => !r.correct);
    const wrongQuestionIds = wrongResults.map(r => r.questionId);
    const finalIds = ids ?? wrongQuestionIds;

    return finalIds.map(id => {
      const question = allQuestions.find(q => q.id === id);
      const result = wrongResults.find(r => r.questionId === id);
      return { question, result };
    }).filter(d => d.question);
  }, [locationResults, questionIds, currentUser, getProgress]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  if (mistakeData.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <ProfessorHoot mood="celebrating" size="lg" message="No mistakes to review! You're doing brilliantly!" showSpeechBubble animate />
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-button font-display font-bold text-white rainbow-gradient">
          Back to the Nest! 🦉
        </button>
      </div>
    );
  }

  const current = mistakeData[currentIdx];
  const q = current.question!;
  const r = current.result;

  const goNext = () => {
    if (currentIdx < mistakeData.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    }
  };

  const selectedIdx = r?.selectedOptionIndex ?? -1;

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white font-display text-sm flex items-center gap-1" aria-label="Go back">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Back
        </button>
        <span className="text-white/60 font-display text-sm font-bold">
          Mistake {currentIdx + 1} of {mistakeData.length}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIdx}
          initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Question text */}
          <div className="bg-white rounded-card p-5 shadow-sm border border-focus-100">
            <p className="font-display text-gray-800 leading-relaxed">{q.questionText}</p>
          </div>

          {/* Answer options */}
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctOptionIndex;
              const isSelected = i === selectedIdx;
              const label = String.fromCharCode(65 + i);

              return (
                <div
                  key={i}
                  className={`rounded-card p-4 border-2 flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-calm-50 border-calm-400'
                      : isSelected
                      ? 'bg-red-50 border-red-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCorrect ? 'bg-calm-500 text-white' : isSelected ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : label}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-display ${
                      isCorrect ? 'text-calm-700 font-bold' : isSelected ? 'text-red-700 font-bold' : 'text-gray-600'
                    }`}>
                      {opt.text}
                    </p>
                    {isCorrect && (
                      <p className="text-xs text-calm-600 mt-1 font-display">✓ Correct answer</p>
                    )}
                    {isSelected && !isCorrect && (
                      <p className="text-xs text-red-500 mt-1 font-display">✗ Your answer</p>
                    )}
                    {isSelected && !isCorrect && opt.eliminationReason && (
                      <p className="text-xs text-red-400 mt-1 font-display italic">{opt.eliminationReason}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation from Professor Hoot */}
          <div className="bg-white rounded-card p-4 border-2 border-purple-200">
            <ProfessorHoot
              mood="teaching"
              size="sm"
              message={q.explanation}
              showSpeechBubble
              animate={false}
            />
          </div>

          {/* Trick type */}
          {q.trickType && (
            <div className="bg-rainbow-indigo/10 rounded-card p-3 border border-rainbow-indigo/30">
              <p className="font-display font-bold text-sm text-rainbow-indigo">
                💡 This was a tricky question!
              </p>
              <p className="text-xs text-gray-600 mt-1 font-display">
                {q.trickType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} trap
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          className={`flex items-center gap-1 px-4 py-2.5 rounded-button font-display font-bold text-sm ${
            currentIdx === 0 ? 'text-white/30' : 'text-white bg-white/20 hover:bg-white/30'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {currentIdx < mistakeData.length - 1 ? (
          <button
            onClick={goNext}
            className="flex items-center gap-1 px-4 py-2.5 rounded-button font-display font-bold text-sm text-white bg-white/20 hover:bg-white/30"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-button font-display font-bold text-sm text-white rainbow-gradient"
          >
            Done! 🦉
          </button>
        )}
      </div>
    </div>
  );
}
