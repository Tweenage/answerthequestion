import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function GuaranteeSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-5 py-14 text-center"
    >
      <p className="text-6xl mb-6">🛡️</p>

      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-6 leading-tight">
        Try the full programme for 7 days.
      </h2>

      <p className="text-white/90 font-display text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-6">
        If it&rsquo;s not right for your family, email us and we&rsquo;ll
        refund every penny. No forms. No questions. No hassle.
      </p>

      <Link
        to="/refunds"
        className="font-display text-white/70 text-sm underline hover:text-white transition-colors"
      >
        Read our refund policy
      </Link>
    </motion.section>
  );
}
