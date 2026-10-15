'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import {
  FieldError,
  HoneypotField,
  inputClass,
  submitLead,
  useBotCheck,
  useFormTracking,
  useHydrated,
} from './LeadFormParts';

interface FormFields {
  name: string;
  email: string;
  message: string;
}

const EMPTY: FormFields = { name: '', email: '', message: '' };

// "hero" is the homepage card from the approved design; "default" is used on /contact and in the pop-up.
const VARIANTS = {
  default: {
    idPrefix: 'contact',
    form: 'card border space-y-5 relative',
    label: 'block text-sm font-medium text-gray-700 mb-2',
    input: inputClass,
    emailLabel: 'Email',
    placeholder: 'For example: We want to move from HubSpot to Salesforce before March.',
    button:
      'btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed',
    buttonText: 'Send',
    note: 'text-xs text-gray-500 text-center',
    success: 'card border text-center py-8',
    successHeading: 'text-2xl font-bold text-gray-900 mb-3 outline-none',
    successText: 'text-gray-600 mb-8',
  },
  hero: {
    idPrefix: 'hero',
    form: 'relative',
    label: 'mb-1.5 block text-sm font-semibold',
    input:
      'w-full min-h-[50px] rounded-[10px] border border-mz-field bg-white px-3.5 text-[17px] focus:outline-none focus:ring-2 focus:ring-mz-accent aria-[invalid=true]:border-red-600',
    emailLabel: 'Your email',
    placeholder:
      "Example: We want to move from HubSpot to Salesforce before March, and we're nervous about our data.",
    button:
      'flex w-full min-h-[56px] items-center justify-center gap-2 rounded-full bg-mz-accent text-[17px] font-semibold text-white hover:bg-mz-deep disabled:cursor-not-allowed disabled:opacity-60',
    buttonText: 'Send it to us',
    note: 'mt-3.5 text-[13px] text-mz-muted',
    success: 'py-6 text-center',
    successHeading: 'font-display mt-4 mb-2 text-[26px] font-semibold leading-tight outline-none',
    successText: 'text-mz-body',
  },
};

export default function ContactForm({ variant = 'default' }: { variant?: keyof typeof VARIANTS }) {
  const style = VARIANTS[variant];
  const id = (field: string) => `${style.idPrefix}-${field}`;
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const successHeading = useRef<HTMLHeadingElement>(null);
  const botCheck = useBotCheck();
  const hydrated = useHydrated();
  const tracking = useFormTracking('enquiry');

  useEffect(() => {
    if (sent) successHeading.current?.focus();
  }, [sent]);

  const update = (key: keyof FormFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFields({ ...fields, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSending(true);

    const outcome = await submitLead(e.currentTarget, {
      kind: 'enquiry',
      ...fields,
      startedAt,
      botCheckToken: botCheck.token,
    });

    setSending(false);
    if (outcome.status === 'ok') {
      tracking.onSent();
      setSent(true);
      return;
    }
    if (outcome.status === 'invalid') setFieldErrors(outcome.fields);
    else setError(outcome.message);
    botCheck.reset();
  };

  const startAgain = () => {
    setFields(EMPTY);
    setStartedAt(Date.now());
    setSent(false);
  };

  if (sent) {
    // On the homepage the form card has no heading above it, so the confirmation is an h2.
    const SuccessHeading = variant === 'hero' ? 'h2' : 'h3';
    return (
      <div className={style.success} role="status">
        {variant === 'hero' ? (
          <CheckCircle className="mx-auto h-12 w-12 text-mz-accent" aria-hidden="true" />
        ) : (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
          </div>
        )}
        <SuccessHeading ref={successHeading} tabIndex={-1} className={style.successHeading}>
          Thanks, we have it.
        </SuccessHeading>
        <p className={style.successText}>
          A real person will reply to {fields.email} within 4 business hours (Monday to Friday,
          India time).
        </p>
        {variant === 'default' && (
          <button type="button" onClick={startAgain} className="btn-secondary mt-8">
            Send another message
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      ref={tracking.ref}
      method="post"
      onSubmit={handleSubmit}
      onFocus={tracking.onStart}
      noValidate
      className={style.form}
    >
      <HoneypotField />

      {variant === 'hero' && (
        <>
          <h2 className="font-display mb-1 text-[26px] font-semibold leading-tight">So, what&apos;s going on?</h2>
          <p className="mb-6 text-base text-mz-muted">Two sentences is plenty. We&apos;ll ask the rest.</p>
        </>
      )}

      <div className={variant === 'hero' ? 'mb-4' : ''}>
        <label htmlFor={id('name')} className={style.label}>
          Your name
        </label>
        <input
          id={id('name')}
          name="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={update('name')}
          required
          maxLength={80}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? id('name-error') : undefined}
          className={style.input}
        />
        <FieldError id={id('name-error')} message={fieldErrors.name} />
      </div>

      <div className={variant === 'hero' ? 'mb-4' : ''}>
        <label htmlFor={id('email')} className={style.label}>
          {style.emailLabel}
        </label>
        <input
          id={id('email')}
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={update('email')}
          required
          maxLength={254}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? id('email-error') : undefined}
          className={style.input}
        />
        <FieldError id={id('email-error')} message={fieldErrors.email} />
      </div>

      <div className={variant === 'hero' ? 'mb-5' : ''}>
        <label htmlFor={id('message')} className={style.label}>
          What do you need?
        </label>
        <textarea
          id={id('message')}
          name="message"
          rows={4}
          value={fields.message}
          onChange={update('message')}
          required
          maxLength={2000}
          placeholder={style.placeholder}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? id('message-error') : undefined}
          className={variant === 'hero' ? `${style.input} py-3 resize-y` : style.input}
        />
        <FieldError id={id('message-error')} message={fieldErrors.message} />
      </div>

      {botCheck.widget}

      {error && (
        <div role="alert" className="mb-4 text-red-700 text-sm bg-red-50 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button type="submit" disabled={sending || !hydrated} className={style.button}>
        {sending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>{style.buttonText}</span>
            {variant === 'default' && <ArrowRight className="w-5 h-5" aria-hidden="true" />}
          </>
        )}
      </button>

      {variant === 'hero' ? (
        <p className={style.note}>
          No sales pitch, promise. By sending, you agree to our{' '}
          <Link href="/privacy" className="text-mz-ink underline">
            privacy policy
          </Link>
          .
        </p>
      ) : (
        <p className={style.note}>
          We use your details only to reply to you. See our{' '}
          <Link href="/privacy" className="underline hover:text-primary-900">
            privacy policy
          </Link>
          .
        </p>
      )}
    </form>
  );
}
