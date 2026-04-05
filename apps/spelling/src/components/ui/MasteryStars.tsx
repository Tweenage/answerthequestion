interface MasteryStarsProps {
  score: number; // 0–5
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASS: Record<NonNullable<MasteryStarsProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export function MasteryStars({ score, size = 'md' }: MasteryStarsProps) {
  const clampedScore = Math.max(0, Math.min(5, Math.round(score)));
  const sizeClass = SIZE_CLASS[size];

  return (
    <span className={`inline-flex gap-0.5 ${sizeClass}`} aria-label={`${clampedScore} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} role="img" aria-hidden="true">
          {i < clampedScore ? '⭐' : <span className="text-gray-300">☆</span>}
        </span>
      ))}
    </span>
  );
}
