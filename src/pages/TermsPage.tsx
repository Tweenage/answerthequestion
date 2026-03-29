import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function TermsPage() {
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
          <h1 className="font-display text-2xl font-bold text-gray-800">Terms of Service</h1>
          <p className="text-sm text-gray-500 font-display mt-1">Last updated: 10 March 2026</p>
        </div>

        <Section title="1. About the Service">
          <p>
            Answer The Question ("the App") is a 12-week online training programme designed to
            help children aged 9–11 develop exam technique skills for the 11+ entrance examination.
            The App provides daily practice questions, guided technique coaching, visualisation
            exercises, and progress tracking.
          </p>
        </Section>

        <Section title="2. Eligibility & Account Creation">
          <p>
            A parent or legal guardian ("Parent") must create the account. By creating an account,
            you confirm that you are at least 18 years old and are the parent or legal guardian of
            the child who will use the App. Children must use the App under parental supervision.
            Each account is for one family's personal use only.
          </p>
        </Section>

        <Section title="3. Acceptable Use">
          <p>You agree to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
            <li>Use the App for personal, non-commercial, family purposes only</li>
            <li>Not share your account credentials with anyone outside your household</li>
            <li>Not copy, reproduce, distribute, or scrape any content from the App</li>
            <li>Not attempt to reverse-engineer, decompile, or hack the App</li>
            <li>Not use the App in any way that is unlawful or harmful</li>
          </ul>
        </Section>

        <Section title="4. Payments & Access">
          <p>
            Week 1 of the programme is available free of charge with no payment required. To access
            Weeks 2–12 and all premium features, a one-time payment of £19.99 is required.
            Payment is processed securely by Stripe. Upon successful payment, full access is granted
            immediately and does not expire. See our{' '}
            <Link to="/refunds" className="text-purple-600 underline">Refund Policy</Link>{' '}
            for details on refunds.
          </p>
        </Section>

        <Section title="5. No Guarantee of Results">
          <p>
            The App is an educational tool designed to improve exam technique. We do not guarantee
            any specific exam results, scores, or school placements. Performance in examinations
            depends on many factors beyond the scope of this App, including the child's existing
            knowledge, the specific exam format, and conditions on the day. The App complements —
            but does not replace — broader exam preparation.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content in the App — including questions, explanations, illustrations, code, design,
            and branding — is owned by Answer The Question and protected by copyright and
            intellectual property laws. You may not reproduce, distribute, or create derivative
            works from any part of the App without our written permission.
          </p>
        </Section>

        <Section title="7. Account Suspension & Termination">
          <p>
            We reserve the right to suspend or terminate your account if you breach these Terms,
            including but not limited to: sharing account access, scraping content, or using the
            App for any unlawful purpose. We will notify you by email before taking action, except
            in cases of serious or immediate breach.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Answer The Question shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages arising from
            your use of the App. Our total liability shall not exceed the amount you have paid
            for the service.
          </p>
        </Section>

        <Section title="9. Changes to These Terms">
          <p>
            We may update these Terms from time to time. If we make significant changes, we will
            notify you by email. Continued use of the App after changes constitutes acceptance
            of the updated Terms.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of England and
            Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of
            England and Wales.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:hello@answerthequestion.co.uk" className="text-purple-600 underline">
              hello@answerthequestion.co.uk
            </a>.
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
