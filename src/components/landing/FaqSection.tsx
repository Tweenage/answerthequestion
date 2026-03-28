import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: 'Why does my child lose marks when they know the content?',
    answer:
      'Knowing the content and answering the question correctly are two different skills. Most 11+ prep focuses on the first one. The CLEAR Method fixes the second — training children to read carefully, think deliberately, and answer what\u2019s actually on the page.',
  },
  {
    question: 'Is Answer the Question instead of Atom Learning?',
    answer:
      'No. Answer the Question is exam technique \u2014 the thing that makes content revision land under timed conditions. Atom Learning builds knowledge. This builds what you do with it when the clock is running.',
  },
  {
    question: 'What age is it for?',
    answer:
      'Year 4, 5 and 6 \u2014 ages 8\u201311. It works alongside existing tutoring or self-study, and one purchase covers the whole family.',
  },
  {
    question: 'Do I need to be involved?',
    answer:
      'Your child can work independently. You\u2019ll get the most from it if you review sessions together using the same method \u2014 the parent dashboard shows exactly where they\u2019re strong and where they\u2019re dropping marks.',
  },
  {
    question: 'Is this only useful for the 11+?',
    answer:
      'No. Staying calm under pressure, reading carefully before answering, working through a method rather than rushing \u2014 these habits help children in every exam they\u2019ll ever sit. The 11+ is the context. The skills last longer than that.',
  },
  {
    question: 'Only a few weeks left \u2014 is it worth starting?',
    answer:
      'Yes. The core skill is visible from Week 1. Enter your child\u2019s exam date and Answer the Question automatically adapts the programme to fit the time you have. A short time with the right method beats a long time without it.',
  },
  {
    question: 'We\u2019re already using Bond books \u2014 will this work alongside them?',
    answer:
      'Perfectly. Bond books are excellent for building knowledge. Answer the Question picks up where paper can\u2019t: it tracks exactly which question types your child is getting wrong, adapts to focus on their gaps, and builds the technique habits that paper practice alone won\u2019t drill. Many families use both \u2014 Bond for content coverage, ATQ to make sure the marks reflect what the child actually knows.',
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-8 leading-tight">
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
