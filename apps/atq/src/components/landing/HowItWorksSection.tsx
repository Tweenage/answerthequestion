import { motion } from 'framer-motion';

const STEPS = [
  { emoji: '📝', title: '10 timed questions', desc: 'Covering Maths, English and Reasoning — matched to your child\u2019s level' },
  { emoji: '🧭', title: 'Step-by-step guidance', desc: 'The CLEAR Method is built into every question, prompting each habit' },
  { emoji: '🔄', title: 'Interactive prompts', desc: 'Read, identify key words, eliminate, answer, review — every time' },
];

export function HowItWorksSection() {
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
            Just 10 minutes a day
          </h2>
          <p className="font-display text-gray-500 text-sm mb-8">
            Each session is short, structured and consistent.
          </p>

          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-left"
              >
                <span className="text-2xl shrink-0">{step.emoji}</span>
                <div>
                  <p className="font-display font-bold text-base text-gray-800">{step.title}</p>
                  <p className="font-display text-sm text-gray-500 leading-relaxed mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="font-display text-sm text-gray-600 mt-8 font-semibold">
            This isn&rsquo;t just practice &mdash; it&rsquo;s training how to think under pressure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
