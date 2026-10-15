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

    // Redirect HTTP to HTTPS only in production
    if (request.headers.get('x-forwarded-proto') !== 'https') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      return NextResponse.redirect(url, 301);
    }
  }

  // Add security headers
  const response = NextResponse.next();

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