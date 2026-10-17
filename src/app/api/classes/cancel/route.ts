import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/leads';
import { TOKEN_PATTERN, cancelWithScript, classesConfigured } from '@/lib/classes';

// Cancels a registration or a waiting-list place, using the private token from the email.
// Only a POST (the button on the cancel page) cancels: email security scanners that open
// links with GET can never cancel anyone by accident.
export async function POST(request: NextRequest) {
  if (!classesConfigured()) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const ip =
    request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (ip !== 'unknown' && isRateLimited(ip, 'classes')) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let token = '';
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === 'string' ? body.token.trim() : '';
  } catch {
    // fall through to the format check
  }
  if (!TOKEN_PATTERN.test(token)) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });

  const result = await cancelWithScript(token);
  if (result.ok) return NextResponse.json({ ok: true, status: 'cancelled' });
  const codes: Record<string, number> = { not_found: 404, too_late: 409, not_cancellable: 409, invalid: 400 };
  const status = codes[result.error] ?? 503;
  return NextResponse.json({ ok: false, error: result.error }, { status });
}
