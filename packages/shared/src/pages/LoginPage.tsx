import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useRequireNoAuth } from '../hooks/useSupabaseAuth';
import { useAuthStore } from '../stores/useAuthStore';
import { ProfessorHoot } from '../components/mascot/ProfessorHoot';

export function LoginPage() {
  useRequireNoAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [confirmationResent, setConfirmationResent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  // Listen for PASSWORD_RECOVERY event when user clicks reset link in email
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowNewPassword(true);
        setError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      const redirect = searchParams.get('redirect');
      navigate(redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/select-child');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      if (msg.toLowerCase().includes('email not confirmed')) {
        setShowResendConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (resendError) throw resendError;
      setConfirmationResent(true);
      setShowResendConfirmation(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setResetEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one letter and one number');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      // Clear the recovery flag so useRequireNoAuth can redirect normally again
      useAuthStore.getState().setPasswordRecovery(false);
      setPasswordUpdated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Floating background emojis
  const floatingEmojis = ['🦉', '📚', '✏️', '🌟', '🎯', '🧠', '💡', '🏆'];

  // --- Password Updated Success ---
  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            <ProfessorHoot mood="celebrating" size="xl" animate showSpeechBubble={false} />
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30 text-center">
            <h2 className="font-display text-xl font-bold text-purple-800 mb-3">
              Password updated! 🎉
            </h2>
            <p className="text-gray-600 font-display mb-4">
              Your password has been changed successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => {
                setPasswordUpdated(false);
                setShowNewPassword(false);
                setNewPassword('');
                setConfirmNewPassword('');
              }}
              className="py-3 px-6 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md"
            >
              Sign In Now 🦉
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Reset Email Sent ---
  if (resetEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            <ProfessorHoot mood="happy" size="xl" animate showSpeechBubble={false} />
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30 text-center">
            <h2 className="font-display text-xl font-bold text-purple-800 mb-3">
              Reset link sent! 📧
            </h2>
            <p className="text-gray-600 font-display mb-2">
              We've sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the link to set a new password.
            </p>
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4 font-display">
              📬 Can't see it? Check your <strong>spam</strong> or <strong>junk</strong> folder — it sometimes ends up there!
            </p>
            <button
              onClick={() => {
                setResetEmailSent(false);
                setShowForgotPassword(false);
              }}
              className="py-3 px-6 rounded-button font-display font-bold text-purple-600 border-2 border-purple-300 hover:bg-purple-50 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Set New Password (after clicking reset link) ---
  if (showNewPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingEmojis.map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-[0.1]"
              style={{ left: `${10 + (i * 12) % 80}%`, top: `${5 + (i * 17) % 85}%` }}
              animate={{ y: [0, -15, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <ProfessorHoot mood="happy" size="xl" animate showSpeechBubble={false} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2">
              AnswerTheQuestion!
            </h1>
            <p className="text-white/90 font-display">11+ Exam Technique Trainer</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
          >
            <h2 className="font-display text-xl font-bold text-purple-800 mb-2 text-center">
              Set New Password
            </h2>
            <p className="text-gray-500 font-display text-sm text-center mb-5">
              Choose a new password for your account
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">New password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-button border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Confirm new password</label>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Type password again"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-button border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                />
              </div>

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
                className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-opacity disabled:opacity-50 shadow-md"
              >
                {loading ? 'Please wait...' : 'Update Password 🔒'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- Main Login Form ---
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-[0.1]"
            style={{ left: `${10 + (i * 12) % 80}%`, top: `${5 + (i * 17) % 85}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <ProfessorHoot mood="happy" size="xl" animate showSpeechBubble={false} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2">
            AnswerTheQuestion!
          </h1>
          <p className="text-white/90 font-display">11+ Exam Technique Trainer</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-card p-6 shadow-lg border border-white/30"
        >
          {showForgotPassword ? (
            <>
              <h2 className="font-display text-xl font-bold text-purple-800 mb-2 text-center">
                Reset Password
              </h2>
              <p className="text-gray-500 font-display text-sm text-center mb-5">
                Enter your email and we'll send you a reset link
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Email address</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-button border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    autoFocus
                  />
                </div>

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
                  className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-opacity disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Please wait...' : 'Send Reset Link 📧'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setError(null); }}
                  className="w-full text-center text-sm text-purple-600 hover:text-purple-800 font-display font-semibold"
                >
                  Back to Sign In
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-purple-800 mb-5 text-center">
                Welcome Back
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Email address</label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-button border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-display font-semibold text-gray-600 mb-1.5">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-button border-2 border-purple-200 text-lg font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm font-display font-semibold bg-red-50 p-3 rounded-lg">
                    {error}
                  </motion.p>
                )}

                {showResendConfirmation && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-amber-800 font-display mb-2">
                      Your email hasn't been confirmed yet. Check your inbox (and spam folder), or resend the confirmation email.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={loading}
                      className="text-sm font-display font-bold text-purple-600 hover:text-purple-800 underline"
                    >
                      {loading ? 'Sending...' : 'Resend confirmation email'}
                    </button>
                  </motion.div>
                )}

                {confirmationResent && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-green-800 font-display">
                      Confirmation email resent to <strong>{email}</strong>. Check your inbox and spam folder.
                    </p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-button font-display font-bold text-white text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-opacity disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Please wait...' : 'Sign In 🦉'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(true); setError(null); }}
                  className="w-full text-center text-sm text-purple-500 hover:text-purple-700 font-display"
                >
                  Forgot your password?
                </button>

                <Link
                  to="/"
                  className="block w-full text-center text-sm text-purple-600 hover:text-purple-800 font-display font-semibold"
                >
                  Don't have an account? Learn more
                </Link>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
