import { ON_PAPER_TIPS } from '../../data/techniques';

export function OnPaperSection() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-display font-bold text-white text-base">
          🖊️ In Your Real Exam
        </h3>
        <p className="text-white/70 text-xs font-display mt-0.5">
          Use these tricks on paper — they really work!
        </p>
      </div>

      <div className="space-y-2">
        {ON_PAPER_TIPS.map(tip => (
          <div
            key={tip.id}
            className="bg-white/90 backdrop-blur-sm rounded-card p-3 border border-white/30 flex items-start gap-3"
          >
            <span className="text-xl shrink-0 mt-0.5">{tip.emoji}</span>
            <div>
              <p className="font-display font-bold text-gray-800 text-sm">{tip.title}</p>
              <p className="text-gray-600 text-xs leading-relaxed mt-0.5">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
