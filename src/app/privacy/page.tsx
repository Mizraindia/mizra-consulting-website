import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/metadata';
import { ADDRESS_ONE_LINE, COMPANY } from '@/lib/site';

// Approved by the owner's lawyer (October 2026). Change the wording only with new approval.
export const metadata = pageMetadata({
  path: '/privacy',
  title: 'Privacy Policy',
  description: 'How Mizra Consulting collects, uses and protects your personal data.',
});

export default function PrivacyPage() {
  const privacyMail = (
    <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>
  );

  return (
    <LegalPage title="Privacy policy" updated="15 October 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          This website is run by {COMPANY.legalName} (CIN {COMPANY.cin}), registered office{' '}
          {ADDRESS_ONE_LINE}. In this policy, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean{' '}
          {COMPANY.legalName}. For any question about your data, email {privacyMail}.
        </p>
      </section>

      <section>
        <h2>What we collect and why</h2>
        <ul>
          <li>
            <strong>Enquiry form:</strong> your name, email address and message, so we can reply
            to your enquiry.
          </li>
          <li>
            <strong>Master-class sign-up:</strong> your name, email address, the topics you choose
            and your confirmation that you are 18 or older or a parent or guardian, so we can tell
            you when classes open. When paid registration opens, we will also collect what is needed
            to run the class, and this policy will be updated first.
          </li>
          <li>
            <strong>Analytics:</strong> information about how pages are used (for example which
            pages are visited and roughly where visitors come from), so we can improve the site.
            Where the law requires it, analytics only runs if you agree.
          </li>
          <li>
            <strong>Emails you send us:</strong> whatever you choose to include, so we can answer.
          </li>
        </ul>
        <p>We do not sell your personal data.</p>
      </section>

      <section>
        <h2>Tools that process your data</h2>
        <ul>
          <li>Vercel, which hosts this website.</li>
          <li>Google Workspace (email and spreadsheets), where enquiries and sign-ups are stored.</li>
          <li>Google Analytics, for site analytics.</li>
          <li>Cloudflare Turnstile, which may be used to block spam on our forms.</li>
          <li>Razorpay, for payments, once paid classes open.</li>
          <li>Zoom or Google Meet, to run online classes.</li>
        </ul>
        <p>
          Some of these providers store data outside your country, including in the United States.
          They process it on our behalf and under their own security and privacy commitments.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Enquiries are kept in our email system and records for up to two years after our last
          contact with you. Class registration details are kept for twelve months after the class.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the personal data we hold about you, or ask us to
          stop using it. Email {privacyMail} and we will respond within 30 days. Depending on where
          you live, you may have further rights under laws such as the EU and UK GDPR or India&apos;s
          Digital Personal Data Protection Act, including the right to complain to your data
          protection authority.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We use analytics cookies only, and no advertising cookies. Visitors in the European Union,
          the UK and similar regions are asked before any analytics cookie is set, and can change
          their choice at any time with the &ldquo;Cookie settings&rdquo; link in the footer. We also
          use a small cookie that records your region so we know whether to ask.
        </p>
      </section>

      <section>
        <h2>Marketing emails</h2>
        <p>
          We send marketing emails only to people who have asked for them. Every marketing email has
          an unsubscribe link.
        </p>
      </section>

      <section>
        <h2>Students under 18</h2>
        <p>
          Students under 18 may attend master classes, but only a parent or guardian can register
          them. The parent or guardian gives their own contact details and receives every message.
          We collect only the student&apos;s first name, we never send marketing to students, and we
          do not use any tracking aimed at children.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we will update this page and the date at the top.
        </p>
      </section>
    </LegalPage>
  );
}
