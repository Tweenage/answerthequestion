interface TestProgressProps {
  total: number;
  results: (boolean | null)[];
}

export function TestProgress({ total, results }: TestProgressProps) {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const result = results[i];
        return (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              result === true ? 'bg-emerald-500' :
              result === false ? 'bg-red-400' :
              'bg-slate-300'
            }`}
          />
        );
      })}
    </div>
  );
}
