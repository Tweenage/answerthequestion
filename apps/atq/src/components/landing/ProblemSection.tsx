import { motion } from 'framer-motion';

export function ProblemSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-1 leading-tight">
          They know the answer.
        </h2>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-fuchsia-200 mb-6 leading-tight">
          But they still get it wrong.
        </h2>

        <p className="font-display text-white/85 text-base mb-4">
          Do you find yourself saying&hellip;
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
          <span className="font-display text-base text-white/90 font-semibold italic">😩 &ldquo;You didn&rsquo;t read it properly&rdquo;</span>
          <span className="font-display text-base text-white/90 font-semibold italic">😤 &ldquo;You rushed that&rdquo;</span>
          <span className="font-display text-base text-white/90 font-semibold italic">😔 &ldquo;You knew this at home&hellip;&rdquo;</span>
        </div>

        <p className="font-display text-white/80 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
          &hellip;and wondering how to help your child reach their potential?
          In exams, children are tested not just on what they know, but how well
          they focus, manage pressure, make decisions and check their work.
        </p>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="font-display font-bold text-sm text-white">
            Without a clear process, even capable children can underperform.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
