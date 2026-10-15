'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  CONSENT_CHANGED_EVENT,
  GA_ID,
  REOPEN_BANNER_EVENT,
  consentRequired,
  readConsent,
  saveConsent,
  trackEvent,
} from '@/lib/analytics';

/**
 * Google Analytics 4 with a consent banner for visitors in the EU, UK and similar
 * regions. Analytics never loads there until the visitor clicks Accept.
 * Renders nothing at all while NEXT_PUBLIC_GA_ID is not set.
 */
export default function Analytics() {
  const [allowed, setAllowed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;

    const decide = () => {
      if (!consentRequired()) {
        setAllowed(true);
        setShowBanner(false);
        return;
      }
      const choice = readConsent();
      setAllowed(choice === 'granted');
      setShowBanner(choice === null);
    };
    const reopen = () => setShowBanner(true);

    decide();
    window.addEventListener(CONSENT_CHANGED_EVENT, decide);
    window.addEventListener(REOPEN_BANNER_EVENT, reopen);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, decide);
      window.removeEventListener(REOPEN_BANNER_EVENT, reopen);
    };
  }, []);

  // Count clicks on email and WhatsApp links as contact events.
  useEffect(() => {
    if (!allowed) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a');
      const href = link?.getAttribute('href') ?? '';
      if (href.startsWith('mailto:')) trackEvent('email_click', { link_url: href });
      else if (href.startsWith('https://wa.me/')) trackEvent('whatsapp_click', { link_url: href });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [allowed]);

  // Withdrawing consent after analytics has loaded: stop sending data.
  useEffect(() => {
    if (!GA_ID || allowed) return;
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  }, [allowed]);

  if (!GA_ID) return null;

  return (
    <>
      {allowed && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
window['ga-disable-${GA_ID}'] = false;
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="region"
          aria-label="Cookie choice"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="container-custom flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-700">
              May we use analytics cookies to see how people use this site? They help us improve it.
              No advertising cookies.{' '}
              <Link href="/privacy" className="underline hover:text-primary-900">
                Privacy policy
              </Link>
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <button type="button" onClick={() => saveConsent('denied')} className="btn-secondary px-5 py-2">
                No thanks
              </button>
              <button type="button" onClick={() => saveConsent('granted')} className="btn-primary px-5 py-2">
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that lets visitors change their analytics choice. */
export function CookieSettingsButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(Boolean(GA_ID) && consentRequired()), []);
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN_BANNER_EVENT))}
      className="hover:text-primary-500 transition-colors"
    >
      Cookie settings
    </button>
  );
}
