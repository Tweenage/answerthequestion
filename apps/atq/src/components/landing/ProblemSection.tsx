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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-2 leading-tight">
            They know the answer.
          </h2>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-fuchsia-600 text-center mb-8 leading-tight">
            But they still get it wrong.
          </h2>

          <p className="font-display text-gray-600 text-base text-center mb-5">
            If you&rsquo;ve ever said:
          </p>

          <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-100/50">
            <ul className="space-y-3 max-w-sm mx-auto">
              {PARENT_QUOTES.map((text, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="font-display text-lg text-purple-800 font-semibold italic text-center"
                >
                  {text}
                </motion.li>
              ))}
            </ul>
          </div>

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
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                {text}
              </motion.li>
            ))}
          </ul>

          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-xl p-4">
            <p className="font-display font-bold text-base text-white text-center">
              Without a clear process, even capable children can underperform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
