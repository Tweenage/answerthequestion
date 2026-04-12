import { motion } from 'framer-motion';

export function ProblemSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 mb-1 leading-tight">
            They know the answer.
          </h2>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-fuchsia-600 mb-6 leading-tight">
            But they still get it wrong.
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
            <span className="font-display text-base text-purple-800 font-semibold italic">😩 &ldquo;You didn&rsquo;t read it properly&rdquo;</span>
            <span className="font-display text-base text-purple-800 font-semibold italic">😤 &ldquo;You rushed that&rdquo;</span>
            <span className="font-display text-base text-purple-800 font-semibold italic">😔 &ldquo;You knew this at home&hellip;&rdquo;</span>
          </div>

          <p className="font-display text-gray-600 text-sm mb-6">
            In exams, children are tested on how they read, manage pressure, make decisions and check their work &mdash; not just what they know.
          </p>

          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-xl p-4">
            <p className="font-display font-bold text-sm text-white">
              Without a clear process, even capable children can underperform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
