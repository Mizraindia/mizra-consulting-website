'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { CONTACT_EMAIL } from '@/components/LeadFormParts';

const ERRORS: Record<string, string> = {
  too_late: 'This class has already started, so it can no longer be cancelled.',
  not_found: 'We could not find this registration. It may already have been removed.',
  not_cancellable: 'This registration cannot be cancelled online.',
  rate_limited: 'Please wait a few minutes and try again.',
};

/** Cancels only when the visitor presses the button (a POST), never just by opening the link. */
export default function CancelButton({ token, waitlisted }: { token: string; waitlisted: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  const cancel = async () => {
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/classes/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const reply = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && reply.ok) {
        setState('done');
        return;
      }
      setError(ERRORS[reply.error ?? ''] ?? `Sorry, something went wrong. Please try again, or email us at ${CONTACT_EMAIL}.`);
    } catch {
      setError(`Sorry, something went wrong. Please try again, or email us at ${CONTACT_EMAIL}.`);
    }
    setState('idle');
  };

  if (state === 'done') {
    return (
      <div role="status">
        <p className="mb-6 text-[18px] text-mz-body">
          {waitlisted ? 'You have left the waiting list.' : 'Your place is cancelled. Thank you for letting us know.'}
        </p>
        <Link href="/student-portal" className="font-semibold text-mz-accent underline">
          See other classes
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={cancel}
        disabled={state === 'sending'}
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-mz-accent px-7 text-[17px] font-semibold text-white hover:bg-mz-deep disabled:opacity-60"
      >
        {state === 'sending' && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {waitlisted ? 'Leave the waiting list' : 'Cancel my place'}
      </button>
    </div>
  );
}
