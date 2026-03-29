import { Link } from 'react-router';
import { motion } from 'framer-motion';

const PHASES = [
  {
    name: 'Foundation',
    emoji: '🌱',
    weeks: '1–4',
    description: 'Build the habit from scratch. Slow down. Breathe. Read every word. The five CLEAR steps, repeated every session — until they start to feel natural.',
    bg: 'bg-red-500',
    tint: 'bg-red-50 border-red-200/60',
  },
  {
    name: 'Building',
    emoji: '🔥',
    weeks: '5–8',
    description: 'The pace increases. The questions get harder. The habit holds. This is where composure under pressure starts to form — and where children begin to trust the method.',
    bg: 'bg-amber-500',
    tint: 'bg-amber-50 border-amber-200/60',
  },
  {
    name: 'Exam Ready',
    emoji: '🚀',
    weeks: '9–12',
    description: 'The method is locked in. No scaffolding, no prompts. Just a child who knows exactly what to do when the clock is running — and stays calm enough to do it.',
    bg: 'bg-green-500',
    tint: 'bg-green-50 border-green-200/60',
  },
];

const FEATURES = [
  { emoji: '🧘', title: 'Calm tools', desc: 'Breathing exercises before every session' },
  { emoji: '👨‍👩‍👧‍👦', title: 'Multi-child', desc: 'One purchase, the whole family' },
  { emoji: '🏆', title: 'Certificate', desc: 'Personalised on completion' },
  { emoji: '🦉', title: 'Professor Hoot', desc: 'Your child\u2019s study companion' },
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
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-3 leading-tight">
            The 12-Week Journey
          </h2>
          <p className="text-gray-500 font-display text-base md:text-lg text-center max-w-xl mx-auto mb-10">
            Twelve weeks from hesitant to automatic. Not just technique &mdash; the calm,
            deliberate thinking that holds up when it actually matters.
          </p>

          {/* Phases */}
          <div className="space-y-4 mb-10">
            {PHASES.map((phase, i) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${phase.tint} p-5 md:p-6 flex items-center gap-4`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-xl ${phase.bg} flex items-center justify-center shadow-sm`}>
                  <span className="text-xl">{phase.emoji}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-extrabold text-base text-gray-800">
                      {phase.name}
                    </span>
                    <span className="text-xs font-display font-bold text-gray-400">
                      Weeks {phase.weeks}
                    </span>
                  </div>
                  <p className="font-display text-sm md:text-base text-gray-500 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Session format */}
          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-2xl p-6 md:p-8 border border-purple-200/50 text-center mb-4">
            <p className="font-display font-extrabold text-xl md:text-2xl text-purple-800">
              10 questions. 10 minutes. Done.
            </p>
            <p className="font-display text-sm md:text-base text-purple-600 mt-2">
              Short enough to fit around homework. Repeated often enough to lock the habit in for good.
            </p>
          </div>

          {/* Fast Track callout */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 border border-amber-200/60 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">⚡</span>
              <div>
                <p className="font-display font-extrabold text-base text-amber-900 mb-1">
                  Exam in fewer than 12 weeks?
                </p>
                <p className="font-display text-sm text-amber-800 leading-relaxed">
                  No problem. Just enter your child&rsquo;s exam date and the app automatically switches
                  to <strong>Fast Track mode</strong> &mdash; a compressed programme that accelerates from
                  gentle start to exam pace in the time you have left. The same CLEAR Method, the same
                  proven technique, just adapted to your timeline.
                </p>
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center"
              >
                <span className="text-2xl block mb-1.5">{f.emoji}</span>
                <p className="font-display font-bold text-sm text-gray-800">{f.title}</p>
                <p className="font-display text-xs text-gray-500 mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              to="/checkout"
              className="inline-block w-full max-w-md py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Answer the Question &mdash; &pound;19.99 &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
