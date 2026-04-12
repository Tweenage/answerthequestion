import { motion } from 'framer-motion';

const RESEARCH = [
  'Teaching reading strategies improves understanding when done explicitly',
  'Metacognitive approaches help children plan, monitor and evaluate their work',
  'Brief breathing exercises can reduce anxiety and support focus in timed tasks',
  'Some errors in multiple-choice assessments come from misreading or attention slips',
  'Reviewing answers helps children catch avoidable mistakes',
  'Learning is more effective when practice is spaced over time',
];

export function ResearchStripSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-3 leading-tight">
            Built on how children actually learn
          </h2>
          <p className="font-display text-gray-500 text-sm text-center mb-8 max-w-lg mx-auto">
            This programme is grounded in established findings from education research and cognitive science.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {RESEARCH.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100/50"
              >
                <span className="shrink-0 mt-1 text-purple-500 text-sm">&check;</span>
                <p className="font-display text-sm text-gray-700 leading-relaxed">
                  {point}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="font-display text-sm text-gray-600 text-center mt-8 leading-relaxed">
            These principles are translated into a simple, repeatable method your child can use every day.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
