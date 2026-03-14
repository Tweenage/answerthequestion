import { motion, AnimatePresence } from 'framer-motion';
import { ProfessorHoot } from '../mascot/ProfessorHoot';
import type { HootMood } from '../mascot/ProfessorHoot';

interface MascotMessageProps {
  message: string;
  show: boolean;
  mood?: HootMood;
}

export function MascotMessage({ message, show, mood = 'happy' }: MascotMessageProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <ProfessorHoot
            mood={mood}
            size="md"
            message={message}
            showSpeechBubble={true}
            animate={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper to get contextual messages — Professor Hoot's voice
export function getMascotTip(state: string, scaffoldingLevel: string): string {
  if (state === 'READING_FIRST') {
    if (scaffoldingLevel === 'heavy') return "Hey there! Let's read this question together. Take it nice and slow — every word matters!";
    return 'Take your time reading this one.';
  }
  if (state === 'READING_SECOND') {
    if (scaffoldingLevel === 'heavy') return "Brilliant! Now read it one more time. Can you tell me what it's REALLY asking? Try saying it in your own words!";
    return "What is it really asking? Say it in your own words!";
  }
  if (state === 'NUMBER_EXTRACTION') {
    if (scaffoldingLevel === 'heavy') return "I spy numbers hiding in words! Tap them to turn them into digits. It helps your brain do the maths!";
    return 'Convert number words to digits.';
  }
  if (state === 'HIGHLIGHTING') {
    if (scaffoldingLevel === 'heavy') return "Time to be a Word Detective! Tap the important words. And watch out for those sneaky danger words — they love to trick you!";
    return 'Highlight key words. Watch for danger words!';
  }
  if (state === 'ELIMINATING') {
    if (scaffoldingLevel === 'heavy') return "Cross out all the wrong answers first! Then tap the one you think is right. Even I get tricked sometimes, so let's be careful!";
    return 'Eliminate all the wrong answers.';
  }
  if (state === 'SELECTING') {
    return "Now tap the answer you think is correct and lock it in!";
  }
  return '';
}
