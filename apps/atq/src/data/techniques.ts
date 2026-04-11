import type { Subject } from '../types/question';

// ─── Core Technique Steps ─────────────────────────────────────────

export interface CoreStep {
  id: string;
  number: number;
  title: string;
  emoji: string;
  childDescription: string;
  hootSecret: string;
  inYourExam: string[];
  inTheApp: string;
  parentDescription: string;
  researchStat?: string;
  researchSource?: string;
}

export const CORE_STEPS: CoreStep[] = [
  {
    id: 'read-twice',
    number: 1,
    title: 'Read It Twice',
    emoji: '📖',
    childDescription:
      'Always read the question TWO times before you look at the answers. The first time, work out what it is about. The second time, ask yourself: "What is this REALLY asking me?"',
    hootSecret:
      "Here's my biggest secret: I ALWAYS read every question twice. Even wise owls need two looks!",
    inYourExam: [
      'Cover the answers with your hand so you cannot peek',
      'Read the question once to get the idea',
      'Read it again and say in your head what it is asking',
      'Only THEN look at the answers',
    ],
    inTheApp:
      'The app makes you read twice before showing the answers. This trains your brain to do it automatically!',
    parentDescription:
      'Re-reading is the most impactful exam technique. Children lose marks not from lack of knowledge, but from misreading.',
    researchStat: 'Up to 7 extra months of progress',
    researchSource: 'EEF',
  },
  {
    id: 'key-words',
    number: 2,
    title: 'Spot the Key Words',
    emoji: '🔍',
    childDescription:
      'Highlight the FEWEST words that tell you exactly what the question is asking — like a detective picking only the vital clues. Always highlight danger words: not, except, least, never, only, however, although. Only highlight a name if there are TWO OR MORE people in the question — then you need to match the right detail to the right person. Test yourself: could you answer the question using only your highlighted words?',
    hootSecret:
      "I call this being a Word Detective! The best detectives don't circle everything — they find the vital few clues. If you highlight every word, none of them stand out. Pick only what really matters!",
    inYourExam: [
      'Underline the fewest words that tell you exactly what the question is asking',
      'Always underline danger words like not, except, least, most, only — they change everything',
      'Only underline names if the question mentions more than one person — then you need to match the right detail to the right person',
    ],
    inTheApp:
      'Tap the key words to highlight them. The app shows you which ones you found and which you missed.',
    parentDescription:
      'Highlighting key words reduces cognitive load by externalising working memory. Danger words (not, except, least) are a major source of avoidable errors.',
    researchStat: 'Reduces working memory load',
    researchSource: 'Cognitive Load Theory (Sweller, 1988)',
  },
  {
    id: 'numbers',
    number: 3,
    title: 'Check the Numbers',
    emoji: '🔢',
    childDescription:
      'Circle every number you see. If a number is written as a word (like "twelve"), write the digit (12) next to it. This stops sneaky number tricks!',
    hootSecret:
      "I always convert number words to digits first. It helps my owl brain do the maths faster! Try it — you'll see!",
    inYourExam: [
      'Circle every number in the question',
      'Write the digit next to any number words (twelve → 12)',
      'Check the units — are they all the same? (cm vs m, pence vs pounds)',
      'Understand the question BEFORE you calculate',
    ],
    inTheApp:
      'Tap number words to convert them to digits. This trains your brain to spot hidden numbers automatically!',
    parentDescription:
      'Number words hidden in text are a deliberate trap. Converting them into digits forces engagement and reduces careless mistakes.',
  },
  {
    id: 'eliminate',
    number: 4,
    title: 'Eliminate Wrong Answers',
    emoji: '✂️',
    childDescription:
      'Cross out ALL the wrong answers one by one. Ask yourself: "Could this possibly be right?" If no, cross it out! The last one standing is your answer.',
    hootSecret:
      "This is my favourite trick! Cross out the wrong ones first, and the right answer practically jumps out at you. Hoo-ray!",
    inYourExam: [
      'Put a single line through each wrong answer',
      'Check every option — do not just grab the first one that looks right',
      'Watch for answers that use a number from the question but calculated wrongly',
      'Watch for answers that mention something from the passage but do not answer THIS question',
    ],
    inTheApp:
      'Tap wrong answers to cross them out. The app tells you why each wrong answer is wrong!',
    parentDescription:
      'Systematic elimination ensures every option is evaluated, avoiding impulsive "first plausible answer" choices.',
  },
  {
    id: 'lock-answer',
    number: 5,
    title: 'Lock Your Answer',
    emoji: '🔒',
    childDescription:
      'Before you lock in, go back to the question one last time. Does your answer match what was asked? Did you spot any danger words? If you are sure, lock it in!',
    hootSecret:
      "A wise owl always double-checks! Go back to the question one last time before you lock in your answer.",
    inYourExam: [
      'Re-read the question one final time before writing your answer',
      'Check: did I answer what was asked, not something else?',
      'If stuck between two, go back to the key words — they point to the right one',
      'NEVER leave a question blank — a guess gives you 25%, blank gives 0%',
    ],
    inTheApp:
      'Hit the "Lock In" button when you are sure. The app checks your technique as well as your answer!',
    parentDescription:
      'A final check closes the loop.',
    researchStat: 'Checking catches 1 in 5 mistakes.',
    researchSource: 'Assessment & Evaluation in Higher Education',
  },
];

// ─── CLEAR Method Steps (child-facing, letter-mapped) ─────────────
// These map directly to C / L / E / A / R and are the canonical
// child-facing explanation of the method. Use in ChildTechniquesView.

export interface ClearStep {
  letter: 'C' | 'L' | 'E' | 'A' | 'R';
  name: string;
  emoji: string;
  tagline: string;
  childDescription: string;
  hootSecret: string;
  inYourExam: string[];
  inTheApp: string;
  linkToBreathing?: boolean;
  gradient: string;
  textColour: string;
}

export const CLEAR_STEPS: ClearStep[] = [
  {
    letter: 'C',
    name: 'Calm',
    emoji: '🧘',
    tagline: 'Take a breath before you start',
    gradient: 'from-blue-500 to-indigo-600',
    textColour: 'text-indigo-700',
    childDescription:
      'Before every practice session and exam, take a moment to breathe. Breathe in for 4 counts, hold for 4, breathe out for 4, and hold for 4. This tells your brain: "Time to focus!" You can also practise visualising the exam room — the desk, the chair, the sounds around you — so that when exam day comes, it feels familiar. A calm brain answers questions better than a worried brain.',
    hootSecret:
      "I always breathe before I start. Even wise owls get nervous — breathing is how I tell my brain to be brilliant! You can feel the difference straight away.",
    inYourExam: [
      'Take slow, deep breaths before the exam begins',
      'Breathe in for 4 counts, hold for 4, breathe out for 4',
      "If you feel stuck on a question, breathe first — then try again",
      'Tell yourself: "I am calm. I am ready. I know my CLEAR Method."',
    ],
    inTheApp:
      'The app includes a box breathing exercise and a visualisation you can use before any session — especially when you feel nervous. It trains your brain to start every exam feeling calm and ready!',
    linkToBreathing: true,
  },
  {
    letter: 'L',
    name: 'Look',
    emoji: '👀',
    tagline: 'Read the whole question — twice',
    gradient: 'from-violet-500 to-purple-600',
    textColour: 'text-purple-700',
    childDescription:
      'Read the question TWO times before you look at the answers. First, read it to understand: what is it about? Second, read it again and ask: what is it REALLY asking? Then, find the key words — the fewest words that tell you exactly what you need. Always look out for danger words like not, except, never, only — they flip the whole meaning!',
    hootSecret:
      "Here's my biggest secret: I ALWAYS read every question twice. Even wise owls need two looks! If you rush straight to the answers, the question setter wins. Slow down to speed up.",
    inYourExam: [
      'Cover the answers with your hand so you cannot peek',
      'Read the question once to understand it',
      'Read it again and ask: "What is this REALLY asking?"',
      'Underline key words — especially danger words like not, except, only, never',
    ],
    inTheApp:
      'The app makes you read twice and tap the key words before the answers appear. This trains your brain to do it automatically!',
  },
  {
    letter: 'E',
    name: 'Eliminate',
    emoji: '✂️',
    tagline: 'Cross out every wrong answer',
    gradient: 'from-fuchsia-500 to-pink-600',
    textColour: 'text-fuchsia-700',
    childDescription:
      'Cross out ALL the wrong answers one by one. Ask yourself: "Could this possibly be right?" If no, cross it out! The last one standing is your answer. Even if you\'re not sure of the right answer, you can almost always spot what is clearly wrong.',
    hootSecret:
      "This is my favourite trick! Cross out the wrong ones first, and the right answer practically jumps out at you. Hoo-ray! The question setters hide the right answer — elimination finds it.",
    inYourExam: [
      'Put a single line through each wrong answer',
      'Check EVERY option — do not grab the first one that looks right',
      'Watch for answers that use numbers from the question but are calculated incorrectly',
      'Watch for answers that mention the passage but do not answer THIS question',
    ],
    inTheApp:
      "Tap wrong answers to cross them out. You cannot select the right answer until all the wrong ones are gone — that's the rule!",
  },
  {
    letter: 'A',
    name: 'Answer',
    emoji: '✏️',
    tagline: 'Choose with confidence',
    gradient: 'from-pink-500 to-rose-600',
    textColour: 'text-rose-700',
    childDescription:
      "Now, choose your answer! After eliminating, you should have just one or two options left. Pick the one that best answers what the question REALLY asked. Trust your method — you've done all the preparation. Go with the answer that matches your key words.",
    hootSecret:
      "After eliminating, choosing becomes easy. The hard work was in L and E. By the time you get to A, you've EARNED your answer — believe in it!",
    inYourExam: [
      'Choose the answer that best matches the key words you found',
      'If stuck between two, go back to the key words — they point to the right one',
      'NEVER leave a question blank — a guess after eliminating gives you 50%+',
    ],
    inTheApp:
      'Tap your chosen answer. The app records your selection and gives you a chance to review before confirming.',
  },
  {
    letter: 'R',
    name: 'Review',
    emoji: '✅',
    tagline: 'Check before you commit',
    gradient: 'from-teal-500 to-emerald-600',
    textColour: 'text-teal-700',
    childDescription:
      "Before you lock in, read the question one more time. Does your answer match what was actually asked? Did you notice any danger words? If it feels right, lock it in. If something feels off, trust that instinct and reconsider. Research shows most answer changes go from wrong to right — checking really works.",
    hootSecret:
      "A wise owl always double-checks! Students who review their answers catch 1 in 5 mistakes. That could be the difference between passing and failing — always review!",
    inYourExam: [
      'Re-read the question one final time before answering',
      'Ask yourself: did I answer what was asked, not what I expected?',
      "If you're stuck, move on — mark it and return at the end",
      "It's okay to change your answer if you have a clear reason",
      'If you finish early, go back and check all your answers',
    ],
    inTheApp:
      "After you choose an answer, the app will ask: \"Does this still make sense?\" You can change your answer at this point. When you're confident — lock it in.",
  },
];

// ─── Subject-Specific Techniques ──────────────────────────────────

export interface SubjectTechnique {
  id: string;
  title: string;
  emoji: string;
  childTip: string;
  parentExplanation: string;
}

export const SUBJECT_TECHNIQUES: Record<Subject, SubjectTechnique[]> = {
  english: [
    {
      id: 'eng-passage-first',
      title: 'Read the Passage First',
      emoji: '📄',
      childTip:
        'Read the whole passage twice. First read: go all the way through without stopping. Second read: underline key words as you go. Only then look at the questions.',
      parentExplanation:
        'Two full reads before looking at the questions builds a mental model of the text and reduces the tendency to anchor on the first relevant detail. Key word identification on the second read deepens focus.',
    },
    {
      id: 'eng-meaning-vs-opposite',
      title: 'Meaning vs Opposite',
      emoji: '↔️',
      childTip:
        '"Closest in meaning" and "opposite" require completely different answers!\nCheck which one the question asks before you look at the choices.',
      parentExplanation:
        'Confusion between synonym and antonym questions is one of the most common errors. Training children to identify the question type before evaluating options prevents this systematic error.',
    },
    {
      id: 'eng-signal-words',
      title: 'Signal Words Change Meaning',
      emoji: '🚦',
      childTip:
        'Words like "however", "although", "but", and "despite" can flip the meaning.\nIf the passage says, "It was sunny, however\u2026" — the answer is about what comes after "however".',
      parentExplanation:
        'Discourse markers (however, although, despite) signal logical relationships. Children who recognise these connectives demonstrate higher-order comprehension and avoid the trap of anchoring on the first clause.',
    },
    {
      id: 'eng-five-ws',
      title: 'Who, What, When, Where, Why',
      emoji: '❓',
      childTip:
        'Work out the type of question first.\n"Who" needs a person. "When" needs a time. "Where" needs a place.\nMake sure your answer matches the question type.',
      parentExplanation:
        'Categorising questions by type (interrogative pronoun) helps children filter answer options efficiently. A "when" question cannot have a person as the answer, immediately eliminating distractors.',
    },
  ],
  maths: [
    {
      id: 'maths-number-words',
      title: 'Convert Number Words',
      emoji: '🔢',
      childTip:
        'Always write the digit next to number words. "Twelve" → 12, "forty-five" → 45. Numbers hidden in words are the sneakiest maths trick!',
      parentExplanation:
        'Number word conversion is a deliberate executive function challenge in 11+ papers. Training automatic conversion removes this cognitive bottleneck, freeing working memory for the actual calculation.',
    },
    {
      id: 'maths-hidden-operations',
      title: 'Spot the Hidden Operation',
      emoji: '🔀',
      childTip:
        '"How many more" means SUBTRACT! "Altogether" means ADD! "Each" means DIVIDE! "Times as many" means MULTIPLY! The words tell you what to do.',
      parentExplanation:
        'Operation masking is a classic 11+ trap where the mathematical operation is encoded in natural language. Children who translate verbal cues to operations before calculating show significantly higher accuracy.',
    },
    {
      id: 'maths-units',
      title: 'Check Your Units',
      emoji: '📏',
      childTip:
        'Are all the numbers in the same units? Watch for mixing up cm and m, or pence and pounds. Convert everything to the same unit first!',
      parentExplanation:
        'Unit inconsistency is deliberately used to test attention to detail. Questions may present one value in cm and another in m, requiring conversion before comparison or calculation.',
    },
    {
      id: 'maths-two-step',
      title: 'Two-Step Problems',
      emoji: '2️⃣',
      childTip:
        'Some questions need TWO calculations. Do step 1 first, then use that answer for step 2. Do not stop after one step!',
      parentExplanation:
        'Multi-step problems test procedural fluency and planning. The most common error is providing the intermediate result as the final answer. Training children to ask "have I answered the actual question?" prevents premature termination.',
    },
  ],
  'reasoning': [
    {
      id: 'vr-alphabet-numbers',
      title: 'Number Your Alphabet',
      emoji: '🔤',
      childTip:
        'For code questions, write out A=1, B=2, C=3... up to Z=26 at the top of your page. This makes cracking codes SO much easier!',
      parentExplanation:
        'Letter-number correspondence is foundational to VR code questions. Externalising this mapping (writing it out) reduces working memory load and speeds up pattern identification.',
    },
    {
      id: 'vr-relationship-first',
      title: 'Find the Relationship First',
      emoji: '🔗',
      childTip:
        'For analogies (A is to B as C is to ?), work out the relationship between the first pair BEFORE looking at the options. Then apply the same relationship.',
      parentExplanation:
        'Analogical reasoning requires identifying the transformation rule before applying it. Children who articulate the relationship ("X is the opposite of Y") before evaluating options show higher accuracy than those who pattern-match intuitively.',
    },
    {
      id: 'vr-check-every-option',
      title: 'Check Every Option',
      emoji: '👁️',
      childTip:
        'For odd-one-out, do not just pick the first one that looks different. Check ALL of them — sometimes two things look odd but only one is truly the odd one out!',
      parentExplanation:
        'Premature closure (selecting the first apparently different item) is the primary error in odd-one-out questions. Systematic checking of all options against a hypothesised rule prevents this.',
    },
    {
      id: 'vr-hidden-words',
      title: 'Hidden Words',
      emoji: '🔎',
      childTip:
        'Some words hide INSIDE other words! Look carefully at the letters: "together" hides "to", "get", and "her". Slide your finger across slowly.',
      parentExplanation:
        'Hidden word questions test visual scanning and orthographic awareness. Training children to segment words systematically (sliding a window across the string) is more reliable than holistic recognition.',
    },
    {
      id: 'nvr-count-systematically',
      title: 'Count Everything',
      emoji: '🔢',
      childTip:
        'Count the shapes, the lines, and the shading in each box. Write the numbers down! Patterns often hide in the counting.',
      parentExplanation:
        'Systematic enumeration (counting elements and properties) transforms visual pattern recognition from an intuitive to an analytical process, making it more reliable and less susceptible to perceptual biases.',
    },
    {
      id: 'nvr-rotation',
      title: 'Rotation Direction',
      emoji: '🔄',
      childTip:
        'Is the shape turning clockwise (like a clock) or anticlockwise? Use your finger to trace the direction. This catches LOTS of tricky questions!',
      parentExplanation:
        'Rotational transformation questions frequently offer distractors that rotate in the wrong direction. Physical tracing (using a finger) provides kinaesthetic reinforcement of the spatial transformation.',
    },
    {
      id: 'nvr-reflection',
      title: 'Reflection vs Rotation',
      emoji: '🪞',
      childTip:
        'Reflection flips the shape like a mirror. Rotation turns it. They look similar but give DIFFERENT answers! Check if the shape is flipped or turned.',
      parentExplanation:
        'Distinguishing reflection from rotation is a key spatial reasoning skill. Questions deliberately pair these transformations as distractors, testing whether children can identify the specific transformation type.',
    },
    {
      id: 'nvr-multiple-changes',
      title: 'Track Multiple Changes',
      emoji: '📋',
      childTip:
        'Sometimes TWO or THREE things change at once — shape, size, shading, position. List what changes between each box to find the pattern.',
      parentExplanation:
        'Multi-variable change detection tests executive function and systematic analysis. Training children to decompose complex visual sequences into individual property changes (size, colour, orientation, count) builds analytical capability.',
    },
  ],
};

// ─── The 9 Trick Types ────────────────────────────────────────────

export interface TrickType {
  type: string;
  name: string;
  emoji: string;
  childExplanation: string;
  parentExplanation: string;
}

export const TRICK_TYPES: TrickType[] = [
  {
    type: 'number-format',
    name: 'Number Words',
    emoji: '🔢',
    childExplanation: "Numbers hiding in words like 'twelve' or 'forty-five'. Circle them and write the digit!",
    parentExplanation: 'Numbers encoded as words test executive function and attention. Children must translate verbal representations to numerical ones before calculating.',
  },
  {
    type: 'irrelevant-info',
    name: 'Extra Information',
    emoji: '🗑️',
    childExplanation: "The question includes numbers or details you do not need. Ask yourself: 'Do I actually need this?'",
    parentExplanation: 'Irrelevant information tests the ability to identify and discard distractors. Questions include plausible but unnecessary data to test whether children can extract only what is needed.',
  },
  {
    type: 'operation-masking',
    name: 'Hidden Operations',
    emoji: '🔀',
    childExplanation: "'How many more' means subtract! 'Altogether' means add! The words tell you what operation to use.",
    parentExplanation: 'Mathematical operations encoded in natural language test the translation from verbal problem statements to mathematical procedures — a key skill for real-world maths application.',
  },
  {
    type: 'reverse-logic',
    name: 'Reverse Logic',
    emoji: '🔄',
    childExplanation: "Words like 'not' and 'except' flip everything! When a question says 'which is not true', the right answer is the one that IS wrong.",
    parentExplanation: 'Negation questions test logical reasoning under reversal. The cognitive cost of maintaining a negated frame is significant, making these questions disproportionately difficult.',
  },
  {
    type: 'two-step',
    name: 'Two Steps',
    emoji: '2️⃣',
    childExplanation: "Some questions need two steps, not one. Do not stop after the first calculation — check if you have answered the actual question!",
    parentExplanation: 'Multi-step problems test procedural planning and the ability to resist premature closure. The intermediate result is often offered as a distractor.',
  },
  {
    type: 'unit-shift',
    name: 'Unit Traps',
    emoji: '📏',
    childExplanation: "Watch for mixing up cm and m, or pence and pounds! Convert everything to the same unit before you calculate.",
    parentExplanation: 'Inconsistent units test attention to detail and mathematical rigour. Questions deliberately mix measurement scales to identify children who calculate before reading.',
  },
  {
    type: 'position-trap',
    name: 'Position Traps',
    emoji: '📍',
    childExplanation: "Read ALL the way to the end of the question. Sometimes the most important bit is hiding right at the bottom!",
    parentExplanation: 'Critical information placed at the end of questions tests complete reading. Children who stop reading early consistently select distractors based on partial information.',
  },
  {
    type: 'negation-trap',
    name: 'Negation Traps',
    emoji: '🚫',
    childExplanation: "Words like 'never', 'except', 'without' change the whole meaning. Circle them so you do not miss them!",
    parentExplanation: 'Negation words (never, except, without, unless) invert the required response. Missing these words is the single most common cause of errors in comprehension questions.',
  },
  {
    type: 'question-at-end',
    name: 'Question at End',
    emoji: '📄',
    childExplanation: "Long passages often hide the question right at the very end. Read the whole thing — the question might be in the last line!",
    parentExplanation: 'Placing the question after a long stimulus tests whether children maintain attention through extended text. Those who read only the beginning anchor on early information and select incorrect responses.',
  },
];

// ─── On Paper Tips ────────────────────────────────────────────────

export interface OnPaperTip {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export const ON_PAPER_TIPS: OnPaperTip[] = [
  {
    id: 'cover-answers',
    emoji: '✋',
    title: 'Cover the Answers',
    description: 'Use your hand or a piece of paper to cover the answer choices while you read the question. No peeking! Read the question twice first.',
  },
  {
    id: 'underline-keywords',
    emoji: '✏️',
    title: 'Underline Key Words',
    description: 'Underline the fewest words that show what the question is really asking. Always underline danger words like not, except, least, never, only. Only underline names if there are two or more people — then you need to match each person to the right detail. If everything is underlined, nothing stands out — be selective.',
  },
  {
    id: 'circle-numbers',
    emoji: '⭕',
    title: 'Circle All Numbers',
    description: 'Circle every number you see. Next to number words like "twelve", write the digit (12). This makes them much harder to miss.',
  },
  {
    id: 'cross-out',
    emoji: '❌',
    title: 'Cross Out Wrong Answers',
    description: 'Put a single line through each wrong answer. When only one is left, that is your answer.',
  },
  {
    id: 'dot-unsure',
    emoji: '🔵',
    title: 'Mark Your Unsure Ones',
    description: 'Put a small dot next to any question you are not 100% sure about. Come back to these at the end if you have time.',
  },
  {
    id: 'clock-check',
    emoji: '⏱️',
    title: 'Check the Clock Halfway',
    description: 'At the halfway point, ask yourself: are you halfway through the questions? If not, speed up on the easier ones to save time for the harder ones.',
  },
  {
    id: 'never-blank',
    emoji: '🎯',
    title: 'Never Leave a Blank',
    description: 'In multiple choice, a guess gives you a 25% chance. A blank gives you 0%. Always choose an answer, even if you are unsure.',
  },
  {
    id: 'change-with-reason',
    emoji: '🔄',
    title: 'Change If You Can Explain Why',
    description: 'If you review an answer and spot a mistake, change it. Research shows changing answers often helps — but only change if you can explain why, not just because you feel unsure.',
  },
];

// ─── Research Evidence ────────────────────────────────────────────

export interface ResearchPoint {
  stat: string;
  context: string;
  source: string;
  detail: string;
}

export const RESEARCH_POINTS: ResearchPoint[] = [
  {
    stat: '7 months',
    context: 'extra progress',
    source: 'EEF Teaching & Learning Toolkit',
    detail: 'Children who read questions carefully before answering gain the equivalent of 7 extra months of academic progress. This is the foundation of the AnswerTheQuestion! method.',
  },
  {
    stat: '3 months',
    context: 'extra progress',
    source: 'EEF Metacognition & Self-Regulation',
    detail: 'Children who use structured "stop-and-think" routines — like the 5-step technique in this app — gain 3 extra months of progress. Daily practice makes the technique automatic.',
  },
  {
    stat: '1 in 5',
    context: 'mistakes caught',
    source: 'Assessment & Evaluation in Higher Education',
    detail: 'Students who check their answers catch approximately 1 in 5 mistakes. In a competitive 11+ exam, this can be the difference between passing and missing out.',
  },
  {
    stat: '30%',
    context: 'of errors are misreads',
    source: 'NFER Analysis of 11+ Performance',
    detail: 'Nearly a third of errors in selective entrance exams come not from lack of knowledge, but from misreading the question. This app targets that specific gap.',
  },
  {
    stat: '2 in 3',
    context: 'answer changes help',
    source: 'Bauer et al. (2007)',
    detail: 'When students review and change answers, changes are predominantly from wrong to right. Students who understand this score higher. The "first instinct" myth costs marks that could be recovered.',
  },
  {
    stat: 'Proven',
    context: 'breathing helps 10–11-year-olds',
    source: 'Khng (2017), Primary 5 RCT',
    detail: 'A controlled trial with 10–11-year-olds found that deep breathing before a test significantly reduced anxiety and improved performance — exactly our age group, exactly our approach.',
  },
];

// ─── Programme Breakdown (for parents) ────────────────────────────

export interface ProgrammePhase {
  phase: string;
  weeks: string;
  emoji: string;
  title: string;
  description: string;
  scaffolding: string;
  detail: string;
}

export const PROGRAMME_PHASES: ProgrammePhase[] = [
  {
    phase: 'foundation',
    weeks: '1–4',
    emoji: '🧠',
    title: 'Foundation',
    description: 'Heavy scaffolding — every step is guided',
    scaffolding: 'Heavy',
    detail: 'Generous time limits (2 minutes per question). Full prompts. Difficulty level 1 (Year 4–5). Goal: learn the technique, not speed.',
  },
  {
    phase: 'building',
    weeks: '5–8',
    emoji: '💪',
    title: 'Building',
    description: 'Moderate scaffolding — fewer reminders',
    scaffolding: 'Moderate',
    detail: 'Tighter time limits (75–95 seconds). Shorter prompts. Difficulty level 2 (Year 5–6). Goal: apply the technique independently.',
  },
  {
    phase: 'exam-ready',
    weeks: '9–12',
    emoji: '⭐',
    title: 'Exam Mode',
    description: 'Light scaffolding — working independently',
    scaffolding: 'Light',
    detail: 'Exam-pace timing (55–70 seconds). Minimal prompts. Difficulty level 3 (advanced). Goal: automatic, exam-ready performance.',
  },
];

// ─── Scoring Breakdown (for parents) ──────────────────────────────

export interface ScoringComponent {
  name: string;
  weight: string;
  description: string;
}

export const SCORING_BREAKDOWN: ScoringComponent[] = [
  { name: 'Read Twice', weight: '25%', description: 'Did the child read the question a second time before proceeding?' },
  { name: 'Reading Time', weight: '15%', description: 'Did the child spend adequate time reading rather than rushing to the answers?' },
  { name: 'Key Words', weight: '30%', description: 'What proportion of key words did the child correctly identify?' },
  { name: 'Elimination', weight: '20%', description: 'Did the child eliminate all wrong answers before selecting?' },
  { name: 'Process Bonus', weight: '+10%', description: 'Bonus awarded when all technique steps are used correctly.' },
];

// ─── The 5 Core Habits ──────────────────────────────────────────
// These explain the rationale behind the whole programme — WHY
// these habits matter and what research supports them.

export interface CoreHabit {
  id: string;
  number: number;
  title: string;
  emoji: string;
  childSummary: string;
  parentExplanation: string;
  researchStat: string;
  researchSource: string;
  whyItMatters: string;
}

export const CORE_HABITS: CoreHabit[] = [
  {
    id: 'stay-calm',
    number: 1,
    title: 'Stay Calm & Breathe',
    emoji: '🧘',
    childSummary:
      'Before you start, take three slow, deep breaths. Breathe in for 4, hold for 4, breathe out for 4. This makes your brain work BETTER!',
    parentExplanation:
      'Test anxiety impairs working memory and executive function — the cognitive resources children need most in exams. A controlled trial with Primary 5 students (Khng, 2017) found that deep breathing before a maths test significantly reduced anxiety and improved performance. Breathing activates the parasympathetic nervous system, reducing cortisol and restoring cognitive capacity. Some researchers (e.g. Beilock) also find that briefly writing down worries before a test frees up working memory.',
    researchStat: 'Deep breathing improves test performance in 10–11-year-olds.',
    researchSource: 'Khng (2017), controlled trial with Primary 5 students',
    whyItMatters:
      'A calm child can access what they know. An anxious child cannot. This is why every session starts with a Calm & Focus exercise.',
  },
  {
    id: 'read-twice',
    number: 2,
    title: 'Read Twice Before Answering',
    emoji: '📖',
    childSummary:
      'Always read the question TWO times before looking at the answers. Cover the answers first — no peeking! This stops you getting tricked.',
    parentExplanation:
      'Nearly a third of errors in 11+ exams come from misreading, not lack of knowledge. The "read twice" habit forces metacognitive engagement — processing the question first for understanding, then for analysis.',
    researchStat: '30% of exam errors come from misreading.',
    researchSource: 'NFER Analysis of 11+ Performance',
    whyItMatters:
      'This is the highest-impact habit. Reading carefully twice eliminates a large proportion of avoidable errors before answering even begins.',
  },
  {
    id: 'eliminate',
    number: 3,
    title: 'Eliminate Wrong Answers',
    emoji: '✂️',
    childSummary:
      'Cross out the wrong answers one by one. Tip: answers with "absolute" words like "always" or "never" are often wrong! Cross them out first, then work through the rest.',
    parentExplanation:
      'Process of elimination transforms guessing from a 25% chance (1 in 4) to at least 50% (1 in 2) when one option is removed. More importantly, it forces systematic evaluation rather than impulsive selection — a bias known as satisficing, where students pick the first plausible answer. Answers with absolute words (always, never, all, none) are also more likely to be incorrect, giving children a practical starting point.',
    researchStat: 'Elimination can double accuracy on uncertain questions.',
    researchSource: 'Journal of Educational Psychology',
    whyItMatters:
      'In a competitive 11+ exam, even questions a child is unsure about can become correct answers through disciplined elimination. This habit turns "I do not know" into "I can work it out".',
  },
  {
    id: 'time-management',
    number: 4,
    title: 'Use Time Wisely',
    emoji: '⏱️',
    childSummary:
      'Do the easy questions first and come back to the hard ones. If you are stuck, put a dot next to it and move on. Do not waste time on one tricky question!',
    parentExplanation:
      'The "two-pass strategy" — answering easier questions first, then returning to harder ones — maximises marks per minute. Students who spend too long on one difficult question often run out of time and miss easier marks later. Knowing when to move on is as important as knowing how to answer.',
    researchStat: 'Poor pacing can cost 15–20% of available marks.',
    researchSource: 'Cambridge Assessment research on exam performance',
    whyItMatters:
      'Speed comes from technique, not rushing. As the 5 steps become automatic, children naturally get faster while making fewer errors.',
  },
  {
    id: 'check-everything',
    number: 5,
    title: 'Check Everything',
    emoji: '🔍',
    childSummary:
      'If you finish early, go back and check! Re-read each question and check your answer matches what was asked. The rule: only change your answer if you can explain WHY you are changing it.',
    parentExplanation:
      'Answer-checking consistently catches around 1 in 5 errors. Contrary to the "first instinct" myth, research shows answer changes are mostly from wrong to right. Students who know this are more likely to review — and score higher.',
    researchStat: 'Answer changes predominantly from wrong to right.',
    researchSource: 'Bauer et al. (2007); Kruger, Wirtz & Miller (2005)',
    whyItMatters:
      'Only change an answer if you can explain why — not just because you feel unsure.',
  },
];

// ─── Exam Strategy Research (for parents) ────────────────────────

export interface ExamStrategyResearch {
  id: string;
  title: string;
  emoji: string;
  question: string;
  finding: string;
  stat: string;
  source: string;
  implication: string;
}

export const EXAM_STRATEGY_RESEARCH: ExamStrategyResearch[] = [
  {
    id: 'answer-changing',
    title: 'Should You Change Your Answer?',
    emoji: '🔄',
    question: 'Is your first answer usually right? Should children stick with their first instinct?',
    finding:
      'The "first instinct fallacy" is one of the most persistent myths in education. Bauer et al. (2007) analysed real exam answer sheets and found that answer changes were predominantly from wrong to right. Crucially, students who were aware of this were more likely to review and change answers — and they scored higher. The key rule: only change an answer if you can explain why. Changing due to anxiety alone does not help; changing after re-reading the question does.',
    stat: 'Answer changes predominantly from wrong to right',
    source: 'Bauer et al. (2007); Kruger, Wirtz & Miller (2005)',
    implication:
      'Children should be explicitly taught that it is okay to change answers when they have a reason. The app reinforces this through the "Lock Your Answer" step: re-read the question, and if a different answer clearly fits, change it with confidence.',
  },
  {
    id: 'when-to-skip',
    title: 'When to Skip a Question',
    emoji: '⏭️',
    question: 'How long should a child spend on a question before moving on?',
    finding:
      'Research on timed assessments shows that the optimal strategy is the "two-pass" approach: answer all the questions you can do quickly first, then return to more difficult ones. Students who spend more than 1.5× the average time per question on a single item show diminishing returns — the chance of getting it right does not increase proportionally. Meanwhile, they risk missing easier marks later.',
    stat: 'After 1.5× average time, returns diminish sharply',
    source: 'Cambridge Assessment research on timed exams',
    implication:
      'In the 11+, there is no negative marking. This means children should always choose an answer, even if they are unsure. A best guess still gives them a chance of gaining a mark. The app trains time awareness through progressively shorter limits. Children learn to recognise when they are stuck, move on, and return later — without leaving questions unanswered.',
  },
  {
    id: 'checking-strategy',
    title: 'How to Check Effectively',
    emoji: '✅',
    question: 'What is the most effective way to check answers?',
    finding:
      'Simply re-reading your answer is far less effective than re-reading the original question. The best strategy is to re-read the question as if seeing it for the first time, then check whether your answer truly matches what was asked.',
    stat: 'Re-reading the question catches 3× more errors than re-reading the answer',
    source: 'NFER Assessment Research Programme',
    implication:
      'The app teaches this in the "Lock Your Answer" step — focusing on the question, not just the chosen option.',
  },
  {
    id: 'test-anxiety',
    title: 'Breathing & Calm Techniques',
    emoji: '🧘',
    question: 'Do breathing exercises actually help?',
    finding:
      'A controlled study of Primary 5 students (Khng, 2017) found that deep breathing before a test significantly reduced anxiety and improved performance. A systematic review also shows breathing exercises are highly effective for managing test anxiety. Beilock\'s research further shows that briefly writing down worries before a test can free up working memory, especially for anxious students.',
    stat: 'Deep breathing improves performance in 10–11-year-olds',
    source: 'Khng (2017); Beilock (2011)',
    implication:
      'The Calm & Focus exercise builds a repeatable pre-exam routine. Over time, children associate it with a calm, focused state they can access on exam day.',
  },
  {
    id: 'time-pacing',
    title: 'Pacing & Time Management',
    emoji: '⏱️',
    question: 'How should children manage their time?',
    finding:
      'Poor time management is a major cause of lost marks. High-performing students typically start answering immediately, skip difficult questions and return later, check the clock halfway through, and never leave a multiple-choice question blank.',
    stat: '15–20% of marks lost to poor pacing',
    source: 'Cambridge Assessment; QCA analysis',
    implication:
      'The app gradually reduces time per question to build pace naturally, while reinforcing these strategies.',
  },
  {
    id: 'elimination-evidence',
    title: 'Process of Elimination',
    emoji: '✂️',
    question: 'How much does elimination help?',
    finding:
      'Eliminating even one option improves the odds of guessing correctly. Eliminating two raises the chance to 50%. More importantly, evaluating each option engages deeper thinking, often helping the correct answer become clear.',
    stat: 'Eliminating two options doubles accuracy',
    source: 'Journal of Educational Psychology; EEF guidance',
    implication:
      'The app makes elimination a scored habit, helping children practise it until it becomes automatic.',
  },
];
