import { motion } from 'framer-motion';

const PARENT_QUOTES = [
  '\u201cYou didn\u2019t read the question properly\u201d',
  '\u201cYou rushed that\u201d',
  '\u201cYou knew this at home\u2026\u201d',
];

const EXAM_SKILLS = [
  'Read and interpret questions',
  'Manage time and pressure',
  'Make decisions quickly',
  'Check their work',
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-6 leading-tight">
            They know the answer&hellip; but still get it wrong
          </h2>

          <p className="font-display text-gray-600 text-base text-center mb-5">
            If you&rsquo;ve ever said:
          </p>

          <ul className="space-y-2 mb-8 max-w-sm mx-auto">
            {PARENT_QUOTES.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="font-display text-base text-gray-700 italic text-center"
              >
                {text}
              </motion.li>
            ))}
          </ul>

          <p className="font-display text-gray-600 text-sm text-center mb-4">
            You&rsquo;re not alone. In exam settings, children are tested on how they:
          </p>

          <ul className="space-y-2 max-w-sm mx-auto mb-8">
            {EXAM_SKILLS.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 text-gray-700 font-display text-sm"
              >
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400" />
                {text}
              </motion.li>
            ))}
          </ul>

          <p className="font-display font-bold text-base text-purple-800 text-center">
            Without a clear process, even capable children can underperform.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
