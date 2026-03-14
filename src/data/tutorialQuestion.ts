import type { Question } from '../types/question';

/**
 * A tutorial English comprehension question used in the guided first-session tutorial.
 * Designed to clearly demonstrate every technique step:
 * - Requires inference (the answer is NOT stated directly)
 * - Has obvious key words ("NOT", "before")
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
      eliminationReason: 'Her mum only drove her on Monday because her friend was ill — that was NOT the normal routine.',
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
      eliminationReason: 'She had "nobody to talk to" only on Monday — that is a trap! The question asks about her NORMAL routine.',
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
    title: 'Step 1: Read It Once',
    message: "Read the question below. Take your time — do NOT look at the answers yet! I've hidden them for you.",
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'read-again',
    hootMood: 'thinking' as const,
    title: 'Step 2: Read It Again',
    message: 'Now, read it again to check your understanding. What is the question REALLY asking? Say it in your head.',
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'key-words',
    hootMood: 'teaching' as const,
    title: 'Step 3: Spot the Key Words',
    message: 'See the word "normally"? That is a KEY WORD! It tells you the question is about what USUALLY happens — not what happened on Monday. In the app, you will tap these words to highlight them.',
    showQuestion: true,
    showAnswers: false,
    highlightKeyWords: true,
  },
  {
    id: 'on-paper',
    hootMood: 'encouraging' as const,
    title: '🖊️ In Your Real Exam...',
    message: 'Cover the answers with your hand and read the question twice first — no peeking! Then underline key words like "normally" and "always" with your pencil.',
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'show-answers',
    hootMood: 'warning' as const,
    title: 'Step 4: Now Eliminate!',
    message: "Here are the answers. Let's cross out the wrong ones! \"Her teacher\" is never mentioned. \"Her mum\" only drove her on Monday. \"Nobody\" is a trap — she only had nobody to talk to on that one day!",
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 1, 3],
  },
  {
    id: 'lock-in',
    hootMood: 'celebrating' as const,
    title: 'Step 5: Lock It In!',
    message: "Only \"Her best friend\" is left — and the passage says she ALWAYS walks with her best friend. That is your answer! In the app, you'll hit the Lock In button.",
    showQuestion: true,
    showAnswers: true,
    correctIndex: 2,
  },
  {
    id: 'complete',
    hootMood: 'celebrating' as const,
    title: 'Hoo-ray! You Did It! 🎉',
    message: "You just used the full technique: Read → Key Words → Eliminate → Lock In. Did you notice the traps? The question tried to trick you with Monday's events! Now you try it yourself. Remember, it is not about getting every answer right — it is about building the HABIT.",
    showQuestion: false,
    showAnswers: false,
  },
];
