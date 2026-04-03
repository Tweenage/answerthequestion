import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: 'Why does my child lose marks when they know the content?',
    answer:
      'Knowing the content and answering the question correctly are two different skills. Most 11+ prep focuses on the first one. The CLEAR Method™ fixes the second — training children to read carefully, think deliberately, and answer what\u2019s actually on the page.',
  },
  {
    question: 'Is AnswerTheQuestion! instead of Atom Learning?',
    answer:
      'No. AnswerTheQuestion! is exam technique \u2014 the thing that makes content revision land under timed conditions. Atom Learning builds knowledge. This builds what you do with it when the clock is running.',
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
      'Yes. The core skill is visible from Week 1. Enter your child\u2019s exam date and AnswerTheQuestion! automatically adapts the programme to fit the time you have. A short time with the right method beats a long time without it.',
  },
  {
    question: 'We\u2019re using Bond books. Will this work alongside them?',
    answer:
      'Yes \u2014 and it fills the gap Bond can\u2019t. Bond books build knowledge on paper; AnswerTheQuestion! builds the exam technique your child needs to use that knowledge under pressure. Many families use both: Bond for content coverage, AnswerTheQuestion! to make sure the habit and the composure transfer to the real thing.',
  },
  {
    question: 'My child is dyslexic. Will this work for them?',
    answer:
      'Yes. AnswerTheQuestion! has a built-in dyslexia-friendly mode that switches the app to the Lexend font, a crème background, and wider letter and word spacing — all based on peer-reviewed research into reading accessibility. To turn it on, go to Settings after you\u2019ve set up your child\u2019s profile and toggle Dyslexia Mode on. It applies instantly and can be switched on or off at any time.',
  },
  {
    question: 'What do I do as a parent?',
    answer:
      "You don\u2019t need to do anything except support the habit. Each session is 10 questions \u2014 around 15\u201320 minutes in the early weeks, shortening to under 10 minutes by Week 12 as the method becomes automatic. Your child works through it independently. The parent dashboard shows progress so you can see how it\u2019s going without interrogating them at dinner.",
  },
  {
    question: 'Will this reduce my child\u2019s anxiety?',
    answer:
      'The breathing and visualisation element specifically targets exam-day nerves. Most parents notice their child becomes calmer \u2014 not because we tell them not to worry, but because they have a technique to use.',
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
