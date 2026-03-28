import type { CategoryScore } from '../../utils/dashboardAnalytics';
import type { Subject } from '../../types/question';

interface CategoryBreakdownProps {
  categoryScores: CategoryScore[];
}

const SUBJECT_LABELS: Record<Subject, string> = {
  english: 'English',
  maths: 'Maths',
  reasoning: 'Reasoning',
};

const CATEGORY_LABELS: Record<string, string> = {
  'comprehension-what': 'What questions',
  'comprehension-who': 'Who questions',
  'comprehension-where': 'Where questions',
  'comprehension-when': 'When questions',
  'comprehension-why': 'Why questions',
  'comprehension-how-many': 'How many questions',
  'comprehension-inference': 'Inference',
  'vocabulary': 'Vocabulary',
  'vocabulary-synonyms': 'Synonyms',
  'vocabulary-antonyms': 'Antonyms',
  'vocabulary-in-context': 'Vocabulary in context',
  'summarising': 'Summarising',
  'figurative-language': 'Figurative language',
  'authors-purpose': "Author's purpose",
  'word-problems': 'Word problems',
  'fractions': 'Fractions',
  'percentages': 'Percentages',
  'ratio': 'Ratio',
  'algebra': 'Algebra',
  'geometry': 'Geometry',
  'averages': 'Averages',
  'sequences': 'Sequences',
  'place-value': 'Place value',
  'number-properties': 'Number properties',
  'arithmetic': 'Arithmetic',
  'decimals': 'Decimals',
  'negative-numbers': 'Negative numbers',
  'missing-digits': 'Missing digits',
  'measurement': 'Measurement',
  'time': 'Time',
  'money': 'Money',
  'data': 'Data & charts',
  'symmetry': 'Symmetry',
  'coordinates': 'Coordinates',
  'bodmas': 'BODMAS',
  'probability': 'Probability',
  'invented-operations': 'Invented operations',
  'venn-diagrams': 'Venn diagrams',
  'logic-sequence': 'Logic: sequences',
  'logic-code': 'Logic: codes',
  'logic-direction': 'Logic: directions',
  'logic-venn': 'Logic: Venn',
  'logic-grid': 'Logic: grids',
  'logic-pattern': 'Logic: patterns',
  'logic-deduction': 'Logic: deduction',
  'compass': 'Compass directions',
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
              const label = CATEGORY_LABELS[score.category] ?? score.category;
              return (
                <div key={score.category} className={`flex items-center justify-between rounded-lg px-3 py-2 ${style.bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                    <span className="font-display text-sm text-gray-700">{label}</span>
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
