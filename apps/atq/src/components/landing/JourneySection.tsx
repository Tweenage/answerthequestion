import { motion } from 'framer-motion';

const PHASES = [
  {
    emoji: '🌱',
    name: 'Foundation',
    weeks: '1\u20134',
    description: 'Learn the method with full guidance.',
    tint: 'bg-red-50 border-red-200/60',
    bg: 'bg-red-500',
  },
  {
    emoji: '🔥',
    name: 'Building',
    weeks: '5\u20138',
    description: 'Apply the method with reduced prompts.',
    tint: 'bg-amber-50 border-amber-200/60',
    bg: 'bg-amber-500',
  },
  {
    emoji: '🚀',
    name: 'Exam Mode',
    weeks: '9\u201312',
    description: 'Use the method independently under time pressure.',
    tint: 'bg-green-50 border-green-200/60',
    bg: 'bg-green-500',
  },
];

export function JourneySection() {
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
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-3 leading-tight">
            A clear path to independent performance
          </h2>
          <p className="text-gray-500 font-display text-sm text-center mb-8 max-w-md mx-auto">
            The programme gradually reduces scaffolding so your child moves from guided practice to independent execution.
          </p>

          <div className="space-y-3">
            {PHASES.map((phase, i) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${phase.tint} p-5 flex items-center gap-4`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl ${phase.bg} flex items-center justify-center shadow-sm`}>
                  <span className="text-xl">{phase.emoji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-extrabold text-base text-purple-800">
                      {phase.name}
                    </span>
                    <span className="text-xs font-display font-bold text-gray-400">
                      Weeks {phase.weeks}
                    </span>
                  </div>
                  <p className="font-display text-sm text-gray-500 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
