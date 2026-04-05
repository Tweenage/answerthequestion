interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  if (streak === 0) {
    return (
      <span className={`inline-flex items-center gap-1 text-gray-400 font-bold ${className}`}>
        <span role="img" aria-label="no streak" className="opacity-30">🔥</span>
        <span>0</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-bold text-honey-600 ${className}`}>
      <span role="img" aria-label="streak fire">🔥</span>
      <span>{streak}</span>
    </span>
  );
}
