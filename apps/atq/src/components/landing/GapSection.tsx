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
          Tutors, books, flashcards, and practice papers all do the same thing: they teach
          your child what to know. But there&rsquo;s a layer that almost all exam preparation
          skips &mdash; not teaching children what to do in an exam, but drilling the habit
          until it&rsquo;s automatic. Knowing and doing under pressure are not the same thing.
        </p>

        <p className="text-white/85 font-display text-base md:text-lg leading-relaxed mb-10">
          AnswerTheQuestion! is built around closing that gap. Every session repeats the same
          process &mdash; not to teach it, but to embed it &mdash; so that when the exam comes,
          the habit fires even when your child is nervous, rushed, or tired. That&rsquo;s the
          difference between a child who <em>knows</em> the answer and a child who
          <em>gets</em> the mark.
        </p>

        <Link
          to="/checkout"
          className="inline-block px-8 py-4 rounded-2xl font-display font-bold text-white text-base bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          Start AnswerTheQuestion! &rarr;
        </Link>
      </motion.div>
    </section>
  );
}
