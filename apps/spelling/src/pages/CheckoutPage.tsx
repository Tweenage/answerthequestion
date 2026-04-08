import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BeeChar } from '../components/mascot/BeeChar';
import { supabase } from '@atq/shared/lib/supabase';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const handleCheckout = async () => {
    // Guest checkout requires email
    if (!isLoggedIn && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-spelling-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            successUrl: `${window.location.origin}/payment-success`,
            cancelUrl: `${window.location.origin}/checkout`,
            discountCode: discountCode.trim() || undefined,
            ...(!token && email.trim() ? { email: email.trim() } : {}),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create checkout');
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8">
      <BeeChar
        mood="encouraging"
        size="lg"
        message="Unlock all 500+ words for just £19.99!"
        showSpeechBubble
        animate
      />

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-white/90 rounded-xl p-6 border-2 border-amber-300 text-center">
          <p className="text-4xl font-bold text-amber-600">£19.99</p>
          <p className="text-sm text-slate-500 mt-1">One-time payment</p>
        </div>

        <div className="space-y-3">
          <div className="bg-white/80 rounded-xl p-4 space-y-2 border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">What you get:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>✅ 500+ words (statutory + 11+ vocabulary)</li>
              <li>✅ Full Spelling Bee ritual</li>
              <li>✅ Drill & test modes</li>
              <li>✅ Bingo grid progress tracking</li>
              <li>✅ Lifetime access — no subscription</li>
            </ul>
          </div>

          {!isLoggedIn && (
            <div>
              <label className="text-sm text-slate-600 block mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm bg-white/90 focus:border-amber-500 focus:outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">You'll create your account after payment</p>
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600 block mb-1">Discount code</label>
            <input
              type="text"
              value={discountCode}
              onChange={e => setDiscountCode(e.target.value)}
              placeholder="Enter code"
              className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm bg-white/90 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? 'Creating checkout...' : 'Pay Now 🐝'}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 text-sm text-slate-500 underline"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
