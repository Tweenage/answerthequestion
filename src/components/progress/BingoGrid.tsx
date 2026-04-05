import type { SpellingWord } from '../../types/spelling';
import { BingoCell } from './BingoCell';
import { useSpellingProgressStore } from '../../stores/useSpellingProgressStore';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface BingoGridProps {
  words: SpellingWord[];
  title: string;
}

export function BingoGrid({ words, title }: BingoGridProps) {
  const user = useCurrentUser();
  const getWordProgress = useSpellingProgressStore(s => s.getWordProgress);

  const cols = 10;

  const masteredCount = words.filter(w => {
    if (!user) return false;
    return getWordProgress(user.id, w.id).stars === 3;
  }).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display font-bold text-lg text-slate-800">{title}</h3>
        <span className="text-sm text-slate-500">
          {masteredCount}/{words.length} mastered
        </span>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {words.map(word => {
          const progress = user ? getWordProgress(user.id, word.id) : null;
          const stars = progress?.stars ?? 0;
          return <BingoCell key={word.id} word={word.word} stars={stars} />;
        })}
      </div>
    </div>
  );
}
