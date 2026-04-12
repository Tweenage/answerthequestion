import { motion } from 'framer-motion';

const OUTCOMES = [
  { icon: '📖', text: 'They slow down and learn to read questions properly' },
  { icon: '🧠', text: 'More structured, methodical thinking under pressure' },
  { icon: '✅', text: 'Fewer careless mistakes with consistent practice' },
  { icon: '💪', text: 'Greater confidence on exam day' },
];

export function ForParentsSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md text-center mb-3 leading-tight">
          What parents notice
        </h2>
        <p className="font-display text-white/80 text-sm text-center mb-8 max-w-md mx-auto">
          Children complete sessions independently. No teaching required.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {OUTCOMES.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-white/30 text-center"
            >
              <span className="text-2xl block mb-2">{o.icon}</span>
              <p className="font-display text-sm font-semibold text-gray-800 leading-snug">{o.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-center">
          <p className="font-display text-white/90 text-sm">
            You can support by encouraging consistency and reinforcing effort &mdash;
            the system guides the rest.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
