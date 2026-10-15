'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { CLASS_TOPICS } from '@/lib/class-topics';
import {
  FieldError,
  HoneypotField,
  inputClass,
  submitLead,
  useBotCheck,
  useFormTracking,
  useHydrated,
} from './LeadFormParts';

export default function ClassInterestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const successHeading = useRef<HTMLHeadingElement>(null);
  const botCheck = useBotCheck();
  const hydrated = useHydrated();
  const tracking = useFormTracking('class_interest');

  useEffect(() => {
    if (sent) successHeading.current?.focus();
  }, [sent]);

  const toggleTopic = (topic: string) =>
    setTopics((current) =>
      current.includes(topic) ? current.filter((t) => t !== topic) : [...current, topic],
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSending(true);

    const outcome = await submitLead(e.currentTarget, {
      kind: 'class-interest',
      name,
      email,
      topics,
      ageConfirmed,
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

  if (sent) {
    return (
      <div className="card border text-center py-8" role="status">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h3 ref={successHeading} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-3 outline-none">
          You&apos;re on the list.
        </h3>
        <p className="text-gray-600">
          We&apos;ll email {email} as soon as dates for your topics are open for registration.
        </p>
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
      className="card border space-y-5 relative text-left"
    >
      <HoneypotField />

      <div>
        <label htmlFor="class-name" className="block text-sm font-medium text-gray-700 mb-2">
          Your name
        </label>
        <input
          id="class-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'class-name-error' : undefined}
          className={inputClass}
        />
        <FieldError id="class-name-error" message={fieldErrors.name} />
      </div>

      <div>
        <label htmlFor="class-email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="class-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'class-email-error' : undefined}
          className={inputClass}
        />
        <FieldError id="class-email-error" message={fieldErrors.email} />
      </div>

      <fieldset aria-describedby={fieldErrors.topics ? 'class-topics-error' : undefined}>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Which topics interest you?
        </legend>
        <div className="grid sm:grid-cols-2 gap-2">
          {CLASS_TOPICS.map((topic) => (
            <label
              key={topic}
              className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-primary-500"
            >
              <input
                type="checkbox"
                name="topics"
                value={topic}
                checked={topics.includes(topic)}
                onChange={() => toggleTopic(topic)}
                className="w-5 h-5 accent-primary-500"
              />
              <span className="text-gray-800">{topic}</span>
            </label>
          ))}
        </div>
        <FieldError id="class-topics-error" message={fieldErrors.topics} />
      </fieldset>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="ageConfirmed"
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
            aria-invalid={Boolean(fieldErrors.ageConfirmed)}
            aria-describedby={fieldErrors.ageConfirmed ? 'class-age-error' : undefined}
            className="w-5 h-5 mt-0.5 accent-primary-500"
          />
          <span className="text-sm text-gray-700">
            I am 18 or older, or I am a parent or guardian signing up for my child.
          </span>
        </label>
        <FieldError id="class-age-error" message={fieldErrors.ageConfirmed} />
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
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
        <span>{sending ? 'Sending...' : 'Tell me when classes open'}</span>
      </button>

      <p className="text-xs text-gray-500 text-center">
        We use your email only to tell you about master classes. No spam, and you can ask us to
        remove you at any time. See our{' '}
        <Link href="/privacy" className="underline hover:text-primary-900">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
