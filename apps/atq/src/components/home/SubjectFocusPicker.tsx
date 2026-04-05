import { Link } from 'react-router';
import type { Subject } from '../../types/question';
import type { SubjectProgress } from '../../types/progress';

const SUBJECTS: { key: Subject; label: string; emoji: string; color: string }[] = [
  { key: 'english', label: 'English', emoji: '📖', color: 'from-pink-400 to-rose-500' },
  { key: 'maths', label: 'Maths', emoji: '🔢', color: 'from-blue-400 to-indigo-500' },
  { key: 'reasoning', label: 'Reasoning', emoji: '🧩', color: 'from-fuchsia-400 to-purple-500' },
];

interface SubjectFocusPickerProps {
  subjectScores: Record<Subject, SubjectProgress>;
}

export function SubjectFocusPicker({ subjectScores }: SubjectFocusPickerProps) {
  return (
    <div>
      <p className="text-white/90 text-sm font-display font-bold mb-2 text-center">
        🎯 Or focus on one subject...
      </p>
      <div className="grid grid-cols-4 gap-2">
        {SUBJECTS.map(({ key, label, emoji, color }) => {
          const score = subjectScores[key];
          const accuracy = score.questionsAttempted > 0
            ? Math.round((score.questionsCorrect / score.questionsAttempted) * 100)
            : null;

          return (
            <Link
              key={key}
              to={`/practice?subject=${key}`}
              className={`bg-gradient-to-br ${color} rounded-card p-2.5 text-center hover:scale-[1.03] active:scale-[0.97] transition-transform shadow-md`}
            >
              <span className="text-xl block">{emoji}</span>
              <p className="font-display font-bold text-white text-xs mt-1">{label}</p>
              {accuracy !== null && (
                <p className="text-white/80 text-[11px] font-display">{accuracy}%</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
