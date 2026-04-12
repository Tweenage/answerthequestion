import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Flag strip */}
      <div className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400">
        <p className="max-w-3xl mx-auto px-5 py-2.5 text-center font-display font-semibold text-xs md:text-sm text-white tracking-wide">
          Help your child build exam technique and calm, focused thinking for 11+, SATs and independent school exams
        </p>
      </div>

      {/* Nav */}
      <div className="max-w-3xl mx-auto px-5 pt-4 pb-2 flex items-center justify-between">
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

      {/* Hero content */}
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display font-extrabold text-[1.75rem] leading-[1.2] md:text-[2.75rem] md:leading-[1.15] text-white drop-shadow-lg mb-5 max-w-2xl mx-auto">
            Worried exam nerves will stop your child showing what they really know?
          </h1>

          <p className="text-white/85 font-display text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Help your child stay calm, read questions properly, and use what they
            already know &mdash; with a structured, research-informed system.
          </p>

          <Link
            to="/checkout"
            className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Start the 10-minute daily system
          </Link>

          <p className="text-white/70 font-display text-sm font-medium mt-3">
            One-time payment &middot; &pound;29.99 &middot; 7-day money-back guarantee
          </p>

          <p className="text-white/60 font-display text-xs mt-4 max-w-sm mx-auto">
            Designed to work alongside schoolwork / tutoring &mdash; not replace it
          </p>
        </motion.div>
      </div>
    </section>
  );
}
