import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';
import { useAuthStore } from '@atq/shared';
import { supabase } from '@atq/shared/lib/supabase';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('ls');
  const hasCribSheet = searchParams.get('crib_sheet') === '1';
  const parentSession = useAuthStore(s => s.parentSession);
  const updateChildLocally = useAuthStore(s => s.updateChildLocally);
  const currentChildId = useAuthStore(s => s.currentChildId);
  const children = useAuthStore(s => s.children);
  const [verified, setVerified] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const isGuest = !parentSession;

  // For authenticated users: optimistically mark all children as paid,
  // and re-fetch from Supabase to confirm webhook processed
  useEffect(() => {
    if (!sessionId || isGuest) return;

    // Optimistic local update
    for (const child of children) {
      updateChildLocally(child.id, { hasPaid: true });
    }

    // Poll Supabase to verify webhook has processed (up to 10s)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        setVerified(true); // Assume success after 10s
        return;
      }

      if (!currentChildId) return;
      const { data } = await supabase
        .from('child_profiles')
        .select('has_paid')
        .eq('id', currentChildId)
        .single();

      if (data?.has_paid) {
        clearInterval(interval);
        setVerified(true);
      }
    }, 1000);

    return () => clearInterval(interval);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // For guests: show success after a brief delay (no child to verify)
  useEffect(() => {
    if (isGuest && sessionId) {
      const timer = setTimeout(() => setVerified(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isGuest, sessionId]);

  const [, setDownloadError] = useState(false);

  const handleDownloadCribSheet = async () => {
    setDownloading(true);
    setDownloadError(false);
    try {
      // Use signed URL — assets bucket is private
      const { data, error } = await supabase.storage
        .from('assets')
        .createSignedUrl('crib-sheet/CLEAR-Method-Crib-Sheet.pdf', 120);
      if (!error && data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        console.error('Failed to create signed URL:', error);
        setDownloadError(true);
      }
    } catch (err) {
      console.error('Crib sheet download error:', err);
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Brand bar */}
      <div className="max-w-3xl mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
        <Link to="/" className="font-display font-extrabold text-base text-white tracking-tight">
          🦉 AnswerTheQuestion!
        </Link>
        {parentSession && (
          <span className="text-sm text-white/70 font-display font-semibold truncate ml-4">
            {parentSession.user.email}
          </span>
        )}
      </div>

      <div className="max-w-lg mx-auto px-5 py-10 space-y-6">
        {/* Celebration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 150, delay: 0.2 }}
          className="text-center"
        >
          <span className="text-7xl block mb-2">🎉</span>
        </motion.div>

        <div className="flex justify-center">
          <ProfessorHoot mood="celebrating" size="lg" animate showSpeechBubble={false} />
        </div>

        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl font-bold text-white drop-shadow-md"
          >
            Hoo-ray! You&rsquo;re all set! 🦉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 font-display mt-2 max-w-sm mx-auto"
          >
            {isGuest
              ? 'Payment received! Create your account to start the 12-week programme.'
              : 'Full access unlocked! All 12 weeks of technique training, Timed Challenges, and more are now yours. Let\u2019s keep building those exam skills!'}
          </motion.p>
        </div>

        {/* Crib Sheet Download — shown prominently BEFORE the CTA */}
        {hasCribSheet && verified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-purple-300"
          >
            <div className="text-center space-y-3">
              <span className="text-4xl block">📋</span>
              <h3 className="font-display font-bold text-lg text-purple-800">
                Your CLEAR Method Crib Sheet
              </h3>
              <p className="font-display text-sm text-gray-600">
                Print it out and stick it on the fridge, the desk, or inside a homework folder!
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadCribSheet}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {downloading ? 'Downloading\u2026' : 'Download Crib Sheet'}
              </motion.button>
              <p className="font-display text-xs text-gray-400">
                You can also re-download this anytime from your home screen
              </p>
            </div>
          </motion.div>
        )}

        {/* Status / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: hasCribSheet ? 1.0 : 0.8 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 text-center"
        >
          {!verified ? (
            <div className="space-y-3">
              <span className="text-4xl animate-bounce inline-block">🦉</span>
              <p className="font-display font-semibold text-gray-600">
                Confirming your payment...
              </p>
              <p className="text-xs text-gray-400 font-display">This usually takes just a moment</p>
            </div>
          ) : isGuest ? (
            /* ── Guest flow: prompt to create account ── */
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span className="font-display font-bold">Payment confirmed!</span>
              </div>
              <p className="font-display text-sm text-gray-600 leading-relaxed">
                Now create your free account to unlock the programme.
                <br />
                <strong className="text-purple-700">Use the same email</strong> you just paid with so we can link your purchase.
              </p>
              <Link
                to="/signup"
                className="block w-full py-4 rounded-2xl font-display font-extrabold text-white text-lg text-center bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-transform"
              >
                Create Your Account 🦉
              </Link>
              <Link
                to="/login"
                className="block text-sm text-purple-600 hover:text-purple-800 font-display font-semibold"
              >
                Already have an account? Sign in
              </Link>
            </div>
          ) : (
            /* ── Authenticated flow: existing behaviour ── */
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span className="font-display font-bold">Payment confirmed!</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/practice')}
                className="w-full py-4 rounded-2xl font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 shadow-lg"
              >
                Start Practising! 🚀
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Back link */}
        <div className="text-center">
          {isGuest ? (
            <Link
              to="/"
              className="text-sm text-white/60 font-display hover:text-white/80 transition-colors"
            >
              &larr; Back to home
            </Link>
          ) : (
            <button
              onClick={() => navigate('/home')}
              className="text-sm text-white/60 font-display hover:text-white/80 transition-colors"
            >
              Back to the nest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
