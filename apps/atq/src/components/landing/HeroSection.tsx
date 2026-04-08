import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Nav */}
      <div className="max-w-3xl mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        <span className="font-display font-extrabold text-base text-white tracking-tight">
          🦉 AnswerTheQuestion!
        </span>
        <Link
          to="/login"
          className="text-sm text-white/70 font-display font-semibold hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-10 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-extrabold text-[2rem] leading-[1.15] md:text-5xl md:leading-[1.15] text-white drop-shadow-lg mb-5 max-w-2xl mx-auto">
            Your child knew the answer. They just didn&rsquo;t{' '}
            <span className="text-fuchsia-300">read the question.</span>
          </h1>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xl mx-auto mb-10">
            <p className="text-white font-display font-bold text-lg md:text-xl leading-relaxed">
              AnswerTheQuestion! trains children to use the{' '}
              <strong className="text-fuchsia-200">CLEAR Method</strong> — a five-step exam
              technique that turns careless mistakes into confident, correct answers. Built
              for 11+, independent school entrance, and every exam beyond.
            </p>
            <p className="text-white/80 font-display text-sm md:text-base leading-relaxed mt-3">
              The only 11+ programme that builds exam technique <em>and</em> exam composure
              &mdash; so your child walks in confident, not just prepared.
            </p>
          </div>

          <p className="text-white/90 font-display text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Because watching your child lose marks on questions they know the answer to is one of
            the most frustrating things in 11+ preparation. We built this to fix exactly that.
          </p>

          <Link
            to="/checkout"
            className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Start the 12-week programme &mdash; &pound;29.99
          </Link>

          <p className="text-white/70 font-display text-sm font-medium mt-4">
            One-time payment &middot; 7-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
