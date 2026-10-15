import { NextResponse } from 'next/server';

// DISABLED (Phase A of the revamp). The old version wrote payment entries to the
// Google Sheet without checking they really came from Razorpay, so anyone could
// fake a payment. It now rejects every request and writes nothing.
// It will be replaced by a signature-verified webhook with the new master-class
// payments, and this address deleted then.
function rejected() {
  return NextResponse.json({ ok: false, error: 'This endpoint is disabled.' }, { status: 410 });
}

export const GET = rejected;
export const POST = rejected;
export const PUT = rejected;
export const PATCH = rejected;
export const DELETE = rejected;
