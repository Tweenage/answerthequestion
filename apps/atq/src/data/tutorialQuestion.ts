import type { Question } from '../types/question';

/**
 * A tutorial English comprehension question used in the guided first-session tutorial.
 * Designed to clearly demonstrate every technique step:
 * - Requires inference (the answer is not stated directly)
 * - Has obvious key words ("normally", "always")
 * - Has clearly eliminatable wrong answers with reasons
 * - Tests careful reading and deduction
 */
export const TUTORIAL_QUESTION: Question = {
  id: 'tutorial-demo',
  subject: 'english',
  difficulty: 1,
  questionText:
    'Lily always walks to school with her best friend. On Monday, her best friend was ill, so Lily\'s mum drove her instead. Lily felt sad because she had nobody to talk to on the way. Who does Lily normally walk to school with?',
  questionTokens: [
    'Lily', ' ', 'always', ' ', 'walks', ' ', 'to', ' ', 'school', ' ',
    'with', ' ', 'her', ' ', 'best', ' ', 'friend.', ' ',
    'On', ' ', 'Monday,', ' ', 'her', ' ', 'best', ' ', 'friend', ' ',
    'was', ' ', 'ill,', ' ', 'so', ' ', "Lily's", ' ', 'mum', ' ',
    'drove', ' ', 'her', ' ', 'instead.', ' ',
    'Lily', ' ', 'felt', ' ', 'sad', ' ', 'because', ' ', 'she', ' ',
    'had', ' ', 'nobody', ' ', 'to', ' ', 'talk', ' ', 'to', ' ',
    'on', ' ', 'the', ' ', 'way.', ' ',
    'Who', ' ', 'does', ' ', 'Lily', ' ', 'normally', ' ', 'walk', ' ',
    'to', ' ', 'school', ' ', 'with?',
  ],
  keyWordIndices: [2, 76], // "always" (index 2) and "normally" (index 76)
  options: [
    {
      text: 'Her mum',
      isEliminatable: true,
      eliminationReason: 'Her mum only drove her on Monday because her friend was ill — that was not the normal routine.',
    },
    {
      text: 'Her teacher',
      isEliminatable: true,
      eliminationReason: 'A teacher is never mentioned in the passage at all.',
    },
    {
      text: 'Her best friend',
      isEliminatable: false,
    },
    {
      text: 'Nobody',
      isEliminatable: true,
      eliminationReason: 'She had "nobody to talk to" only on Monday — that is a trap! The question asks about her normal routine.',
    },
    {
      text: 'Her older sister',
      isEliminatable: true,
      eliminationReason: 'A sister is never mentioned in the passage. A rusher might guess a family member, but the passage says she walks with her best friend.',
    },
  ],
  correctOptionIndex: 2,
  explanation:
    'The passage says Lily "always walks to school with her best friend." The key word "normally" in the question matches "always" in the passage. Her mum only drove her on Monday — that was the exception, not the rule!',
  category: 'comprehension-inference',
  trickType: 'negation-trap',
};

/** Tutorial step messages from Professor Hoot */
export const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    hootMood: 'teaching' as const,
    title: "Let's Learn Together!",
    message: "Before you start practising, let me show you how this works. We'll do one question together — I'll guide you through every step!",
    showQuestion: false,
    showAnswers: false,
  },
  {
    id: 'read-first',
    hootMood: 'teaching' as const,
    title: 'C — Calm (Read It Once)',
    message: "Take one slow breath, then read the question below. Do not look at the answers yet — I've hidden them for you.",
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'read-again',
    hootMood: 'thinking' as const,
    title: 'C — Calm (Read It Again)',
    message: 'Good. Now read it one more time. What is the question really asking? Say it in your head before looking at any answers.',
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'key-words',
    hootMood: 'teaching' as const,
    title: 'L — Look for Key Words',
    message: 'See "normally"? That is a key word — it tells you the question asks about the usual routine, not Monday\'s exception. The rule: highlight the FEWEST words that tell you what to find. Always highlight danger words like "normally", "always", "never", "not", "except". In the app, tap to highlight. In your real exam, underline with your pencil!',
    showQuestion: true,
    showAnswers: false,
    highlightKeyWords: true,
  },
  {
    id: 'show-answers',
    hootMood: 'warning' as const,
    title: 'E — Eliminate!',
    message: "Tap each wrong answer to cross it out! I'll tell you why as you go. You cannot choose the right answer until all the wrong ones are gone — that is the rule!",
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3, 4],
    interactive: true,
  },
  {
    id: 'lock-in',
    hootMood: 'celebrating' as const,
    title: 'A — Answer!',
    message: "Only \"Her best friend\" is left — and the passage says she always walks with her best friend. That is your answer! In the app, you'll hit the Lock In button.",
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3, 4],
    correctIndex: 2,
  },
  {
    id: 'review',
    hootMood: 'thinking' as const,
    title: 'R — Review!',
    message: "Before you confirm, look back at the question one more time. It says \"normally\" — and \"Her best friend\" matches \"always walks with her best friend\" in the passage. It still makes sense! The app will always show you your chosen answer and give you a chance to change it before you lock in. Only change your answer if you spot a real reason to!",
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3, 4],
    correctIndex: 2,
  },
  {
    id: 'complete',
    hootMood: 'celebrating' as const,
    title: 'Hoo-ray! You Did It! 🎉',
    message: "You just used the full CLEAR Method! Calm → Look for key words → Eliminate → Answer → Review. Did you notice the traps? Now you try it yourself — practise the CLEAR steps every day and they will become automatic!",
    showQuestion: false,
    showAnswers: false,
  },
];
