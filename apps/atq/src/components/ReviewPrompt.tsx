import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@atq/shared';
import { supabase } from '@atq/shared/lib/supabase';
import { ProfessorHoot } from './mascot/ProfessorHoot';

interface ReviewPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewPrompt({ isOpen, onClose }: ReviewPromptProps) {
  const parentSession = useAuthStore(s => s.parentSession);
  const userEmail = parentSession?.user?.email ?? '';

  const [rating, setRating] = useState<number>(0);
  const [testimonial, setTestimonial] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [step, setStep] = useState<'rate' | 'positive' | 'negative' | 'done'>('rate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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
      if (e.key === 'Escape') { onClose(); return; }
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
  }, [isOpen, step, onClose]);

  const handleRate = (stars: number) => {
    setRating(stars);
    if (stars >= 4) {
      setStep('positive');
    } else {
      setStep('negative');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('reviews').insert({
        user_email: userEmail,
        rating,
        testimonial: testimonial.trim() || null,
        name: name.trim() || null,
        location: location.trim() || null,
      });
      if (insertError) throw insertError;
      setStep('done');
      setTimeout(onClose, 2500);
    } catch (err) {
      console.warn('Review submission failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Rate your experience"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-card p-6 max-w-sm w-full shadow-xl border border-white/30"
          >
            {step === 'rate' && (
              <div className="text-center">
                <ProfessorHoot mood="happy" size="lg" animate showSpeechBubble={false} />
                <h2 className="font-display font-extrabold text-lg text-gray-800 mt-3 mb-1">
                  How is your child finding AnswerTheQuestion!?
                </h2>
                <p className="font-display text-sm text-gray-500 mb-4">
                  Your feedback helps us improve.
                </p>
                <div className="flex justify-center gap-2 mb-4" role="group" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      className="text-3xl transition-transform hover:scale-125 active:scale-95"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="text-sm text-gray-400 hover:text-gray-600 font-display"
                >
                  Maybe later
                </button>
              </div>
            )}

            {step === 'positive' && (
              <div>
                <div className="text-center mb-4">
                  <p className="text-2xl mb-1">🎉</p>
                  <h2 className="font-display font-bold text-gray-800">
                    That&rsquo;s wonderful to hear!
                  </h2>
                  <p className="font-display text-sm text-gray-500 mt-1">
                    Would you like to share your experience? We&rsquo;d love to feature your story.
                  </p>
                </div>
                <div className="space-y-3">
                  <textarea
                    value={testimonial}
                    onChange={e => setTestimonial(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={3}
                    maxLength={2000}
                    aria-label="Your testimonial"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm font-display focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      maxLength={100}
                      aria-label="Your name"
                      className="px-3 py-2 rounded-lg border-2 border-gray-200 text-sm font-display focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Location (optional)"
                      maxLength={100}
                      aria-label="Your location"
                      className="px-3 py-2 rounded-lg border-2 border-gray-200 text-sm font-display focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs font-display bg-red-50 p-2 rounded-lg">{error}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    onClick={() => { handleSubmit(); }}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 font-display"
                  >
                    Just submit the rating
                  </button>
                </div>
              </div>
            )}

            {step === 'negative' && (
              <div>
                <div className="text-center mb-4">
                  <ProfessorHoot mood="thinking" size="md" animate showSpeechBubble={false} />
                  <h2 className="font-display font-bold text-gray-800 mt-2">
                    What could we do better?
                  </h2>
                  <p className="font-display text-sm text-gray-500 mt-1">
                    Your honest feedback helps us improve.
                  </p>
                </div>
                <div className="space-y-3">
                  <textarea
                    value={testimonial}
                    onChange={e => setTestimonial(e.target.value)}
                    placeholder="Tell us what's not working..."
                    rows={3}
                    maxLength={2000}
                    aria-label="Your feedback"
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm font-display focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    autoFocus
                  />

                  {error && (
                    <p className="text-red-600 text-xs font-display bg-red-50 p-2 rounded-lg">{error}</p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 rounded-button font-display font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Send Feedback'}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 font-display"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {step === 'done' && (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">🙏</p>
                <p className="font-display font-bold text-gray-800">Thank you!</p>
                <p className="font-display text-sm text-gray-500 mt-1">
                  Your feedback means a lot.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
