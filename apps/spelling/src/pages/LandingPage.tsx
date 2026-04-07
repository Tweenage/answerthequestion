import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';

/* ── FAQ data ── */
const FAQ_ITEMS = [
  {
    question: 'What words are included?',
    answer:
      'Every word from the Department for Education statutory spelling lists for Year 3/4 (109 words) and Year 5/6 (100 words), plus 365 words that appear regularly in 11+ entrance exams. 624 words in total — the complete set your child needs.',
  },
  {
    question: 'How long does each session take?',
    answer:
      'A daily session is 8 words — typically 5 to 10 minutes. Short enough to fit before school, after dinner, or in the car. The point is consistency, not marathon sessions.',
  },
  {
    question: 'My child already does spellings at school. How is this different?',
    answer:
      'School spelling tests give your child a list on Monday and test on Friday. By the following Monday, most of those words are forgotten. Spelling Bees uses spaced repetition — it brings words back at the point your child is about to forget them, which is designed to move them into long-term memory.',
  },
  {
    question: 'What age is it for?',
    answer:
      'Years 3 to 6, ages 7–11. The placement test works out the right starting level so your child isn\u2019t bored by easy words or overwhelmed by hard ones.',
  },
  {
    question: 'Do I need to sit with my child?',
    answer:
      'No. Once they\u2019ve done the placement test, your child can work through daily sessions independently. You can check their progress any time — but you don\u2019t need to be there running through the list.',
  },
  {
    question: 'I already have a Tweenage account. Do I need a new one?',
    answer:
      'No — if you use AnswerTheQuestion!, you can sign in with the same account. Your child profiles carry over. One family account across all Tweenage apps.',
  },
  {
    question: 'Is there a subscription?',
    answer:
      'No. One payment of \u00A319.99, yours to keep forever. No monthly fees, no renewal traps.',
  },
  {
    question: 'My child is dyslexic. Will this work for them?',
    answer:
      'Yes. Spelling Bee has a built-in dyslexia-friendly mode with the Lexend font, a cr\u00E8me background, and wider letter and word spacing — all based on peer-reviewed research. Toggle it on in Settings.',
  },
];

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <div className="min-h-screen flex flex-col">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Nav */}
        <div className="max-w-3xl mx-auto px-5 pt-5 pb-2 flex items-center justify-between">
          <span className="font-display font-extrabold text-base text-white tracking-tight">
            Spelling Bee
          </span>
          <Link
            to="/login"
            className="text-sm text-white/70 font-display font-semibold hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>

        <div className="max-w-3xl mx-auto px-5 pt-10 pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <BeeChar size="lg" mood="celebrating" animate />
            </div>

            <h1 className="font-display font-extrabold text-[2rem] leading-[1.15] md:text-5xl md:leading-[1.15] text-white drop-shadow-lg mb-5 max-w-2xl mx-auto">
              Another week gone.{' '}
              <span className="text-yellow-200">Spellings still not done.</span>
            </h1>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xl mx-auto mb-10">
              <p className="text-white font-display font-bold text-lg md:text-xl leading-relaxed">
                Spelling Bees builds a daily spelling habit your child can do independently
                &mdash; 5&ndash;10 minutes a day, 624 words covering the key vocabulary
                for the 11+, and a method designed to move words into long-term memory.
              </p>
              <p className="text-white/80 font-display text-sm md:text-base leading-relaxed mt-3">
                No more last-minute cramming. No more forgotten word lists. Just consistent,
                manageable practice &mdash; and a child who can actually spell the words when
                it matters.
              </p>
            </div>

            <Link
              to="/checkout"
              className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Spelling Bees &mdash; &pound;19.99
            </Link>

            <p className="text-white/70 font-display text-sm font-medium mt-4">
              One-time payment &middot; Whole family &middot; 7-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PROBLEM ═══════════ */}
      <section className="bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-8 leading-tight">
              If this sounds familiar&hellip;
            </h2>

            <ul className="space-y-4 mb-8">
              {[
                'You meant to do spellings this week. Again. But life got in the way.',
                'Your child learns the list for Friday\u2019s test \u2014 and forgets it all by Monday.',
                'You\u2019ve tried flashcards, apps, writing them out three times. Nothing sticks long-term.',
                'The 11+ is getting closer and you\u2019re not sure which words they actually need to know.',
                'You want them to practise independently, but they need you there to test them.',
              ].map((text, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 text-gray-700 font-display text-base leading-relaxed"
                >
                  <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-amber-400" />
                  {text}
                </motion.li>
              ))}
            </ul>

            <p className="font-display font-bold text-base md:text-lg text-gray-800 text-center leading-relaxed">
              Spelling isn&rsquo;t the problem. Consistency is.
              <br />
              And consistency is exactly what Spelling Bee builds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section>
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white text-center mb-3 leading-tight drop-shadow-lg">
              How it works
            </h2>
            <p className="font-display text-white/80 text-center text-sm md:text-base mb-10 max-w-lg mx-auto">
              Each session uses <strong className="text-yellow-200">Cover-Copy-Compare</strong>
              &mdash; the method used by educational psychologists to build spelling recall.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
              {[
                { step: '1', title: 'See the word', desc: 'Read it, see the definition, spot the tricky bit highlighted in amber.' },
                { step: '2', title: 'Cover it', desc: 'The word disappears. Hold it in your mind.' },
                { step: '3', title: 'Type it', desc: 'Spell it from memory. No peeking.' },
                { step: '4', title: 'Compare', desc: 'See your attempt letter-by-letter \u2014 green for correct, red for wrong. Learn from the mistake immediately.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-display font-extrabold text-sm mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-base">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <p className="font-display text-white/80 text-center text-sm mt-8 max-w-md mx-auto leading-relaxed">
              Words your child gets wrong come back sooner. Words they know well space out
              further. The app remembers so you don&rsquo;t have to.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WORD BANK ═══════════ */}
      <section className="bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-3 leading-tight">
              624 words your child needs to know.
            </h2>
            <p className="font-display text-gray-500 text-center text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              Not a random list. Every statutory spelling word from the national curriculum,
              plus the vocabulary that comes up again and again in 11+ exams.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200/50 text-center">
                <p className="font-display font-extrabold text-3xl text-amber-600">109</p>
                <p className="font-display font-bold text-gray-800 text-sm mt-1">DfE Year 3/4</p>
                <p className="text-gray-500 text-xs mt-1">Statutory spelling list</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50 text-center">
                <p className="font-display font-extrabold text-3xl text-orange-600">100</p>
                <p className="font-display font-bold text-gray-800 text-sm mt-1">DfE Year 5/6</p>
                <p className="text-gray-500 text-xs mt-1">Statutory spelling list</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200/50 text-center">
                <p className="font-display font-extrabold text-3xl text-rose-600">415</p>
                <p className="font-display font-bold text-gray-800 text-sm mt-1">11+ vocabulary</p>
                <p className="text-gray-500 text-xs mt-1">Words that come up in entrance exams</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHAT MAKES IT DIFFERENT ═══════════ */}
      <section>
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white text-center mb-8 leading-tight drop-shadow-lg">
              Built for independence
            </h2>

            <div className="space-y-4">
              {[
                {
                  emoji: '\u23F0',
                  title: '5\u201310 minutes a day',
                  desc: 'Short enough to fit before school, after dinner, or in the car. Daily sessions of 8 words \u2014 no marathon study sessions.',
                },
                {
                  emoji: '\uD83E\uDDE0',
                  title: 'Spaced repetition that adapts',
                  desc: 'The app tracks which words your child finds hard and brings them back at the right time. Words they know well space out automatically.',
                },
                {
                  emoji: '\uD83D\uDCCA',
                  title: 'Progress you can see',
                  desc: 'Every word earns mastery stars. The bingo grid fills up as words are mastered. Your child sees the progress \u2014 and it motivates them to keep going.',
                },
                {
                  emoji: '\uD83C\uDFAF',
                  title: 'Starts at the right level',
                  desc: 'A quick placement test works out where your child should begin, so they\u2019re not bored by words they know or overwhelmed by words they don\u2019t.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex items-start gap-4"
                >
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-base">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="bg-white/95 backdrop-blur-sm" id="pricing">
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            {/* Price card with everything inside */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 border border-amber-200/50 mb-8">
              <div className="text-center mb-6">
                <p className="font-display font-extrabold text-5xl text-amber-600">
                  &pound;19.99
                </p>
                <p className="font-display text-base text-gray-500 mt-1.5 font-medium">
                  One payment &middot; Whole family &middot; No subscription
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  ['\uD83D\uDCDA', '624 words \u2014 statutory + 11+'],
                  ['\uD83E\uDDE0', 'Spaced repetition scheduling'],
                  ['\uD83D\uDCCA', 'Mastery stars + bingo grid'],
                  ['\uD83C\uDFAF', 'Placement test'],
                  ['\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66', 'Multi-child \u2014 whole family'],
                  ['\uD83D\uDD25', 'Streaks + drill mode'],
                  ['\uD83D\uDCD6', 'Dyslexia-friendly mode'],
                  ['\uD83D\uDC1D', 'Bee mascot guide'],
                ].map(([emoji, text], i) => (
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

              <p className="font-display text-sm text-gray-500 text-center leading-relaxed">
                Five words a day, five days a week &mdash; all 624 covered in six months.
              </p>
            </div>

            {/* Guarantee */}
            <div className="bg-green-50 rounded-2xl p-5 md:p-6 border border-green-200/50 text-center max-w-md mx-auto mb-8">
              <p className="font-display font-extrabold text-base text-green-800 mb-1.5">
                7-day money-back guarantee
              </p>
              <p className="font-display text-sm text-green-700 leading-relaxed">
                Try it for 7 days. If it&rsquo;s not right for your child, just email us
                and we&rsquo;ll refund you in full. No forms. No questions.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/signup"
                className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Spelling Bees &mdash; &pound;19.99
              </Link>

              <div className="flex items-center justify-center gap-4 text-gray-400 text-xs font-display mt-4">
                <span>Secure checkout</span>
                <span>&middot;</span>
                <span>7-day guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FREE WORD LIST ═══════════ */}
      <section>
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center max-w-lg mx-auto">
              <BeeChar size="sm" mood="happy" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mt-3">
                Already got flashcards and apps? Try this first.
              </h2>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                Grab our free printable workbook &mdash; the 50 trickiest 11+ spelling
                words with definitions, hints, and space to practise. See if your child
                can spell them all.
              </p>

              {submitState === 'success' ? (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-display font-bold text-sm">
                    Check your inbox! The word list is on its way.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-display focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={submitState === 'loading'}
                    className="bg-amber-500 text-white font-bold rounded-xl py-3 px-6 font-display text-sm hover:bg-amber-600 transition-colors disabled:opacity-60 shadow-md whitespace-nowrap"
                  >
                    {submitState === 'loading' ? 'Sending...' : 'Send me the list'}
                  </button>
                </form>
              )}

              {submitState === 'error' && (
                <p className="text-red-600 text-xs mt-2 font-display">{errorMsg}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="bg-white/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-5 py-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 text-center mb-8 leading-tight">
              Parents ask&hellip;
            </h2>

            <div className="space-y-2.5 max-w-xl mx-auto">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200/80 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <span className="font-display font-bold text-sm md:text-base text-gray-800 pr-4">
                        {item.question}
                      </span>
                      <span
                        className={`text-amber-400 shrink-0 transition-transform duration-200 text-sm ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        &#9660;
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        className="px-4 md:px-5 pb-4 md:pb-5"
                      >
                        <p className="font-display text-sm md:text-base text-gray-500 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section>
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white drop-shadow-lg mb-4 leading-tight max-w-lg mx-auto">
              Your child can learn every spelling they need for the 11+.
              <br />
              <span className="text-yellow-200">They just need a system that fits your week.</span>
            </h2>

            <p className="font-display text-white/80 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
              5 minutes a day. 624 words. A habit that builds itself.
            </p>

            <Link
              to="/checkout"
              className="inline-block w-full max-w-md py-5 rounded-2xl font-display font-extrabold text-white text-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Spelling Bees &mdash; &pound;19.99 &rarr;
            </Link>

            <p className="text-white/60 font-display text-xs mt-4">
              One-time payment &middot; Whole family &middot; 7-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="pb-8 pt-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-4 text-white/50 text-xs font-display">
          <Link to="/privacy-policy" className="hover:text-white/80 transition-colors">Privacy Policy</Link>
          <span>&middot;</span>
          <Link to="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
          <span>&middot;</span>
          <Link to="/refunds" className="hover:text-white/80 transition-colors">Refund Policy</Link>
        </div>
        <p className="text-white/40 text-xs font-display">
          Same account as AnswerTheQuestion! &middot; Built by Tweenage
        </p>
      </footer>
    </div>
  );
}
