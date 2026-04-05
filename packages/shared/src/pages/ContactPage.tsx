import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactPage() {
  return (
    <motion.div
      className="space-y-6 py-2 pb-24 lg:pb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-sm text-purple-500 font-display font-semibold flex items-center gap-1 hover:text-purple-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-sm border border-white/30 space-y-6 text-center">
        <div>
          <span className="text-5xl">🦉</span>
          <h1 className="font-display text-2xl font-bold text-gray-800 mt-3">Get in Touch</h1>
        </div>

        <p className="font-display text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          We&rsquo;d love to hear from you! Whether you have a question about the programme, need
          help with your account, or just want to say hello &mdash; drop us a line.
        </p>

        <div className="py-4">
          <a
            href="mailto:hello@answerthequestion.co.uk"
            className="inline-block bg-purple-600 text-white font-display font-bold text-base px-6 py-3 rounded-full shadow hover:bg-purple-700 transition-colors"
          >
            hello@answerthequestion.co.uk
          </a>
        </div>

        <p className="font-display text-sm text-gray-500">
          We aim to reply within 24 hours.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="font-display text-sm text-purple-500 font-semibold hover:text-purple-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
