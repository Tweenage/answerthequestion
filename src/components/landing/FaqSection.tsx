import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: 'Which subjects does it cover?',
    answer:
      'AnswerTheQuestion! isn\u2019t about teaching the curriculum \u2014 it\u2019s about teaching exam technique. The questions are in the style of English, Maths and Reasoning, so your child practises the CLEAR Method across all the core 11+ and independent school exam subjects. It works because it teaches how to approach any question, not just specific content.',
  },
  {
    question: 'How is this different from doing more practice papers?',
    answer:
      'Practice papers test your child. AnswerTheQuestion! trains them. Even when children already know the material, they lose marks because they rush, misread, or panic. The CLEAR Method builds the exam-technique habit that practice papers assume your child already has.',
  },
  {
    question: 'How long is each session?',
    answer:
      'Each daily session is 10 questions and takes around 10 minutes. The timing gets shorter as your child moves through the programme, building speed and confidence under pressure. It\u2019s designed to be short enough to fit alongside homework and other activities, but focused enough to build real exam technique.',
  },
  {
    question: 'Which schools and exams is this for?',
    answer:
      'AnswerTheQuestion! is designed for children preparing for 11+ exams (GL, CEM, ISEB) and independent school entrance tests. However, the CLEAR Method is a universal exam technique that helps with school tests, SATs, and assessments of every kind.',
  },
  {
    question: 'What year group is it best for?',
    answer:
      'It\u2019s ideal for children in Year 4 and Year 5 who are preparing for entrance exams. Some families start in late Year 3. It\u2019s also useful for Year 6 children preparing to go to any secondary school \u2014 the exam-technique habits transfer to SATs, school tests, and beyond. The programme works well alongside existing tutoring or self-study.',
  },
  {
    question: 'Can I use it for more than one child?',
    answer:
      'Yes! One purchase covers your whole family. You can add multiple child profiles, and each child gets their own independent 12-week journey with separate progress tracking, badges, and a personalised certificate.',
  },
  {
    question: "What if my child's exam is only a few weeks away?",
    answer:
      "AnswerTheQuestion! includes Fast Track mode for exactly this situation. Enter your child\u2019s exam date and the app automatically adapts the programme to fit your timeline \u2014 compressing the progression from gentle start to exam pace into the weeks you have left. Whether you have 2 weeks or 10, the CLEAR Method can still make a real difference.",
  },
  {
    question: 'Is this a subscription?',
    answer:
      'No. It\u2019s a one-time payment of \u00a319.99 for lifetime access to the full 12-week programme \u2014 for the whole family. No recurring charges, no hidden fees.',
  },
  {
    question: 'What if it doesn\u2019t work for my child?',
    answer:
      'We offer a 7-day money-back guarantee. If it\u2019s not the right fit, just email us and we\u2019ll refund you in full \u2014 no questions asked.',
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
