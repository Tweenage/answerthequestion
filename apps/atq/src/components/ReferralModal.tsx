import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentUser } from '@atq/shared';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const currentUser = useCurrentUser();
  const [copied, setCopied] = useState(false);

  const code = currentUser?.referralCode ?? '';
  const shareUrl = `https://answerthequestion.co.uk?ref=${code}`;
  const shareMessage = `Root for your child's best friend too. Share AnswerTheQuestion! — because the best outcome is they both get in. ${shareUrl}`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AnswerTheQuestion!',
          text: shareMessage,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy(shareMessage);
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-card p-6 max-w-sm w-full shadow-xl border border-white/30"
          >
            <div className="text-center mb-4">
              <p className="text-3xl mb-2">🤝</p>
              <h2 className="font-display font-extrabold text-lg text-gray-800">
                Refer a Friend
              </h2>
              <p className="font-display text-sm text-gray-500 mt-1">
                The best outcome is they both get in.
              </p>
            </div>

            {/* Share message */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
              <p className="font-display text-xs text-gray-600 leading-relaxed">
                {shareMessage}
              </p>
            </div>

            {/* Your code */}
            <div className="text-center mb-4">
              <p className="font-display text-xs text-gray-400 uppercase tracking-wide mb-1">Your referral code</p>
              <p className="font-display font-extrabold text-xl text-purple-600 tracking-widest">{code}</p>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleNativeShare}
                className="w-full py-3 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-md"
              >
                {'share' in navigator ? 'Share with a Friend' : 'Copy Share Message'}
              </button>

              <button
                onClick={() => handleCopy(shareUrl)}
                className="w-full py-3 rounded-button font-display font-bold text-purple-600 border-2 border-purple-200 hover:bg-purple-50 transition-all"
              >
                {copied ? 'Copied! ✓' : 'Copy Link'}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-center text-sm text-gray-400 hover:text-gray-600 font-display"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
