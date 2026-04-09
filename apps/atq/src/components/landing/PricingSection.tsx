import { Link } from 'react-router';
import { motion } from 'framer-motion';

const INCLUDES = [
  ['📚', '12-week CLEAR Method programme'],
  ['⚡', 'Fast Track mode — any timeline'],
  ['📱', 'Works on any device'],
  ['🧘', 'Breathing & calm exercises'],
  ['📊', 'Parent progress dashboard'],
  ['🦉', 'Professor Hoot companion'],
  ['🏆', 'Certificate of Achievement'],
  ['📖', 'Dyslexia-friendly mode'],
];

export function PricingSection() {
  return (
    <section className="bg-white/95 backdrop-blur-sm" id="pricing">
      <div className="max-w-3xl mx-auto px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-purple-900 text-center mb-10 leading-tight">
            &pound;29.99. That&rsquo;s it.
          </h2>

          {/* Anchor */}
          <p className="font-display text-base text-gray-500 text-center max-w-md mx-auto mb-8 leading-relaxed">
            One payment. Full 12-week programme. No subscription.
            <br />
            <span className="text-gray-700 font-medium">Far less than a single tutoring session.</span>
            <br />
            And it makes all of those hours of study count.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
            {INCLUDES.map(([emoji, text], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 text-gray-700 font-display text-sm"
              >
                <span className="shrink-0 text-base">{emoji}</span>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <div className="bg-green-50 rounded-2xl p-5 md:p-6 border border-green-200/50 text-center max-w-md mx-auto mb-8">
            <p className="font-display font-extrabold text-base text-green-800 mb-1.5">
              🛡️ 7-day money-back guarantee
            </p>
            <p className="font-display text-sm text-green-700 leading-relaxed">
              Try the full programme for 7 days. If it&rsquo;s not right for your child, just email us
              and we&rsquo;ll refund you in full. No forms. No questions.{' '}
              <Link to="/refunds" className="underline hover:text-green-900 transition-colors">
                Read our refund policy.
              </Link>
            </p>
          </div>

          {/* Near-payment reminder */}
          <p className="font-display font-semibold text-base text-gray-600 text-center italic mb-8">
            Your child knew the answer.
            <br />
            They just didn&rsquo;t read the question properly.
          </p>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/checkout"
              className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Start AnswerTheQuestion! &rarr;
            </Link>

            <div className="flex items-center justify-center gap-4 text-gray-400 text-xs font-display mt-4">
              <span>🛡️ Secure checkout</span>
              <span>🍋 Powered by LemonSqueezy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
