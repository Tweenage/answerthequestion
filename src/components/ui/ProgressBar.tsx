interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  colour?: 'honey' | 'meadow' | 'buzz';
}

const FILL_CLASS: Record<NonNullable<ProgressBarProps['colour']>, string> = {
  honey: 'bg-honey-500',
  meadow: 'bg-meadow-500',
  buzz: 'bg-buzz-500',
};

export function ProgressBar({ value, className = '', colour = 'honey' }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillClass = FILL_CLASS[colour];

  return (
    <div
      className={`h-2 rounded-full bg-honey-100 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillClass}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
