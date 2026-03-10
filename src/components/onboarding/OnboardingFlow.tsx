import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import type { HootMood } from '../mascot/ProfessorHoot';

interface OnboardingSlide {
  hootMood: HootMood;
  title: string;
  body: string;
  tips?: { emoji: string; text: string }[];
  highlight?: string;
}

const slides: OnboardingSlide[] = [
  {
    hootMood: 'happy',
    title: 'Welcome!',
    body: "I'm Professor Hoot! This app trains 5 research-backed habits that help you pick up marks other children lose. Most mistakes in exams come from rushing, not from not knowing!",
    highlight: 'pick up marks',
  },
  {
    hootMood: 'thinking',
    title: 'Calm & Focused',
    body: "First, we breathe. Research with children your age shows that deep breathing before a test makes your brain work better. We start every session with a quick calm exercise.",
    highlight: 'deep breathing',
  },
  {
    hootMood: 'teaching',
    title: 'Read Twice, Then Answer',
    body: "Nearly a third of all exam mistakes come from misreading. So we ALWAYS read the question twice — and cover the answers so you can't peek! Only then do you look at the choices.",
    highlight: 'read the question twice',
  },
  {
    hootMood: 'warning',
    title: 'Eliminate, Don\'t Guess',
    body: "Don't jump to the first answer that looks right. Cross out the ones you KNOW are wrong. This turns a 25% guess into a 50% chance — or better! The right answer reveals itself.",
    highlight: 'Cross out',
  },
  {
    hootMood: 'teaching',
    title: 'Time & Checking',
    body: "Top students skip hard questions and come back later. And when you check, it's OK to change your answer — research shows changes usually help, not hurt!",
    tips: [
      { emoji: '⏭️', text: 'Stuck? Dot it and move on' },
      { emoji: '⏱️', text: 'Easy questions first, hard ones second' },
      { emoji: '🔄', text: 'Change your answer if you find a reason to' },
    ],
  },
  {
    hootMood: 'encouraging',
    title: 'The 5 Step Method',
    body: "Every question follows the same 5 steps. Practise daily and they become automatic — just like tying your shoes!",
    tips: [
      { emoji: '📖', text: 'Read the question twice' },
      { emoji: '🔍', text: 'Spot the key words' },
      { emoji: '🔢', text: 'Check the numbers' },
      { emoji: '✂️', text: 'Eliminate wrong answers' },
      { emoji: '🔒', text: 'Lock your answer' },
    ],
  },
  {
    hootMood: 'celebrating',
    title: "Let's Start!",
    body: "Your first session is ready. This isn't about knowing the answers — it's about building the HABITS that win marks. I'll be right here helping you!",
    highlight: 'HABITS',
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const isLast = currentSlide === slides.length - 1;
  const slide = slides[currentSlide];

  const goNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentSlide(i => i + 1);
    }
  };

  const goBack = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(i => i - 1);
    }
  };

  const renderBody = (text: string, highlight?: string) => {
    if (!highlight) return text;
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="font-bold text-purple-700 bg-purple-100 px-1 rounded">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6"
      style={{
        background: 'linear-gradient(160deg, #c084fc 0%, #a855f7 25%, #d946ef 50%, #f472b6 75%, #fb923c 100%)',
      }}
    >
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 text-sm text-white/60 hover:text-white font-display font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        Skip
      </button>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-center"
          >
            {/* Professor Hoot */}
            <div className="flex justify-center mb-5">
              <ProfessorHoot
                mood={slide.hootMood}
                size="xl"
                animate
                showSpeechBubble={false}
              />
            </div>

            {/* Title */}
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white drop-shadow-md mb-4">
              {slide.title}
            </h2>

            {/* Body */}
            <div className="bg-white/90 backdrop-blur-sm rounded-card p-5 shadow-lg">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed font-display">
                {renderBody(slide.body, slide.highlight)}
              </p>

              {/* Tips list */}
              {slide.tips && (
                <div className="mt-4 space-y-2.5">
                  {slide.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-2.5 text-left"
                    >
                      <span className="text-xl shrink-0">{tip.emoji}</span>
                      <span className="font-display font-semibold text-sm text-gray-700">{tip.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom area: dots + button */}
      <div className="w-full max-w-md space-y-5 pb-4">
        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-8 bg-white'
                  : i < currentSlide
                  ? 'w-2 bg-white/60'
                  : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={goBack}
              className="px-6 py-3 rounded-button font-display font-bold text-white/80 border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={goNext}
            className={`flex-1 py-4 rounded-button font-display font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
              isLast
                ? 'bg-white text-purple-600 hover:bg-white/90'
                : 'bg-white/20 text-white border-2 border-white/30 hover:bg-white/30'
            }`}
          >
            {isLast ? "Let's Go! 🦉" : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
