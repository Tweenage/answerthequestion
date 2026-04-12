import { motion } from 'framer-motion';

export function ObjectionSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-6 leading-tight">
          &ldquo;But we already have a tutor&rdquo;
        </h2>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <p className="font-display text-white/90 text-base leading-relaxed mb-4">
            That&rsquo;s absolutely fine.
          </p>
          <p className="font-display text-white/80 text-sm leading-relaxed mb-2">
            Tutors teach knowledge.
          </p>
          <p className="font-display text-white/80 text-sm leading-relaxed mb-6">
            This programme helps your child apply it under pressure.
          </p>
          <p className="font-display text-white font-bold text-base">
            The two are designed to work together.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
