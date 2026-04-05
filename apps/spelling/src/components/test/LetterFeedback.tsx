interface LetterFeedbackProps {
  target: string;
  typed: string;
}

export function LetterFeedback({ target, typed }: LetterFeedbackProps) {
  const maxLen = Math.max(target.length, typed.length);

  return (
    <div className="flex flex-wrap justify-center gap-0.5 font-mono text-2xl">
      {Array.from({ length: maxLen }, (_, i) => {
        const targetChar = target[i] ?? '';
        const typedChar = typed[i] ?? '';
        const isCorrect = targetChar.toLowerCase() === typedChar.toLowerCase();
        const isMissing = i >= typed.length;
        const isExtra = i >= target.length;

        return (
          <span
            key={i}
            className={`w-8 h-10 flex items-center justify-center rounded ${
              isExtra ? 'bg-red-100 text-red-600' :
              isMissing ? 'bg-amber-100 text-amber-600' :
              isCorrect ? 'bg-emerald-100 text-emerald-700' :
              'bg-red-100 text-red-600'
            }`}
          >
            {isExtra ? typedChar : isMissing ? targetChar : isCorrect ? typedChar : targetChar}
          </span>
        );
      })}
    </div>
  );
}
