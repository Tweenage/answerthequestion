import { Link } from 'react-router';

export function LandingFooter() {
  return (
    <footer className="max-w-3xl mx-auto px-5 py-10 text-center">
      <div className="flex items-center justify-center gap-4 text-sm text-white/70 font-display font-medium flex-wrap">
        <Link to="/privacy-policy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
        <span className="text-white/25">|</span>
        <Link to="/terms" className="hover:text-white transition-colors">
          Terms
        </Link>
        <span className="text-white/25">|</span>
        <Link to="/refunds" className="hover:text-white transition-colors">
          Refund Policy
        </Link>
        <span className="text-white/25">|</span>
        <Link to="/research" className="hover:text-white transition-colors">
          Why It Works
        </Link>
        <span className="text-white/25">|</span>
        <Link to="/contact" className="hover:text-white transition-colors">
          Contact
        </Link>
        <span className="text-white/25">|</span>
        <Link to="/login" className="hover:text-white transition-colors">
          Sign In
        </Link>
      </div>
      <p className="text-white/50 font-display text-xs mt-5">
        Made with 🦉 by a working mum
      </p>
    </footer>
  );
}
