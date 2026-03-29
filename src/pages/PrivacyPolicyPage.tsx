import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

export function PrivacyPolicyPage() {
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
          <h1 className="font-display text-2xl font-bold text-gray-800">Privacy Policy</h1>
          <p className="text-sm text-gray-500 font-display mt-1">Last updated: 10 March 2026</p>
        </div>

        <Section title="1. Who We Are">
          <p>
            Answer The Question ("we", "us", "our") is a UK-based company that provides an online
            11+ exam technique training application ("the App"). If you have any questions about
            this policy or your data, contact us at{' '}
            <a href="mailto:hello@answerthequestion.co.uk" className="text-purple-600 underline">
              hello@answerthequestion.co.uk
            </a>.
          </p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>We collect the minimum data needed to provide the service:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
            <li><strong>Parent account:</strong> email address and hashed password (via Supabase Auth)</li>
            <li><strong>Child profile:</strong> first name and avatar preference only — no surname, date of birth, or school</li>
            <li><strong>Practice data:</strong> question responses, technique scores, timestamps, streak counts, and badge progress</li>
            <li><strong>Payment data:</strong> processed securely by Stripe — we never see or store your card details</li>
          </ul>
        </Section>

        <Section title="3. Why We Collect It (Legal Basis)">
          <p>Under the UK GDPR, we rely on:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
            <li><strong>Consent:</strong> you actively agree to this policy and our Terms of Service when creating an account</li>
            <li><strong>Legitimate interest:</strong> to deliver the service, improve the App, and prevent misuse</li>
            <li><strong>Contract:</strong> to fulfil the service you have purchased or are trialling</li>
          </ul>
        </Section>

        <Section title="4. Children's Data">
          <p>
            The App is designed for children aged 9–11 preparing for the 11+ exam. A parent or
            guardian must create the account. We collect only the child's first name and practice
            session data. We do not collect email addresses, dates of birth, or any other personal
            data from children. All data is managed under the parent's account and parental consent.
          </p>
        </Section>

        <Section title="5. How We Store Your Data">
          <p>
            Data is stored securely in Supabase, which uses PostgreSQL databases hosted within the
            EU (Frankfurt, Germany). All data is encrypted in transit (TLS) and at rest.
            Row-level security (RLS) ensures each parent can only access their own family's data.
          </p>
        </Section>

        <Section title="6. Who We Share Data With">
          <p>We do not sell, rent, or trade your data. We share data only with:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
            <li><strong>Supabase:</strong> our data processor, for hosting and authentication</li>
            <li><strong>Stripe:</strong> for payment processing (they have their own privacy policy)</li>
          </ul>
          <p className="mt-2">No data is transferred outside the EU/UK unless required by these processors under appropriate safeguards.</p>
        </Section>

        <Section title="7. Cookies & Tracking">
          <p>
            We use only essential cookies required for authentication (Supabase session token).
            We do not use any analytics, advertising, or tracking cookies. We do not use
            Google Analytics or any third-party tracking tools.
          </p>
        </Section>

        <Section title="8. How Long We Keep Data">
          <p>
            We keep your data for as long as your account is active. If you delete your account,
            all associated data (parent account, child profiles, practice data) will be permanently
            removed within 30 days. You can request deletion at any time by emailing us.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
            <li><strong>Access:</strong> request a copy of your personal data</li>
            <li><strong>Rectification:</strong> correct any inaccurate data</li>
            <li><strong>Erasure:</strong> request deletion of your data ("right to be forgotten")</li>
            <li><strong>Portability:</strong> receive your data in a machine-readable format</li>
            <li><strong>Object:</strong> object to processing based on legitimate interest</li>
            <li><strong>Withdraw consent:</strong> withdraw consent at any time</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@answerthequestion.co.uk" className="text-purple-600 underline">
              hello@answerthequestion.co.uk
            </a>.
            We will respond within 30 days.
          </p>
        </Section>

        <Section title="10. Complaints">
          <p>
            If you are not satisfied with how we handle your data, you have the right to lodge a
            complaint with the Information Commissioner's Office (ICO):{' '}
            <a href="https://ico.org.uk" className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this policy from time to time. If we make significant changes, we will
            notify you by email. The "last updated" date at the top of this page will always
            reflect the most recent version.
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
