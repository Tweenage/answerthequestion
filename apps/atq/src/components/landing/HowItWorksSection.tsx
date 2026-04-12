import { motion } from 'framer-motion';

const PHASES = [
  { emoji: '🌱', name: 'Foundation', weeks: '1\u20134', desc: 'Learn the method with full guidance', bg: 'bg-red-500', tint: 'bg-red-50 border-red-200/60' },
  { emoji: '🔥', name: 'Building', weeks: '5\u20138', desc: 'Apply the method with reduced prompts', bg: 'bg-amber-500', tint: 'bg-amber-50 border-amber-200/60' },
  { emoji: '🚀', name: 'Exam Mode', weeks: '9\u201312', desc: 'Use it independently under time pressure', bg: 'bg-green-500', tint: 'bg-green-50 border-green-200/60' },
];

export function HowItWorksSection() {
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
          Just 10 minutes a day. 12 weeks.
        </h2>
        <p className="font-display text-white/80 text-sm text-center mb-8 max-w-md mx-auto">
          Short, structured sessions that build exam technique gradually &mdash;
          from guided practice to independent performance.
        </p>

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border ${phase.tint} p-5 text-center`}
            >
              <div className={`w-12 h-12 rounded-xl ${phase.bg} flex items-center justify-center shadow-sm mx-auto mb-3`}>
                <span className="text-xl">{phase.emoji}</span>
              </div>
              <p className="font-display font-extrabold text-base text-gray-800">{phase.name}</p>
              <p className="font-display text-xs font-bold text-gray-400 mb-1">Weeks {phase.weeks}</p>
              <p className="font-display text-sm text-gray-500">{phase.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-center">
          <p className="font-display text-white font-semibold text-sm">
            This isn&rsquo;t just practice &mdash; it&rsquo;s training how to think under pressure.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
