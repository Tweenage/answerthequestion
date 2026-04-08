import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: 'How do I help my child get all the marks for the content they know?',
    answer:
      'Knowing the content and answering the question correctly are two different skills. Most 11+ prep focuses on the first one. The CLEAR Method fixes the second — training children to read carefully, think deliberately, and answer what\u2019s actually on the page, so the marks reflect what they genuinely know.',
  },
  {
    question: 'We\u2019ve already got a tutor, books, and flashcards. What does this add?',
    answer:
      'AnswerTheQuestion! does something completely different. Tutors, books, and flashcards teach your child what to know. This teaches the habit of staying calm, reading the question properly, and getting marks for the knowledge they already have. It works alongside everything else \u2014 it fills the gap that content prep leaves.',
  },
  {
    question: 'What age is it for?',
    answer:
      'Year 4, 5 and 6 \u2014 ages 8\u201311. It works alongside existing tutoring or self-study.',
  },
  {
    question: 'My child is dyslexic. Will this work for them?',
    answer:
      'Yes. AnswerTheQuestion! has a built-in dyslexia-friendly mode that switches the app to the Lexend font, a cr\u00e8me background, and wider letter and word spacing \u2014 all based on peer-reviewed research into reading accessibility. To turn it on, go to Settings after you\u2019ve set up your child\u2019s profile and toggle Dyslexia Mode on. It applies instantly and can be switched on or off at any time.',
  },
  {
    question: 'Do I need to be involved?',
    answer:
      'It helps to sit with your child for the first session or two to make sure they\u2019ve understood how the method works before they go independent. After that, your child can work on their own. You\u2019ll get the most from it if you check in occasionally \u2014 the parent dashboard shows exactly where they\u2019re strong and where they\u2019re dropping marks.',
  },
  {
    question: 'Is this only useful for the 11+?',
    answer:
      'No. The habit being built here \u2014 staying calm, reading carefully, working through a method rather than rushing \u2014 serves children in every exam they\u2019ll ever sit. The 11+ is the starting point. The skill lasts far longer than that.',
  },
  {
    question: 'Only a few weeks left \u2014 is it worth starting?',
    answer:
      'Yes. The core skill is visible from Week 1. Enter your child\u2019s exam date and AnswerTheQuestion! automatically adapts the programme to fit the time you have. The price is still \u00a329.99 regardless of how many weeks are left \u2014 it\u2019s already priced to be accessible, and a short time with the right method beats a long time without it.',
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
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
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
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      className="px-4 md:px-5 pb-4 md:pb-5"
                    >
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
