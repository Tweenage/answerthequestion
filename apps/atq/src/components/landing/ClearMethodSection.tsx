import { motion } from 'framer-motion';

const STEPS = [
  { letter: 'C', bg: 'bg-blue-500', name: 'Calm', description: 'A short breathing pause to reduce anxiety and improve focus.' },
  { letter: 'L', bg: 'bg-violet-500', name: 'Look', description: 'Read the question carefully and identify key words.' },
  { letter: 'E', bg: 'bg-pink-500', name: 'Eliminate', description: 'Rule out incorrect answers before choosing.' },
  { letter: 'A', bg: 'bg-amber-500', name: 'Answer', description: 'Select the best answer based on remaining evidence.' },
  { letter: 'R', bg: 'bg-emerald-500', name: 'Review', description: 'Check the answer matches the question.' },
];

export function ClearMethodSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 mb-3 leading-tight">
            A simple method that works for every question
          </h2>
          <p className="text-gray-500 font-display text-sm mb-8">
            Covering Maths, English and Reasoning. Designed to become automatic under exam conditions.
          </p>

          {/* Letter circles */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className={`w-14 h-14 rounded-full ${step.bg} flex items-center justify-center shadow-md`}
              >
                <span className="font-display font-extrabold text-2xl text-white">
                  {step.letter}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Step breakdown */}
          <div className="space-y-3 text-left">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className={`w-9 h-9 rounded-full ${step.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className="font-display font-extrabold text-base text-white">{step.letter}</span>
                </div>
                <div>
                  <p className="font-display font-bold text-gray-900 text-base">{step.name}</p>
                  <p className="font-display text-sm text-gray-500 leading-relaxed mt-0.5">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="font-display text-sm text-gray-600 mt-8 font-semibold">
            Over time, this becomes instinct &mdash; not effort.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
