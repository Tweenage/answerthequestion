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
      'Re-reading is the single most impactful exam technique. Children lose marks not from lack of knowledge but from misreading. Enforcing a "read twice" habit builds metacognitive awareness — the ability to monitor their own understanding before committing to an answer.',
    researchStat: '7 extra months of progress',
    researchSource: 'EEF Teaching & Learning Toolkit',
  },
  {
    id: 'key-words',
    number: 2,
    title: 'Spot the Key Words',
    emoji: '🔍',
    childDescription:
      'Highlight the FEWEST words that tell you exactly what the question is asking — like a detective picking only the vital clues. Always highlight danger words: NOT, except, least, never, only, however, although. Only highlight a name if there are TWO OR MORE people in the question — then you need to match the right detail to the right person. Test yourself: could you answer the question using only your highlighted words?',
    hootSecret:
      "I call this being a Word Detective! The best detectives don't circle everything — they find the vital few clues. If you highlight every word, none of them stand out. Pick only what really matters!",
    inYourExam: [
      'Underline the fewest words that tell you exactly what the question is asking',
      'Always underline danger words like NOT, except, least, most, only — they change everything',
      'Only underline names if the question mentions more than one person — then you need to match the right detail to the right person',
    ],
    inTheApp:
      'Tap the key words to highlight them. The app shows you which ones you found and which you missed.',
    parentDescription:
      'Highlighting key words reduces cognitive load by externalising working memory. Children can hold the question in mind more effectively when they have physically identified what matters. Danger words (NOT, except, least) are the most common cause of avoidable errors in 11+ exams.',
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
      'Number words embedded in text are a deliberate trap in 11+ maths questions. Converting to digits is a metacognitive strategy that forces engagement with the mathematical content before calculating, reducing impulsive errors.',
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
      'Systematic elimination is a metacognitive strategy that forces children to evaluate every option rather than satisficing (picking the first plausible answer). This is particularly powerful in 11+ multiple choice where distractors are deliberately designed to catch common misreadings.',
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
      'The final verification step closes the metacognitive loop. Research shows that students who perform a final check before committing catch approximately 1 in 5 errors — a significant margin in competitive 11+ exams where a single mark can determine outcomes.',
    researchStat: 'Catches 1 in 5 mistakes',
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
    tagline: 'Breathe before you begin',
    gradient: 'from-blue-500 to-indigo-600',
    textColour: 'text-indigo-700',
    childDescription:
      'Before every practice session and every exam, take a moment to breathe. Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. This tells your brain: "Time to focus!" A calm brain answers questions better than a worried brain.',
    hootSecret:
      "I always breathe before I start. Even wise owls get nervous — breathing is how I tell my brain to be brilliant! You can feel the difference straight away.",
    inYourExam: [
      'Take 3 slow, deep breaths before the exam begins',
      'Breathe in for 4 counts, hold for 4, breathe out for 4',
      "If you feel stuck on a question, breathe first — then try again",
      'Tell yourself: "I am calm. I am ready. I know my CLEAR Method."',
    ],
    inTheApp:
      'Every session starts with a box breathing exercise. Do not skip it — it is training your brain to start every exam feeling calm and ready!',
    linkToBreathing: true,
  },
  {
    letter: 'L',
    name: 'Look',
    emoji: '👀',
    tagline: 'Read every word carefully',
    gradient: 'from-violet-500 to-purple-600',
    textColour: 'text-purple-700',
    childDescription:
      'Read the question TWO times before you look at the answers. First read: what is it about? Second read: what is it REALLY asking? Then find the key words — the fewest words that tell you exactly what you need. Always look out for danger words like NOT, except, never, only — they flip the whole meaning!',
    hootSecret:
      "Here's my biggest secret: I ALWAYS read every question twice. Even wise owls need two looks! If you rush straight to the answers, the question setter wins. Slow down to speed up.",
    inYourExam: [
      'Cover the answers with your hand so you cannot peek',
      'Read the question once to understand it',
      'Read it again and ask: "What is this REALLY asking?"',
      'Underline key words — especially danger words like NOT, except, only, never',
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
      'Cross out ALL the wrong answers one by one. Ask yourself: "Could this possibly be right?" If no, cross it out! The last one standing is your answer. Even if you are not sure of the right answer, you can almost always spot what is clearly wrong.',
    hootSecret:
      "This is my favourite trick! Cross out the wrong ones first, and the right answer practically jumps out at you. Hoo-ray! The question setters hide the right answer — elimination finds it.",
    inYourExam: [
      'Put a single line through each wrong answer',
      'Check EVERY option — do not grab the first one that looks right',
      'Watch for answers using numbers from the question but calculated wrongly',
      'Watch for answers that mention the passage but do not answer THIS question',
    ],
    inTheApp:
      'Tap wrong answers to cross them out. You cannot select the right answer until all wrong ones are gone — that is the rule!',
  },
  {
    letter: 'A',
    name: 'Answer',
    emoji: '✏️',
    tagline: 'Choose with confidence',
    gradient: 'from-pink-500 to-rose-600',
    textColour: 'text-rose-700',
    childDescription:
      'Now choose your answer! After eliminating, you should have just one or two options left. Pick the one that best answers what the question REALLY asked. Trust your method — you have done all the preparation. Go with the answer that matches your key words.',
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
      "Before you lock in, read the question ONE MORE TIME. Does your answer still match what was asked? Did you spot any danger words? If you are happy, lock it in! If something feels off, trust that feeling and reconsider. Research shows that answer changes are mostly from WRONG to RIGHT — checking really works!",
    hootSecret:
      "A wise owl always double-checks! The research says students who check their answers catch 1 in 5 mistakes. That could be the difference between passing and failing. Always review!",
    inYourExam: [
      'Re-read the question one final time before writing your answer',
      'Check: did I answer what was ASKED, not what I expected?',
      'It is okay to change your answer if you spot a real reason',
      'If you finish early, go back and check ALL your answers!',
    ],
    inTheApp:
      'After choosing, the app shows your answer and asks "does this still make sense?". You can change it at this point. When you are sure — lock it in!',
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
        'For long passages, read the whole thing once before looking at any questions. Then go back to find the answers. Do not just skim!',
      parentExplanation:
        'Full passage reading before questions builds a mental model of the text, enabling more accurate retrieval and reducing the tendency to anchor on the first relevant detail found.',
    },
    {
      id: 'eng-meaning-vs-opposite',
      title: 'Meaning vs Opposite',
      emoji: '↔️',
      childTip:
        '"Closest in meaning" and "opposite" need completely different answers! Read which one the question asks BEFORE you look at the choices.',
      parentExplanation:
        'Confusion between synonym and antonym questions is one of the most common errors. Training children to identify the question type before evaluating options prevents this systematic error.',
    },
    {
      id: 'eng-signal-words',
      title: 'Signal Words Change Meaning',
      emoji: '🚦',
      childTip:
        'Words like "however", "although", "but" and "despite" flip the meaning! If the passage says "It was sunny, however..." — the answer is about what comes AFTER "however".',
      parentExplanation:
        'Discourse markers (however, although, despite) signal logical relationships. Children who recognise these connectives demonstrate higher-order comprehension and avoid the trap of anchoring on the first clause.',
    },
    {
      id: 'eng-five-ws',
      title: 'Who, What, When, Where, Why',
      emoji: '❓',
      childTip:
        'Work out which type of question it is. "Who" needs a person. "When" needs a time. "Where" needs a place. Match your answer to the question type!',
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
    childExplanation: "NOT and EXCEPT flip everything! When a question says 'which is NOT true', the right answer is the one that IS wrong.",
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
    description: 'Use your hand or a piece of paper to cover the answer choices while you read the question. No peeking! Read the question twice FIRST.',
  },
  {
    id: 'underline-keywords',
    emoji: '✏️',
    title: 'Underline Key Words',
    description: 'Use your pencil to underline the fewest words that tell you what the question is really asking. Always underline danger words like NOT, except, least, never, only. Only underline names if there are two or more people — then you need to match each person to the right detail. If everything is underlined, nothing stands out — be selective.',
  },
  {
    id: 'circle-numbers',
    emoji: '⭕',
    title: 'Circle All Numbers',
    description: 'Circle every number you see. Next to number words like "twelve", write the digit (12). This makes them impossible to miss.',
  },
  {
    id: 'cross-out',
    emoji: '❌',
    title: 'Cross Out Wrong Answers',
    description: 'Put a single line through each wrong answer. When only one is left, that is your answer!',
  },
  {
    id: 'dot-unsure',
    emoji: '🔵',
    title: 'Dot Your Unsure Ones',
    description: 'Put a small dot next to any question you are not 100% sure about. Come back to these at the end if you have time.',
  },
  {
    id: 'clock-check',
    emoji: '⏱️',
    title: 'Check the Clock Halfway',
    description: 'At the halfway point, check: are you halfway through the questions? If not, speed up on the easy ones to save time for the hard ones.',
  },
  {
    id: 'never-blank',
    emoji: '🎯',
    title: 'Never Leave a Blank',
    description: 'In multiple choice, a guess gives you a 25% chance. A blank gives you 0%. Always put an answer, even if you are not sure!',
  },
  {
    id: 'change-with-reason',
    emoji: '🔄',
    title: 'Change If You Can Explain Why',
    description: 'If you check an answer and spot a mistake, change it! Research shows changing usually helps. But only change if you can say WHY — not just because you feel unsure.',
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
    detail: "Children who use structured 'stop-and-think' routines — like the 5-step technique in this app — gain 3 extra months of progress. Daily practice makes the technique automatic.",
  },
  {
    stat: '1 in 5',
    context: 'mistakes caught',
    source: 'Assessment & Evaluation in Higher Education',
    detail: 'Students who check their answers catch approximately 1 in 5 mistakes. In a competitive 11+ exam, this could be the difference between a pass and a miss.',
  },
  {
    stat: '30%',
    context: 'of errors are misreads',
    source: 'NFER Analysis of 11+ Performance',
    detail: 'Nearly a third of all errors in selective entrance exams come not from lack of knowledge but from misreading the question. This app targets that specific gap.',
  },
  {
    stat: '2 in 3',
    context: 'answer changes help',
    source: 'Bauer et al. (2007)',
    detail: 'When students review and change answers, changes are predominantly from wrong to right. Students informed about this scored higher. The "first instinct" myth costs children marks they could recover.',
  },
  {
    stat: 'Proven',
    context: 'breathing helps 10–11 yr olds',
    source: 'Khng (2017), Primary 5 RCT',
    detail: 'A controlled trial with 10–11 year olds found deep breathing before a test significantly reduced anxiety and improved performance. Exactly our age group, exactly our approach.',
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
    description: 'Heavy scaffolding — we guide every step',
    scaffolding: 'Heavy',
    detail: 'Generous time limits (2 minutes per question). Full prompts at every step. Difficulty level 1 (Year 4–5). The goal is to learn the technique, not to be fast.',
  },
  {
    phase: 'building',
    weeks: '5–8',
    emoji: '💪',
    title: 'Building',
    description: 'Medium scaffolding — fewer reminders',
    scaffolding: 'Medium',
    detail: 'Tighter time limits (75–95 seconds). Shorter prompts. Difficulty level 2 (Year 5–6). Children begin applying the technique independently.',
  },
  {
    phase: 'exam-ready',
    weeks: '9–12',
    emoji: '⭐',
    title: 'Exam Mode',
    description: 'Light scaffolding — working independently',
    scaffolding: 'Light',
    detail: 'Exam-pace time limits (55–70 seconds). Minimal prompts. Difficulty level 3 (advanced). The technique is now automatic — children do it without thinking.',
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
      'Test anxiety impairs working memory and executive function — the very cognitive resources children need most in exams. A controlled trial with Primary 5 students (Khng, 2017) found that deep breathing before a maths test significantly reduced anxiety and improved performance. Breathing activates the parasympathetic nervous system, reducing cortisol and restoring cognitive capacity. Some researchers (Beilock) also find that briefly writing down worries before a test frees up working memory.',
    researchStat: 'Deep breathing significantly improved test scores in 10–11 year olds',
    researchSource: 'Khng (2017), controlled trial with Primary 5 students',
    whyItMatters:
      'A calm child can access everything they know. An anxious child cannot. Building a pre-exam calm routine turns "I feel scared" into "I feel ready". This is why the app starts every session with a Calm & Focus exercise.',
  },
  {
    id: 'read-twice',
    number: 2,
    title: 'Read Twice Before Answering',
    emoji: '📖',
    childSummary:
      'Always read the question TWO times before looking at the answers. Cover the answers first — no peeking! This stops you getting tricked.',
    parentExplanation:
      'Nearly a third of all errors in 11+ exams come from misreading, not from lack of knowledge. The "read twice" habit forces metacognitive engagement — children must process the question on two levels (comprehension, then analysis) before seeing any answer options. This eliminates the most common source of avoidable marks lost.',
    researchStat: '30% of exam errors are from misreading',
    researchSource: 'NFER Analysis of 11+ Performance',
    whyItMatters:
      'This is the single highest-impact habit. If a child reads carefully twice, they eliminate nearly a third of all potential errors before they even start thinking about the answer.',
  },
  {
    id: 'eliminate',
    number: 3,
    title: 'Eliminate Wrong Answers',
    emoji: '✂️',
    childSummary:
      'Cross out the wrong answers one by one. Tip: answers with "absolute" words like "always" or "never" are often wrong! Cross them out first, then work through the rest.',
    parentExplanation:
      'Process of elimination transforms guessing from a 25% chance (1 in 4) to at least 50% (1 in 2) when even one option is eliminated. More importantly, it forces systematic evaluation of every option rather than impulsive selection of the first plausible answer — a cognitive bias called "satisficing" that costs children significant marks. Test-taking research also shows that answers containing absolute qualifiers (always, never, all, none) are more frequently incorrect, giving children a concrete starting heuristic.',
    researchStat: 'Doubles accuracy from 25% to 50%+ on uncertain questions',
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
      'The "two-pass strategy" — answering easy questions first, then returning to difficult ones — maximises marks per minute. Research on timed assessments shows that students who spend disproportionate time on a single difficult question frequently run out of time and miss easy marks later. Training children to recognise when to move on is as important as teaching them how to answer.',
    researchStat: 'Students lose 15–20% of available marks to poor pacing',
    researchSource: 'Cambridge Assessment research on exam performance',
    whyItMatters:
      'Speed comes from technique, not rushing. As the 5 steps become automatic through daily practice, children naturally get faster — spending less time per question while making fewer errors. The app gradually reduces time limits across the 12 weeks to build this fluency.',
  },
  {
    id: 'check-everything',
    number: 5,
    title: 'Check Everything',
    emoji: '🔍',
    childSummary:
      'If you finish early, go back and check! Re-read each question and check your answer matches what was asked. The rule: only change your answer if you can explain WHY you are changing it.',
    parentExplanation:
      'Research consistently shows that answer-checking catches approximately 1 in 5 errors. Contrary to the popular "first instinct fallacy", Bauer et al. (2007) analysed real exam answer sheets and found changes were "predominantly from wrong to right". Critically, students who were informed about this tendency were more likely to check and change — and scored higher. The golden rule from the literature: only change an answer if you can explain why you are changing it.',
    researchStat: 'Answer changes predominantly from wrong to right',
    researchSource: 'Bauer et al. (2007); Kruger, Wirtz & Miller (2005)',
    whyItMatters:
      'Many children (and adults) believe they should stick with their first instinct. The research says the opposite: informed review improves scores. Teaching children it IS okay to change — when they have a reason — removes the fear of second-guessing and builds confident checking habits.',
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
      'The "first instinct fallacy" is one of the most persistent myths in education. Bauer et al. (2007) analysed real exam answer sheets and found that answer changes were "predominantly from wrong to right". Crucially, students who were informed about this research were more likely to review and change answers — and they scored higher. The key rule: only change an answer if you can explain why you are changing it. Changing based on anxiety alone does not help; changing based on re-reading the question does.',
    stat: 'Answer changes predominantly from wrong to right',
    source: 'Bauer et al. (2007); Kruger, Wirtz & Miller (2005)',
    implication:
      'Children should be explicitly taught that it IS okay to change answers when they have a reason. The app reinforces this through the "Lock Your Answer" step: re-read the question one final time, and if a different answer now clearly fits, change it with confidence.',
  },
  {
    id: 'when-to-skip',
    title: 'When to Skip a Question',
    emoji: '⏭️',
    question: 'How long should a child spend on a question before giving up and moving on?',
    finding:
      'Research on timed assessments shows that the optimal strategy is "two-pass": answer all questions you can do quickly on the first pass, then return to difficult ones. Students who spend more than 1.5x the average time per question on a single item show diminishing returns — the probability of getting it right does not increase proportionally with time spent. Meanwhile, they miss easy marks at the end.',
    stat: 'After 1.5x average time, returns diminish sharply',
    source: 'Cambridge Assessment research on timed exams',
    implication:
      'The app trains awareness of time through progressively shorter time limits. Children learn to recognise when they are stuck and to mark the question for later review rather than persisting unproductively.',
  },
  {
    id: 'checking-strategy',
    title: 'How to Check Effectively',
    emoji: '✅',
    question: 'What is the most effective way to check answers in an exam?',
    finding:
      'Simply re-reading your answer is far less effective than re-reading the original question. The most effective checking strategy is to re-read the question as if seeing it for the first time, then verify your answer addresses what was actually asked. This catches errors from misreading, which account for the largest category of avoidable mistakes.',
    stat: 'Re-reading the question catches 3x more errors than re-reading the answer',
    source: 'NFER Assessment Research Programme',
    implication:
      'The app teaches children to go back to the question in the "Lock Your Answer" step — not to re-check their chosen option but to verify they answered what was actually asked.',
  },
  {
    id: 'test-anxiety',
    title: 'Breathing & Calm Techniques',
    emoji: '🧘',
    question: 'Do breathing exercises actually help children perform better in exams?',
    finding:
      'A controlled study of Primary 5 students (Khng, 2017) found that deep breathing before a maths test "significantly reduced self-reported feelings of anxiety and improved test performance". A systematic review also concludes that breathing exercises, especially combined with cognitive coping, are "significantly important in coping with test anxiety". Separately, Beilock\'s research shows that briefly writing about worries before a test frees up working memory, particularly for high-anxiety students.',
    stat: 'Deep breathing significantly improved scores in 10–11 year olds',
    source: 'Khng (2017); systematic review of breathing interventions; Beilock (2011)',
    implication:
      'The Calm & Focus exercise at the start of each session builds a pre-exam routine. Over 12 weeks, children associate the breathing pattern with a calm, focused state — creating an anchor they can use on exam day. Parents can also encourage a brief "worry dump" (writing down anxious thoughts) before the real exam.',
  },
  {
    id: 'time-pacing',
    title: 'Pacing & Time Management',
    emoji: '⏱️',
    question: 'How should children manage their time in a timed exam?',
    finding:
      'Research consistently shows that poor time management is one of the top causes of underperformance in timed exams. Studies of high-achieving test-takers show they do NOT read the whole paper first (this is time-consuming and ineffective). Instead they: (1) start answering immediately, (2) skip difficult questions and return to them later, (3) check the clock at the halfway point and adjust pace, and (4) never leave a question blank in multiple choice (even a guess is worth 25%).',
    stat: '15–20% of marks lost to poor pacing',
    source: 'Cambridge Assessment; QCA Analysis of KS2/11+ Performance',
    implication:
      'The app gradually reduces time per question across the 12-week programme, building pace naturally. The "On Paper" tips teach children the halfway clock check and the dot-for-later strategy.',
  },
  {
    id: 'elimination-evidence',
    title: 'Process of Elimination',
    emoji: '✂️',
    question: 'How much does systematic elimination actually help?',
    finding:
      'Systematic elimination of distractors is one of the most effective test-taking strategies. Even when a student cannot identify the correct answer directly, eliminating just one option improves their probability from 25% to 33%, and eliminating two raises it to 50%. More importantly, the process of actively evaluating each option engages deeper cognitive processing, which often triggers recognition of the correct answer.',
    stat: 'Eliminating 2 options doubles chance of correct answer',
    source: 'Journal of Educational Psychology; EEF Metacognition guidance',
    implication:
      'The app makes elimination a scored component of every question. Children practise crossing out wrong answers systematically, building the habit so it becomes automatic in the exam.',
  },
];
