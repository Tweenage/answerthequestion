import { motion } from 'framer-motion';

const PARENT_QUOTES = [
  { text: 'You didn\u2019t read the question properly', emoji: '😩' },
  { text: 'You rushed that', emoji: '😤' },
  { text: 'You knew this at home\u2026', emoji: '😔' },
];

const EXAM_SKILLS = [
  { icon: '📖', skill: 'Read and interpret questions under pressure' },
  { icon: '⏱️', skill: 'Manage their time without rushing' },
  { icon: '🎯', skill: 'Make careful decisions, not impulsive ones' },
  { icon: '✅', skill: 'Check their work before moving on' },
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

          <p className="font-display text-gray-600 text-lg text-center mb-6">
            If you&rsquo;ve ever said:
          </p>

          {/* Parent quotes as individual cards */}
          <div className="space-y-3 mb-10">
            {PARENT_QUOTES.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-5 border border-purple-100/60 flex items-center gap-4"
              >
                <span className="text-2xl shrink-0">{q.emoji}</span>
                <p className="font-display text-lg md:text-xl text-purple-800 font-bold italic">
                  &ldquo;{q.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>

          <p className="font-display text-gray-600 text-base text-center mb-6 max-w-lg mx-auto leading-relaxed">
            You&rsquo;re not alone. In exams, children aren&rsquo;t just tested on knowledge &mdash;
            they&rsquo;re tested on whether they can:
          </p>

          {/* Skills as icon cards */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {EXAM_SKILLS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm text-center"
              >
                <span className="text-3xl block mb-2">{s.icon}</span>
                <p className="font-display text-sm font-semibold text-gray-800 leading-snug">{s.skill}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl p-6 shadow-lg">
            <p className="font-display font-bold text-lg md:text-xl text-white text-center">
              Without a clear process, even capable children can underperform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
