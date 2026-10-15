// Browser-side helpers for Google Analytics 4. Nothing here runs unless
// NEXT_PUBLIC_GA_ID is set and the visitor's consent rules allow analytics.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const CONSENT_KEY = 'mz_analytics_consent';
export const CONSENT_CHANGED_EVENT = 'mz-consent-changed';
export const REOPEN_BANNER_EVENT = 'mz-consent-reopen';

export type ConsentChoice = 'granted' | 'denied' | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function readConsent(): ConsentChoice {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // storage blocked: the choice lasts for this page view only
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: choice }));
}

/** True when the visitor is in a region where analytics must wait for consent. */
export function consentRequired(): boolean {
  return !document.cookie.split('; ').includes('mz_region=open');
}

/** Send a GA4 event if analytics is running; otherwise do nothing. */
export function trackEvent(name: string, params: Record<string, string> = {}) {
  window.gtag?.('event', name, params);
}
