import { motion, AnimatePresence } from 'framer-motion';

interface BumpUpsellProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function BumpUpsell({ isOpen, onAccept, onDecline }: BumpUpsellProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-card p-6 max-w-sm w-full shadow-xl border border-white/30"
          >
            <div className="text-center mb-4">
              <p className="text-3xl mb-2">📋</p>
              <h2 className="font-display font-extrabold text-lg text-gray-800">
                One last thing &mdash; are you sure?
              </h2>
            </div>

            <p className="font-display text-sm text-gray-600 leading-relaxed text-center mb-5">
              When the screens are off and the pen is in hand, make sure the principles are still close. Add the <strong>CLEAR Method Crib Sheet</strong> for just <strong>&pound;4.99</strong>.
            </p>

            <div className="space-y-2">
              <button
                onClick={onAccept}
                className="w-full py-3 rounded-button font-display font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-600 transition-all shadow-md"
              >
                Yes, add it &mdash; &pound;4.99
              </button>
              <button
                onClick={onDecline}
                className="w-full py-3 rounded-button font-display font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                No thanks, continue to payment
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
