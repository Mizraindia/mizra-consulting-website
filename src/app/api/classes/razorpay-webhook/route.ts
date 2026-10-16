import { NextRequest, NextResponse } from 'next/server';
import { markPaidWithScript } from '@/lib/classes';
import { tokenFromReference, verifyWebhookSignature } from '@/lib/razorpay';

// Razorpay payment notifications for master classes. In Razorpay, point the webhook at
// https://<site>/api/classes/razorpay-webhook with the "payment_link.paid" event.
// Every request must carry a valid X-Razorpay-Signature for its exact raw body, or it is
// rejected and nothing is written. Repeats are harmless: the script keys on the payment ID.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get('x-razorpay-signature'))) {
    console.warn('Rejected a Razorpay webhook with a missing or invalid signature');
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment_link?: { entity?: { reference_id?: string } };
      payment?: { entity?: { id?: string; amount?: number; currency?: string; status?: string } };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid body' }, { status: 400 });
  }

  // Other events are acknowledged and ignored.
  if (event.event !== 'payment_link.paid') return NextResponse.json({ ok: true, ignored: true });

  const reference = event.payload?.payment_link?.entity?.reference_id ?? '';
  const payment = event.payload?.payment?.entity;
  if (!reference || !payment?.id) return NextResponse.json({ ok: true, ignored: true });

  const result = await markPaidWithScript({
    token: tokenFromReference(reference),
    paymentId: payment.id,
    amountCents: Number(payment.amount),
    currency: String(payment.currency ?? ''),
  });

  if (result.ok) return NextResponse.json({ ok: true, status: result.status });
  if (result.error === 'not_found' || result.error === 'invalid') {
    // Not one of ours (for example a payment link created by hand): nothing to retry.
    console.warn(`Razorpay webhook for unknown registration: ${result.error}`);
    return NextResponse.json({ ok: true, ignored: true });
  }
  // Script busy or unreachable: answer with an error so Razorpay retries later.
  console.error(`Payment NOT recorded yet (${payment.id}): ${result.error}`);
  return NextResponse.json({ ok: false, error: 'retry' }, { status: 503 });
}
