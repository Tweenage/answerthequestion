import { motion } from 'framer-motion';

export function TrustNoteSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <h2 className="font-display font-extrabold text-xl md:text-2xl text-white drop-shadow-md mb-6 leading-tight">
          A note on outcomes
        </h2>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <p className="font-display text-white/80 text-sm leading-relaxed mb-4">
            This programme is based on established principles from educational
            psychology and cognitive science. While individual studies support
            components of the approach, outcomes for any child will depend on
            engagement, prior attainment, and consistency of use.
          </p>
          <p className="font-display text-white/70 text-sm leading-relaxed italic">
            Like any learning approach, results depend on how it is used.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
