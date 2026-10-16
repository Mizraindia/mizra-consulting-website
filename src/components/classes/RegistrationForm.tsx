'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { CONSENT_PARTS } from '@/lib/class-consent';
import { trackEvent } from '@/lib/analytics';
import { CONTACT_EMAIL, FieldError, HoneypotField, useBotCheck, useHydrated } from '@/components/LeadFormParts';

type Who = 'self' | 'parent';

const input =
  'w-full min-h-[48px] rounded-[10px] border border-mz-field bg-white px-3.5 text-base focus:outline-none focus:ring-2 focus:ring-mz-accent aria-[invalid=true]:border-red-600';
const label = 'mb-1.5 block text-sm font-semibold';

const ERRORS: Record<string, string> = {
  duplicate: `This email is already registered for this class. Check your inbox for the confirmation, or email us at ${CONTACT_EMAIL}.`,
  full: 'Sorry, this class is now full.',
  closed: 'Registration for this class has closed.',
  not_found: 'Registration for this class has closed.',
  payments_unavailable: 'Online payment for this class is not open yet. Please check back soon.',
  busy: 'Lots of people are registering right now. Please try again in a minute. What you typed is still here.',
  rate_limited: `You've tried several times in a short time. Please wait a few minutes, or email us at ${CONTACT_EMAIL}.`,
  bot_check: `We couldn't complete our automatic spam check. Please try again, or email us at ${CONTACT_EMAIL}.`,
};
const UNAVAILABLE = `Sorry, we couldn't register you just now. What you typed is still here, so please try again in a minute, or email us at ${CONTACT_EMAIL}.`;

export default function RegistrationForm({ classId, classTitle }: { classId: string; classTitle: string }) {
  const [who, setWho] = useState<Who>('self');
  const [fields, setFields] = useState({ name: '', email: '', whatsapp: '', studentFirstName: '' });
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ emailed: boolean } | null>(null);
  const [startedAt] = useState(() => Date.now());
  const successHeading = useRef<HTMLHeadingElement>(null);
  const botCheck = useBotCheck();
  const hydrated = useHydrated();

  useEffect(() => {
    if (done) successHeading.current?.focus();
  }, [done]);

  const update = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields({ ...fields, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSending(true);
    const honeypot = e.currentTarget.elements.namedItem('company_website') as HTMLInputElement | null;

    try {
      const res = await fetch('/api/classes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId,
          registrantType: who,
          ...fields,
          studentFirstName: who === 'parent' ? fields.studentFirstName : '',
          consent,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          startedAt,
          company_website: honeypot?.value ?? '',
          botCheckToken: botCheck.token,
          source: window.location.pathname,
        }),
      });
      const reply = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        emailed?: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (res.ok && reply.ok) {
        trackEvent('class_registration', { class_id: classId });
        setDone({ emailed: reply.emailed !== false });
        return;
      }
      if (reply.error === 'invalid' && reply.fields && Object.keys(reply.fields).length > 0) setFieldErrors(reply.fields);
      else setError(ERRORS[reply.error ?? ''] ?? UNAVAILABLE);
    } catch {
      setError(UNAVAILABLE);
    } finally {
      setSending(false);
    }
    botCheck.reset();
  };

  if (done) {
    return (
      <div role="status" className="py-3 text-center">
        <CheckCircle className="mx-auto h-11 w-11 text-mz-accent" aria-hidden="true" />
        <h2 ref={successHeading} tabIndex={-1} className="mb-2 mt-4 font-display text-[26px] font-semibold leading-tight outline-none">
          You are registered.
        </h2>
        <p className="mb-5 text-mz-body">
          {done.emailed
            ? `We have emailed your join link and a calendar invite to ${fields.email}.`
            : `Your place is saved, but we could not send your confirmation email just now. We will email your join link to ${fields.email} shortly.`}
        </p>
        <Link
          href="/student-portal"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-mz-ink px-6 font-semibold"
        >
          See other classes
        </Link>
      </div>
    );
  }

  const err = (key: string) => (fieldErrors[key] ? { 'aria-invalid': true, 'aria-describedby': `reg-${key}-error` } : {});

  return (
    <form method="post" onSubmit={handleSubmit} noValidate className="relative">
      <HoneypotField />
      <p className="mb-1 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-mz-accent">Register for</p>
      <h2 className="mb-5 font-display text-2xl font-semibold leading-tight">{classTitle}</h2>

      <fieldset className="mb-4" aria-describedby={fieldErrors.registrantType ? 'reg-registrantType-error' : undefined}>
        <legend className="mb-2 text-sm font-semibold">Who is this for?</legend>
        <div className="flex flex-wrap gap-2.5">
          {(
            [
              ['self', 'Myself (18 or older)'],
              ['parent', 'My child (under 18)'],
            ] as const
          ).map(([value, text]) => (
            <label
              key={value}
              className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-5 text-[15px] font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-mz-accent ${
                who === value ? 'border-mz-ink bg-mz-ink text-mz-cream' : 'border-mz-field bg-white text-mz-ink'
              }`}
            >
              <input
                type="radio"
                name="registrantType"
                value={value}
                checked={who === value}
                onChange={() => setWho(value)}
                className="sr-only"
              />
              {text}
            </label>
          ))}
        </div>
        <FieldError id="reg-registrantType-error" message={fieldErrors.registrantType} />
      </fieldset>

      <div className="mb-3.5">
        <label htmlFor="reg-name" className={label}>
          {who === 'parent' ? 'Your name (parent or guardian)' : 'Your name'}
        </label>
        <input id="reg-name" name="name" type="text" autoComplete="name" maxLength={80} value={fields.name} onChange={update('name')} className={input} {...err('name')} />
        <FieldError id="reg-name-error" message={fieldErrors.name} />
      </div>
      <div className="mb-3.5">
        <label htmlFor="reg-email" className={label}>Email</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" maxLength={254} value={fields.email} onChange={update('email')} className={input} {...err('email')} />
        <FieldError id="reg-email-error" message={fieldErrors.email} />
      </div>
      <div className="mb-3.5">
        <label htmlFor="reg-whatsapp" className={label}>WhatsApp number</label>
        <input id="reg-whatsapp" name="whatsapp" type="tel" autoComplete="tel" maxLength={25} placeholder="+91 98765 43210" value={fields.whatsapp} onChange={update('whatsapp')} className={input} {...err('whatsapp')} />
        <FieldError id="reg-whatsapp-error" message={fieldErrors.whatsapp} />
      </div>
      {who === 'parent' && (
        <div className="mb-3.5">
          <label htmlFor="reg-studentFirstName" className={label}>Student&apos;s first name</label>
          <input id="reg-studentFirstName" name="studentFirstName" type="text" autoComplete="off" maxLength={40} value={fields.studentFirstName} onChange={update('studentFirstName')} className={input} {...err('studentFirstName')} />
          <FieldError id="reg-studentFirstName-error" message={fieldErrors.studentFirstName} />
        </div>
      )}

      <div className="mb-5 mt-5">
        <div className="flex items-start gap-2.5">
          <input
            id="reg-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-[22px] w-[22px] flex-none accent-mz-accent"
            {...err('consent')}
          />
          <label htmlFor="reg-consent" className="text-sm text-mz-body">
            {CONSENT_PARTS.before}
            <Link href="/privacy" className="text-mz-ink underline">
              {CONSENT_PARTS.link}
            </Link>
            {CONSENT_PARTS.after}
          </label>
        </div>
        <FieldError id="reg-consent-error" message={fieldErrors.consent} />
      </div>

      {botCheck.widget}

      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={sending || !hydrated}
        className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-mz-accent text-[17px] font-semibold text-white hover:bg-mz-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {sending ? 'Registering...' : 'Register'}
      </button>
      <p className="mt-3 text-[13px] text-mz-muted">
        We use your WhatsApp number only for class reminders. For students under 18, everything goes to the parent
        or guardian and we keep only the student&apos;s first name.
      </p>
    </form>
  );
}
