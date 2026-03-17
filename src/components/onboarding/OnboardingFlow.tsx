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
    body: "I'm Professor Hoot! This app teaches you the CLEAR Method — a simple technique that helps you pick up marks other children lose. Most exam mistakes come from rushing, not from not knowing!",
    highlight: 'CLEAR Method',
  },
  {
    hootMood: 'teaching',
    title: 'What is the CLEAR Method?',
    body: "It's 5 simple steps you follow for every question. Practise them daily and they become automatic — just like tying your shoes! Let me show you...",
    tips: [
      { emoji: '📖', text: 'C — Comprehend: read the question twice' },
      { emoji: '🔍', text: 'L — Look for key words and danger words' },
      { emoji: '❌', text: 'E — Eliminate the wrong answers' },
      { emoji: '✅', text: 'A — Answer with confidence' },
      { emoji: '🔄', text: 'R — Review and check your work' },
    ],
  },
  {
    hootMood: 'thinking',
    title: 'C — Comprehend',
    body: "Nearly a third of all exam mistakes come from misreading. So we always read the question twice — and cover the answers so you can't peek! Only then do you look at the choices.",
    highlight: 'read the question twice',
  },
  {
    hootMood: 'teaching',
    title: 'L — Look for Key Words',
    body: "Words like \"not\", \"most\", \"least\", \"always\" and \"except\" change the whole question. In the app you'll tap to highlight them. In your real exam, underline them with your pencil!",
    highlight: 'underline them',
  },
  {
    hootMood: 'warning',
    title: 'E — Eliminate',
    body: "Don't jump to the first answer that looks right. Cross out the ones you know are wrong first. This turns a 25% guess into a 50% chance — or better! You must eliminate before you can answer.",
    highlight: 'Cross out',
  },
  {
    hootMood: 'encouraging',
    title: 'A — Answer & R — Review',
    body: "Once you've eliminated, lock in your answer with confidence. Then review — top students check their work and it's OK to change your answer if you spot a mistake!",
    tips: [
      { emoji: '⏭️', text: 'Stuck? Dot it and move on' },
      { emoji: '⏱️', text: 'Go through the paper and answer all of the easy questions before returning to ones you find hard' },
      { emoji: '🔄', text: 'Change your answer ONLY if you have good reason to' },
    ],
  },
  {
    hootMood: 'teaching',
    title: '👨‍👩‍👧 A Note for Parents',
    body: "For the best start, sit with your child for the tutorial, the first practice question, and the first full session. After that, they can fly solo! I'll guide them every step of the way.",
    tips: [
      { emoji: '📖', text: 'Read through these slides together' },
      { emoji: '🧪', text: 'Do the tutorial side by side so you can explain each step' },
      { emoji: '⭐', text: 'Stay for Day 1 — after that they\'re ready to go it alone!' },
    ],
  },
  {
    hootMood: 'celebrating',
    title: "Let's Start!",
    body: "Your first session is ready. This is about building the habits so you can identify the best answer based on everything else you're learning. I'll be right here helping you!",
    highlight: 'CLEAR habit',
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
        className="absolute top-4 right-4 text-sm text-white/80 hover:text-white font-display font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
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
