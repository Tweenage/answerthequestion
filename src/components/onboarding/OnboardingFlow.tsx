import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import type { HootMood } from '../mascot/ProfessorHoot';
import { useDyslexiaStore } from '../../stores/useDyslexiaStore';

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
    title: '👨‍👩‍👧 A Note for Parents',
    body: "Please sit with your child for these slides, the tutorial, and the first session. As you go through each slide together, ask your child to read the words aloud — starting with what Professor Hoot says, then all the tips. Reading out loud helps the method really stick!",
    tips: [
      { emoji: '🗣️', text: "Ask your child to read every slide aloud — Professor Hoot's speech first, then each tip below" },
      { emoji: '🧪', text: 'Do the tutorial side by side so you can talk through each step together' },
      { emoji: '⭐', text: "Stay for Day 1 — after that they're ready to fly solo!" },
      { emoji: '💡', text: "If they get stuck, encourage them to re-read the question — that's the whole method!" },
    ],
  },
  {
    hootMood: 'teaching',
    title: 'What is the CLEAR Method?',
    body: "It's 5 simple steps you follow for every question. Practise them daily and they become automatic — just like tying your shoes! Let me show you...",
    tips: [
      { emoji: '🧘', text: 'C — Calm: take a breath before you start' },
      { emoji: '👀', text: 'L — Look: read the whole question carefully' },
      { emoji: '❌', text: 'E — Eliminate the wrong answers' },
      { emoji: '✅', text: 'A — Answer with confidence' },
      { emoji: '🔄', text: 'R — Review and check your work' },
    ],
  },
  {
    hootMood: 'thinking',
    title: 'C — Calm',
    body: "Before you read a single word, take one slow breath. Put your pencil down. Breathe in for 3 counts, out for 3. A calm mind reads better than a rushing one — and rushing is where marks get lost.",
    highlight: 'one slow breath',
  },
  {
    hootMood: 'teaching',
    title: 'L — Look',
    body: "Read the whole question — all the way to the end — before you look at any answers. Then tap to highlight the key words: what is it actually asking? Always highlight danger words: NOT, except, least, never, only. In your real exam, underline with your pencil!",
    highlight: 'danger words',
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
    hootMood: 'thinking',
    title: '⏱️ Your Time Challenge',
    body: "On Day 1 you get 2 minutes per question — that's 20 minutes for 10 questions. By Week 12 you'll answer each question in under a minute — just like a real exam! The timer gets shorter each week as you build confidence. That's not scary — that's how you get brilliant!",
    tips: [
      { emoji: '🌱', text: 'Week 1: 20 minutes total — take all the time you need' },
      { emoji: '🔥', text: 'Week 6: 15 minutes — technique is becoming a habit' },
      { emoji: '🎯', text: 'Week 12: 9 minutes — exam-ready speed!' },
    ],
  },
  {
    hootMood: 'celebrating',
    title: "Let's Start!",
    body: "Your first session is ready. This is about building the habits so you can identify the best answer based on everything else you're learning. I'll be right here helping you!",
    highlight: 'CLEAR habit',
  },
];

const DYSLEXIA_SLIDE_INDEX = slides.length - 1; // insert just before the last slide

interface OnboardingFlowProps {
  onComplete: () => void;
  childId: string;
}

export function OnboardingFlow({ onComplete, childId }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const { isDyslexiaMode, toggleDyslexiaMode } = useDyslexiaStore();
  const dyslexiaOn = isDyslexiaMode(childId);

  // Total slides = regular slides + 1 dyslexia slide inserted before the last
  const totalSlides = slides.length + 1;
  const isDyslexiaSlide = currentSlide === DYSLEXIA_SLIDE_INDEX;
  const isLast = currentSlide === totalSlides - 1;

  // Map visual slide index to slides array index (accounting for inserted dyslexia slide)
  const slide = currentSlide < DYSLEXIA_SLIDE_INDEX
    ? slides[currentSlide]
    : slides[currentSlide - 1];

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

  const dotCount = totalSlides;

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
            {isDyslexiaSlide ? (
              /* ── Dyslexia opt-in slide ── */
              <>
                <div className="flex justify-center mb-5">
                  <ProfessorHoot mood="teaching" size="xl" animate showSpeechBubble={false} />
                </div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white drop-shadow-md mb-4">
                  One quick thing&hellip;
                </h2>
                <div className="bg-white/90 backdrop-blur-sm rounded-card p-5 shadow-lg text-left">
                  <p className="font-display text-base text-gray-700 leading-relaxed mb-5 text-center">
                    Does your child find reading easier with a different font and background?
                    Dyslexia-friendly mode uses a specially designed font and softer colours
                    to reduce visual stress.
                  </p>

                  {/* Toggle card */}
                  <button
                    onClick={() => toggleDyslexiaMode(childId)}
                    className={`w-full rounded-2xl p-5 border-2 transition-all ${
                      dyslexiaOn
                        ? 'border-purple-400 bg-[#FAFAC8]'
                        : 'border-gray-200 bg-gray-50 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-display font-bold text-base ${dyslexiaOn ? 'text-gray-800' : 'text-gray-600'}`}
                        style={dyslexiaOn ? { fontFamily: 'Lexend, sans-serif', letterSpacing: '0.05em' } : {}}>
                        📖 Dyslexia-friendly mode
                      </span>
                      <div className={`w-12 h-6 rounded-full transition-colors ${dyslexiaOn ? 'bg-purple-500' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-transform ${dyslexiaOn ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
                      </div>
                    </div>
                    <p className={`font-display text-sm leading-relaxed text-left ${dyslexiaOn ? 'text-gray-700' : 'text-gray-400'}`}
                      style={dyslexiaOn ? { fontFamily: 'Lexend, sans-serif', letterSpacing: '0.04em', wordSpacing: '0.2em' } : {}}>
                      {dyslexiaOn
                        ? 'On — this is how the app will look. Tap to turn off.'
                        : 'Off — tap to see what dyslexia-friendly mode looks like.'}
                    </p>
                  </button>

                  <p className="font-display text-xs text-gray-400 text-center mt-4">
                    You can change this any time in Settings.
                  </p>
                </div>
              </>
            ) : (
              /* ── Regular slide ── */
              <>
                <div className="flex justify-center mb-5">
                  <ProfessorHoot
                    mood={slide.hootMood}
                    size="xl"
                    animate
                    showSpeechBubble={false}
                  />
                </div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white drop-shadow-md mb-4">
                  {slide.title}
                </h2>
                <div className="bg-white/90 backdrop-blur-sm rounded-card p-5 shadow-lg">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed font-display">
                    {renderBody(slide.body, slide.highlight)}
                  </p>
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
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom area: dots + button */}
      <div className="w-full max-w-md space-y-5 pb-4">
        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => (
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
