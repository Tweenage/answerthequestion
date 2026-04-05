import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const parentSession = useAuthStore(s => s.parentSession);
  const userEmail = parentSession?.user?.email ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('feedback').insert({
        user_email: userEmail,
        page: location.pathname,
        message: message.trim(),
      });

      if (insertError) throw insertError;
      setSubmitted(true);
      setMessage('');
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  // Trap focus inside modal when open
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); return; }
      if (e.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-6 z-40 w-10 h-10 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Send feedback"
      >
        <span className="text-lg">💬</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Send feedback"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-card p-5 max-w-sm w-full shadow-xl border border-white/30"
            >
              {submitted ? (
                <div className="text-center py-4">
                  <p className="text-3xl mb-2">🦉</p>
                  <p className="font-display font-bold text-gray-800">Thanks for the feedback!</p>
                  <p className="font-display text-sm text-gray-500 mt-1">We read every message.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-display font-bold text-gray-800 mb-3">
                    💬 Send Feedback
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="feedback-message" className="block text-xs font-display font-semibold text-gray-500 mb-1">
                        What happened?
                      </label>
                      <textarea
                        id="feedback-message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Bug, suggestion, or just saying hello..."
                        rows={3}
                        required
                        maxLength={2000}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm font-display focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-display font-semibold text-gray-500 mb-1">Page</label>
                        <input
                          type="text"
                          value={location.pathname}
                          readOnly
                          className="w-full px-3 py-2 rounded-lg border-2 border-gray-100 text-sm font-display bg-gray-50 text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-display font-semibold text-gray-500 mb-1">Email</label>
                        <input
                          type="text"
                          value={userEmail}
                          readOnly
                          className="w-full px-3 py-2 rounded-lg border-2 border-gray-100 text-sm font-display bg-gray-50 text-gray-400"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-600 text-xs font-display bg-red-50 p-2 rounded-lg">{error}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-2 rounded-button font-display font-bold text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="flex-1 py-2 rounded-button font-display font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
