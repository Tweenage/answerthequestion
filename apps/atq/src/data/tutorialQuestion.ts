import type { Question } from '../types/question';

/**
 * Tutorial English comprehension question — designed to demonstrate the CLEAR Method.
 *
 * Design principles:
 * - Multiple named characters all mentioned in the passage (plausible traps)
 * - A busy week creates distraction — the unusual week obscures the usual routine
 * - Danger words "usually" (passage) and "normal" (question) MEAN the same thing
 *   but LOOK different — teaches children that danger-word matching can be
 *   conceptual, not just literal
 * - The question asks about a week NOT described in the passage ("if next week
 *   is a normal week"), forcing the child to DEDUCE from the usual routine rather
 *   than read the answer off
 * - Only one wild card answer (older sister — not mentioned at all)
 * - Requires genuine inference, not surface-level reading
 */
export const TUTORIAL_QUESTION: Question = {
  id: 'tutorial-demo',
  subject: 'english',
  difficulty: 2,
  questionText:
    "Amir usually walks to school with his best friend Jake. This week was different. On Monday, Jake was away, so Amir walked with his neighbour Priya instead. On Tuesday, Amir's mum drove him because of the rain. On Wednesday and Thursday, Priya and Amir walked together. On Friday, Jake came back and walked with Amir. If next week is a normal week, who will Amir go to school with on Tuesday?",
  questionTokens: [
    'Amir', ' ', 'usually', ' ', 'walks', ' ', 'to', ' ', 'school', ' ',
    'with', ' ', 'his', ' ', 'best', ' ', 'friend', ' ', 'Jake.', ' ',
    'This', ' ', 'week', ' ', 'was', ' ', 'different.', ' ',
    'On', ' ', 'Monday,', ' ', 'Jake', ' ', 'was', ' ', 'away,', ' ',
    'so', ' ', 'Amir', ' ', 'walked', ' ', 'with', ' ', 'his', ' ',
    'neighbour', ' ', 'Priya', ' ', 'instead.', ' ',
    'On', ' ', 'Tuesday,', ' ', "Amir's", ' ', 'mum', ' ', 'drove', ' ',
    'him', ' ', 'because', ' ', 'of', ' ', 'the', ' ', 'rain.', ' ',
    'On', ' ', 'Wednesday', ' ', 'and', ' ', 'Thursday,', ' ',
    'Priya', ' ', 'and', ' ', 'Amir', ' ', 'walked', ' ', 'together.', ' ',
    'On', ' ', 'Friday,', ' ', 'Jake', ' ', 'came', ' ', 'back', ' ',
    'and', ' ', 'walked', ' ', 'with', ' ', 'Amir.', ' ',
    'If', ' ', 'next', ' ', 'week', ' ', 'is', ' ', 'a', ' ', 'normal', ' ', 'week,', ' ',
    'who', ' ', 'will', ' ', 'Amir', ' ', 'go', ' ',
    'to', ' ', 'school', ' ', 'with', ' ', 'on', ' ', 'Tuesday?',
  ],
  // "usually" at passage index 2 and "normal" at question index 120.
  // Conceptually matched danger words — different word, same meaning.
  keyWordIndices: [2, 120],
  options: [
    {
      text: 'Priya',
      isEliminatable: true,
      eliminationReason: 'Priya only walked with Amir this week because Jake was away. The passage says this week was different — a normal week means things are back to his usual routine.',
    },
    {
      text: "Amir's mum",
      isEliminatable: true,
      eliminationReason: "Amir's mum drove him ONCE this Tuesday because it was raining — that was a one-off, not his normal routine.",
    },
    {
      text: 'Jake',
      isEliminatable: false,
    },
    {
      text: 'His older sister',
      isEliminatable: true,
      eliminationReason: 'No sister is ever mentioned in the passage. Never choose someone the passage has not told you about.',
    },
  ],
  correctOptionIndex: 2,
  explanation:
    'This question asks about a NORMAL week — a week not described in the passage. You have to deduce the answer. The passage says Amir "usually walks to school with his best friend Jake" — "usually" and "normal" mean the same thing. "This week was different", so Priya and his mum were exceptions. It\'s tempting to pick "Amir\'s mum" because she drove him on Tuesday this week — but that was a one-off because of the rain. In a normal week, Amir is back to his usual routine: walking with Jake.',
  category: 'comprehension-inference',
  trickType: 'exception-as-rule',
};

/** Tutorial step messages from Professor Hoot */
export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    hootMood: 'teaching' as const,
    title: "Let's Learn Together!",
    message: "Quick demo before you start — one practice question, all five CLEAR steps. It's deliberately simple so you can see how the method works. Real questions are harder.",
    showQuestion: false,
    showAnswers: false,
  },
  {
    id: 'read-first',
    hootMood: 'teaching' as const,
    title: 'C — Calm',
    message: "Breath in. Read the question — just the question, not the answers yet.",
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'read-again',
    hootMood: 'thinking' as const,
    title: 'L — Look',
    message: "Read it again. Say in your head what you're looking for before you look at any answers.",
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'key-words',
    hootMood: 'teaching' as const,
    title: 'L — Key Words',
    message: 'Spot the danger words: "usually" in the passage and "normal" in the question. Different words — same meaning. That\'s your connection. In your exam, underline them. In the app, tap to highlight.',
    showQuestion: true,
    showAnswers: false,
    highlightKeyWords: true,
  },
  {
    id: 'show-answers',
    hootMood: 'teaching' as const,
    title: 'E — Eliminate!',
    message: "Tap the wrong answers to cross them out. You can't choose the right answer until all the wrong ones are gone.",
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3],
    interactive: true,
  },
  {
    id: 'lock-in',
    hootMood: 'celebrating' as const,
    title: 'A — Answer',
    message: 'One answer left. That\'s your pick. In the app, hit Lock In.',
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3],
    correctIndex: 2,
  },
  {
    id: 'review',
    hootMood: 'thinking' as const,
    title: 'R — Review',
    message: 'Check: does your answer actually answer the question that was asked? Read the question again — not the passage, just the question. If it still fits, lock it in.',
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3],
    correctIndex: 2,
  },
  {
    id: 'complete',
    hootMood: 'celebrating' as const,
    title: 'Done! 🎉',
    message: "C → L → E → A → R. Every question, every time. The real questions are harder — but the method is the same. Practise it until it's automatic.",
    showQuestion: false,
    showAnswers: false,
  },
];
