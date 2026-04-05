import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';

interface ResearchSection {
  id: string;
  emoji: string;
  title: string;
  clearStep?: string;
  summary: string;
  detail: string;
  citations: Citation[];
}

interface Citation {
  authors: string;
  year: number;
  title: string;
  journal: string;
  detail?: string;
}

const SECTIONS: ResearchSection[] = [
  {
    id: 'metacognition',
    emoji: '🧠',
    title: 'Metacognition',
    summary:
      'Teaching children to think about their own thinking is one of the most powerful interventions in education. The CLEAR Method builds metacognitive habits into every question.',
    detail:
      'Metacognition \u2014 the ability to monitor and regulate one\u2019s own cognitive processes \u2014 has been consistently identified as a key predictor of academic success. Research shows that explicitly training metacognitive strategies can significantly improve exam performance, particularly in high-stakes settings. The CLEAR Method embeds metacognitive checkpoints throughout each question: pausing before answering, reviewing highlighted keywords, and reflecting on technique scores after each session.',
    citations: [
      {
        authors: 'Flavell, J.H.',
        year: 1979,
        title: 'Metacognition and cognitive monitoring: A new area of cognitive\u2013developmental inquiry',
        journal: 'American Psychologist, 34(10), 906\u2013911',
      },
      {
        authors: 'Veenman, M.V.J., Van Hout-Wolters, B.H.A.M., & Afflerbach, P.',
        year: 2006,
        title: 'Metacognition and learning: Conceptual and methodological considerations',
        journal: 'Metacognition and Learning, 1(1), 3\u201314',
      },
      {
        authors: 'Education Endowment Foundation',
        year: 2021,
        title: 'Metacognition and Self-Regulated Learning: Guidance Report',
        journal: 'EEF, London',
        detail: 'Metacognition and self-regulation approaches have consistently high levels of impact, with pupils making an average of seven months\u2019 additional progress.',
      },
    ],
  },
  {
    id: 'close-reading',
    emoji: '👀',
    title: 'Close Reading & Active Comprehension',
    clearStep: 'L \u2014 Look for Keywords',
    summary:
      'Underlining, highlighting, and re-reading the question are proven strategies for improving reading comprehension and reducing careless errors.',
    detail:
      'Active reading strategies \u2014 including annotation, keyword identification, and re-reading \u2014 have been widely studied. Research from RAND and others shows that constructively responsive reading (engaging actively with text rather than passively scanning) leads to deeper comprehension and more accurate answers. The CLEAR Method trains children to highlight keywords before attempting an answer, building a habit of careful question analysis.',
    citations: [
      {
        authors: 'Snow, C.E.',
        year: 2002,
        title: 'Reading for Understanding: Toward an R&D Program in Reading Comprehension',
        journal: 'RAND Corporation, Santa Monica, CA',
      },
      {
        authors: 'Pressley, M. & Afflerbach, P.',
        year: 1995,
        title: 'Verbal Protocols of Reading: The Nature of Constructively Responsive Reading',
        journal: 'Lawrence Erlbaum Associates, Hillsdale, NJ',
      },
      {
        authors: 'Dunlosky, J., Rawson, K.A., Marsh, E.J., Nathan, M.J., & Willingham, D.T.',
        year: 2013,
        title: 'Improving students\u2019 learning with effective learning techniques: Promising directions from cognitive and educational psychology',
        journal: 'Psychological Science in the Public Interest, 14(1), 4\u201358',
      },
    ],
  },
  {
    id: 'elimination',
    emoji: '\u2702\uFE0F',
    title: 'Process of Elimination',
    clearStep: 'E \u2014 Eliminate Wrong Answers',
    summary:
      'Eliminating obviously wrong answers before selecting a final answer is a well-documented exam technique that improves accuracy, particularly in multiple-choice formats.',
    detail:
      'The process of elimination is one of the most effective test-taking strategies available. Research on test-wiseness \u2014 the ability to use the format and structure of a test to gain advantage \u2014 shows that training students in elimination techniques leads to measurable score improvements. By crossing out wrong answers first, children narrow the field and reduce cognitive load, making it easier to identify the correct response.',
    citations: [
      {
        authors: 'Gierl, M.J., Alves, C., & Taylor-Majeau, R.',
        year: 2010,
        title: 'Using the Attribute Hierarchy Method to make diagnostic inferences about examinees\u2019 knowledge and skills',
        journal: 'Alberta Journal of Educational Research, 56(2)',
      },
      {
        authors: 'Millman, J., Bishop, C.H., & Ebel, R.',
        year: 1965,
        title: 'An analysis of test-wiseness',
        journal: 'Educational and Psychological Measurement, 25(3), 707\u2013726',
      },
    ],
  },
  {
    id: 'breathing',
    emoji: '\uD83E\uDDD8',
    title: 'Breathing Exercises & Stress Regulation',
    clearStep: 'C \u2014 Calm Your Mind',
    summary:
      'Controlled breathing techniques reduce test anxiety and improve attention. Our pre-session breathing exercises are grounded in clinical research.',
    detail:
      'Test anxiety affects a significant proportion of students and is associated with poorer performance. Diaphragmatic (slow, deep) breathing has been shown to activate the parasympathetic nervous system, reducing cortisol levels and improving attentional focus. Research published in Frontiers in Psychology demonstrated that even brief breathing exercises can measurably improve attention and reduce negative affect in both children and adults. The CLEAR Method opens every session with a Calm step \u2014 a guided breathing exercise designed to bring focus before the first question.',
    citations: [
      {
        authors: 'Ma, X., Yue, Z.Q., Gong, Z.Q., Zhang, H., Duan, N.Y., Shi, Y.T., Wei, G.X., & Li, Y.F.',
        year: 2017,
        title: 'The effect of diaphragmatic breathing on attention, negative affect and stress in healthy adults',
        journal: 'Frontiers in Psychology, 8, 874',
      },
      {
        authors: 'Zaccaro, A., Piarulli, A., Laurino, M., Garbella, E., Menicucci, D., Neri, B., & Gemignani, A.',
        year: 2018,
        title: 'How breath-control can change your life: A systematic review on psycho-physiological correlates of slow breathing',
        journal: 'Frontiers in Human Neuroscience, 12, 353',
      },
      {
        authors: 'Hembree, R.',
        year: 1988,
        title: 'Correlates, causes, effects, and treatment of test anxiety',
        journal: 'Review of Educational Research, 58(1), 47\u201377',
        detail: 'Meta-analysis of 562 studies finding that test anxiety reliably decreases performance.',
      },
    ],
  },
  {
    id: 'spaced-repetition',
    emoji: '🔄',
    title: 'Spaced Repetition & Distributed Practice',
    summary:
      'Our mistake review system uses spaced repetition \u2014 one of the most rigorously studied techniques in cognitive psychology \u2014 to ensure children revisit and learn from errors.',
    detail:
      'The spacing effect, first documented by Ebbinghaus in 1885, is one of the most robust findings in learning science. Distributing practice over time leads to dramatically better long-term retention than massed (crammed) study. A comprehensive meta-analysis by Cepeda et al. confirmed that spaced practice produces reliable benefits across ages, materials, and domains. AnswerTheQuestion! automatically resurfaces questions that a child got wrong, spacing them across subsequent sessions to strengthen retention.',
    citations: [
      {
        authors: 'Ebbinghaus, H.',
        year: 1885,
        title: '\u00DCber das Ged\u00E4chtnis: Untersuchungen zur experimentellen Psychologie',
        journal: 'Duncker & Humblot, Leipzig (translated 1913 as Memory: A Contribution to Experimental Psychology)',
      },
      {
        authors: 'Cepeda, N.J., Pashler, H., Vul, E., Wixted, J.T., & Rohrer, D.',
        year: 2006,
        title: 'Distributed practice in verbal recall tasks: A review and quantitative synthesis',
        journal: 'Psychological Bulletin, 132(3), 354\u2013380',
      },
    ],
  },
  {
    id: 'test-anxiety',
    emoji: '💆',
    title: 'Test Anxiety & Exam Preparation',
    summary:
      'Test anxiety is a major barrier to children performing at their best. Familiarity with exam format, timed practice, and structured routines all reduce anxiety.',
    detail:
      'Research consistently shows that test anxiety has both a cognitive component (worry, self-doubt) and an emotional component (physiological arousal). Importantly, repeated, low-stakes exposure to test conditions reduces anxiety through desensitisation. The AnswerTheQuestion! programme provides daily 15-minute sessions with gradually increasing difficulty and realistic timing, helping children become comfortable with exam pressure long before the actual test day.',
    citations: [
      {
        authors: 'Cassady, J.C. & Johnson, R.E.',
        year: 2002,
        title: 'Cognitive test anxiety and academic performance',
        journal: 'Contemporary Educational Psychology, 27(2), 270\u2013295',
      },
      {
        authors: 'Hembree, R.',
        year: 1988,
        title: 'Correlates, causes, effects, and treatment of test anxiety',
        journal: 'Review of Educational Research, 58(1), 47\u201377',
      },
      {
        authors: 'Putwain, D.W. & Daly, A.L.',
        year: 2014,
        title: 'Test anxiety prevalence and gender differences in a sample of English secondary school students',
        journal: 'Educational Studies, 40(5), 554\u2013570',
      },
    ],
  },
  {
    id: 'self-regulation',
    emoji: '🎯',
    title: 'Self-Regulation & Executive Function',
    clearStep: 'R \u2014 Review Your Answer',
    summary:
      'Training children to pause, check their work, and reflect builds executive function skills that benefit them across all subjects and throughout life.',
    detail:
      'Executive functions \u2014 including inhibitory control (resisting impulses), working memory, and cognitive flexibility \u2014 are critical for academic success. Zimmerman\u2019s model of self-regulated learning emphasises the cyclical nature of planning, monitoring, and reflecting. The Review step in the CLEAR Method explicitly trains children to check their answer before moving on, building the habit of self-monitoring that transfers to other academic contexts.',
    citations: [
      {
        authors: 'Diamond, A.',
        year: 2013,
        title: 'Executive functions',
        journal: 'Annual Review of Psychology, 64, 135\u2013168',
      },
      {
        authors: 'Zimmerman, B.J.',
        year: 2002,
        title: 'Becoming a self-regulated learner: An overview',
        journal: 'Theory Into Practice, 41(2), 64\u201370',
      },
    ],
  },
  {
    id: 'visualisation',
    emoji: '🌈',
    title: 'Mental Imagery & Positive Visualisation',
    summary:
      'Guided visualisation before a task can improve confidence, reduce anxiety, and prime the brain for focused performance.',
    detail:
      'Mental imagery techniques have been widely studied in both clinical and performance psychology. Research shows that positive mental imagery can reduce anxiety and improve self-efficacy. The visualisation exercises in AnswerTheQuestion! guide children through imagining a calm, confident exam experience \u2014 priming their brain for focused, composed performance before they begin practising.',
    citations: [
      {
        authors: 'Holmes, E.A. & Mathews, A.',
        year: 2010,
        title: 'Mental imagery in emotion and emotional disorders',
        journal: 'Clinical Psychology Review, 30(3), 349\u2013362',
      },
      {
        authors: 'Moran, A., Guillot, A., MacIntyre, T., & Collet, C.',
        year: 2012,
        title: 'Re-imagining motor imagery: Building bridges between cognitive neuroscience and sport psychology',
        journal: 'British Journal of Psychology, 103(2), 224\u2013247',
      },
    ],
  },
];

function ResearchCard({ section }: { section: ResearchSection }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="bg-white/95 backdrop-blur-sm rounded-card p-5 shadow-sm border border-white/30"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5">{section.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-extrabold text-base text-gray-800">
              {section.title}
            </h3>
            {section.clearStep && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-display font-bold">
                CLEAR: {section.clearStep}
              </span>
            )}
            <p className="font-display text-sm text-gray-600 mt-2 leading-relaxed">
              {section.summary}
            </p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <p className="font-display text-sm text-gray-600 leading-relaxed mb-4">
            {section.detail}
          </p>

          <div className="space-y-3">
            <p className="font-display font-bold text-xs text-gray-400 uppercase tracking-wide">
              Key References
            </p>
            {section.citations.map((cite, i) => (
              <div
                key={i}
                className="pl-3 border-l-2 border-purple-200"
              >
                <p className="font-display text-xs text-gray-700 leading-relaxed">
                  <span className="font-bold">{cite.authors}</span> ({cite.year}).{' '}
                  <em>{cite.title}</em>.{' '}
                  <span className="text-gray-500">{cite.journal}</span>
                </p>
                {cite.detail && (
                  <p className="font-display text-xs text-purple-600 mt-1 italic">
                    {cite.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ResearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
        <Link
          to="/"
          className="inline-block mb-4 text-white/80 hover:text-white font-display text-sm transition-colors"
        >
          &larr; Back to home
        </Link>
        <div className="flex justify-center mb-4">
          <ProfessorHoot mood="teaching" size="lg" animate showSpeechBubble={false} />
        </div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-lg mb-3">
          Why It Works
        </h1>
        <p className="font-display text-white/90 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          AnswerTheQuestion! isn&rsquo;t built on guesswork. Every element of the CLEAR Method
          is grounded in published research from cognitive psychology, education science,
          and exam preparation.
        </p>
      </div>

      {/* Section cards */}
      <div className="max-w-2xl mx-auto px-4 pb-10 space-y-4">
        {SECTIONS.map(section => (
          <ResearchCard key={section.id} section={section} />
        ))}

        {/* Disclaimer */}
        <div className="text-center pt-4 pb-2">
          <p className="font-display text-xs text-white/75 leading-relaxed max-w-md mx-auto">
            All citations are from peer-reviewed journals or recognised educational bodies.
            We encourage parents and educators to verify these sources independently.
            AnswerTheQuestion! is an educational tool and does not guarantee specific exam outcomes.
          </p>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-6"
        >
          <Link
            to="/signup"
            className="inline-block py-3 px-8 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Try it risk-free &mdash; 7-day money-back guarantee
          </Link>
          <p className="font-display text-white/80 text-sm mt-3">
            <Link to="/login" className="underline hover:text-white/80">Already have an account? Sign in</Link>
          </p>
        </motion.div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 text-sm text-white/80 font-display flex-wrap pb-8">
          <Link to="/privacy-policy" className="hover:text-white/80 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-white/30">|</span>
          <Link to="/terms" className="hover:text-white/80 transition-colors">
            Terms
          </Link>
          <span className="text-white/30">|</span>
          <Link to="/refunds" className="hover:text-white/80 transition-colors">
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
