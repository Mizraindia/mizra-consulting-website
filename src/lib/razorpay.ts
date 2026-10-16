// Server side only: Razorpay Payment Links for paid master classes.
// Settings live in Vercel (test keys for Preview, live keys for Production):
//   RAZORPAY_KEY_ID          rzp_test_... or rzp_live_...
//   RAZORPAY_KEY_SECRET      the key secret for that key
//   RAZORPAY_WEBHOOK_SECRET  the secret typed when creating the webhook in Razorpay
// Signature checks follow Razorpay's documentation and its official Node.js library:
//   webhook:  HMAC-SHA256 of the raw request body with the webhook secret (hex)
//   callback: HMAC-SHA256 of "linkId|referenceId|status|paymentId" with the key secret (hex)

import { createHmac, timingSafeEqual } from 'node:crypto';

// Only for local testing against a stand-in server; leave unset everywhere else.
const API_BASE = process.env.RAZORPAY_API_URL || 'https://api.razorpay.com';

export function paymentsConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);
}

function authHeader(): string {
  const id = process.env.RAZORPAY_KEY_ID ?? '';
  const secret = process.env.RAZORPAY_KEY_SECRET ?? '';
  return `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`;
}

function hmacHex(message: string, secret: string): string {
  return createHmac('sha256', secret).update(message).digest('hex');
}

/** Constant-time comparison of two hex signatures. */
function sameSignature(expected: string, received: string): boolean {
  if (!/^[0-9a-f]+$/i.test(received) || received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  return sameSignature(hmacHex(rawBody, secret), signature);
}

export function verifyCallbackSignature(p: {
  linkId: string;
  referenceId: string;
  status: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !p.signature) return false;
  return sameSignature(hmacHex(`${p.linkId}|${p.referenceId}|${p.status}|${p.paymentId}`, secret), p.signature);
}

/**
 * Razorpay needs a reference that is unique for every payment link (max 40 characters).
 * We use the registration's private token (32 characters) plus a short time stamp, so a
 * visitor who comes back to pay gets a fresh link for the same held seat.
 */
export function referenceFor(token: string): string {
  return `${token.replace(/-/g, '')}.${Math.floor(Date.now() / 1000).toString(36)}`;
}

export function tokenFromReference(reference: string): string {
  return reference.split('.')[0] ?? '';
}

export async function createPaymentLink(p: {
  amountCents: number;
  referenceId: string;
  description: string;
  name: string;
  email: string;
  callbackUrl: string;
  classId: string;
}): Promise<{ id: string; shortUrl: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/payment_links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
      body: JSON.stringify({
        amount: p.amountCents,
        currency: 'USD',
        accept_partial: false,
        description: p.description.slice(0, 2048),
        reference_id: p.referenceId,
        customer: { name: p.name, email: p.email },
        notify: { sms: false, email: false },
        reminder_enable: false,
        // Matches the 30-minute seat hold (Razorpay requires at least 15 minutes).
        expire_by: Math.floor(Date.now() / 1000) + 30 * 60,
        notes: { class_id: p.classId },
        callback_url: p.callbackUrl,
        callback_method: 'get',
      }),
      signal: AbortSignal.timeout(20000),
    });
    const body = (await res.json()) as { id?: string; short_url?: string; error?: { description?: string } };
    if (!res.ok || !body.id || !body.short_url) {
      console.error('Razorpay payment link not created:', res.status, body.error?.description ?? '');
      return null;
    }
    return { id: body.id, shortUrl: body.short_url };
  } catch (error) {
    console.error('Razorpay payment link request failed:', error);
    return null;
  }
}

/** Look up a payment, to confirm its amount, currency and status with Razorpay itself. */
export async function fetchPayment(
  paymentId: string,
): Promise<{ id: string; amount: number; currency: string; status: string } | null> {
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) return null;
  try {
    const res = await fetch(`${API_BASE}/v1/payments/${paymentId}`, {
      headers: { Authorization: authHeader() },
      signal: AbortSignal.timeout(20000),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as { id: string; amount: number; currency: string; status: string };
  } catch {
    return null;
  }
}
