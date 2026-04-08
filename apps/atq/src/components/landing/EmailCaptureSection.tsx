import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@atq/shared';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function EmailCaptureSection() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;

    setState('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('email_leads')
        .insert({ email: email.trim().toLowerCase(), source: 'atq-landing' });

      if (error) {
        // Unique constraint = already subscribed
        if (error.code === '23505') {
          setState('success');
          return;
        }
        throw error;
      }

      setState('success');
    } catch {
      setState('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto px-5 py-12"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center">
        <h3 className="font-display font-extrabold text-xl text-white mb-2">
          Not ready to buy yet?
        </h3>
        <p className="text-white/70 font-display text-sm mb-6 max-w-md mx-auto">
          Get our free parent guide — the research behind why exam technique matters more than extra tutoring.
        </p>

        {state === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/20 border border-green-400/30 rounded-2xl p-5"
          >
            <p className="font-display font-bold text-white text-base">
              ✅ You're in!
            </p>
            <p className="text-white/70 font-display text-sm mt-1">
              We'll send you the guide shortly.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl font-display text-sm text-gray-800 bg-white/95 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="px-6 py-3 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {state === 'loading' ? 'Sending...' : 'Send Me the Guide'}
            </button>
          </form>
        )}

        {state === 'error' && (
          <p className="text-red-300 font-display text-xs mt-3">{errorMsg}</p>
        )}
      </div>
    </motion.section>
  );
}
