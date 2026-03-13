import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';

export function CheckoutPage() {
  const parentSession = useAuthStore(s => s.parentSession);

  const [includeCribSheet, setIncludeCribSheet] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePrice = 19.99;
  const cribSheetPrice = 4.99;
  const total = basePrice + (includeCribSheet ? cribSheetPrice : 0);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canProceed = parentSession
    ? true
    : guestEmail.trim() !== '' && isValidEmail(guestEmail.trim());

  const handleCheckout = async () => {
    if (!canProceed) return;

    setLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/checkout`,
        includeCribSheet,
        promoCode: promoCode.trim() || undefined,
      };

      // For guest checkout, send email in the body
      if (!parentSession) {
        body.email = guestEmail.trim().toLowerCase();
      }

      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body,
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Brand bar */}
      <div className="max-w-3xl mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-base text-white tracking-tight">
          🦉 AnswerTheQuestion!
        </Link>
        {parentSession ? (
          <span className="text-sm text-white/70 font-display font-semibold truncate ml-4">
            {parentSession.user.email}
          </span>
        ) : (
          <Link
            to="/login"
            className="text-sm text-white/70 font-display font-semibold hover:text-white transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>

      <div className="max-w-lg mx-auto px-5 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-lg text-center mb-8">
            Complete your order
          </h1>

          {/* Order card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/30">
            {/* Main product */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-extrabold text-lg text-gray-900">
                  AnswerTheQuestion! Programme
                </h2>
                <p className="font-display text-sm text-gray-500 mt-1 leading-relaxed">
                  12-week CLEAR Method&trade; training &middot; Whole family access &middot; Lifetime
                </p>
              </div>
              <p className="font-display font-extrabold text-xl text-gray-900 shrink-0 ml-4">
                &pound;{basePrice.toFixed(2)}
              </p>
            </div>

            {/* Crib Sheet Bump */}
            <motion.div
              className="mb-6"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: 2, delay: 1.5 }}
            >
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-fuchsia-400 bg-gradient-to-br from-fuchsia-50 via-purple-50 to-white cursor-pointer hover:from-fuchsia-100 hover:via-purple-100 transition-colors shadow-md shadow-fuchsia-100/50 relative overflow-hidden">
                {/* Attention ribbon */}
                <span className="absolute -top-0.5 -right-0.5 bg-fuchsia-500 text-white text-[10px] font-display font-extrabold px-2.5 py-0.5 rounded-bl-lg rounded-tr-lg uppercase tracking-wide">
                  Only at checkout
                </span>
                <input
                  type="checkbox"
                  checked={includeCribSheet}
                  onChange={e => setIncludeCribSheet(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-400 shrink-0 accent-purple-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display font-extrabold text-base text-gray-900">
                      📋 Add the CLEAR Method&trade; Crib Sheet
                    </p>
                    <p className="font-display font-extrabold text-base text-fuchsia-600 shrink-0">
                      &pound;{cribSheetPrice.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-display text-sm text-gray-700 mt-2 leading-relaxed">
                    A printable one-page PDF of the 5 CLEAR Method&trade; steps &mdash; designed to live
                    on the fridge, inside a pencil case, or beside practice papers.
                    <strong className="text-purple-700"> When the screens are off and the pen is in hand,
                    the technique stays close.</strong>
                  </p>
                  <p className="font-display text-xs text-fuchsia-600 font-semibold mt-2">
                    This is the only time you can add it &mdash; it&rsquo;s not available separately.
                  </p>
                </div>
              </label>
            </motion.div>

            {/* Discount Code */}
            <div className="mb-6">
              <label className="block text-sm font-display font-semibold text-gray-600 mb-1.5">
                Discount code
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. ATQWELCOME10"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 font-display text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 uppercase placeholder:normal-case"
              />
              {promoCode.trim() && (
                <p className="font-display text-xs text-purple-600 mt-1.5">
                  ✓ Code will be applied at checkout
                </p>
              )}
            </div>

            {/* Email — only shown for guests */}
            {!parentSession && (
              <div className="mb-6">
                <label className="block text-sm font-display font-semibold text-gray-600 mb-1.5">
                  Your email address
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 font-display text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder:text-gray-400"
                />
                <p className="font-display text-xs text-gray-400 mt-1.5">
                  You&rsquo;ll create your account after payment &mdash; use the same email
                </p>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-6">
              <p className="font-display font-extrabold text-lg text-gray-900">Total</p>
              <div className="text-right">
                <p className="font-display font-extrabold text-2xl text-fuchsia-600">
                  &pound;{total.toFixed(2)}
                </p>
                {promoCode.trim() && (
                  <p className="font-display text-xs text-purple-600">
                    Discount applied at checkout
                  </p>
                )}
              </div>
            </div>

            {/* CTA — always show Pay button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              disabled={loading || !canProceed}
              className="w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Redirecting to payment\u2026' : `Pay \u00A3${total.toFixed(2)} \u2014 Secure Checkout`}
            </motion.button>

            {!parentSession && (
              <p className="text-center text-sm text-gray-500 font-display mt-3">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800">
                  Sign in first
                </Link>
              </p>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm font-display font-semibold bg-red-50 p-3 rounded-lg mt-3 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400 font-display">
              <span>🛡️ Secure checkout</span>
              <span>💳 Powered by Stripe</span>
            </div>
          </div>

          {/* Guarantee */}
          <div className="text-center mt-6">
            <p className="text-white/70 font-display text-sm">
              🛡️ 7-day money-back guarantee &middot;{' '}
              <Link to="/refunds" className="underline hover:text-white/90 transition-colors">
                Refund policy
              </Link>
            </p>
          </div>

          {/* Back to landing */}
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-white/60 font-display hover:text-white/80 transition-colors">
              &larr; Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
