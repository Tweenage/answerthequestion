import { motion } from 'framer-motion';

const LETTERS = [
  { letter: 'C', bg: 'bg-blue-500' },
  { letter: 'L', bg: 'bg-violet-500' },
  { letter: 'E', bg: 'bg-pink-500' },
  { letter: 'A', bg: 'bg-amber-500' },
  { letter: 'R', bg: 'bg-emerald-500' },
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

          <div className="flex items-center justify-center gap-4">
            {LETTERS.map((step, i) => (
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
        </motion.div>
      </div>
    </section>
  );
}
