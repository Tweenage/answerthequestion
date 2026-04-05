import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield } from 'lucide-react';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { BumpUpsell } from '../components/BumpUpsell';
import { useCurrentUser, useAuthStore } from '@atq/shared';
import { supabase } from '@atq/shared/lib/supabase';

const FEATURES = [
  { emoji: '📖', text: 'All 12 weeks of guided technique training' },
  { emoji: '🎯', text: 'English, Maths & Reasoning questions' },
  { emoji: '📝', text: 'Full Timed Challenges with real timing' },
  { emoji: '🏅', text: 'Complete badge collection & achievements' },
  { emoji: '🧘', text: 'Visualisation & breathing exercises' },
  { emoji: '📊', text: 'Parent dashboard with progress tracking' },
  { emoji: '🔄', text: 'Spaced-repetition mistake review' },
];

export function UpgradePage() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const parentSession = useAuthStore(s => s.parentSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBumpUpsell, setShowBumpUpsell] = useState(false);
  const [includeCribSheet, setIncludeCribSheet] = useState(false);

  // Called when user clicks the main CTA — show bump upsell first
  const handleCtaClick = () => {
    if (!includeCribSheet) {
      setShowBumpUpsell(true);
    } else {
      handleCheckout();
    }
  };

  const handleBumpAccept = () => {
    setIncludeCribSheet(true);
    setShowBumpUpsell(false);
    handleCheckout(true);
  };

  const handleBumpDecline = () => {
    setShowBumpUpsell(false);
    handleCheckout();
  };

  const handleCheckout = async (withCribSheet?: boolean) => {
    if (!parentSession?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          parentId: parentSession.user.id,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/upgrade`,
          includeCribSheet: withCribSheet || includeCribSheet,
        },
      });

      if (fnError) throw fnError;
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
    <div className="space-y-6 py-2 pb-24 lg:pb-6">
      {/* Professor Hoot */}
      <div className="flex justify-center">
        <ProfessorHoot mood="encouraging" size="lg" animate showSpeechBubble={false} />
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-white drop-shadow-md">
          Ready to master exam technique? 🦉
        </h2>
        <p className="text-white/80 font-display mt-2 max-w-sm mx-auto">
          {currentUser?.name}, unlock the full 12-week CLEAR Method™ programme and
          turn &ldquo;nearly right&rdquo; into confident, accurate answers.
        </p>
      </div>

      {/* Pricing card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
      >
        {/* Price */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-display font-extrabold text-3xl text-gray-800">£29.99</span>
          </div>
          <p className="text-sm text-gray-500 font-display">One-time payment · Full access forever</p>
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3"
            >
              <span className="text-lg shrink-0">{f.emoji}</span>
              <span className="text-sm text-gray-700 font-display">{f.text}</span>
              <Check className="w-4 h-4 text-green-500 ml-auto shrink-0" />
            </motion.div>
          ))}
        </div>

        {/* Crib Sheet Bump */}
        <label className="flex items-start gap-3 mb-4 p-3 rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 cursor-pointer hover:bg-purple-50 transition-colors">
          <input
            type="checkbox"
            checked={includeCribSheet}
            onChange={e => setIncludeCribSheet(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-400 shrink-0 accent-purple-600"
          />
          <div className="flex-1">
            <p className="font-display font-bold text-sm text-gray-800">
              📋 Add the CLEAR Method Crib Sheet — <span className="text-fuchsia-600">£4.99</span>
            </p>
            <p className="font-display text-xs text-gray-500 mt-0.5">
              A printable one-pager so the principles stick when the screens are off.
            </p>
          </div>
        </label>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCtaClick}
          disabled={loading}
          className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-opacity disabled:opacity-50 shadow-lg"
        >
          {loading ? 'Redirecting to checkout…' : `Unlock Full Access — £${includeCribSheet ? '34.98' : '29.99'} 🔓`}
        </motion.button>

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
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400 font-display">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure payment</span>
          </div>
          <span>·</span>
          <Link to="/refunds" className="underline hover:text-gray-600">
            7-day money-back guarantee
          </Link>
        </div>
      </motion.div>

      {/* Back link */}
      <div className="text-center">
        <button
          onClick={() => navigate('/home')}
          className="text-sm text-white/80 font-display hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Bump Upsell Modal */}
      <BumpUpsell
        isOpen={showBumpUpsell}
        onAccept={handleBumpAccept}
        onDecline={handleBumpDecline}
      />
    </div>
  );
}
