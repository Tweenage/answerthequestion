import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ─── Evidence Base sections (matches Parent Guide v2.1, April 2026) ── */

interface EvidenceSection {
  id: string;
  title: string;
  body: string;
  source: string;
  implication: string;
}

const EVIDENCE: EvidenceSection[] = [
  {
    id: 'reading-comprehension',
    title: 'Reading comprehension strategies (EEF synthesis)',
    body:
      'Research syntheses from the Education Endowment Foundation indicate that explicitly teaching reading comprehension strategies is associated with moderate improvements in reading outcomes for learners, typically summarised as several months of additional progress in school settings.',
    source:
      'Education Endowment Foundation (EEF) Teaching & Learning Toolkit \u2014 Reading Comprehension Strategies',
    implication:
      'Structured prompts such as rereading, identifying key words, and checking meaning reflect widely recommended comprehension strategies used in effective teaching practice.',
  },
  {
    id: 'metacognition',
    title: 'Metacognition and self-regulation (EEF synthesis)',
    body:
      'Metacognition and self-regulated learning approaches are consistently identified in large-scale evidence reviews as having high impact relative to cost, supporting pupils in planning, monitoring, and evaluating their work.',
    source:
      'Education Endowment Foundation (EEF) Teaching & Learning Toolkit \u2014 Metacognition and Self-Regulation',
    implication:
      'The \u201cLook \u2192 Eliminate \u2192 Answer \u2192 Review\u201d structure is designed to prompt children to monitor their thinking and reduce impulsive responding.',
  },
  {
    id: 'breathing',
    title: 'Brief breathing and test anxiety (Khng, 2017)',
    body:
      'A randomised controlled trial with primary-aged pupils found that a short guided breathing exercise prior to timed tasks was associated with reduced test anxiety and improved performance outcomes in that study context.',
    source: 'Khng, K.H. (2017), Cognition and Emotion',
    implication:
      'The \u201cCalm\u201d step uses a brief breathing routine intended to support emotional regulation and task focus before answering questions.',
  },
  {
    id: 'assessment-errors',
    title: 'Errors in multiple-choice assessment (Binks et al., 2022)',
    body:
      'Research into assessment errors suggests that a proportion of incorrect responses may reflect attention slips, misreading, or execution errors rather than lack of knowledge, highlighting the value of careful review processes.',
    source: 'Binks et al. (2022), Teaching and Learning in Medicine',
    implication:
      'The \u201cReview\u201d step is designed to help children catch avoidable mistakes through structured re-checking.',
  },
  {
    id: 'answer-changing',
    title: 'Answer changing in multiple-choice contexts (Bauer et al., 2007)',
    body:
      'Research in multiple-choice assessment contexts indicates that when students change answers, changes are more often from incorrect to correct than from correct to incorrect, although results vary by context and student population.',
    source: 'Bauer et al. (2007), BMC Medical Education',
    implication:
      'CLEAR encourages deliberate review rather than instinctive finalisation, while teaching children to justify changes with evidence.',
  },
  {
    id: 'spacing',
    title: 'Distributed practice (spacing effect)',
    body:
      'A large body of cognitive science research shows that learning is more durable when practice is distributed over time rather than concentrated in a single session.',
    source:
      'Rohrer & Pashler (2007); broader spacing effect literature',
    implication:
      'The programme uses short, regular practice sessions designed to support retention and reduce overload.',
  },
];

/* ─── CLEAR Method steps ─── */

const CLEAR_STEPS = [
  {
    letter: 'C',
    name: 'Calm',
    description:
      'Children complete a brief breathing exercise before starting. This is intended to support attention, reduce anxiety, and improve readiness for timed tasks.',
  },
  {
    letter: 'L',
    name: 'Look',
    description:
      'Children read each question carefully, often more than once, to improve comprehension and reduce misinterpretation. Key words are highlighted mentally (e.g. \u201cnot\u201d, \u201cexcept\u201d, \u201calways\u201d).',
  },
  {
    letter: 'E',
    name: 'Eliminate',
    description:
      'Children are encouraged to rule out clearly incorrect options where applicable. This supports reasoning and reduces reliance on guesswork.',
  },
  {
    letter: 'A',
    name: 'Answer',
    description:
      'Children select the best available answer based on remaining evidence, rather than initial instinct alone.',
  },
  {
    letter: 'R',
    name: 'Review',
    description:
      'Children are prompted to re-check that their answer matches the question. This step is designed to reduce avoidable errors and support metacognitive checking.',
  },
];

/* ─── Programme phases ─── */

const PHASES = [
  {
    emoji: '\uD83C\uDF31',
    name: 'Foundation',
    weeks: '1\u20134',
    line1: 'High scaffolding. Short timed questions.',
    focus: 'learning the steps of the method.',
  },
  {
    emoji: '\uD83D\uDD25',
    name: 'Building',
    weeks: '5\u20138',
    line1: 'Reduced prompts. Increased difficulty and speed requirements.',
    focus: 'applying the method more independently.',
  },
  {
    emoji: '\u2B50',
    name: 'Exam Mode',
    weeks: '9\u201312',
    line1: 'Minimal scaffolding. Full exam-style timing.',
    focus: 'independent execution under pressure.',
  },
];

/* ─── Parent guidance tips ─── */

const PARENT_TIPS = [
  {
    bold: 'Focus on process rather than outcome.',
    detail:
      'Praise behaviours such as rereading, slowing down, or checking answers. Research on feedback suggests that process-focused reinforcement supports persistence and learning habits.',
  },
  {
    bold: 'Short, regular practice is more effective than long sessions.',
    detail:
      'The programme is designed around frequent, short practice sessions to support retention and reduce cognitive overload.',
  },
  {
    bold: 'Allow the system to do the teaching.',
    detail:
      'When children make mistakes, the programme provides structured feedback. Avoid over-intervening in order to preserve independent learning opportunities.',
  },
  {
    bold: 'Encourage consistency over intensity.',
    detail: 'Regular engagement is more important than occasional long sessions.',
  },
  {
    bold: 'Support calm routines where helpful.',
    detail:
      'Breathing or settling routines may help some children approach timed tasks with greater focus.',
  },
];

/* ─── Sources list ─── */

const SOURCES = [
  'Bauer, K., Kopp, V., & Fischer, M. R. (2007). Answer changing in multiple choice assessment \u2014 change that answer when in doubt, and spread the word! BMC Medical Education, 7:14.',
  'Binks, A. P., Mutcheson, R. B., Holt, E. M., & LeClair, R. J. (2022). A Simple and Sustainable Exercise to Enhance Student Self-Reflection on Error-Making. Teaching and Learning in Medicine, 34(5), 573\u2013583.',
  'Education Endowment Foundation (2023). Reading Comprehension Strategies \u2014 Teaching & Learning Toolkit.',
  'Education Endowment Foundation (2021). Metacognition and Self-Regulation \u2014 Teaching & Learning Toolkit.',
  'Khng, K. H. (2017). A better state-of-mind: deep breathing reduces state anxiety and enhances test performance through regulating test cognitions in children. Cognition and Emotion, 31(7), 1502\u20131510.',
  'Rohrer, D., & Pashler, H. (2007). Increasing retention without increasing study time. Current Directions in Psychological Science, 16(4), 183\u2013186.',
  'Dweck, C. S., and colleagues. Research on process vs. person praise and motivation. Referenced in support of process-focused reinforcement.',
];

/* ─── Expandable card component ─── */

function EvidenceCard({ section }: { section: EvidenceSection }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/30"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-extrabold text-base text-gray-800">
              {section.title}
            </h3>
            <p className="font-display text-sm text-gray-600 mt-2 leading-relaxed">
              {section.body}
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
          <p className="font-display text-xs text-gray-500 italic mb-3">
            {section.source}
          </p>
          <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
            <p className="font-display text-sm text-purple-800 leading-relaxed">
              <span className="font-bold">Implication for CLEAR:</span>{' '}
              {section.implication}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Page ─── */

export function ResearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
        <Link
          to="/"
          className="inline-block mb-6 text-white/80 hover:text-white font-display text-sm transition-colors"
        >
          &larr; Back to home
        </Link>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-lg mb-3">
          AnswerTheQuestion! &mdash; Parent Guide
        </h1>
        <p className="font-display text-white/80 text-xs mb-6">
          The evidence behind the CLEAR Method (v2, April 2026)
        </p>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/30 text-left">
          <p className="font-display text-sm text-gray-700 leading-relaxed mb-3">
            A structured 12-week exam technique programme for 11+ preparation,
            designed around established findings from cognitive science and
            education research. The CLEAR Method translates well-evidenced
            learning principles into a consistent, repeatable approach for
            children.
          </p>
          <p className="font-display text-sm text-gray-600 leading-relaxed">
            This guide summarises the research base behind each component. All
            cited sources are peer-reviewed studies or large-scale research
            syntheses.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10 space-y-8">
        {/* ───── The Evidence Base ───── */}
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
            The Evidence Base
          </h2>
          {EVIDENCE.map(section => (
            <EvidenceCard key={section.id} section={section} />
          ))}
        </div>

        {/* ───── The CLEAR Method ───── */}
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
            The CLEAR Method
          </h2>
          <p className="font-display text-sm text-white/80 text-center max-w-lg mx-auto leading-relaxed">
            A structured five-step approach embedded into every question to
            support consistency and reduce avoidable errors.
          </p>

          <div className="space-y-3">
            {CLEAR_STEPS.map(step => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30"
              >
                <p className="font-display text-sm text-gray-700 leading-relaxed">
                  <span className="font-extrabold text-purple-700">
                    {step.letter} &mdash; {step.name}.
                  </span>{' '}
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ───── 12-Week Programme ───── */}
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
            The 12-Week Programme Structure
          </h2>
          <p className="font-display text-sm text-white/80 text-center max-w-lg mx-auto leading-relaxed">
            The programme gradually reduces scaffolding so that children move
            from guided use of the method to independent application under exam
            conditions.
          </p>

          <div className="space-y-3">
            {PHASES.map(phase => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30"
              >
                <p className="font-display font-extrabold text-base text-gray-800">
                  {phase.emoji} {phase.name} (Weeks {phase.weeks})
                </p>
                <p className="font-display text-sm text-gray-600 leading-relaxed mt-1">
                  {phase.line1}
                </p>
                <p className="font-display text-sm text-gray-500 italic mt-0.5">
                  Focus: {phase.focus}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ───── Guidance for Parents ───── */}
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
            Guidance for Parents
          </h2>

          <div className="space-y-3">
            {PARENT_TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/30"
              >
                <p className="font-display text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold">{tip.bold}</span> {tip.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ───── Important Note on Evidence ───── */}
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
            Important Note on Evidence
          </h2>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/30">
            <p className="font-display text-sm text-gray-600 leading-relaxed mb-4">
              The CLEAR Method is based on established principles from
              educational psychology and cognitive science. While individual
              studies support components of the approach, outcomes for any child
              will depend on factors including prior attainment, engagement, and
              consistency of use.
            </p>

            <div className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-xl p-4 border border-fuchsia-200/50">
              <p className="font-display text-sm text-gray-700 leading-relaxed italic">
                The gap between knowing content and performing well under exam
                conditions is often influenced by attention, comprehension
                accuracy, emotional regulation, and checking behaviours, not
                only subject knowledge. The CLEAR Method is designed to support
                children in developing these underlying skills through a
                structured, repeatable process.
              </p>
            </div>
          </div>
        </div>

        {/* ───── Sources ───── */}
        <div className="space-y-4">
          <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md text-center">
            Sources
          </h2>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/30">
            <ol className="list-decimal list-inside space-y-3">
              {SOURCES.map((source, i) => (
                <li
                  key={i}
                  className="font-display text-xs text-gray-600 leading-relaxed"
                >
                  {source}
                </li>
              ))}
            </ol>
          </div>

          <p className="font-display text-xs text-white/60 text-center">
            AnswerTheQuestion! &mdash; answerthequestion.co.uk &mdash; &copy;
            2026. v2 citations verified April 2026.
          </p>
        </div>

        {/* ───── CTA ───── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-6"
        >
          <Link
            to="/checkout"
            className="inline-block py-3 px-8 rounded-2xl font-display font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start the 12-week programme &mdash; &pound;29.99
          </Link>
          <p className="font-display text-white/70 text-sm mt-3">
            One-time payment &middot; 7-day money-back guarantee
          </p>
        </motion.div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 text-sm text-white/80 font-display flex-wrap pb-8">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-white/30">|</span>
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <span className="text-white/30">|</span>
          <Link to="/refunds" className="hover:text-white transition-colors">
            Refund Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
