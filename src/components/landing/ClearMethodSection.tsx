import { motion } from 'framer-motion';

const STEPS = [
  { letter: 'C', bg: 'bg-blue-500', name: 'Calm', description: 'Take a breath before you start. A settled mind reads more carefully than a rushing one.' },
  { letter: 'L', bg: 'bg-violet-500', name: 'Look', description: 'Read the whole question before looking at any answers. Every word. Every time.' },
  { letter: 'E', bg: 'bg-pink-500', name: 'Eliminate', description: 'Cross out answers that are obviously wrong. The right one is easier to find when the wrong ones are gone.' },
  { letter: 'A', bg: 'bg-amber-500', name: 'Answer', description: 'What is the question actually asking? Not what you expect — what it says.' },
  { letter: 'R', bg: 'bg-emerald-500', name: 'Review', description: 'Read your answer back against the question before moving on. One last check.' },
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 mb-6 leading-tight">
            The CLEAR Method
          </h2>

          <p className="text-gray-600 font-display text-base md:text-lg leading-relaxed mb-10">
            The CLEAR Method is grounded in metacognition research &mdash; thinking about
            how you think. The Education Endowment Foundation found metacognitive strategies
            add an average of seven months of progress. Your child learns the method in
            week one. They use it automatically by week twelve.
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
        </motion.div>
      </div>
    </section>
  );
}
