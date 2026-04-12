import { motion } from 'framer-motion';

export function ProblemSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 pt-10 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto text-center"
      >
        <h2 className="font-display font-extrabold text-xl md:text-2xl text-white drop-shadow-md mb-4 leading-tight">
          They know the answer. <span className="text-fuchsia-200">But they still get it wrong.</span>
        </h2>

        <p className="font-display text-white/80 text-sm leading-relaxed">
          😩 &ldquo;You didn&rsquo;t read it properly&rdquo; &nbsp;&middot;&nbsp;
          😤 &ldquo;You rushed that&rdquo; &nbsp;&middot;&nbsp;
          😔 &ldquo;You knew this at home&hellip;&rdquo;
        </p>
      </motion.div>
    </section>
  );
}
