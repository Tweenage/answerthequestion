import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function FinalCtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-5 py-16 text-center"
    >
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-3 leading-tight max-w-xl mx-auto">
        Every mark lost to rushing or nerves is a mark they already earned.
      </h2>
      <p className="font-display text-white/80 text-base mb-8 max-w-md mx-auto">
        Give them the method to keep those marks.
      </p>

      <Link
        to="/checkout"
        className="inline-block w-full max-w-sm py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
      >
        Sign up &mdash; &pound;49.99
      </Link>

      <p className="text-white/70 font-display text-sm mt-3">
        One-time payment &middot; 7-day money-back guarantee
      </p>
    </motion.section>
  );
}
