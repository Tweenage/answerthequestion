import { Link } from 'react-router';
import { motion } from 'framer-motion';

const INCLUDES = [
  '12-week CLEAR Method programme',
  'Daily guided sessions (10 mins)',
  'Maths, English & Reasoning questions',
  'Fast Track mode for shorter timelines',
  'Parent progress dashboard',
  'Breathing & calm exercises',
  'Dyslexia-friendly mode',
  'Certificate of Achievement',
];

export function PricingSection() {
  return (
    <section className="max-w-3xl mx-auto px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center"
      >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-md mb-2 leading-tight">
            Simple, one-time access
          </h2>
          <p className="font-display text-white/70 text-sm mb-8">
            Less than one tutoring session.
          </p>

          {/* Price card */}
          <div className="bg-gradient-to-b from-purple-50 to-white rounded-2xl p-6 md:p-8 border border-purple-200/50 shadow-sm mb-6">
            <p className="font-display font-extrabold text-5xl text-purple-700 mb-1">
              &pound;29.99
            </p>
            <p className="font-display font-bold text-sm text-gray-500 mb-6">
              One-time payment &middot; No subscription
            </p>

            <ul className="space-y-2 text-left mb-8">
              {INCLUDES.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 font-display text-sm text-gray-700"
                >
                  <span className="text-purple-500 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/checkout"
              className="block w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Start the 10-minute daily system
            </Link>

            <p className="font-display text-xs text-gray-400 mt-3">
              🛡️ 7-day money-back guarantee &middot; Secure checkout
            </p>
          </div>

          {/* Guarantee */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200/50">
            <p className="font-display text-sm text-green-800 leading-relaxed">
              <span className="font-bold">Try for 7 days.</span> Full refund if it&rsquo;s
              not right for your child. No forms. No questions.{' '}
              <Link to="/refunds" className="underline text-green-700">
                Refund policy
              </Link>
            </p>
          </div>
      </motion.div>
    </section>
  );
}
