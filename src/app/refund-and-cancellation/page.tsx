import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/metadata';
import { COMPANY } from '@/lib/site';

// DRAFT (5 November 2026), written from the owner's refund rule. Kept out of search results
// (noindex) and the sitemap until the owner confirms a lawyer has approved it.
export const metadata = pageMetadata({
  path: '/refund-and-cancellation',
  title: 'Refund and Cancellation Policy',
  description: 'How to cancel a Mizra Consulting master class and when you get a refund.',
  noindex: true,
});

export default function RefundPage() {
  const email = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
  const whatsapp = (
    <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer">
      {COMPANY.whatsappDisplay}
    </a>
  );

  return (
    <LegalPage title="Refund and cancellation policy" updated="5 November 2026" draft>
      <p>
        This policy applies to master classes booked with {COMPANY.legalName} (&ldquo;we&rdquo;). It
        explains how to cancel a place and when you get your money back.
      </p>

      <section>
        <h2>Free classes</h2>
        <p>
          Free classes cost nothing, so there is nothing to refund. If you can no longer attend, please
          cancel your place with the cancel link in your email, so someone on the waiting list can have it.
        </p>
      </section>

      <section>
        <h2>Paid classes: the refund rule</h2>
        <ul>
          <li>Full refund until 24 hours before the class starts.</li>
          <li>After that, a place in the next class instead of a refund.</li>
        </ul>
      </section>

      <section>
        <h2>How to cancel and ask for a refund</h2>
        <p>
          Email {email} or send a WhatsApp message to {whatsapp} with your name, the class, and the payment
          ID from your payment confirmation. If you registered through our website, you can also use the
          cancel link in your email.
        </p>
        <p>
          The time we receive your message decides which part of the refund rule applies.
        </p>
      </section>

      <section>
        <h2>How refunds are paid</h2>
        <p>
          Payments are taken by Razorpay. Refunds go back to the card, UPI account or other method you paid
          with. Razorpay and your bank usually take 5 to 7 working days to show the refund.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Email {email} or WhatsApp {whatsapp}. See also our{' '}
          <Link href="/shipping-and-delivery">shipping and delivery policy</Link>,{' '}
          <Link href="/terms">terms</Link> and <Link href="/privacy">privacy policy</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
