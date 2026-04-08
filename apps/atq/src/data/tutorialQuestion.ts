import type { Question } from '../types/question';

/**
 * Tutorial English comprehension question — designed to demonstrate the CLEAR Method.
 *
 * Design principles:
 * - Multiple named characters all mentioned in the passage (plausible traps)
 * - A busy week creates distraction — the unusual week obscures the usual routine
 * - Key danger word "usually" appears in both the passage AND the question
 * - Only one wild card answer (older sister — not mentioned at all)
 * - Requires genuine inference, not surface-level reading
 */
export const TUTORIAL_QUESTION: Question = {
  id: 'tutorial-demo',
  subject: 'english',
  difficulty: 2,
  questionText:
    "Amir usually walks to school with his best friend Jake. This week was different. On Monday, Jake was away, so Amir walked with his neighbour Priya instead. On Tuesday, Amir's mum drove him because of the rain. On Wednesday and Thursday, Priya and Amir walked together. On Friday, Jake came back and walked with Amir. Who does Amir usually walk to school with?",
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
    'Who', ' ', 'does', ' ', 'Amir', ' ', 'usually', ' ', 'walk', ' ',
    'to', ' ', 'school', ' ', 'with?',
  ],
  // "usually" at index 2 (passage) and index 116 (question)
  keyWordIndices: [2, 116],
  options: [
    {
      text: 'Priya',
      isEliminatable: true,
      eliminationReason: 'Priya walked with Amir this week — but the passage says this week was different. Look back at the very first sentence.',
    },
    {
      text: "Amir's mum",
      isEliminatable: true,
      eliminationReason: "Amir's mum drove him on Tuesday because of the rain — that was an exception, not his usual routine.",
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
    'The passage says Amir "usually walks to school with his best friend Jake." The danger word "usually" appears in both the passage and the question — that\'s the connection. Priya only walked with him because this week was different. His mum drove him once. Jake is the usual answer.',
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
    message: '"Usually" — danger word. It appears in the passage AND the question. That\'s what connects them. In your exam, underline it. In the app, tap to highlight.',
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
