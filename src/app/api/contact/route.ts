import { NextRequest, NextResponse } from 'next/server';
import { checkSubmission, isRateLimited, passesBotCheck, saveLead } from '@/lib/leads';

// Handles the enquiry form and the master-class interest form.
// It only answers { ok: true } after the Google Sheet confirms the save.
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  // Vercel always sets the visitor's IP; never lump unknown visitors into one shared limit.
  if (ip !== 'unknown' && isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid', fields: {} }, { status: 400 });
  }

  const check = checkSubmission(body);
  if (!check.ok && check.reason === 'bot') {
    // Look like success to the bot, but save nothing.
    return NextResponse.json({ ok: true });
  }
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: 'invalid', fields: check.fields }, { status: 400 });
  }

  const token = (body as Record<string, unknown>).botCheckToken;
  if (!(await passesBotCheck(token, ip))) {
    return NextResponse.json({ ok: false, error: 'bot_check' }, { status: 400 });
  }

  const result = await saveLead(check.lead);
  if (!result.saved) {
    console.error(`Lead NOT saved (${check.lead.kind}): ${result.problem}`);
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }
  if (!result.emailed) {
    console.warn(`Lead saved but the email notification did not send (${check.lead.kind}).`);
  }

  return NextResponse.json({ ok: true });
}
