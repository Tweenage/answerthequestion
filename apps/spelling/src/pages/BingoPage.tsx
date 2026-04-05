import { useState } from 'react';
import { WORDS_BY_DIFFICULTY } from '../data/words';
import { BingoGrid } from '../components/progress/BingoGrid';

const BLOCKS = [
  { key: 1 as const, label: 'Year 3/4', subtitle: 'D1 — Foundation' },
  { key: 2 as const, label: 'Year 5/6', subtitle: 'D2 — Building' },
  { key: 3 as const, label: '11+', subtitle: 'D3 — Advanced' },
];

export default function BingoPage() {
  const [activeBlock, setActiveBlock] = useState<1 | 2 | 3>(1);

  const words = WORDS_BY_DIFFICULTY[activeBlock];
  const grids = activeBlock === 3
    ? Array.from({ length: Math.ceil(words.length / 100) }, (_, i) =>
        words.slice(i * 100, (i + 1) * 100)
      )
    : [words];

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-display text-2xl font-bold text-slate-800">Word Grid</h2>

      {/* Block tabs */}
      <div className="flex gap-2">
        {BLOCKS.map(b => (
          <button
            key={b.key}
            onClick={() => setActiveBlock(b.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-colors ${
              activeBlock === b.key
                ? 'bg-amber-500 text-white'
                : 'bg-white/60 text-slate-600'
            }`}
          >
            <div>{b.label}</div>
            <div className="text-[10px] opacity-70">{b.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Grids */}
      {grids.map((gridWords, i) => (
        <BingoGrid
          key={`${activeBlock}-${i}`}
          words={gridWords}
          title={activeBlock === 3 ? `11+ Vocabulary (${i + 1}/${grids.length})` : BLOCKS.find(b => b.key === activeBlock)!.label}
        />
      ))}
    </div>
  );
}
