import { motion } from 'framer-motion';

export function CalmSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md text-center mb-8 leading-tight">
          11+ prep often ignores the nerves. We don&rsquo;t.
        </h2>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-white/30">
          {/* Breathing circle animation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200 via-fuchsia-100 to-pink-200 opacity-60"
                style={{
                  animation: 'breathe 4s ease-in-out infinite',
                }}
              />
              <div
                className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-300 via-fuchsia-200 to-pink-300 opacity-80"
                style={{
                  animation: 'breathe 4s ease-in-out infinite 0.3s',
                }}
              />
              <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl">🧘</span>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes breathe {
              0%, 100% { transform: scale(0.85); opacity: 0.4; }
              50% { transform: scale(1.05); opacity: 0.8; }
            }
          `}</style>

          <p className="text-gray-700 font-display text-base leading-relaxed mb-4 text-center">
            Before every session, your child does a guided breathing exercise
            with a positive affirmation. It takes 60 seconds and it changes
            everything.
          </p>

          <p className="text-gray-700 font-display text-base leading-relaxed mb-4 text-center">
            When nerves kick in, focus drops. The breathing exercise activates
            the parasympathetic nervous system &mdash; calming the body so the
            brain can do its job.
          </p>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200/50 text-center">
            <p className="font-display text-base text-purple-800 leading-relaxed">
              🌟 Your child also visualises their classroom &mdash; the desk,
              the chair, the sounds &mdash; so that when exam day comes, calm
              focus feels familiar, not forced.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
