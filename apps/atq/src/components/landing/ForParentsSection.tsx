import { motion } from 'framer-motion';

const TIPS = [
  'Encourage consistency over intensity',
  'Reinforce effort, not just results',
  'Let the system guide their learning',
];

export function ForParentsSection() {
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 mb-6 leading-tight">
            Designed for independence &mdash; with parent insight
          </h2>

          <p className="font-display text-gray-600 text-base leading-relaxed mb-6">
            Children complete sessions independently. You can support by:
          </p>

          <ul className="space-y-3 max-w-sm mx-auto mb-8 text-left">
            {TIPS.map((text, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 text-gray-700 font-display text-sm"
              >
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400" />
                {text}
              </motion.li>
            ))}
          </ul>

          <p className="font-display text-purple-700 font-bold text-base">
            No teaching required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
