import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: 'We\u2019ve already got a tutor, books, and flashcards. What does this add?',
    answer:
      'AnswerTheQuestion! does something completely different. Tutors, books, and flashcards teach your child what to know. This programme teaches them how to apply that knowledge under exam conditions \u2014 staying calm, reading properly, and thinking methodically. The two are designed to work together.',
  },
  {
    question: 'My child is dyslexic. Will this work for them?',
    answer:
      'Yes. AnswerTheQuestion! has a built-in dyslexia-friendly mode that switches the app to the Lexend font, a cr\u00e8me background, and wider letter and word spacing \u2014 all based on peer-reviewed research into reading accessibility. To turn it on, go to Settings after you\u2019ve set up your child\u2019s profile and toggle Dyslexia Mode on.',
  },
  {
    question: 'Only a few weeks left \u2014 is it worth starting?',
    answer:
      'Yes. The core skill is visible from Week 1. Enter your child\u2019s exam date and the app automatically adapts the programme to fit the time you have.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-8 leading-tight">
            Parents ask&hellip;
          </h2>

          <div className="space-y-2.5 max-w-xl mx-auto">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200/80 bg-white overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    <span className="font-display font-bold text-sm md:text-base text-gray-800 pr-4">
                      {item.question}
                    </span>
                    <span
                      className={`text-purple-400 shrink-0 transition-transform duration-200 text-sm ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <p className="font-display text-sm md:text-base text-gray-500 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
