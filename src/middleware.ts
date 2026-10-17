import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REGION_COOKIE = 'mz_region';

// EU and EEA members, the UK and Switzerland.
const CONSENT_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
  'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
]);

function needsAnalyticsConsent(country: string | null): boolean {
  return !country || CONSENT_COUNTRIES.has(country.toUpperCase());
}

/**
 * Which /student-portal/... addresses do not exist on this deployment. Kept here, without
 * importing lib/classes, so the middleware stays small; the same rules are in lib/classes
 * (isRegistrationOpen, classesConfigured) and lib/razorpay (paymentsConfigured).
 */
function isHiddenClassPage(pathname: string): boolean {
  if (!pathname.startsWith('/student-portal/')) return false;
  const env = process.env;
  const classesSet = Boolean(env.CLASSES_SCRIPT_URL?.trim() && env.CLASSES_SCRIPT_SECRET?.trim());
  const paymentsSet = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_WEBHOOK_SECRET);
  const page = pathname.replace(/\/+$/, '');
  if (page === '/student-portal/cancel') return !classesSet;
  if (page === '/student-portal/payment-complete') return !(classesSet && paymentsSet);
  return env.CLASS_REGISTRATION_OPEN !== 'true';
}

export function middleware(request: NextRequest) {
  // Only apply redirects in production
  if (process.env.NODE_ENV === 'production') {
    const { host } = request.nextUrl;

    // Redirect www to non-www
    if (host.startsWith('www.')) {
      const newHost = host.replace('www.', '');
      const url = request.nextUrl.clone();
      url.host = newHost;
      return NextResponse.redirect(url, 301);
    }

    // Redirect HTTP to HTTPS only in production. Skipped for localhost, which has no
    // HTTPS, so a local production build (and its image optimiser) can be tested.
    const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
    if (!isLocalhost && request.headers.get('x-forwarded-proto') !== 'https') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      return NextResponse.redirect(url, 301);
    }
  }

  // Master-class pages that are switched off on this deployment get the site's ordinary 404
  // page, exactly as if they did not exist (a page calling notFound() itself would draw its
  // 404 in the browser instead of sending it ready-made).
  const response = isHiddenClassPage(request.nextUrl.pathname)
    ? NextResponse.rewrite(new URL('/_not-found-page', request.url))
    : NextResponse.next();

  // Tell the consent banner whether this visitor must opt in before analytics loads
  // (EU, EEA, UK and Switzerland, or an unknown country).
  let region = needsAnalyticsConsent(request.headers.get('x-vercel-ip-country')) ? 'consent' : 'open';
  // Previews only: ?test-region=consent (or open) lets the owner see the banner from India.
  const testRegion = request.nextUrl.searchParams.get('test-region');
  if (process.env.VERCEL_ENV !== 'production' && (testRegion === 'consent' || testRegion === 'open')) {
    region = testRegion;
  }
  if (request.cookies.get(REGION_COOKIE)?.value !== region) {
    response.cookies.set(REGION_COOKIE, region, { path: '/', sameSite: 'lax', secure: true, maxAge: 60 * 60 * 24 });
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};