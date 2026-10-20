'use client';

import { useState } from 'react';
import Link from 'next/link';
import LocalTime from './LocalTime';
import { CLASS_TOPICS } from '@/lib/class-topics';
import type { PublicClass } from '@/lib/classes';

function priceLabel(price: number) {
  return price > 0 ? `$${price}` : 'Free';
}

/** Upcoming classes with topic filter chips. Each card opens the class page to register. */
export default function ClassList({ classes }: { classes: PublicClass[] }) {
  const [topic, setTopic] = useState('All');
  // A chip only for topics that have at least one open class, in the usual topic order.
  const chips = ['All', ...CLASS_TOPICS.filter((t) => classes.some((c) => c.topic === t))];
  const shown = classes.filter((c) => topic === 'All' || c.topic === topic);

  return (
    <>
      {/* With classes in only one topic there is nothing to filter. */}
      {chips.length > 2 && (
        <>
          <p id="filter-label" className="mb-3 font-sans text-sm font-semibold tracking-[0.06em]">
            Filter by topic
          </p>
          <div role="group" aria-labelledby="filter-label" className="mb-8 flex flex-wrap gap-2.5">
            {chips.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === topic}
                onClick={() => setTopic(t)}
                className={`min-h-[44px] rounded-full border px-5 text-[15px] font-semibold ${
                  t === topic ? 'border-mz-ink bg-mz-ink text-mz-cream' : 'border-mz-field bg-white text-mz-ink hover:border-mz-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}

      {shown.length === 0 ? (
        <p className="rounded-[20px] border border-mz-border bg-white p-7 text-mz-body">
          No upcoming classes in this topic yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {shown.map((c) => (
            <li key={c.id}>
              <article className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-mz-border bg-white p-6">
                <div className="min-w-0 flex-[1_1_300px]">
                  <p className="mb-1.5 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-mz-accent">
                    {c.topic}
                  </p>
                  <h2 className="mb-2 font-display text-2xl font-semibold leading-tight">{c.title}</h2>
                  <p className="text-[15px] text-mz-body">
                    <LocalTime iso={c.startUtc} /> · {c.durationMinutes} minutes
                  </p>
                  <p className="text-[15px] text-mz-body">
                    {c.seatsLeft > 0 ? `${c.seatsLeft} of ${c.seats} seats left` : 'Full · waiting list open'} · {priceLabel(c.priceUsd)}
                  </p>
                  {c.audience && <p className="mt-1 text-[15px] text-mz-body">Who it&apos;s for: {c.audience}</p>}
                </div>
                <Link
                  href={`/student-portal/${c.id}`}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-mz-accent px-6 text-[15px] font-semibold text-white hover:bg-mz-deep"
                >
                  {c.seatsLeft > 0 ? 'View and register' : 'Join the waiting list'}
                  <span className="sr-only">: {c.title}</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
