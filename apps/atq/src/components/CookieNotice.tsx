import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Minimal cookie notice — not a consent gate.
 *
 * Under the DUAA 2025, analytics cookies used purely for statistical purposes
 * are exempt from the prior-consent requirement. This notice informs the user
 * and lets them dismiss it. No dark patterns: there's one button that says
 * "Got it" and a link to the privacy policy.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('atq-cookie-notice-dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('atq-cookie-notice-dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">🍪</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700 font-display leading-relaxed">
                We use essential cookies for authentication and analytics cookies for
                statistical purposes only.{' '}
                <a
                  href="/privacy-policy"
                  className="text-purple-600 underline hover:text-purple-800"
                >
                  Privacy policy
                </a>
              </p>
              <button
                onClick={dismiss}
                className="mt-2 px-4 py-1.5 rounded-lg font-display font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
