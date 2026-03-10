/**
 * Maps number words to their digit equivalents.
 * Used for the NUMBER_EXTRACTION step where children tap
 * number words to convert them to digits — training the
 * "circle all numbers immediately" exam reflex.
 */

const UNITS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4',
  five: '5', six: '6', seven: '7', eight: '8', nine: '9',
  ten: '10', eleven: '11', twelve: '12', thirteen: '13',
  fourteen: '14', fifteen: '15', sixteen: '16', seventeen: '17',
  eighteen: '18', nineteen: '19',
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const LARGE: Record<string, number> = {
  hundred: 100, thousand: 1000,
};

/**
 * Checks whether a token (possibly with trailing punctuation) is a number word.
 * Handles simple words ("twelve"), hyphenated compounds ("twenty-four"),
 * and "hundred"/"thousand".
 */
export function isNumberWord(token: string): boolean {
  const cleaned = token.toLowerCase().replace(/[.,!?;:"'()]/g, '');
  if (!cleaned) return false;

  // Direct match
  if (UNITS[cleaned] !== undefined) return true;
  if (TENS[cleaned] !== undefined) return true;
  if (LARGE[cleaned] !== undefined) return true;

  // Hyphenated compound: "twenty-four"
  if (cleaned.includes('-')) {
    const [tens, units] = cleaned.split('-');
    if (TENS[tens] !== undefined && UNITS[units] !== undefined) return true;
  }

  return false;
}

/**
 * Converts a number word token to its digit string.
 * Returns the original token if not a number word.
 */
export function toDigit(token: string): string {
  // Preserve trailing punctuation
  const match = token.match(/^(.+?)([.,!?;:"'()]+)?$/);
  if (!match) return token;

  const word = match[1].toLowerCase();
  const punctuation = match[2] || '';

  // Direct match
  if (UNITS[word] !== undefined) return UNITS[word] + punctuation;
  if (TENS[word] !== undefined) return String(TENS[word]) + punctuation;
  if (LARGE[word] !== undefined) return String(LARGE[word]) + punctuation;

  // Hyphenated compound: "twenty-four" → "24"
  if (word.includes('-')) {
    const [tens, units] = word.split('-');
    if (TENS[tens] !== undefined && UNITS[units] !== undefined) {
      return String(TENS[tens] + Number(UNITS[units])) + punctuation;
    }
  }

  return token;
}

/**
 * Returns all indices of number-word tokens in a token array.
 */
export function findNumberWordIndices(tokens: string[]): number[] {
  return tokens
    .map((token, index) => isNumberWord(token) ? index : -1)
    .filter(i => i !== -1);
}
