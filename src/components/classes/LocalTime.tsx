'use client';

import { useEffect, useState } from 'react';

const UTC_FORMAT = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

/**
 * A class start time in the visitor's own time zone, with the UTC offset, for example
 * "Sat 21 Nov 2026, 7:00 pm GMT+5:30". The server-rendered HTML shows UTC, so search
 * engines and visitors without JavaScript still see a correct time.
 */
export default function LocalTime({ iso, withZoneName = false }: { iso: string; withZoneName?: boolean }) {
  const [local, setLocal] = useState<string | null>(null);
  const [zone, setZone] = useState('');

  useEffect(() => {
    const date = new Date(iso);
    setLocal(
      new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'shortOffset',
      }).format(date),
    );
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [iso]);

  return (
    <>
      <time dateTime={iso}>{local ?? `${UTC_FORMAT.format(new Date(iso))} UTC`}</time>
      {withZoneName && zone && <span className="text-mz-muted"> · your time zone: {zone}</span>}
    </>
  );
}
