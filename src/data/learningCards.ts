export interface LearningCard {
  title: string;
  tip: string;
  example?: string;
}

export const LEARNING_CARDS: Record<string, LearningCard> = {
  // ── Comprehension ────────────────────────────────────────────────────────────
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
  'comprehension-what': {
    title: '📌 "What" questions',
    tip: "Find the exact part of the passage the question refers to. Re-read that sentence, then choose the answer that matches what the text actually says — not what sounds likely.",
  },
  'comprehension-who': {
    title: '👤 "Who" questions',
    tip: "The answer is a person (or character). Read the sentence near the key event — the answer is usually named there. Don't assume from earlier in the passage.",
  },
  'comprehension-where': {
    title: '📍 "Where" questions',
    tip: "Find the part of the text that describes a location. Re-read carefully — sometimes the setting changes partway through the passage.",
  },
  'comprehension-when': {
    title: '⏰ "When" questions',
    tip: "Look for time words: morning, after, before, later, suddenly. Go back to the passage and find the moment described — time order questions can be tricky if events aren't told in order.",
  },
  // ── Vocabulary ───────────────────────────────────────────────────────────────
  'vocabulary-in-context': {
    title: '📖 Vocabulary in context',
    tip: 'Cover the word and read the sentence. What word would make sense there? Then look at the options. The answer matches the meaning of the sentence, not just the word itself.',
  },
  'vocabulary-synonyms': {
    title: '🔤 Synonyms',
    tip: 'A synonym means the same (or nearly the same) thing. Read the word in a sentence first — the correct synonym must fit the same context, not just sound similar.',
    example: '"Rapid" and "swift" are synonyms. "Quick" could also work but check all options before choosing.',
  },
  'vocabulary-antonyms': {
    title: '🔄 Antonyms',
    tip: 'An antonym means the opposite. Watch out for trap answers that are synonyms — they appear to check whether you read the question carefully.',
    example: 'Antonym of "ancient" = "modern". Trap: "old" looks related but is actually a synonym.',
  },
  // ── English skills ───────────────────────────────────────────────────────────
  'summarising': {
    title: '📝 Summarising',
    tip: "A summary captures the main point only — not every detail. Ask: \"If I had to explain this in one sentence, what would it be?\" Reject options that are too specific or too broad.",
  },
  'figurative-language': {
    title: '🎨 Figurative language',
    tip: "Read the phrase literally first, then ask: does that make sense? If not, it's figurative. Similes use 'like' or 'as'. Metaphors say one thing IS another. Personification gives human traits to objects.",
    example: '"The wind whispered through the trees" — personification. The wind doesn\'t literally whisper.',
  },
  'authors-purpose': {
    title: '✍️ Author\'s purpose',
    tip: "Ask: is the author trying to inform, persuade, entertain, or describe? Look at the tone and the word choices. Persuasive texts often use strong adjectives and facts. Informative texts are balanced.",
  },
  // ── Maths: core ─────────────────────────────────────────────────────────────
  'word-problems': {
    title: '📐 Word problems',
    tip: 'Underline the numbers and the question word (how many, how much, how far). Decide what operation is needed before you calculate.',
    example: '"If 3 bags hold 12 apples each, how many apples in total?" — multiply, not add.',
  },
  'fractions': {
    title: '½ Fractions',
    tip: 'Check what the question is asking: simplify, compare, add, subtract, or find a fraction of a number? Each needs a different method.',
  },
  'percentages': {
    title: '% Percentages',
    tip: 'To find a percentage of a number: divide by 100, then multiply by the percentage. To find what percentage one number is of another: divide the part by the whole, then multiply by 100.',
    example: '15% of 80: 80 ÷ 100 = 0.8, then 0.8 × 15 = 12.',
  },
  'ratio': {
    title: '⚖️ Ratio & proportion',
    tip: 'Find the total number of parts first. Then divide the total by the number of parts to find one part. Multiply to find any other part.',
  },
  'algebra': {
    title: '🔣 Algebra',
    tip: 'Replace the letter with a number and check. Work backwards from the answer if the equation is simple enough.',
  },
  'geometry': {
    title: '📐 Shapes',
    tip: 'Read the question carefully — angles in a triangle always add up to 180°, angles on a straight line add up to 180°, angles in a quadrilateral add up to 360°.',
  },
  'averages': {
    title: '📊 Averages',
    tip: 'Mean: add all values, divide by how many there are. Median: put values in order, find the middle. Mode: the value that appears most often. The question will say which one it wants.',
  },
  'sequences': {
    title: '🔢 Number sequences',
    tip: 'Find the rule: check the difference between each pair of terms. Is it the same each time (arithmetic)? Is it doubling or multiplying (geometric)? Does the rule alternate?',
    example: '2, 5, 10, 17, 26 — differences are +3, +5, +7, +9. The gaps increase by 2 each time.',
  },
  'place-value': {
    title: '🔟 Place value',
    tip: 'Each digit has a position: thousands, hundreds, tens, units, tenths, hundredths. Read the whole number before choosing — trap answers often swap two digits or shift a decimal point.',
  },
  'number-properties': {
    title: '🔵 Number properties',
    tip: 'Know your definitions: prime (only divisible by 1 and itself), factor (divides exactly), multiple (in the times table), square number (whole number × itself).',
    example: 'Is 1 prime? No — a prime needs exactly two factors. 1 has only one factor.',
  },
  'arithmetic': {
    title: '➕ Arithmetic',
    tip: 'Read the operation carefully — addition, subtraction, multiplication, or division. Estimate the answer first so you can spot if your working has gone wrong.',
  },
  'decimals': {
    title: '🔸 Decimals',
    tip: 'Line up the decimal points when adding or subtracting. For multiplication, ignore the decimal point first, then put it back in the answer (count the decimal places in both numbers).',
  },
  'negative-numbers': {
    title: '➖ Negative numbers',
    tip: 'Use a number line. Subtracting a negative is the same as adding. The further left on the number line, the smaller the number.',
    example: '−3 − (−5) = −3 + 5 = 2',
  },
  'missing-digits': {
    title: '🔲 Missing digits',
    tip: "Work column by column. Start with the column you know most about. Use trial and error for the unknown digit — try each value 0–9 and check whether it makes the calculation work.",
  },
  'measurement': {
    title: '📏 Measurement',
    tip: 'Check the units in the question and the units in the answer. Convert if needed (1 kg = 1000 g, 1 m = 100 cm, 1 km = 1000 m, 1 litre = 1000 ml).',
  },
  'time': {
    title: '🕐 Time',
    tip: 'Convert to 24-hour clock if mixing am/pm. Remember: 60 minutes in an hour, not 100. When finding a duration, count up from the start time to the end time.',
    example: '10:45 to 13:20 — count 15 min to 11:00, then 2 hours to 13:00, then 20 min. Total: 2 h 35 min.',
  },
  'money': {
    title: '💰 Money',
    tip: 'Convert everything to pence (or pounds) before calculating. Read the question to check whether the answer should be in pounds, pence, or both.',
  },
  'data': {
    title: '📈 Data & charts',
    tip: "Read the title, axis labels, and key before you look at the data. The question often asks about a specific column, bar, or category — highlight it before answering.",
  },
  'symmetry': {
    title: '🔁 Symmetry',
    tip: 'Fold the shape (in your head or on paper) along the line of symmetry. Both halves should match exactly. A shape can have more than one line of symmetry — count carefully.',
  },
  'coordinates': {
    title: '📍 Coordinates',
    tip: 'Always go along the x-axis (horizontal) first, then up the y-axis (vertical). Remember: "along the corridor, then up the stairs." Negative coordinates go left or down.',
    example: '(3, −2) means 3 right and 2 down.',
  },
  'bodmas': {
    title: '🧮 Order of operations (BODMAS)',
    tip: 'Brackets first, then Other (powers/roots), then Division and Multiplication (left to right), then Addition and Subtraction (left to right).',
    example: '3 + 4 × 2 = 3 + 8 = 11. Not 14.',
  },
  'probability': {
    title: '🎲 Probability',
    tip: 'Probability = number of favourable outcomes ÷ total number of possible outcomes. The answer is always between 0 (impossible) and 1 (certain). Check you\'ve counted all outcomes.',
  },
  'invented-operations': {
    title: '🔧 Invented operations',
    tip: "The question defines a new symbol (like ★ or ◆). Read the definition carefully, substitute in the numbers given, and evaluate step by step. Don't guess what the symbol means.",
    example: 'If a★b = 2a + b, then 3★4 = 2(3) + 4 = 10.',
  },
  'venn-diagrams': {
    title: '⭕ Venn diagrams',
    tip: 'The overlapping section contains items that belong to BOTH groups. Items outside all circles belong to neither. Read the question to check whether it asks about the overlap, one circle only, or the total.',
  },
  // ── Logic & Reasoning ────────────────────────────────────────────────────────
  'logic-sequence': {
    title: '🔢 Sequence questions',
    tip: 'Find the rule: is it adding, multiplying, or alternating? Check if it applies consistently before choosing an answer.',
  },
  'logic-code': {
    title: '🔐 Code questions',
    tip: "Find the pattern by lining up the word and its code. Look at each letter's position in the alphabet. Does each letter shift by the same amount?",
  },
  'logic-direction': {
    title: '🧭 Direction questions',
    tip: "Draw a quick sketch. Mark North at the top. Move step by step — don't try to hold the whole route in your head.",
  },
  'compass': {
    title: '🧭 Compass directions',
    tip: 'The four main points: North, South, East, West. Between them: NE, NW, SE, SW. If you face North and turn clockwise 90°, you face East. Draw it if you need to.',
  },
  'logic-grid': {
    title: '🗂️ Grid logic questions',
    tip: 'Draw a grid with people as rows and categories as columns. Work through each clue one by one, marking ✓ (yes) and ✗ (no). When a row has exactly one ✓ left, all other boxes in that row must be ✗.',
    example: '"Charles, Veronica, Angie and Peter each had a different breakfast. Veronica had chips. Peter had an egg." Start with what you know: write ✓ in Veronica/chips and ✓ in Peter/egg. Mark ✗ everywhere else in those rows and columns.',
  },
  'logic-venn': {
    title: '⭕ Venn diagram logic',
    tip: 'Place each item in the correct region: left circle only, right circle only, the overlap (both properties), or outside (neither). Re-read each clue to check — the overlap is the most common mistake.',
  },
  'logic-pattern': {
    title: '🔷 Pattern questions',
    tip: 'Look at rows AND columns. Check if shapes rotate, reflect, grow, or change colour. The rule that works in one direction should also work in the other.',
  },
  'logic-deduction': {
    title: '🧠 Deduction questions',
    tip: "List what you know for certain first. Then eliminate options that break any single rule. Only one answer will satisfy ALL the conditions — use process of elimination rather than guessing.",
  },
};

export function getLearningCard(category: string | undefined): LearningCard | null {
  if (!category) return null;
  return LEARNING_CARDS[category] ?? null;
}
