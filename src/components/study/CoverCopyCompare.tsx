import { useState, useEffect, useRef } from 'react';
import type { SpellingWord } from '../../types/spelling';
import { gradeAnswer } from '../../utils/sm2';
import { BeeChar } from '../mascot/BeeChar';

interface CoverCopyCompareProps {
  word: SpellingWord;
  onComplete: (grade: number, responseTimeMs: number) => void;
  dyslexiaMode: boolean;
}

type Phase = 'show' | 'cover' | 'type' | 'compare';

export function CoverCopyCompare({ word, onComplete, dyslexiaMode }: CoverCopyCompareProps) {
  const [phase, setPhase] = useState<Phase>('show');
  const [typed, setTyped] = useState('');
  const startTimeRef = useRef<number>(0);
  const [responseTimeMs, setResponseTimeMs] = useState(0);
  const calledRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when word changes
  useEffect(() => {
    setPhase('show');
    setTyped('');
    setResponseTimeMs(0);
    calledRef.current = false;
  }, [word.id]);

  // Start timer when entering type phase
  useEffect(() => {
    if (phase === 'type') {
      startTimeRef.current = Date.now();
      inputRef.current?.focus();
    }
  }, [phase]);

  function handleSubmit() {
    if (phase !== 'type') return;
    const elapsed = Date.now() - startTimeRef.current;
    setResponseTimeMs(elapsed);
    setPhase('compare');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleNext() {
    if (calledRef.current) return;
    calledRef.current = true;
    const isCorrect =
      typed.trim().toLowerCase() === word.word.toLowerCase() &&
      typed.trim().length === word.word.length;
    const grade = gradeAnswer(isCorrect, responseTimeMs);
    onComplete(grade, responseTimeMs);
  }

  // Render the word with tricky characters highlighted
  function renderWordWithHighlight(w: SpellingWord) {
    const [start, end] = w.trickyIndices[0] ?? [0, 0];
    const chars = w.word.split('');
    return (
      <span className={dyslexiaMode ? 'font-mono' : ''}>
        {chars.map((ch, i) => {
          if (i >= start && i <= end) {
            return (
              <span key={i} className="bg-honey-200 rounded px-0.5 font-bold">
                {ch}
              </span>
            );
          }
          return <span key={i}>{ch}</span>;
        })}
      </span>
    );
  }

  // Render comparison of target vs typed
  function renderComparison() {
    const target = word.word;
    const typedTrimmed = typed.trim();
    const maxLen = Math.max(target.length, typedTrimmed.length);
    const isCorrect =
      typedTrimmed.toLowerCase() === target.toLowerCase() &&
      typedTrimmed.length === target.length;

    const targetChars = target.split('');
    const typedChars = typedTrimmed.split('');

    return (
      <div className="space-y-3">
        {/* Target word */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Target</p>
          <div className="flex flex-wrap gap-0.5 text-2xl font-bold">
            {targetChars.map((ch, i) => {
              const typedCh = typedChars[i];
              const matches = typedCh !== undefined && typedCh.toLowerCase() === ch.toLowerCase();
              const missing = typedCh === undefined;
              return (
                <span
                  key={i}
                  className={
                    missing
                      ? 'text-honey-600 bg-honey-50 rounded px-0.5'
                      : matches
                      ? 'text-meadow-600 bg-meadow-50 rounded px-0.5'
                      : 'text-red-600 bg-red-50 rounded px-0.5'
                  }
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>

        {/* Typed word */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">You wrote</p>
          <div className={`flex flex-wrap gap-0.5 text-2xl font-bold ${dyslexiaMode ? 'font-mono' : ''}`}>
            {Array.from({ length: maxLen }, (_, i) => {
              const typedCh = typedChars[i];
              const targetCh = targetChars[i];
              if (typedCh === undefined) return null;
              const matches = targetCh !== undefined && typedCh.toLowerCase() === targetCh.toLowerCase();
              const extra = targetCh === undefined;
              return (
                <span
                  key={i}
                  className={
                    extra
                      ? 'text-red-600 bg-red-50 rounded px-0.5'
                      : matches
                      ? 'text-meadow-600 bg-meadow-50 rounded px-0.5'
                      : 'text-red-600 bg-red-50 rounded px-0.5'
                  }
                >
                  {typedCh}
                </span>
              );
            })}
          </div>
        </div>

        <div className={`font-bold text-lg ${isCorrect ? 'text-meadow-600' : 'text-red-600'}`}>
          {isCorrect ? 'Correct!' : `The correct spelling is: ${target}`}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-5">

        {phase === 'show' && (
          <>
            <div className="flex justify-center">
              <BeeChar mood="happy" size="md" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-4xl font-bold font-display tracking-wide">
                {renderWordWithHighlight(word)}
              </p>
              <p className="text-sm text-gray-500 italic">{word.definitions[0].definition}</p>
              <p className="text-sm text-gray-600 bg-honey-50 rounded-lg px-3 py-2">
                &ldquo;{word.definitions[0].exampleSentence}&rdquo;
              </p>
            </div>

            <button
              onClick={() => setPhase('cover')}
              className="w-full bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Cover it! 🙈
            </button>
          </>
        )}

        {phase === 'cover' && (
          <>
            <div className="flex justify-center">
              <BeeChar mood="thinking" size="md" message="Can you remember how to spell it?" />
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold tracking-wide text-transparent select-none bg-gray-200 rounded-lg py-2 px-4 inline-block">
                {'█'.repeat(word.word.length)}
              </div>
              <p className="text-sm text-gray-500 italic">{word.definitions[0].definition}</p>
            </div>

            <button
              onClick={() => setPhase('type')}
              className="w-full bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              I&apos;m ready! ✏️
            </button>
          </>
        )}

        {phase === 'type' && (
          <>
            <div className="flex justify-center">
              <BeeChar mood="encouraging" size="md" message="Spell it out!" />
            </div>

            <div className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={e => setTyped(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                placeholder="Type the word here…"
                className={`w-full border-2 border-honey-300 focus:border-honey-500 focus:outline-none rounded-xl px-4 py-3 text-xl text-center ${dyslexiaMode ? 'font-mono' : 'font-display'}`}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={typed.trim().length === 0}
              className="w-full bg-meadow-500 hover:bg-meadow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Check it! ✓
            </button>
          </>
        )}

        {phase === 'compare' && (
          <>
            <div className="flex justify-center">
              <BeeChar
                mood={
                  typed.trim().toLowerCase() === word.word.toLowerCase() &&
                  typed.trim().length === word.word.length
                    ? 'celebrating'
                    : 'warning'
                }
                size="md"
              />
            </div>

            {renderComparison()}

            <button
              onClick={handleNext}
              className="w-full bg-honey-500 hover:bg-honey-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Next word →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
