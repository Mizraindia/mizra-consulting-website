import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/metadata';
import { COMPANY } from '@/lib/site';

// DRAFT (5 November 2026), written from the owner's description of how classes are delivered.
// Kept out of search results (noindex) and the sitemap until the owner confirms a lawyer has
// approved it.
export const metadata = pageMetadata({
  path: '/shipping-and-delivery',
  title: 'Shipping and Delivery Policy',
  description: 'How Mizra Consulting master classes are delivered online on Google Meet.',
  noindex: true,
});

export default function ShippingPage() {
  const email = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
  const whatsapp = (
    <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer">
      {COMPANY.whatsappDisplay}
    </a>
  );

  return (
    <LegalPage title="Shipping and delivery policy" updated="5 November 2026" draft>
      <p>
        {COMPANY.legalName} (&ldquo;we&rdquo;) does not ship physical goods. Our master classes are live and
        online, so nothing is posted or couriered to you.
      </p>

      <section>
        <h2>How classes are delivered</h2>
        <p>Every class takes place live on Google Meet at the date and time shown on the class page.</p>
      </section>

      <section>
        <h2>How you get the joining link</h2>
        <ul>
          <li>After you pay, the joining link is shown on the confirmation page.</li>
          <li>When you register through our website, the joining link is emailed to you.</li>
        </ul>
        <p>Please keep the joining link to yourself.</p>
      </section>

      <section>
        <h2>If you do not have the joining link</h2>
        <p>
          Check your spam or promotions folder first. If it is not there, email {email} or send a WhatsApp
          message to {whatsapp} with your name and the class, and we will send it to you.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          See also our <Link href="/refund-and-cancellation">refund and cancellation policy</Link>,{' '}
          <Link href="/terms">terms</Link> and <Link href="/privacy">privacy policy</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
