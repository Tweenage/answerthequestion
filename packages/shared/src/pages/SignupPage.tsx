import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useRequireNoAuth } from '../hooks/useSupabaseAuth';
import { useAppBrand } from '../context/AppBrandContext';

export function SignupPage() {
  useRequireNoAuth();
  const brand = useAppBrand();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Capture referral code from URL (?ref=XXXXXX) and store for later
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('atq_referral_code', ref);
    }
  }, [searchParams]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain at least one letter and one number');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Privacy Policy and Terms of Service to continue');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            marketing_opt_in: marketingOptIn,
          },
        },
      });
      if (signUpError) throw signUpError;
      // If session exists, email confirmation is disabled — go straight in
      if (data.session) {
        // Send welcome email (non-blocking)
        supabase.functions.invoke('send-welcome-email').catch(() => {
          // Non-critical — don't block signup flow
        });
        const redirect = searchParams.get('redirect');
        navigate(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/select-child');
      } else {
        setConfirmationSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  // --- Confirmation Sent ---
  if (confirmationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            {brand.mascot}
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30 text-center">
            <h2 className={`font-display text-xl font-bold ${brand.headingColor} mb-3`}>
              Check your email! 📧
            </h2>
            <p className="text-gray-600 font-display mb-2">
              We've sent a confirmation link to <strong>{email}</strong>.
              Click the link to activate your account, then come back and sign in.
            </p>
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4 font-display">
              📬 Can't see it? Check your <strong>spam</strong> or <strong>junk</strong> folder — it sometimes ends up there!
            </p>

            {resent ? (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4 font-display font-semibold">
                ✅ Confirmation email resent! Check your inbox.
              </p>
            ) : (
              <button
                onClick={async () => {
                  setResending(true);
                  try {
                    await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/login` } });
                    setResent(true);
                  } catch {
                    // silently fail
                  } finally {
                    setResending(false);
                  }
                }}
                disabled={resending}
                className={`text-sm font-display font-bold ${brand.accentColor} ${brand.accentHoverColor} underline mb-4 block`}
              >
                {resending ? 'Sending...' : 'Resend confirmation email'}
              </button>
            )}

            <Link
              to="/login"
              className={`inline-block py-3 px-6 rounded-button font-display font-bold ${brand.accentColor} border-2 border-current hover:bg-white/50 transition-all`}
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Main Signup Form ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {brand.mascot}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2">
            {brand.name}
          </h1>
          <p className="text-white/90 font-display">{brand.tagline}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
        >
          <h2 className={`font-display text-xl font-bold ${brand.headingColor} mb-5 text-center`}>
            Create Parent Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Email address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={`w-full px-4 py-3 rounded-button border border-gray-300 text-lg font-display focus:outline-none focus:ring-2 ${brand.focusRing}`}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className={`w-full px-4 py-3 rounded-button border border-gray-300 text-lg font-display focus:outline-none focus:ring-2 ${brand.focusRing}`}
              />
            </div>

            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label htmlFor="signup-confirm-password" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Confirm password</label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Type password again"
                required
                minLength={8}
                className={`w-full px-4 py-3 rounded-button border border-gray-300 text-lg font-display focus:outline-none focus:ring-2 ${brand.focusRing}`}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className={`mt-1 w-5 h-5 rounded border-2 ${brand.checkboxColor} shrink-0`}
                />
                <span className="text-sm text-gray-600 font-display leading-snug">
                  I agree to the{' '}
                  <Link to="/privacy-policy" className={`${brand.accentColor} underline font-semibold`} target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms" className={`${brand.accentColor} underline font-semibold`} target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={e => setMarketingOptIn(e.target.checked)}
                  className={`mt-1 w-5 h-5 rounded border-2 ${brand.checkboxColor} shrink-0`}
                />
                <span className="text-sm text-gray-600 font-display leading-snug">
                  Tick this box if you'd like occasional tips, study ideas, and news from {brand.name}. We'll only email you if you opt in, and you can unsubscribe anytime.
                </span>
              </label>
            </motion.div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm font-display font-semibold bg-red-50 p-3 rounded-lg">
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r ${brand.buttonGradient} ${brand.buttonGradientHover} transition-opacity disabled:opacity-50 shadow-md`}
            >
              {loading ? 'Please wait...' : 'Create Account'}
            </motion.button>

            <Link
              to="/login"
              className={`block w-full text-center text-sm ${brand.accentColor} ${brand.accentHoverColor} font-display font-semibold`}
            >
              Already have an account? Sign in
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
