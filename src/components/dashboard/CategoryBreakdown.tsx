import type { CategoryScore } from '../../utils/dashboardAnalytics';
import type { Subject } from '../../types/question';
import { getBondName, BOND_TAXONOMY } from '../../data/bondTaxonomy';

interface CategoryBreakdownProps {
  categoryScores: CategoryScore[];
}

const SUBJECT_LABELS: Record<Subject, string> = {
  english: 'English',
  maths: 'Maths',
  reasoning: 'Reasoning',
};

const RAG_STYLES: Record<CategoryScore['rag'], { dot: string; bg: string; text: string }> = {
  red:   { dot: 'bg-red-400',     bg: 'bg-red-50',     text: 'text-red-700' },
  amber: { dot: 'bg-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-700' },
  green: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const SUBJECT_ORDER: Subject[] = ['english', 'maths', 'reasoning'];

export function CategoryBreakdown({ categoryScores }: CategoryBreakdownProps) {
  if (categoryScores.length === 0) {
    return (
      <div className="bg-white rounded-card p-4 shadow-sm text-center">
        <p className="text-gray-400 font-display text-sm">
          Complete more sessions to see your category breakdown.
        </p>
      </div>
    );
  }

  const bySubject = SUBJECT_ORDER.map(subject => ({
    subject,
    scores: categoryScores.filter(c => c.subject === subject),
  })).filter(g => g.scores.length > 0);

  return (
    <div className="bg-white rounded-card shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-display font-bold text-sm text-gray-700">Question Type Breakdown</h3>
        <p className="font-display text-xs text-gray-400 mt-0.5">
          Categories you&rsquo;ve tried 3+ times
        </p>
      </div>

      {bySubject.map(({ subject, scores }) => (
        <div key={subject} className="px-4 pb-3">
          <p className="font-display text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">
            {SUBJECT_LABELS[subject]}
          </p>
          <div className="space-y-1.5">
            {scores.map(score => {
              const style = RAG_STYLES[score.rag];
              return (
                <div key={score.category} className={`flex items-center justify-between rounded-lg px-3 py-2 ${style.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                    <div className="flex flex-col">
                      <span className="font-display text-sm text-gray-700">{getBondName(score.category)}</span>
                      {BOND_TAXONOMY[score.category]?.description && (
                        <span className="font-display text-xs text-gray-400">{BOND_TAXONOMY[score.category].description}</span>
                      )}
                    </div>
                  </div>
                  <span className={`font-display font-bold text-sm ${style.text}`}>
                    {score.accuracyPct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
