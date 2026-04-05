import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const features = [
  {
    icon: '🧠',
    title: 'Smart spaced repetition',
    desc: 'SM-2 algorithm brings back words you struggle with at exactly the right time.',
  },
  {
    icon: '🐝',
    title: 'Spelling Bee ritual',
    desc: 'See it, say it, cover it, write it — the proven SOS method brought to life.',
  },
  {
    icon: '⭐',
    title: '0-3 star mastery',
    desc: 'Every word earns stars as your child masters it. Clear, motivating progress.',
  },
  {
    icon: '🎯',
    title: 'Bingo grid progress',
    desc: 'Visual grid fills up as words are mastered. Children love completing the board.',
  },
  {
    icon: '🔥',
    title: 'Drill mode',
    desc: 'Targeted practice on weak words. No wasted time on words already known.',
  },
  {
    icon: '📝',
    title: 'Placement test',
    desc: 'Starts with a quick assessment so your child works at the right level from day one.',
  },
];

const wordSources = [
  { label: 'DfE Year 3/4', count: '~100 words', colour: 'from-amber-400 to-yellow-400' },
  { label: 'DfE Year 5/6', count: '~100 words', colour: 'from-orange-400 to-amber-400' },
  { label: '11+ vocabulary', count: '300+ words', colour: 'from-rose-400 to-pink-400' },
];

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitState('loading');
    setErrorMsg('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lead-capture`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      if (!res.ok) throw new Error('Something went wrong. Please try again.');
      setSubmitState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitState('error');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:px-6">
      <div className="max-w-3xl mx-auto w-full">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="flex flex-col items-center text-center"
        >
          <BeeChar size="lg" mood="celebrating" animate />
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white drop-shadow mt-4">
            ATQ Spelling Bee
          </h1>
          <p className="text-white/90 text-lg sm:text-xl mt-2 max-w-md">
            Master every spelling word for the 11+ — with a method that actually sticks.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="bg-white text-amber-600 font-bold rounded-xl py-3 px-8 shadow-lg hover:shadow-xl transition-shadow font-display text-base"
            >
              Start for free
            </Link>
            <Link
              to="/login"
              className="text-white/90 underline text-sm font-display self-center"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </motion.div>

        {/* ── Features grid ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center drop-shadow">
            Everything your child needs to spell with confidence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="font-display font-bold text-gray-900 mt-2">{f.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Word sources ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow">
            500+ words from the right sources
          </h2>
          <p className="text-white/80 mt-2 max-w-lg mx-auto text-sm sm:text-base">
            Every statutory spelling list, plus the vocabulary that comes up again and again in 11+ exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {wordSources.map((ws) => (
              <div
                key={ws.label}
                className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg flex-1 max-w-xs mx-auto sm:mx-0"
              >
                <div
                  className={`inline-block bg-gradient-to-r ${ws.colour} text-white text-xs font-bold px-3 py-1 rounded-full`}
                >
                  {ws.count}
                </div>
                <h3 className="font-display font-bold text-gray-900 mt-3 text-lg">{ws.label}</h3>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Pricing ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-center drop-shadow">
            Simple pricing. No subscription.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
            {/* Free tier */}
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-lg flex flex-col">
              <div className="font-display text-sm font-bold text-amber-600 uppercase tracking-wide">
                Free
              </div>
              <div className="font-display text-4xl font-extrabold text-gray-900 mt-2">
                £0
              </div>
              <ul className="mt-4 space-y-2 text-gray-700 text-sm flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>~50 sample words</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>All features included</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Spaced repetition + mastery tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Placement test</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="mt-6 block text-center bg-amber-100 text-amber-700 font-bold rounded-xl py-3 px-6 font-display text-sm hover:bg-amber-200 transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Full access */}
            <div className="bg-white backdrop-blur rounded-2xl p-6 shadow-xl flex flex-col ring-2 ring-amber-400">
              <div className="font-display text-sm font-bold text-amber-600 uppercase tracking-wide">
                Full Access
              </div>
              <div className="font-display text-4xl font-extrabold text-gray-900 mt-2">
                £19.99
              </div>
              <p className="text-gray-500 text-xs mt-1">One-time payment. Yours to keep.</p>
              <ul className="mt-4 space-y-2 text-gray-700 text-sm flex-1">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>500+ words — statutory + 11+ vocabulary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>All features included</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Bingo grid, drill mode, streaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Lifetime access — no recurring fees</span>
                </li>
              </ul>
              <Link
                to="/signup"
                className="mt-6 block text-center bg-amber-500 text-white font-bold rounded-xl py-3 px-6 font-display text-sm hover:bg-amber-600 transition-colors shadow-md"
              >
                Unlock full word bank
              </Link>
            </div>
          </div>
          <p className="text-center text-white/70 text-xs mt-4 font-display">
            No subscription. One-time payment. Works on any device.
          </p>
        </motion.section>

        {/* ── Email capture ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16"
        >
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-lg text-center max-w-lg mx-auto">
            <BeeChar size="sm" mood="happy" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mt-3">
              Want to hear when we launch?
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Drop your email and we'll let you know — plus early-bird pricing.
            </p>

            {submitState === 'success' ? (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-700 font-display font-bold text-sm">
                  You're on the list! We'll let you know when we launch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-display focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  disabled={submitState === 'loading'}
                  className="bg-amber-500 text-white font-bold rounded-xl py-3 px-6 font-display text-sm hover:bg-amber-600 transition-colors disabled:opacity-60 shadow-md whitespace-nowrap"
                >
                  {submitState === 'loading' ? 'Sending...' : 'Get started'}
                </button>
              </form>
            )}

            {submitState === 'error' && (
              <p className="text-red-600 text-xs mt-2 font-display">{errorMsg}</p>
            )}
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="mt-16 mb-6 text-center space-y-1">
          <p className="text-white/60 text-xs font-display">
            Used alongside ATQ 11+ Exam Technique. Same login.
          </p>
          <p className="text-white/40 text-xs font-display">
            Built by Tweenage
          </p>
        </footer>
      </div>
    </div>
  );
}
