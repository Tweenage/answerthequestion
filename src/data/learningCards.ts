export interface LearningCard {
  title: string;
  tip: string;
  example?: string;
}

export const LEARNING_CARDS: Record<string, LearningCard> = {
  'comprehension-inference': {
    title: '🔍 Inference questions',
    tip: "The answer isn't stated directly — you have to work it out from clues in the text. Ask yourself: \"What does the author want me to understand here?\"",
    example: "If the passage says \"She slammed the door\", you infer she's angry — even though the word \"angry\" isn't used.",
  },
  'comprehension-why': {
    title: '❓ "Why" questions',
    tip: 'Go back to the text. The reason is usually in the same paragraph as the event. Look for "because", "so", "since", or "as a result".',
  },
  'comprehension-how-many': {
    title: '🔢 "How many" questions',
    tip: "The question is asking for a number. Read carefully — it might ask how many times something happened, how many characters, or how many days. Don't answer with a name or description.",
  },
  'vocabulary-in-context': {
    title: '📖 Vocabulary in context',
    tip: 'Cover the word and read the sentence. What word would make sense there? Then look at the options. The answer matches the meaning of the sentence, not just the word itself.',
  },
  'word-problems': {
    title: '📐 Word problems',
    tip: 'Underline the numbers and the question word (how many, how much, how far). Decide what operation is needed before you calculate.',
    example: '"If 3 bags hold 12 apples each, how many apples in total?" — multiply, not add.',
  },
  'fractions': {
    title: '½ Fractions',
    tip: 'Check what the question is asking: simplify, compare, add, subtract, or find a fraction of a number? Each needs a different method.',
  },
  'ratio': {
    title: '⚖️ Ratio & proportion',
    tip: 'Find the total number of parts first. Then divide the total by the number of parts to find one part. Multiply to find any other part.',
  },
  'logic-code': {
    title: '🔐 Code questions',
    tip: "Find the pattern by lining up the word and its code. Look at each letter's position in the alphabet. Does each letter shift by the same amount?",
  },
  'logic-direction': {
    title: '🧭 Direction questions',
    tip: "Draw a quick sketch. Mark North at the top. Move step by step — don't try to hold the whole route in your head.",
  },
  'logic-sequence': {
    title: '🔢 Sequence questions',
    tip: 'Find the rule: is it adding, multiplying, or alternating? Check if it applies consistently before choosing an answer.',
  },
  'algebra': {
    title: '🔣 Algebra',
    tip: 'Replace the letter with a number and check. Work backwards from the answer if the equation is simple enough.',
  },
  'geometry': {
    title: '📐 Shapes',
    tip: 'Read the question carefully — angles in a triangle always add up to 180°, angles on a straight line add up to 180°, angles in a quadrilateral add up to 360°.',
  },
};

export function getLearningCard(category: string | undefined): LearningCard | null {
  if (!category) return null;
  return LEARNING_CARDS[category] ?? null;
}
