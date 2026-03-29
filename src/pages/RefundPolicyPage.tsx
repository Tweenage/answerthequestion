import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function RefundPolicyPage() {
  return (
    <div className="space-y-6 py-2 pb-24 lg:pb-6">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-sm text-purple-500 font-display font-semibold flex items-center gap-1 hover:text-purple-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-card p-6 shadow-sm border border-white/30 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800">Refund Policy</h1>
          <p className="text-sm text-gray-500 font-display mt-1">Last updated: 10 March 2026</p>
        </div>

        <Section title="7-Day Money-Back Guarantee">
          <p>
            We want you to feel confident in your purchase. If you are not satisfied with
            Answer The Question for any reason, you may request a full refund within{' '}
            <strong>7 days</strong> of your purchase date — no questions asked.
          </p>
        </Section>

        <Section title="After 7 Days">
          <p>
            After 7 days from the date of purchase, we are unable to offer a refund as the
            programme content will have been accessed. We encourage you to make full use of
            the free Week 1 trial before purchasing to make sure the App is right for your child.
          </p>
        </Section>

        <Section title="How to Request a Refund">
          <p>
            To request a refund, simply email us at{' '}
            <a href="mailto:hello@answerthequestion.co.uk" className="text-purple-600 underline">
              hello@answerthequestion.co.uk
            </a>{' '}
            with the email address associated with your account. Please include "Refund Request"
            in the subject line.
          </p>
        </Section>

        <Section title="Processing Time">
          <p>
            Refunds are processed to your original payment method. Please allow 5–10 business
            days for the refund to appear in your account, depending on your bank or card provider.
          </p>
        </Section>

        <Section title="Questions?">
          <p>
            If you have any questions about our refund policy, please don't hesitate to contact us
            at{' '}
            <a href="mailto:hello@answerthequestion.co.uk" className="text-purple-600 underline">
              hello@answerthequestion.co.uk
            </a>.
            We're happy to help.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display font-bold text-lg text-gray-800 mb-2">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed font-display space-y-2">{children}</div>
    </div>
  );
}
