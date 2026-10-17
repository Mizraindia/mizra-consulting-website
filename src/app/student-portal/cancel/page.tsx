import Link from 'next/link';
import CancelButton from '@/components/classes/CancelButton';
import LocalTime from '@/components/classes/LocalTime';
import { lookupRegistration } from '@/lib/classes';

// Opened from the cancel link in every class email. Shows which class it is and asks the
// visitor to confirm; nothing is cancelled until they press the button.
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Cancel a master class place', robots: { index: false, follow: false } };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function CancelPage({ searchParams }: { searchParams: Search }) {
  const raw = (await searchParams).token;
  const token = (Array.isArray(raw) ? raw[0] : raw) ?? '';
  const found = await lookupRegistration(token);

  let body;
  if (!found.ok) {
    body = (
      <p className="text-[18px] text-mz-body">
        {found.error === 'unavailable'
          ? 'We could not load this registration just now. Please try again in a few minutes.'
          : 'This cancel link is not valid. Please use the link from your most recent email about the class.'}
      </p>
    );
  } else if (found.status === 'cancelled') {
    body = <p className="text-[18px] text-mz-body">This place is already cancelled. You do not need to do anything.</p>;
  } else if (new Date(found.startUtc).getTime() <= Date.now()) {
    body = <p className="text-[18px] text-mz-body">This class has already started, so it can no longer be cancelled.</p>;
  } else {
    const waitlisted = found.status === 'waitlisted';
    body = (
      <>
        <p className="mb-2 text-[18px] text-mz-body">
          {waitlisted ? 'Leave the waiting list for' : 'Cancel your place in'} <strong className="text-mz-ink">{found.classTitle}</strong>?
        </p>
        <p className="mb-8 text-mz-body">
          <LocalTime iso={found.startUtc} withZoneName />
        </p>
        <CancelButton token={token} waitlisted={waitlisted} />
      </>
    );
  }

  return (
    <section className="bg-mz-cream py-20 text-mz-ink sm:py-28">
      <div className="mx-auto max-w-[680px] px-4 sm:px-8">
        <h1 className="font-display mb-6 text-[32px] font-semibold leading-tight sm:text-[40px]">Cancel a master class place</h1>
        {body}
        <p className="mt-10 text-sm text-mz-muted">
          Changed your mind? Simply close this page; nothing changes until you press the button.{' '}
          <Link href="/student-portal" className="underline">
            Master classes
          </Link>
        </p>
      </div>
    </section>
  );
}
