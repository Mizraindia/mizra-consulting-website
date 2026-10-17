import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited, passesBotCheck } from '@/lib/leads';
import { createPaymentLink, referenceFor } from '@/lib/razorpay';
import { CONSENT_TEXT, CONSENT_VERSION } from '@/lib/class-consent';
import {
  checkRegistration,
  getClass,
  isRegistrationOpen,
  paymentsReady,
  registerWithScript,
} from '@/lib/classes';

const MIN_FILL_TIME_MS = 2500;

// Registers a visitor for a master class. Answers { ok: true, status } only after the
// classes script has saved the registration.
export async function POST(request: NextRequest) {
  if (!isRegistrationOpen()) {
    return NextResponse.json({ ok: false, error: 'closed' }, { status: 403 });
  }

  const ip =
    request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (ip !== 'unknown' && isRateLimited(ip, 'classes')) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid', fields: {} }, { status: 400 });
  }

  // Bots: the hidden field is filled, or the form was sent impossibly fast. Save nothing.
  const startedAt = Number(body.startedAt);
  const tooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS;
  if ((typeof body.company_website === 'string' && body.company_website.trim() !== '') || tooFast) {
    return NextResponse.json({ ok: true, status: 'registered' });
  }

  const check = checkRegistration(body);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: 'invalid', fields: check.fields }, { status: 400 });
  }
  if (!(await passesBotCheck(body.botCheckToken, ip))) {
    return NextResponse.json({ ok: false, error: 'bot_check' }, { status: 400 });
  }

  const cls = await getClass(check.registration.classId);
  if (cls === null) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  if (cls === undefined) return NextResponse.json({ ok: false, error: 'closed' }, { status: 404 });
  if (cls.priceUsd > 0 && !paymentsReady()) {
    return NextResponse.json({ ok: false, error: 'payments_unavailable' }, { status: 409 });
  }

  const reply = await registerWithScript({
    ...check.registration,
    consent: true,
    consentAt: new Date().toISOString(),
    consentText: `${CONSENT_VERSION}: ${CONSENT_TEXT}`,
    source: text(body.source, 200),
  });

  if (reply.ok && (reply.status === 'registered' || reply.status === 'waitlisted')) {
    return NextResponse.json({ ok: true, status: reply.status, emailed: reply.emailed !== false });
  }
  if (reply.ok && reply.status === 'awaiting_payment') {
    // The seat is held for 30 minutes. Send the visitor to Razorpay's secure payment page.
    const link = await createPaymentLink({
      amountCents: reply.amountCents,
      referenceId: referenceFor(reply.token),
      description: `Mizra master class: ${reply.title}`,
      name: check.registration.name,
      email: check.registration.email,
      callbackUrl: `${new URL(request.url).origin}/student-portal/payment-complete`,
      classId: check.registration.classId,
    });
    if (!link) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
    return NextResponse.json({ ok: true, status: 'awaiting_payment', paymentUrl: link.shortUrl });
  }

  const statusCode: Record<string, number> = {
    duplicate: 409,
    full: 409,
    closed: 404,
    not_found: 404,
    busy: 503,
    invalid: 400,
  };
  if (reply.ok) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  if (reply.error === 'unavailable' || !(reply.error in statusCode)) {
    console.error(`Class registration NOT saved: ${reply.error}`);
  }
  return NextResponse.json(
    { ok: false, error: reply.error in statusCode ? reply.error : 'unavailable' },
    { status: statusCode[reply.error] ?? 503 },
  );
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
