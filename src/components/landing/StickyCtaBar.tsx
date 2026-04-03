import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';

export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const pricingEl = document.getElementById('pricing');
        const scrollY = window.scrollY;

        if (pricingEl) {
          const rect = pricingEl.getBoundingClientRect();
          const pricingInView = rect.top < window.innerHeight && rect.bottom > 0;
          setVisible(scrollY > 500 && !pricingInView);
        } else {
          setVisible(scrollY > 500);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl safe-area-bottom"
        >
          <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display font-extrabold text-base text-gray-800">
                &pound;29.99 <span className="font-medium text-gray-400 text-sm">one time</span>
              </p>
              <p className="font-display text-xs text-gray-400">Full programme &middot; Whole family</p>
            </div>
            <Link
              to="/checkout"
              className="shrink-0 px-7 py-3 rounded-xl font-display font-extrabold text-white text-sm bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 hover:from-fuchsia-600 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
