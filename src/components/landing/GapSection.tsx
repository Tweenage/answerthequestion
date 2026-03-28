import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function GapSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto"
      >
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-6 leading-tight">
          The piece that&rsquo;s missing
        </h2>

        <p className="text-white/85 font-display text-base md:text-lg leading-relaxed mb-5">
          Tutors and practice papers teach your child what to know and how to apply it.
          But there&rsquo;s a layer that most exam preparation skips: the habit of actually
          reading the question before answering it. That single habit is responsible for
          more lost marks than any gap in knowledge.
        </p>

        <p className="text-white/85 font-display text-base md:text-lg leading-relaxed mb-10">
          AnswerTheQuestion! is the only 11+ prep tool built around this. Every session
          starts with a breathing exercise. Every question reinforces a five-step method
          that builds calm, deliberate thinking. Children don&rsquo;t just learn to answer
          questions &mdash; they learn to stay composed when it counts. That&rsquo;s the
          difference between a child who <em>knows</em> the answer and a child who
          <em>gets</em> the mark.
        </p>

        <Link
          to="/checkout"
          className="inline-block px-8 py-4 rounded-2xl font-display font-bold text-white text-base bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          See how it works &mdash; &pound;19.99
        </Link>
      </motion.div>
    </section>
  );
}
