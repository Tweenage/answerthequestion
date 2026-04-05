import { motion } from 'framer-motion';
import {
  CORE_STEPS,
  CORE_HABITS,
  RESEARCH_POINTS,
  TRICK_TYPES,
  PROGRAMME_PHASES,
  SCORING_BREAKDOWN,
  EXAM_STRATEGY_RESEARCH,
} from '../../data/techniques';
import { TechniqueCard } from './TechniqueCard';
import { SubjectTechniquesTabs } from './SubjectTechniquesTabs';

export function ParentTechniquesView() {
  return (
    <div className="space-y-6">
      {/* Professional header */}
      <div className="text-center space-y-1">
        <h2 className="font-display font-extrabold text-xl text-white drop-shadow-md">
          The Science Behind AnswerTheQuestion!
        </h2>
        <p className="text-white/80 text-sm font-display max-w-md mx-auto">
          A research-backed, 12-week exam technique programme designed to close the gap between what children know and what they score.
        </p>
      </div>

      {/* ───── The Evidence ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          The Evidence
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {RESEARCH_POINTS.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/95 backdrop-blur-sm rounded-card p-3 border border-white/30"
            >
              <p className="font-display font-extrabold text-2xl text-purple-600">
                {point.stat}
              </p>
              <p className="font-display font-bold text-xs text-gray-500 mb-1.5">
                {point.context}
              </p>
              <p className="text-gray-600 text-xs leading-relaxed">
                {point.detail}
              </p>
              <p className="text-gray-400 text-[10px] font-display mt-1.5 italic">
                {point.source}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ───── The 5 Core Habits ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          The 5 Habits We Build
        </h3>
        <p className="text-white/70 text-xs text-center font-display max-w-sm mx-auto">
          Every feature in this app is designed to build these five research-backed habits — the skills that separate children who know the answers from children who get the marks.
        </p>

        <div className="space-y-2">
          {CORE_HABITS.map((habit, i) => (
            <TechniqueCard
              key={habit.id}
              emoji={habit.emoji}
              title={`${habit.number}. ${habit.title}`}
              defaultOpen={i === 0}
            >
              <p className="text-gray-600 text-sm leading-relaxed">
                {habit.parentExplanation}
              </p>
              <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100 mt-2">
                <p className="text-xs text-gray-500">
                  <strong className="text-purple-600">{habit.researchStat}</strong>
                  <span className="text-gray-400"> — {habit.researchSource}</span>
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100 mt-2">
                <p className="text-xs text-gray-600 italic">{habit.whyItMatters}</p>
              </div>
            </TechniqueCard>
          ))}
        </div>
      </div>

      {/* ───── The Method ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          The 5-Step Method
        </h3>
        <p className="text-white/70 text-xs text-center font-display">
          Every practice session guides children through a structured metacognitive process.
        </p>

        <div className="space-y-2">
          {CORE_STEPS.map((step, i) => (
            <TechniqueCard
              key={step.id}
              emoji={step.emoji}
              title={`${step.number}. ${step.title}`}
              defaultOpen={i === 0}
            >
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.parentDescription}
              </p>
              {step.researchStat && (
                <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100 mt-2">
                  <p className="text-xs text-gray-500">
                    <strong className="text-purple-600">{step.researchStat}</strong>
                    {step.researchSource && (
                      <span className="text-gray-400"> — {step.researchSource}</span>
                    )}
                  </p>
                </div>
              )}
            </TechniqueCard>
          ))}
        </div>
      </div>

      {/* ───── How Questions Are Designed ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          How Questions Are Designed
        </h3>
        <p className="text-white/70 text-xs text-center font-display max-w-sm mx-auto">
          Every question targets a specific trap pattern. Children learn to recognise these patterns through repeated exposure and labelled feedback.
        </p>

        <div className="space-y-2">
          {TRICK_TYPES.map(trick => (
            <TechniqueCard
              key={trick.type}
              emoji={trick.emoji}
              title={trick.name}
            >
              <p className="text-gray-600 text-sm leading-relaxed">
                {trick.parentExplanation}
              </p>
            </TechniqueCard>
          ))}
        </div>
      </div>

      {/* ───── The 12-Week Programme ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          The 12-Week Programme
        </h3>
        <p className="text-white/70 text-xs text-center font-display max-w-sm mx-auto">
          Scaffolding is systematically reduced so children internalise the technique and can apply it independently under exam conditions.
        </p>

        <div className="space-y-2">
          {PROGRAMME_PHASES.map(phase => (
            <div
              key={phase.phase}
              className="bg-white/95 backdrop-blur-sm rounded-card p-3.5 border border-white/30"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{phase.emoji}</span>
                <div>
                  <p className="font-display font-bold text-gray-800 text-sm">
                    {phase.title} <span className="text-gray-400 font-normal">— Weeks {phase.weeks}</span>
                  </p>
                  <p className="text-gray-500 text-xs">{phase.description}</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed ml-8">
                {phase.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Subject Approaches ───── */}
      <SubjectTechniquesTabs mode="parent" />

      {/* ───── How Technique Scoring Works ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          How Technique Scoring Works
        </h3>
        <p className="text-white/70 text-xs text-center font-display max-w-sm mx-auto">
          We measure process, not just correctness. This incentivises children to build proper habits even when they already know the answer.
        </p>

        <div className="bg-white/95 backdrop-blur-sm rounded-card p-4 border border-white/30 space-y-2.5">
          {SCORING_BREAKDOWN.map(item => (
            <div key={item.name} className="flex items-start gap-3">
              <span className="font-display font-extrabold text-purple-600 text-sm w-10 shrink-0 text-right">
                {item.weight}
              </span>
              <div>
                <p className="font-display font-bold text-gray-800 text-sm">{item.name}</p>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Exam Strategy Research ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          The Research Behind the Method
        </h3>
        <p className="text-white/70 text-xs text-center font-display max-w-sm mx-auto">
          Common questions parents ask — answered with evidence.
        </p>

        <div className="space-y-2">
          {EXAM_STRATEGY_RESEARCH.map(item => (
            <TechniqueCard
              key={item.id}
              emoji={item.emoji}
              title={item.title}
            >
              <p className="text-gray-500 text-xs font-display font-bold italic mb-2">
                {item.question}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.finding}
              </p>
              <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100 mt-2">
                <p className="text-xs text-gray-500">
                  <strong className="text-purple-600">{item.stat}</strong>
                  <span className="text-gray-400"> — {item.source}</span>
                </p>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mt-2 italic">
                {item.implication}
              </p>
            </TechniqueCard>
          ))}
        </div>
      </div>

      {/* ───── Tips for Parents ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-base text-center">
          Tips for Parents
        </h3>

        <div className="bg-white/95 backdrop-blur-sm rounded-card p-4 border border-white/30 space-y-3">
          {[
            { emoji: '🎯', title: 'Focus on technique, not answers', desc: 'Praise "I saw you read it twice!" rather than "You got it right!" The habit is what matters.' },
            { emoji: '📅', title: 'Little and often beats cramming', desc: '7 minutes daily is far more effective than an hour at the weekend. Consistency builds automaticity.' },
            { emoji: '🚫', title: "Don't help with the answers", desc: 'If they get it wrong, the app explains why. Mistakes are learning opportunities, not failures.' },
            { emoji: '🌟', title: 'Celebrate streaks, not scores', desc: 'The streak counter builds the habit. Five days in a row matters more than five correct answers.' },
            { emoji: '🧘', title: 'Try the Calm & Focus exercise', desc: 'The guided visualisation helps with exam anxiety. Try it together — it works for adults too!' },
          ].map(tip => (
            <div key={tip.emoji} className="flex items-start gap-2.5">
              <span className="text-lg shrink-0">{tip.emoji}</span>
              <div>
                <p className="font-display font-bold text-gray-800 text-sm">{tip.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
