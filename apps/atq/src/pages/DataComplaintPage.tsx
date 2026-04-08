import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@atq/shared';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function DataComplaintPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'submitting') return;

    setState('submitting');

    try {
      const { error } = await supabase
        .from('data_complaints')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          description: description.trim(),
        });

      if (error) throw error;
      setState('success');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="space-y-6 py-2 pb-24 lg:pb-6">
      <div className="flex items-center gap-2">
        <Link
          to="/privacy-policy"
          className="text-sm text-purple-500 font-display font-semibold flex items-center gap-1 hover:text-purple-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Privacy Policy
        </Link>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-sm border border-white/30 space-y-6 max-w-lg mx-auto">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">
            Data Protection Complaint
          </h1>
          <p className="text-sm text-gray-500 font-display mt-1">
            If you are not satisfied with how we handle your personal data, you can
            submit a complaint using this form. We will acknowledge your complaint
            within 30 days.
          </p>
        </div>

        {state === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-2">
            <p className="font-display font-bold text-green-800 text-base">
              Complaint received
            </p>
            <p className="text-sm text-green-700 font-display">
              We will acknowledge your complaint within 30 days and contact you
              at the email address you provided.
            </p>
            <p className="text-xs text-gray-500 font-display mt-3">
              You also have the right to lodge a complaint with the{' '}
              <a
                href="https://ico.org.uk"
                className="text-purple-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Information Commissioner's Office (ICO)
              </a>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display font-bold text-sm text-gray-700 mb-1">
                Your name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-display text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block font-display font-bold text-sm text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-display text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block font-display font-bold text-sm text-gray-700 mb-1">
                Describe your complaint
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the data protection issue you would like us to address..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-display text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
              />
            </div>

            {state === 'error' && (
              <p className="text-red-600 font-display text-sm">
                Something went wrong. Please try again or email us directly at{' '}
                <a href="mailto:hello@answerthequestion.co.uk" className="underline">
                  hello@answerthequestion.co.uk
                </a>.
              </p>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              className="w-full py-3 rounded-xl font-display font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === 'submitting' ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
