import type { Question } from '../types/question';

/**
 * A simple English comprehension question used in the guided first-session tutorial.
 * Designed to clearly demonstrate every technique step:
 * - Has obvious key words ("NOT")
 * - Has clearly eliminatable wrong answers with reasons
 * - Tests a danger word (negation trap)
 */
export const TUTORIAL_QUESTION: Question = {
  id: 'tutorial-demo',
  subject: 'english',
  difficulty: 1,
  questionText:
    'Sam had three pets: a cat called Whiskers, a dog called Patch, and a hamster called Nibbles. Sam loved all of his pets, but Whiskers was NOT his favourite. Which pet was NOT Sam\'s favourite?',
  questionTokens: [
    'Sam', ' ', 'had', ' ', 'three', ' ', 'pets:', ' ',
    'a', ' ', 'cat', ' ', 'called', ' ', 'Whiskers,', ' ',
    'a', ' ', 'dog', ' ', 'called', ' ', 'Patch,', ' ',
    'and', ' ', 'a', ' ', 'hamster', ' ', 'called', ' ', 'Nibbles.', ' ',
    'Sam', ' ', 'loved', ' ', 'all', ' ', 'of', ' ', 'his', ' ', 'pets,', ' ',
    'but', ' ', 'Whiskers', ' ', 'was', ' ', 'NOT', ' ', 'his', ' ', 'favourite.', ' ',
    'Which', ' ', 'pet', ' ', 'was', ' ', 'NOT', ' ', "Sam's", ' ', 'favourite?',
  ],
  keyWordIndices: [50, 62], // "NOT" in both places
  options: [
    {
      text: 'Patch',
      isEliminatable: true,
      eliminationReason: 'The passage says Whiskers was NOT his favourite — it does not say anything about Patch.',
    },
    {
      text: 'Whiskers',
      isEliminatable: false,
    },
    {
      text: 'Nibbles',
      isEliminatable: true,
      eliminationReason: 'The passage says Whiskers was NOT his favourite — it does not mention Nibbles being or not being the favourite.',
    },
    {
      text: 'Sam',
      isEliminatable: true,
      eliminationReason: 'Sam is the owner, not a pet! This is a trick answer designed to catch you if you rush.',
    },
  ],
  correctOptionIndex: 1,
  explanation:
    'The passage clearly says "Whiskers was NOT his favourite." The danger word NOT tells us the answer is Whiskers. Did you spot it?',
  category: 'comprehension-who',
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
    message: 'Brilliant! Now read it one more time. Can you work out what it is REALLY asking? Say it in your head.',
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'key-words',
    hootMood: 'teaching' as const,
    title: 'Step 3: Spot the Key Words',
    message: 'See the word "NOT"? That is a DANGER WORD! It changes the whole question. In the app, you will tap these words to highlight them.',
    showQuestion: true,
    showAnswers: false,
    highlightKeyWords: true,
  },
  {
    id: 'on-paper',
    hootMood: 'encouraging' as const,
    title: '🖊️ In Your Real Exam...',
    message: 'Cover the answers with your hand and read the question twice first — no peeking! Then underline key words like "NOT" with your pencil.',
    showQuestion: true,
    showAnswers: false,
  },
  {
    id: 'show-answers',
    hootMood: 'warning' as const,
    title: 'Step 4: Now Eliminate!',
    message: "Here are the answers. Let's cross out the wrong ones! \"Sam\" is the owner, not a pet — cross it out! \"Patch\" and \"Nibbles\" are not mentioned as NOT being the favourite.",
    showQuestion: true,
    showAnswers: true,
    eliminateIndices: [0, 2, 3],
  },
  {
    id: 'lock-in',
    hootMood: 'celebrating' as const,
    title: 'Step 5: Lock It In!',
    message: "Only Whiskers is left — and the passage says Whiskers was NOT Sam's favourite. That is your answer! In the app, you'll hit the Lock In button.",
    showQuestion: true,
    showAnswers: true,
    correctIndex: 1,
  },
  {
    id: 'complete',
    hootMood: 'celebrating' as const,
    title: 'Hoo-ray! You Did It! 🎉',
    message: "You just used the full technique: Read → Key Words → Eliminate → Lock In. Now you try it yourself! Remember, it is not about getting every answer right — it is about building the HABIT.",
    showQuestion: false,
    showAnswers: false,
  },
];
