import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import { CLEAR_STEPS, TRICK_TYPES } from '../../data/techniques';
import { TechniqueCard } from './TechniqueCard';
import { SubjectTechniquesTabs } from './SubjectTechniquesTabs';
import { OnPaperSection } from './OnPaperSection';

export function ChildTechniquesView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const step = CLEAR_STEPS[activeIndex];

  return (
    <div className="space-y-5">
      {/* Professor Hoot header */}
      <div className="text-center">
        <ProfessorHoot
          mood="teaching"
          size="md"
          message="The CLEAR Method™ is your secret weapon! Learn these 5 steps and you will ace any question!"
          showSpeechBubble={true}
          animate={true}
        />
      </div>

      {/* ───── The CLEAR Method™ ───── */}
      <div className="space-y-3">
        <div className="text-center">
          <h3 className="font-display font-extrabold text-white text-lg drop-shadow-md">
            The CLEAR Method™
          </h3>
          <p className="text-white/70 text-xs font-display mt-0.5">
            5 steps — in order — every single question
          </p>
        </div>

        {/* CLEAR letter selector */}
        <div className="flex gap-2 justify-center">
          {CLEAR_STEPS.map((s, i) => (
            <button
              key={s.letter}
              onClick={() => setActiveIndex(i)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                activeIndex === i ? 'scale-110' : 'opacity-70 hover:opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${s.gradient} ${
                  activeIndex === i
                    ? 'ring-3 ring-white ring-offset-2 ring-offset-transparent shadow-xl'
                    : ''
                }`}
              >
                <span className="font-display font-extrabold text-white text-xl leading-none">
                  {s.letter}
                </span>
              </div>
              <span className="text-white/80 font-display font-bold text-[10px] leading-tight text-center">
                {s.name}
              </span>
            </button>
          ))}
        </div>

        {/* Active step detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-card p-4 border border-white/30 space-y-3">
              {/* Step header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${step.gradient} shadow-md shrink-0`}
                >
                  <span className="font-display font-extrabold text-white text-xl">
                    {step.letter}
                  </span>
                </div>
                <div>
                  <p className="font-display font-extrabold text-gray-800 text-base leading-tight">
                    {step.letter} — {step.name}
                  </p>
                  <p className={`font-display font-semibold text-xs ${step.textColour}`}>
                    {step.emoji} {step.tagline}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {step.childDescription}
              </p>

              {/* In Your Exam */}
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                <p className="font-display font-bold text-purple-700 text-xs mb-1.5">
                  🖊️ In Your Exam:
                </p>
                <ul className="space-y-1">
                  {step.inYourExam.map((tip, j) => (
                    <li key={j} className="text-gray-600 text-xs flex items-start gap-1.5">
                      <span className="text-purple-400 mt-0.5 shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* In the App */}
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                <p className="font-display font-bold text-blue-700 text-xs mb-1">
                  📱 In This App:
                </p>
                <p className="text-gray-600 text-xs">{step.inTheApp}</p>

                {/* C step: link to breathing exercise */}
                {step.linkToBreathing && (
                  <button
                    onClick={() => navigate('/practice')}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-display font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>🧘</span>
                    <span>Start a session to try the breathing exercise →</span>
                  </button>
                )}
              </div>

              {/* Professor Hoot secret */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border-2 border-amber-200/40">
                <div className="flex items-start gap-2">
                  <span className="text-lg shrink-0">🦉</span>
                  <div>
                    <p className="font-display font-bold text-xs text-amber-600 mb-0.5">
                      Professor Hoot's Secret
                    </p>
                    <p className="text-sm text-gray-600 italic">"{step.hootSecret}"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step navigation dots */}
        <div className="flex justify-center gap-1.5">
          {CLEAR_STEPS.map((s, i) => (
            <button
              key={s.letter}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/35 hover:bg-white/55'
              }`}
            />
          ))}
        </div>
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
