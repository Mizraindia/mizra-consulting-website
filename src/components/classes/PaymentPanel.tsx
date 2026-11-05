import Link from 'next/link';
import PayButton from './PayButton';
import { formatInr } from '@/lib/money';
import { COMPANY } from '@/lib/site';

// Shown on a class page instead of the registration form when the class is paid on an
// outside Razorpay payment page. Plain facts only: no Razorpay logo, no certifications.
export default function PaymentPanel({
  classTitle,
  priceInr,
  paymentLink,
}: {
  classTitle: string;
  priceInr: number;
  paymentLink: string;
}) {
  return (
    <div>
      <p className="mb-1 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-mz-accent">Register for</p>
      <h2 className="mb-2 font-display text-2xl font-semibold leading-tight">{classTitle}</h2>
      <p className="mb-5 text-mz-body">
        {formatInr(priceInr)} per student · Seats are limited
      </p>
      <PayButton href={paymentLink} priceInr={priceInr} classTitle={classTitle} />

      <h3 className="mb-3 mt-7 font-sans text-base font-semibold text-mz-ink">Before you pay</h3>
      <ul className="space-y-2.5 text-[15px] text-mz-body">
        <li>You will be taken to Razorpay&apos;s secure payment page.</li>
        <li>We do not see or store your card details.</li>
        <li>Full refund until 24 hours before the class. After that, a place in the next class.</li>
        <li>After you pay, the joining link is shown on the confirmation page.</li>
        <li>
          Questions? Email{' '}
          <a href={`mailto:${COMPANY.email}`} className="font-semibold text-mz-ink underline">
            {COMPANY.email}
          </a>{' '}
          or WhatsApp{' '}
          <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-mz-ink underline">
            {COMPANY.whatsappDisplay}
          </a>
          .
        </li>
      </ul>
      <p className="mt-5 text-[13px] text-mz-muted">
        Read our{' '}
        <Link href="/terms" className="underline">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy policy
        </Link>
        , and how{' '}
        <Link href="/refund-and-cancellation" className="underline">
          refunds and cancellations
        </Link>{' '}
        and{' '}
        <Link href="/shipping-and-delivery" className="underline">
          class delivery
        </Link>{' '}
        work.
      </p>
    </div>
  );
}
