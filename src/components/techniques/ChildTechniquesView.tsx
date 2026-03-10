import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import { CORE_STEPS, CORE_HABITS, TRICK_TYPES } from '../../data/techniques';
import { TechniqueCard } from './TechniqueCard';
import { SubjectTechniquesTabs } from './SubjectTechniquesTabs';
import { OnPaperSection } from './OnPaperSection';

export function ChildTechniquesView() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-5">
      {/* Professor Hoot header */}
      <div className="text-center">
        <ProfessorHoot
          mood="teaching"
          size="md"
          message="Welcome to my technique library! Learn these 5 steps and you will ace any question!"
          showSpeechBubble={true}
          animate={true}
        />
      </div>

      {/* ───── The 5 Habits ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-center text-base">
          🌟 5 Habits of Top Students
        </h3>
        <p className="text-white/70 text-xs font-display text-center">
          Learn these habits and you will be ready for anything!
        </p>

        <div className="space-y-2">
          {CORE_HABITS.map(habit => (
            <div
              key={habit.id}
              className="bg-white/90 backdrop-blur-sm rounded-card p-3 border border-white/30 flex items-start gap-2.5"
            >
              <span className="text-xl shrink-0">{habit.emoji}</span>
              <div>
                <p className="font-display font-bold text-gray-800 text-sm">
                  {habit.number}. {habit.title}
                </p>
                <p className="text-gray-600 text-xs leading-relaxed mt-0.5">
                  {habit.childSummary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── The 5 Steps ───── */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-white text-center text-base">
          The 5 Steps
        </h3>

        {/* Step selector */}
        <div className="flex gap-1.5 justify-center">
          {CORE_STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-xs font-display font-bold transition-all min-w-[52px] ${
                activeStep === i
                  ? 'bg-white text-purple-600 shadow-sm scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="text-base">{step.emoji}</span>
              <span className="text-[10px] leading-tight">{step.number}</span>
            </button>
          ))}
        </div>

        {/* Active step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const step = CORE_STEPS[activeStep];
              return (
                <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 border border-white/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.emoji}</span>
                    <h4 className="font-display font-bold text-gray-800 text-base">
                      Step {step.number}: {step.title}
                    </h4>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.childDescription}
                  </p>

                  {/* In Your Exam box */}
                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                    <p className="font-display font-bold text-purple-700 text-xs mb-1.5">
                      🖊️ In Your Exam:
                    </p>
                    <ul className="space-y-1">
                      {step.inYourExam.map((tip, j) => (
                        <li key={j} className="text-gray-600 text-xs flex items-start gap-1.5">
                          <span className="text-purple-400 mt-0.5 shrink-0">-</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* In the App box */}
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <p className="font-display font-bold text-blue-700 text-xs mb-1">
                      📱 In This App:
                    </p>
                    <p className="text-gray-600 text-xs">{step.inTheApp}</p>
                  </div>

                  {/* Research stat */}
                  {step.researchStat && (
                    <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200/60">
                      <p className="text-xs font-display text-gray-500">
                        Research shows this gives children{' '}
                        <strong className="text-amber-700">{step.researchStat}</strong>
                      </p>
                    </div>
                  )}

                  {/* Hoot secret */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border-2 border-amber-200/40">
                    <div className="flex items-start gap-2">
                      <span className="text-lg shrink-0">🦉</span>
                      <div>
                        <p className="font-display font-bold text-xs text-amber-600 mb-0.5">
                          Professor Hoot's Secret
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          "{step.hootSecret}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ───── Subject Techniques ───── */}
      <SubjectTechniquesTabs mode="child" />

      {/* ───── On Paper ───── */}
      <OnPaperSection />

      {/* ───── Spot the Tricks ───── */}
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="font-display font-bold text-white text-base">
            🎭 Spot the 9 Tricks
          </h3>
          <p className="text-white/70 text-xs font-display mt-0.5">
            Exam questions follow patterns — learn them and they cannot fool you!
          </p>
        </div>

        <div className="space-y-2">
          {TRICK_TYPES.map((trick, i) => (
            <TechniqueCard
              key={trick.type}
              emoji={trick.emoji}
              title={trick.name}
              defaultOpen={i === 0}
            >
              <p className="text-gray-600 text-sm leading-relaxed">
                {trick.childExplanation}
              </p>
            </TechniqueCard>
          ))}
        </div>
      </div>
    </div>
  );
}
