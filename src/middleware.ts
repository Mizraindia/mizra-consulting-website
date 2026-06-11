import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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