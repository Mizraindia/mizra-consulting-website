import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import StructuredData from '@/components/StructuredData';
import { SITE_URL, organizationData } from '@/lib/site';
import type { ServiceContent } from '@/content/services/types';

// Layout shared by the Salesforce, Zoho, Custom development and Consulting pages,
// using the same design language as the homepage. Sections without content are skipped.

const container = 'mx-auto max-w-[1200px] px-4 sm:px-8';
const eyebrow = 'mb-4 text-sm font-semibold uppercase tracking-[0.14em]';
const sectionHeading = 'font-display text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[40px]';

export default function ServicePage({ content }: { content: ServiceContent }) {
  const { hero, problems, offerings, method, products, principles, faq, closing } = content;
  const url = `${SITE_URL}/${content.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: content.name,
        serviceType: content.serviceType,
        description: content.metaDescription,
        url,
        areaServed: 'Worldwide',
        provider: organizationData(),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: content.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="bg-mz-cream text-[18px] leading-relaxed text-mz-ink">
      <StructuredData data={structuredData} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-mz-ink pb-20 pt-10 text-mz-cream sm:pb-24 sm:pt-12">
        <Image
          src="/brand/mizra-mark-large.png"
          alt=""
          width={564}
          height={389}
          className="pointer-events-none absolute bottom-[-190px] right-[-120px] w-[620px] max-w-none opacity-[0.18]"
        />
        <div className={`relative ${container}`}>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-mz-lilac">
            <Link href="/" className="hover:text-mz-amber">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{content.name}</span>
          </nav>
          <p className={`${eyebrow} mb-5 text-mz-amber`}>{content.name}</p>
          <h1 className="font-display mb-7 max-w-[880px] text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[52px]">
            {hero.title}
          </h1>
          <p className="mb-8 max-w-[640px] text-[19px] text-mz-mist sm:text-[21px]">{hero.intro}</p>
          <ul className="mb-10 flex flex-col gap-2.5 text-[17px]">
            {hero.situations.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-[9px] h-2.5 w-2.5 flex-none rounded-full bg-mz-amber" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="#get-started"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-mz-amber px-8 text-[17px] font-semibold text-mz-ink hover:bg-[#ffbb33]"
          >
            {hero.button}
          </Link>
        </div>
      </section>

      {/* Problems */}
      <section className="py-20 sm:py-24">
        <div className={container}>
          <p className={`${eyebrow} text-mz-accent`}>Sound familiar?</p>
          <h2 className={`${sectionHeading} mb-10 max-w-[760px]`}>{problems.heading}</h2>
          <ul className="mb-12 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {problems.quotes.map((quote) => (
              <li key={quote} className="font-display text-[22px] font-medium leading-[1.35] sm:text-[26px]">
                &ldquo;{quote}&rdquo;
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-6">
            <div className="min-w-0 flex-[1_1_420px] rounded-[20px] border border-mz-border bg-white p-7 sm:p-9">
              <h3 className="font-display mb-4 text-2xl font-semibold">What it costs you</h3>
              <ul className="space-y-3 text-[17px] text-mz-body">
                {problems.costs.map((cost) => (
                  <li key={cost}>{cost}</li>
                ))}
              </ul>
            </div>
            {problems.signs && (
              <div className="min-w-0 flex-[1_1_420px] rounded-[20px] border border-mz-border bg-white p-7 sm:p-9">
                <h3 className="font-display mb-4 text-2xl font-semibold">{problems.signs.heading}</h3>
                <ul className="list-disc space-y-2 pl-5 text-[17px] text-mz-body marker:text-mz-accent">
                  {problems.signs.items.map((sign) => (
                    <li key={sign}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-y border-mz-border bg-white py-20 sm:py-24">
        <div className={container}>
          <h2 className={`${sectionHeading} mb-10`}>{offerings.heading}</h2>
          <div className="border-b border-mz-border">
            {offerings.items.map((item) => (
              <div key={item.title} className="flex flex-wrap gap-x-10 gap-y-3 border-t border-mz-border py-8">
                <h3 className="font-display min-w-0 flex-[1_1_300px] text-[24px] font-semibold leading-[1.2] sm:text-[28px] md:max-w-[340px]">
                  {item.title}
                </h3>
                <div className="min-w-0 flex-[2_1_420px] space-y-3 text-[18px] text-mz-body">
                  {item.text && <p>{item.text}</p>}
                  {item.included && (
                    <p>
                      <strong className="text-mz-ink">Included:</strong> {item.included}
                    </p>
                  )}
                  {item.receive && (
                    <p>
                      <strong className="text-mz-ink">You receive:</strong> {item.receive}
                    </p>
                  )}
                  {item.need && (
                    <p>
                      <strong className="text-mz-ink">We need from you:</strong> {item.need}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="py-20 sm:py-24">
        <div className={container}>
          <p className={`${eyebrow} text-mz-accent`}>Our method</p>
          <h2 className={`${sectionHeading} mb-8 max-w-[780px]`}>{method.heading}</h2>
          <ol className="mb-4 flex flex-wrap gap-3">
            {method.steps.map((step, index) => (
              <li
                key={step}
                className="inline-flex min-h-[46px] items-center gap-3 rounded-full border border-mz-chip bg-white py-1.5 pl-1.5 pr-5 text-base font-medium"
              >
                <span
                  aria-hidden="true"
                  className={`font-display flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    index === method.steps.length - 1 ? 'bg-mz-amber text-mz-ink' : 'bg-mz-accent text-white'
                  }`}
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {method.stepsNote && <p className="mb-12 font-semibold text-mz-accent">{method.stepsNote}</p>}
          <div className="grid gap-6 md:grid-cols-3">
            {method.details.map((detail) => (
              <div key={detail.title} className="rounded-[20px] border border-mz-border bg-white p-7">
                <h3 className="font-display mb-3 text-xl font-semibold">{detail.title}</h3>
                <p className="text-[17px] text-mz-body">{detail.text}</p>
              </div>
            ))}
          </div>
          {method.timeline && (
            <p className="mt-10 max-w-[760px] rounded-[20px] bg-mz-soft p-7 text-[18px]">
              <strong>How long it takes. </strong>
              {method.timeline}
            </p>
          )}
        </div>
      </section>

      {/* Products and tools */}
      {products && (
        <section className="bg-mz-soft py-20 sm:py-24">
          <div className={container}>
            <h2 className={`${sectionHeading} mb-10`}>{products.heading}</h2>
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {products.groups.map((group) => (
                <div key={group.title} className="rounded-[20px] bg-white p-7 sm:p-9">
                  <h3 className="font-display mb-4 text-2xl font-semibold">{group.title}</h3>
                  <ul className="list-disc space-y-2 pl-5 text-[17px] text-mz-body marker:text-mz-accent">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {products.saysNo && <p className="max-w-[760px] text-mz-body">{products.saysNo}</p>}
          </div>
        </section>
      )}

      {/* Principles */}
      {principles && (
        <section className="bg-mz-deep py-20 text-white sm:py-24">
          <div className="mx-auto max-w-[1000px] px-4 sm:px-8">
            <h2 className={`${eyebrow} mb-7 text-mz-amber`}>{principles.heading}</h2>
            <ul className="mb-12 space-y-4">
              {principles.items.map((item) => (
                <li
                  key={item}
                  className="font-display text-[26px] font-medium leading-[1.3] tracking-[-0.01em] text-mz-amber sm:text-[36px]"
                >
                  {item}
                </li>
              ))}
            </ul>
            {principles.extra && (
              <div className="border-t border-mz-line pt-8">
                <h3 className="font-display mb-2 text-xl font-semibold">{principles.extra.title}</h3>
                <p className="max-w-[760px] text-mz-mist">{principles.extra.text}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-4 sm:px-8">
          <h2 className="font-display mb-8 text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[36px]">
            Questions about {content.name}
          </h2>
          <div className="border-b border-mz-chip">
            {faq.map((item) => (
              <details key={item.q} className="group border-t border-mz-chip py-[18px]">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[19px] font-semibold sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-2xl font-normal text-mz-accent transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-mz-body">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing and form */}
      <section id="get-started" className="pb-20 sm:pb-24">
        <div className={container}>
          <div className="flex flex-wrap items-start gap-10 overflow-hidden rounded-[28px] bg-mz-deep p-6 text-white sm:p-12 lg:gap-14">
            <div className="min-w-0 flex-[1_1_380px]">
              <h2 className="font-display mb-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.015em] sm:text-[38px]">
                {closing.title}
              </h2>
              <p className="text-[19px] text-mz-mist">{closing.text}</p>
            </div>
            <div className="w-full min-w-0 flex-[1_1_420px] rounded-[20px] bg-white p-6 text-mz-ink sm:p-[34px]">
              <ContactForm variant="hero" showIntro={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
