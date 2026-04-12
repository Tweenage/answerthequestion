import { motion } from 'framer-motion';

const STEPS = [
  { letter: 'C', bg: 'bg-blue-500', name: 'Calm', description: 'Breathe. Reduce anxiety and improve focus.' },
  { letter: 'L', bg: 'bg-violet-500', name: 'Look', description: 'Read carefully. Identify key words.' },
  { letter: 'E', bg: 'bg-pink-500', name: 'Eliminate', description: 'Rule out wrong answers first.' },
  { letter: 'A', bg: 'bg-amber-500', name: 'Answer', description: 'Choose based on evidence, not instinct.' },
  { letter: 'R', bg: 'bg-emerald-500', name: 'Review', description: 'Check it matches the question.' },
];

export function ClearMethodSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 mb-2 leading-tight">
            A simple method that works for every question
          </h2>
          <p className="text-gray-500 font-display text-sm mb-6">
            Covering Maths, English and Reasoning. Designed to become automatic under exam conditions.
          </p>

          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${step.bg} flex items-center justify-center shadow-md mx-auto mb-2`}>
                  <span className="font-display font-extrabold text-xl md:text-2xl text-white">{step.letter}</span>
                </div>
                <p className="font-display font-bold text-sm text-gray-900">{step.name}</p>
                <p className="font-display text-xs text-gray-500 leading-snug mt-0.5">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <p className="font-display text-sm text-gray-600 mt-6 font-semibold">
            Over time, this becomes instinct &mdash; not effort.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
