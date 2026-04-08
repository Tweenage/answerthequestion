import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ScaffoldingLevel } from '../../types/programme';
import { isNumberWord, toDigit } from '../../utils/numberWords';

// Research-backed "danger words" that genuinely change the meaning of an exam question.
// Restricted to words that, if missed, would lead directly to the wrong answer.
// Removed over-broad words ('at', 'each', 'more', 'less', 'before', 'after', 'between', 'until')
// that appear too frequently to provide a useful teaching signal in Foundation phase.

interface HighlightableTextProps {
  tokens: string[];
  highlightedIndices: number[];
  onToggleHighlight: (index: number) => void;
  disabled: boolean;
  correctKeyWordIndices?: number[];
  showFeedback: boolean;
  scaffoldingLevel: ScaffoldingLevel;
  numberExtractionMode?: boolean;
  convertedNumberIndices?: number[];
  onConvertNumber?: (index: number) => void;
  dyslexiaMode?: boolean;
}

export function HighlightableText({
  tokens,
  highlightedIndices,
  onToggleHighlight,
  disabled,
  correctKeyWordIndices,
  showFeedback,
  scaffoldingLevel,
  numberExtractionMode = false,
  convertedNumberIndices = [],
  onConvertNumber,
  dyslexiaMode = false,
}: HighlightableTextProps) {
  // Track which tokens have been animated (for the pop effect)
  const [justConverted, setJustConverted] = useState<Set<number>>(new Set());

  const getTokenStyle = (index: number) => {
    const isHighlighted = highlightedIndices.includes(index);
    const isCorrectKeyWord = correctKeyWordIndices?.includes(index);

    if (showFeedback && correctKeyWordIndices) {
      if (isHighlighted && isCorrectKeyWord) {
        return 'bg-calm-200 border-b-3 border-calm-500 font-semibold';
      }
      if (!isHighlighted && isCorrectKeyWord) {
        return 'border-b-3 border-dashed border-celebrate-orange';
      }
      if (isHighlighted && !isCorrectKeyWord) {
        return 'bg-gray-100 line-through text-gray-400';
      }
      return '';
    }

    if (isHighlighted) {
      return 'bg-highlighter font-semibold shadow-sm';
    }

    return '';
  };

  const getNumberExtractionStyle = (index: number) => {
    if (!numberExtractionMode) return '';
    if (!isNumberWord(tokens[index])) return '';

    if (convertedNumberIndices.includes(index)) {
      return 'bg-rainbow-blue/15 text-rainbow-blue font-bold rounded-lg border-2 border-rainbow-blue/40';
    }

    // Unconverted number word — pulsing blue border
    return 'border-2 border-rainbow-blue/60 rounded-lg cursor-pointer animate-pulse bg-blue-50';
  };

  const handleTokenClick = (index: number) => {
    if (numberExtractionMode) {
      if (isNumberWord(tokens[index]) && !convertedNumberIndices.includes(index) && onConvertNumber) {
        onConvertNumber(index);
        setJustConverted(prev => new Set(prev).add(index));
        setTimeout(() => {
          setJustConverted(prev => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        }, 500);
      }
      return;
    }

    if (!disabled) {
      onToggleHighlight(index);
    }
  };

  // Get the display text for a token (converted digit or original)
  const getDisplayText = (token: string, index: number) => {
    if (numberExtractionMode && convertedNumberIndices.includes(index)) {
      return toDigit(token);
    }
    return token;
  };

  return (
    <div className={`leading-[2.0] text-[1.3rem] font-display ${dyslexiaMode ? 'dyslexia-text' : ''}`}>
      {tokens.map((token, index) => {
        const isClickable = numberExtractionMode
          ? (isNumberWord(token) && !convertedNumberIndices.includes(index))
          : !disabled;
        const wasJustConverted = justConverted.has(index);

        return (
          <motion.span
            key={index}
            onClick={() => handleTokenClick(index)}
            whileTap={isClickable ? { scale: 0.95 } : undefined}
            animate={wasJustConverted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={wasJustConverted ? { duration: 0.3 } : undefined}
            className={`
              inline-block px-1 py-0.5
              rounded transition-all duration-150 select-none
              ${isClickable ? 'cursor-pointer hover:bg-focus-100 active:bg-focus-200' : ''}
              ${getTokenStyle(index)}
              ${getNumberExtractionStyle(index)}
            `}
            style={{ touchAction: 'manipulation', minHeight: '44px', lineHeight: 'inherit' }}
          >
            {getDisplayText(token, index)}
            {numberExtractionMode && isNumberWord(token) && !convertedNumberIndices.includes(index) && (
              <span className={`ml-0.5 ${dyslexiaMode ? 'text-xs' : 'text-[10px]'} text-rainbow-blue font-bold align-super`}>123</span>
            )}
          </motion.span>
        );
      })}

      {numberExtractionMode && scaffoldingLevel === 'heavy' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-rainbow-blue font-display bg-blue-50 rounded-xl p-3 border border-blue-200 space-y-1"
        >
          <p className="font-bold text-base">🔢 Tap the number words to turn them into digits!</p>
          <p className={`${dyslexiaMode ? 'text-sm text-gray-700' : 'text-xs text-gray-500'}`}>
            In your exam, always circle numbers and write the digit next to any number words.
          </p>
        </motion.div>
      )}
      {numberExtractionMode && scaffoldingLevel === 'medium' && (
        <p className={`mt-3 ${dyslexiaMode ? 'text-base' : 'text-sm'} text-rainbow-blue font-display font-semibold`}>
          🔢 Tap number words to convert them to digits.
        </p>
      )}

      {!numberExtractionMode && !disabled && (scaffoldingLevel === 'heavy' || scaffoldingLevel === 'medium') && (
        <p className={`mt-3 ${dyslexiaMode ? 'text-sm text-gray-700' : 'text-xs text-gray-500'} font-display`}>
          Are there any danger words? not, never, except, only, although, however
        </p>
      )}
    </div>
  );
}
