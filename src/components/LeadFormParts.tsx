'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

// Shared pieces for every form that sends a lead to /api/contact.

export const CONTACT_EMAIL = 'info@mizraconsulting.com';

export const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all aria-[invalid=true]:border-red-500';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile, the invisible bot check. Renders nothing until
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set in Vercel.
 */
export function useBotCheck() {
  // The container is tracked as state so the widget is rebuilt whenever the form is re-shown.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !scriptReady || !container || !window.turnstile) return;
    const id = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (value: string) => setToken(value),
      'expired-callback': () => setToken(''),
      'error-callback': () => setToken(''),
    });
    widgetId.current = id;
    return () => {
      try {
        window.turnstile?.remove(id);
      } catch {
        // already gone
      }
      if (widgetId.current === id) widgetId.current = null;
      setToken('');
    };
  }, [scriptReady, container]);

  const reset = useCallback(() => {
    setToken('');
    try {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    } catch (error) {
      console.warn('Bot check reset failed:', error);
    }
  }, []);

  const widget = TURNSTILE_SITE_KEY ? (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setScriptReady(true)}
      />
      <div ref={setContainer} />
    </>
  ) : null;

  return { token, reset, widget };
}

/**
 * False until the page's JavaScript is running. Submit buttons stay disabled until then,
 * so the browser can never send the form by itself before our handler is attached.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/**
 * Analytics events for a lead form: seen (half of it on screen), started (first
 * field focused) and sent (saved successfully). Each fires at most once.
 */
export function useFormTracking(formName: string) {
  const observer = useRef<IntersectionObserver | null>(null);
  const viewed = useRef(false);
  const started = useRef(false);

  const ref = useCallback(
    (form: HTMLFormElement | null) => {
      observer.current?.disconnect();
      observer.current = null;
      if (!form || viewed.current || typeof IntersectionObserver === 'undefined') return;
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            viewed.current = true;
            trackEvent('lead_form_view', { form_name: formName });
            observer.current?.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      observer.current.observe(form);
    },
    [formName],
  );

  const onStart = useCallback(() => {
    if (started.current) return;
    started.current = true;
    trackEvent('lead_form_start', { form_name: formName });
  }, [formName]);

  const onSent = useCallback(() => trackEvent('generate_lead', { form_name: formName }), [formName]);

  return { ref, onStart, onSent };
}

/** Hidden from people and screen readers; bots tend to fill it in. */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

export type SubmitOutcome =
  | { status: 'ok' }
  | { status: 'invalid'; fields: Record<string, string> }
  | { status: 'error'; message: string };

/** Where the visitor came from, including any utm_ tags on the link they followed. */
function currentSource(): string {
  const params = new URLSearchParams(window.location.search);
  const tags = [...params.entries()]
    .filter(([key]) => key.startsWith('utm_'))
    .map(([key, value]) => `${key}=${value}`);
  return [window.location.pathname, ...tags].join(' ');
}

export async function submitLead(
  form: HTMLFormElement,
  payload: Record<string, unknown>,
): Promise<SubmitOutcome> {
  const honeypot = form.elements.namedItem('company_website') as HTMLInputElement | null;
  const unavailable = `Sorry, we couldn't save your message just now. What you typed is still here, so please try again in a minute, or email us at ${CONTACT_EMAIL}.`;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        company_website: honeypot?.value ?? '',
        source: currentSource(),
      }),
    });
    const reply = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      fields?: Record<string, string>;
    };

    if (res.ok && reply.ok === true) return { status: 'ok' };
    if (reply.error === 'invalid' && reply.fields && Object.keys(reply.fields).length > 0) {
      return { status: 'invalid', fields: reply.fields };
    }
    if (reply.error === 'rate_limited') {
      return {
        status: 'error',
        message: `You've sent several messages in a short time. Please wait a few minutes, or email us at ${CONTACT_EMAIL}.`,
      };
    }
    if (reply.error === 'bot_check') {
      return {
        status: 'error',
        message: `We couldn't complete our automatic spam check. Please try again, or email us at ${CONTACT_EMAIL}.`,
      };
    }
    return { status: 'error', message: unavailable };
  } catch {
    return { status: 'error', message: unavailable };
  }
}
