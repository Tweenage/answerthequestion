import { motion } from 'framer-motion';

const BULLETS = [
  'They come out of the exam saying "I knew all of that" — but the marks don\'t reflect it.',
  'The question said "give two reasons" — they gave one and moved on.',
  'You\'ve said "read the question" so many times it\'s lost all meaning.',
  'They ace practice papers at home, then panic and rush under timed conditions.',
  'They knew the answer. They just didn\'t answer the question that was asked.',
];

export function ProblemSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-8 leading-tight">
            If this sounds familiar&hellip;
          </h2>

          <ul className="space-y-4 mb-8">
            {BULLETS.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-gray-700 font-display text-base leading-relaxed"
              >
                <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-fuchsia-400" />
                {text}
              </motion.li>
            ))}
          </ul>

          <p className="font-display font-bold text-base md:text-lg text-gray-800 text-center leading-relaxed">
            That&rsquo;s not a knowledge problem. It&rsquo;s an exam-technique habit.
            <br />
            And habits can be trained.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
