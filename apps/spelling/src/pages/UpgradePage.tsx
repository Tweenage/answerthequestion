import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { BeeChar } from '../components/mascot/BeeChar';
import { FREE_WORDS, SPELLING_WORDS } from '../data/words';

export default function UpgradePage() {
  const navigate = useNavigate();

  const features = [
    { free: `${FREE_WORDS.length} sample words`, paid: `${SPELLING_WORDS.length}+ words` },
    { free: 'Year 3/4 & 5/6 samples', paid: 'Full statutory + 11+ vocabulary' },
    { free: 'All features included', paid: 'All features included' },
    { free: 'Spelling Bee ritual', paid: 'Spelling Bee ritual' },
    { free: 'Bingo grid progress', paid: 'Bingo grid progress' },
  ];

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <BeeChar
        mood="encouraging"
        size="lg"
        message="Unlock the full word bank and supercharge your spelling!"
        showSpeechBubble
        animate
      />

      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-display font-bold text-slate-800 text-center">
          Upgrade to Full Access
        </h2>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 rounded-xl p-6 border-2 border-amber-300 text-center"
        >
          <p className="text-4xl font-bold text-amber-600">£19.99</p>
          <p className="text-sm text-slate-500 mt-1">One-time payment • No subscription</p>
        </motion.div>

        {/* Feature comparison */}
        <div className="bg-white/80 rounded-xl overflow-hidden border border-slate-200">
          <div className="grid grid-cols-3 text-xs font-semibold text-slate-500 px-3 py-2 bg-slate-50">
            <span></span>
            <span className="text-center">Free</span>
            <span className="text-center text-amber-600">Full</span>
          </div>
          {features.map((f, i) => (
            <div key={i} className="grid grid-cols-3 text-xs px-3 py-2 border-t border-slate-100">
              <span className="text-slate-600">{f.free === f.paid ? f.free : ''}</span>
              <span className="text-center text-slate-500">{f.free}</span>
              <span className="text-center text-amber-700 font-medium">{f.paid}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          Get Full Access 🐝
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-2 text-sm text-slate-500 underline"
        >
          Continue with free words
        </button>
      </div>
    </div>
  );
}
