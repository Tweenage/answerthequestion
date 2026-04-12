import { motion } from 'framer-motion';

const PARENT_QUOTES = [
  '\u201cYou didn\u2019t read the question properly\u201d',
  '\u201cYou rushed that\u201d',
  '\u201cYou knew this at home\u2026\u201d',
];

const EXAM_SKILLS = [
  'Read and interpret questions under pressure',
  'Manage their time without rushing',
  'Make careful decisions, not impulsive ones',
  'Check their work before moving on',
];

export function ProblemSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-purple-900 text-center mb-2 leading-tight">
            They know the answer.
          </h2>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-fuchsia-600 text-center mb-10 leading-tight">
            But they still get it wrong.
          </h2>

          <p className="font-display text-gray-700 text-lg text-center mb-6">
            If you&rsquo;ve ever said:
          </p>

          <div className="bg-purple-50 rounded-2xl p-8 mb-10 border border-purple-100/50">
            <ul className="space-y-4">
              {PARENT_QUOTES.map((text, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="font-display text-xl md:text-2xl text-purple-800 font-bold italic text-center"
                >
                  {text}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="font-display text-gray-700 text-lg text-center mb-6">
            You&rsquo;re not alone. In exams, children aren&rsquo;t just tested on knowledge &mdash;
            they&rsquo;re tested on whether they can:
          </p>

          <div className="grid md:grid-cols-2 gap-3 mb-10">
            {EXAM_SKILLS.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
                <p className="font-display text-base font-medium text-gray-800">{text}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl p-6">
            <p className="font-display font-bold text-lg md:text-xl text-white text-center">
              Without a clear process, even capable children can underperform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
