import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { BeeChar } from '../components/mascot/BeeChar';
import { supabase } from '@atq/shared/lib/supabase';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [claiming, setClaiming] = useState(true);
  const [, setClaimed] = useState(false);

  useEffect(() => {
    const claimPayment = async () => {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        if (!token) {
          setClaiming(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claim-spelling-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          setClaimed(true);
        }
      } catch {
        // Non-critical — payment will be claimed on next login
      } finally {
        setClaiming(false);
      }
    };

    if (searchParams.get('ls') === '1') {
      claimPayment();
    } else {
      setClaiming(false);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
      <BeeChar
        mood="celebrating"
        size="xl"
        message={claiming ? 'Setting up your account...' : 'Welcome to the full Spelling Bee! 🎉'}
        showSpeechBubble
        animate
      />

      {!claiming && (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-slate-800">Payment Successful!</h2>
            <p className="text-sm text-slate-500 mt-2">
              You now have access to all 624 words.
            </p>
          </div>

          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 rounded-xl bg-amber-500 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Start Spelling! 🐝
          </button>
        </>
      )}
    </div>
  );
}
