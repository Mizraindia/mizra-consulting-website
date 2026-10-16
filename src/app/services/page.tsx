import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { pageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';
import { SERVICES } from '@/content/home';

// Short overview linking to the four service pages. Copy reuses the approved homepage
// wording (src/content/home.ts), so the two never disagree.

const TITLE = 'Services: Salesforce, Zoho, Custom Development and Consulting';
const DESCRIPTION =
  'Four ways Mizra helps: Salesforce, Zoho, custom web and mobile development, and consulting. Fixed price for a defined scope; a reply in 4 business hours.';

export const metadata = pageMetadata({ path: '/services', title: TITLE, description: DESCRIPTION });

const container = 'mx-auto max-w-[1200px] px-4 sm:px-8';
// Product names keep their capitals in "More about ..."; the rest are lowercased.
const PRODUCT_NAMES = new Set(['Salesforce', 'Zoho']);

export default function ServicesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mizra Consulting services',
    itemListElement: SERVICES.filter((s) => s.page).map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      url: `${SITE_URL}${service.page}`,
    })),
  };

  return (
    <div className="bg-mz-cream text-[18px] leading-relaxed text-mz-ink">
      <StructuredData data={structuredData} />

      <section className="bg-mz-ink pb-16 pt-10 text-mz-cream sm:pb-20 sm:pt-12">
        <div className={container}>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-mz-lilac">
            <Link href="/" className="hover:text-mz-amber">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Services</span>
          </nav>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-mz-amber">What we do</p>
          <h1 className="font-display mb-6 max-w-[820px] text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[52px]">
            Four ways we help. One team behind all of them.
          </h1>
          <p className="max-w-[640px] text-[19px] text-mz-mist sm:text-[21px]">
            We set up Salesforce and Zoho, build the software around them, and help you think it through.
            Every project gets a fixed scope and a written estimate before we start.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className={container}>
          <ul className="grid gap-6 md:grid-cols-2">
            {SERVICES.filter((s) => s.page).map((service) => (
              <li key={service.id}>
                <Link
                  href={service.page as string}
                  className="group flex h-full flex-col rounded-[20px] border border-mz-border bg-white p-7 transition-shadow hover:shadow-lg focus-visible:shadow-lg sm:p-9"
                >
                  <h2 className="font-display mb-3 text-[28px] font-semibold leading-tight sm:text-[32px]">
                    {service.name}
                  </h2>
                  <p className="mb-6 flex-1 text-mz-body">{service.text}</p>
                  <span className="font-semibold text-mz-accent group-hover:underline">
                    More about {PRODUCT_NAMES.has(service.name) ? service.name : service.name.toLowerCase()}
                    <span aria-hidden="true">&nbsp;→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className={container}>
          <div className="rounded-[28px] bg-mz-deep p-8 text-white sm:p-14">
            <h2 className="font-display mb-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.015em] sm:text-[38px]">
              Not sure which one you need?
            </h2>
            <p className="mb-7 max-w-[640px] text-[19px] text-mz-mist">
              Send two sentences. We reply within 4 business hours.
            </p>
            <Link
              href="/#start"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-mz-amber px-8 text-[17px] font-semibold text-mz-ink hover:bg-[#ffbb33]"
            >
              Tell us what you need
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
