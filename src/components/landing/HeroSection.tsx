import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Brand bar */}
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
          {/* Big bold headline */}
          <h1 className="font-display font-extrabold text-[2rem] leading-[1.15] md:text-5xl md:leading-[1.15] text-white drop-shadow-lg mb-5 max-w-2xl mx-auto">
            They&rsquo;ll only get the marks if they{' '}
            <span className="text-fuchsia-300">Read the&nbsp;Question!</span>
          </h1>

          {/* Subhead — glass card with dark text */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xl mx-auto mb-10">
            <p className="text-white font-display font-bold text-lg md:text-xl leading-relaxed">
              <strong className="text-purple-700">AnswerTheQuestion!</strong> trains children to slow down and read before they answer &mdash; using the{' '}
              <strong className="text-purple-700">CLEAR Method</strong>. Perfect for 11+, independent school exams, and a powerful habit for
              any child preparing to start secondary school.
            </p>
          </div>

          {/* CTA block */}
          <Link
            to="/signup"
            className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Start the 12-week programme
          </Link>

          <div className="mt-5 flex flex-col items-center gap-1.5">
            <p className="font-display font-extrabold text-3xl text-white">
              &pound;19.99
            </p>
            <p className="text-white/70 font-display text-sm font-medium">
              One-time payment &middot; 12 weeks &middot; The whole family
            </p>
            <p className="text-white/60 font-display text-xs mt-1">
              7-day money-back guarantee &middot; No subscription
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
