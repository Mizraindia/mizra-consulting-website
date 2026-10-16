import Link from 'next/link';
import { CONTACT_EMAIL } from '@/components/LeadFormParts';
import { markPaidWithScript } from '@/lib/classes';
import { fetchPayment, tokenFromReference, verifyCallbackSignature } from '@/lib/razorpay';

// Where Razorpay sends the visitor after paying. The details in the address are trusted only
// if Razorpay's signature checks out; the amount is then confirmed with Razorpay itself.
// Recording the payment here as well as in the webhook means the visitor is confirmed even
// if the webhook is delayed; the script ignores the second report of the same payment.
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Payment', robots: { index: false, follow: false } };

type Search = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

async function outcome(params: Record<string, string | string[] | undefined>) {
  const linkId = one(params.razorpay_payment_link_id);
  const referenceId = one(params.razorpay_payment_link_reference_id);
  const status = one(params.razorpay_payment_link_status);
  const paymentId = one(params.razorpay_payment_id);
  const signature = one(params.razorpay_signature);

  if (!verifyCallbackSignature({ linkId, referenceId, status, paymentId, signature })) return 'unverified';
  if (status !== 'paid') return 'not_paid';

  const payment = await fetchPayment(paymentId);
  if (!payment || !['captured', 'authorized'].includes(payment.status)) return 'pending';

  const result = await markPaidWithScript({
    token: tokenFromReference(referenceId),
    paymentId,
    amountCents: payment.amount,
    currency: payment.currency,
  });
  if (!result.ok) return 'pending';
  return result.status === 'paid' ? (result.emailed === false && !result.repeat ? 'paid_no_email' : 'paid') : 'check';
}

const MESSAGES: Record<string, { title: string; text: string }> = {
  paid: {
    title: 'Payment received. You are registered.',
    text: 'We have emailed your join link and a calendar invite. Please check your inbox, and your spam folder just in case.',
  },
  paid_no_email: {
    title: 'Payment received. You are registered.',
    text: 'We could not send your confirmation email just now. We will email your join link shortly.',
  },
  check: {
    title: 'Payment received.',
    text: 'We need to check one detail before confirming your place. We will email you within 4 business hours (Monday to Friday, India time).',
  },
  pending: {
    title: 'We are confirming your payment.',
    text: 'This can take a few minutes. You will receive a confirmation email with your join link as soon as it is confirmed.',
  },
  not_paid: {
    title: 'Payment not completed.',
    text: 'No money was taken. Your seat is held for 30 minutes from when you registered; go back to the class page and register again to pay.',
  },
  unverified: {
    title: 'We could not confirm this payment.',
    text: `If money was taken, email us at ${CONTACT_EMAIL} with your payment ID and we will sort it out.`,
  },
};

export default async function PaymentCompletePage({ searchParams }: { searchParams: Search }) {
  const message = MESSAGES[await outcome(await searchParams)];
  return (
    <section className="bg-mz-cream py-20 text-mz-ink sm:py-28">
      <div className="mx-auto max-w-[680px] px-4 sm:px-8" role="status">
        <h1 className="font-display mb-4 text-[32px] font-semibold leading-tight sm:text-[40px]">{message.title}</h1>
        <p className="mb-8 text-[18px] text-mz-body">{message.text}</p>
        <Link
          href="/student-portal"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-mz-accent px-6 font-semibold text-white hover:bg-mz-deep"
        >
          Back to master classes
        </Link>
      </div>
    </section>
  );
}
