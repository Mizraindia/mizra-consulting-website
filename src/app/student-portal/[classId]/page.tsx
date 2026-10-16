import Link from 'next/link';
import { notFound } from 'next/navigation';
import LocalTime from '@/components/classes/LocalTime';
import RegistrationForm from '@/components/classes/RegistrationForm';
import StructuredData from '@/components/StructuredData';
import { getClass, getClasses, isRegistrationOpen } from '@/lib/classes';
import { pageMetadata } from '@/lib/metadata';
import { SITE_URL, organizationData } from '@/lib/site';

// One master class: details, Event data for search engines, and the registration form.
// Exists only while registration is switched on; refreshed from the sheet at most once a minute.
export const revalidate = 60;

type Params = { params: Promise<{ classId: string }> };

export async function generateStaticParams() {
  const classes = (await getClasses()) ?? [];
  return classes.map((c) => ({ classId: c.id }));
}

export async function generateMetadata({ params }: Params) {
  if (!isRegistrationOpen()) return {};
  const cls = await getClass((await params).classId);
  if (!cls) return {};
  return pageMetadata({
    path: `/student-portal/${cls.id}`,
    title: `${cls.title}: live ${cls.topic.toLowerCase()} master class`,
    description:
      cls.description ||
      `A live online ${cls.topic.toLowerCase()} master class from Mizra Consulting. ${cls.durationMinutes} minutes. Register with your name, email and WhatsApp number.`,
  });
}

export default async function ClassPage({ params }: Params) {
  if (!isRegistrationOpen()) notFound();
  const cls = await getClass((await params).classId);
  if (cls === null) {
    return (
      <p role="status" className="mx-auto max-w-[820px] px-4 py-20 text-mz-body">
        We could not load this class just now. Please try again in a few minutes.
      </p>
    );
  }
  if (!cls) notFound();

  const url = `${SITE_URL}/student-portal/${cls.id}`;
  const end = new Date(new Date(cls.startUtc).getTime() + cls.durationMinutes * 60000).toISOString();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: cls.title,
    description: cls.description || `A live online ${cls.topic.toLowerCase()} master class.`,
    startDate: cls.startUtc,
    endDate: end,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    // The location is this page, never the private join link.
    location: { '@type': 'VirtualLocation', url },
    image: `${SITE_URL}/og-image.jpg`,
    organizer: organizationData(),
    offers: {
      '@type': 'Offer',
      url,
      price: String(cls.priceUsd),
      priceCurrency: 'USD',
      availability: cls.seatsLeft > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
  };

  return (
    <div className="bg-mz-cream text-[17px] leading-relaxed text-mz-ink">
      <StructuredData data={structuredData} />
      <section className="pb-20 pt-10 sm:pt-12">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-10 px-4 sm:px-8">
          <div className="min-w-0 flex-[1_1_480px]">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-mz-muted">
              <Link href="/" className="hover:text-mz-accent">
                Home
              </Link>
              <span aria-hidden="true"> / </span>
              <Link href="/student-portal" className="hover:text-mz-accent">
                Master classes
              </Link>
            </nav>
            <p className="mb-3 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-mz-accent">
              {cls.topic}
            </p>
            <h1 className="font-display mb-5 text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[42px]">
              {cls.title}
            </h1>
            <dl className="mb-6 space-y-2 text-mz-body">
              <div>
                <dt className="inline font-semibold text-mz-ink">When: </dt>
                <dd className="inline">
                  <LocalTime iso={cls.startUtc} withZoneName />
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold text-mz-ink">Length: </dt>
                <dd className="inline">{cls.durationMinutes} minutes, live online</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-mz-ink">Seats: </dt>
                <dd className="inline">{cls.seatsLeft > 0 ? `${cls.seatsLeft} of ${cls.seats} left` : 'Full'}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-mz-ink">Price: </dt>
                <dd className="inline">{cls.priceUsd > 0 ? `$${cls.priceUsd} per student` : 'Free'}</dd>
              </div>
            </dl>
            {cls.description && <p className="mb-6 max-w-[640px] whitespace-pre-line text-mz-body">{cls.description}</p>}
            <p className="text-mz-body">Taught by a practising product owner.</p>
          </div>

          <div className="w-full min-w-0 flex-[1_1_360px] rounded-[20px] border border-mz-border bg-white p-6 sm:p-7">
            {cls.seatsLeft > 0 ? (
              <RegistrationForm classId={cls.id} classTitle={cls.title} priceUsd={cls.priceUsd} />
            ) : (
              <div>
                <h2 className="mb-2 font-display text-2xl font-semibold">This class is full</h2>
                <p className="mb-5 text-mz-body">
                  <Link href="/student-portal" className="font-semibold text-mz-accent underline">
                    See other classes
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
