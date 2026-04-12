import { motion } from 'framer-motion';

const OUTCOMES = [
  'They slow down and read questions properly',
  'Fewer avoidable mistakes',
  'More structured, methodical thinking',
  'Greater confidence in timed conditions',
  'Better alignment between knowledge and performance',
];

export function OutcomesSection() {
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-8 leading-tight">
            What tends to change over time
          </h2>

          <ul className="space-y-3">
            {OUTCOMES.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 text-gray-700 font-display text-base leading-relaxed"
              >
                <span className="shrink-0 mt-1 text-green-500 font-bold">&check;</span>
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
