import { motion } from 'framer-motion';

export function ObjectionSection() {
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
            &ldquo;But we already have a tutor&rdquo;
          </h2>

          <p className="font-display text-gray-600 text-base leading-relaxed mb-2">
            That&rsquo;s absolutely fine. Tutors teach knowledge.
          </p>
          <p className="font-display text-gray-600 text-base leading-relaxed mb-6">
            This programme helps your child <strong className="text-purple-700">apply it under pressure</strong>.
          </p>

          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-xl p-4">
            <p className="font-display font-bold text-base text-white">
              The two are designed to work together.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
