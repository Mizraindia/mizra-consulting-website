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

export default function ContactForm() {
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
    return (
      <div className="card border text-center py-8" role="status">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
        </div>
        <h3 ref={successHeading} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-3 outline-none">
          Thanks, we have it.
        </h3>
        <p className="text-gray-600 mb-8">
          A real person will reply to {fields.email} within 4 business hours (Monday to Friday,
          India time).
        </p>
        <button type="button" onClick={startAgain} className="btn-secondary">
          Send another message
        </button>
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
      className="card border space-y-5 relative"
    >
      <HoneypotField />

      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={update('name')}
          required
          maxLength={80}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
          className={inputClass}
        />
        <FieldError id="contact-name-error" message={fieldErrors.name} />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={update('email')}
          required
          maxLength={254}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
          className={inputClass}
        />
        <FieldError id="contact-email-error" message={fieldErrors.email} />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
          What do you need?
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={fields.message}
          onChange={update('message')}
          required
          maxLength={2000}
          placeholder="For example: We want to move from HubSpot to Salesforce before March."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
          className={inputClass}
        />
        <FieldError id="contact-message-error" message={fieldErrors.message} />
      </div>

      {botCheck.widget}

      {error && (
        <div role="alert" className="text-red-700 text-sm bg-red-50 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={sending || !hydrated}
        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        We use your details only to reply to you. See our{' '}
        <Link href="/privacy" className="underline hover:text-primary-900">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
