import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import ContactForm from '@/components/ContactForm';
import { organizationData } from '@/lib/site';
import { pageMetadata } from '@/lib/metadata';
import {
  CLASS_TOPICS_SHOWN,
  COST_OF_WAITING,
  FAQ,
  HERO,
  HOW_WE_WORK,
  PAINS,
  SERVICES,
  STEPS,
} from '@/content/home';

const HOME_TITLE = 'Mizra Consulting: Salesforce, Zoho, Custom Development and Consulting';
const HOME_DESCRIPTION =
  'We set up Salesforce and Zoho, build the software around them, and help you think it through. A real person replies within 4 business hours. Based in India, working with clients worldwide.';

export const metadata = {
  ...pageMetadata({ path: '/', title: HOME_TITLE, description: HOME_DESCRIPTION }),
  title: { absolute: HOME_TITLE },
};

const container = 'mx-auto max-w-[1200px] px-4 sm:px-8';
const eyebrow = 'mb-4 text-sm font-semibold uppercase tracking-[0.14em]';
const sectionHeading = 'font-display text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[40px]';

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { ...organizationData(), description: HOME_DESCRIPTION },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="bg-mz-cream text-[18px] leading-relaxed text-mz-ink">
      <StructuredData data={structuredData} />

      {/* Hero */}
      <section id="start" className="relative overflow-hidden bg-mz-ink pb-24 pt-10 text-mz-cream sm:pb-28 sm:pt-12">
        <Image
          src="/brand/mizra-mark-large.png"
          alt=""
          width={564}
          height={389}
          className="pointer-events-none absolute bottom-[-170px] left-1/2 w-[760px] max-w-none -translate-x-1/2 opacity-[0.22]"
        />
        <div className={`relative flex flex-wrap items-center gap-10 lg:gap-14 ${container}`}>
          <div className="min-w-0 flex-[1_1_520px]">
            <p className={`${eyebrow} mb-5 text-mz-amber`}>{HERO.eyebrow}</p>
            <h1 className="font-display mb-7 text-[38px] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-[48px] lg:text-[56px]">
              Your tools should{' '}
              <span className="underline decoration-mz-amber decoration-[6px] underline-offset-[10px]">
                work for you
              </span>
              , not the other way round.
            </h1>
            <p className="mb-8 max-w-[540px] text-[19px] text-mz-mist sm:text-[21px]">{HERO.intro}</p>
            <ul className="flex flex-col gap-2.5 text-[17px]">
              {HERO.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[9px] h-2.5 w-2.5 flex-none rounded-full bg-mz-amber" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full min-w-0 flex-[1_1_420px] rounded-[20px] bg-white p-6 text-mz-ink sm:p-[34px]">
            <ContactForm variant="hero" />
          </div>
        </div>
      </section>

      {/* Sound familiar */}
      <section className="pb-20 pt-20 sm:pb-[88px] sm:pt-[104px]">
        <div className={container}>
          <p className={`${eyebrow} text-mz-accent`}>Sound familiar?</p>
          <h2 className={`${sectionHeading} mb-12 max-w-[760px] sm:mb-16`}>
            If you&apos;ve said any of these this month, we should talk.
          </h2>
          <div className="flex flex-wrap gap-x-[72px] gap-y-12">
            {PAINS.map((pain, index) => (
              <figure key={pain.href} className={`min-w-0 flex-[1_1_440px] ${index % 2 === 1 ? 'md:pt-10' : ''}`}>
                <blockquote className="font-display mb-4 text-[22px] font-medium leading-[1.35] sm:text-[28px]">
                  &ldquo;{pain.quote}&rdquo;
                </blockquote>
                <Link
                  href={pain.href}
                  className="inline-block py-2.5 font-semibold text-mz-accent hover:underline"
                >
                  {pain.link} <span aria-hidden="true">&nbsp;→</span>
                </Link>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section id="services" className="border-y border-mz-border bg-white py-20 sm:py-24">
        <div className={container}>
          <p className={`${eyebrow} text-mz-accent`}>What we do</p>
          <h2 className={`${sectionHeading} mb-12 max-w-[760px]`}>Four ways we help. One team behind all of them.</h2>
          <div className="border-b border-mz-border">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-mz-border py-8"
              >
                <h3 className="font-display m-0 flex-[0_0_300px] text-[28px] font-semibold leading-[1.15] sm:text-[32px]">
                  {service.name}
                </h3>
                <p className="min-w-0 flex-[1_1_360px] text-[19px] text-mz-body">{service.text}</p>
                <Link
                  href="/#start"
                  className="inline-block flex-none py-2.5 font-semibold text-mz-accent hover:underline"
                >
                  Start a conversation<span className="sr-only"> about {service.name}</span>
                  <span aria-hidden="true">&nbsp;→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project path */}
      <section id="path" className="pb-24 pt-20 sm:pt-[104px]">
        <div className={container}>
          <p className={`${eyebrow} text-mz-accent`}>Your project path</p>
          <h2 className={`${sectionHeading} mb-4 max-w-[780px]`}>
            From your first message to launch day, here&apos;s exactly what happens.
          </h2>
          <p className="mb-14 max-w-[640px] text-mz-body">No surprises, and you always know what comes next.</p>

          <ol className="max-w-[760px]">
            {STEPS.map((step, index) => {
              const last = index === STEPS.length - 1;
              return (
                <li key={step.title} className="flex gap-[22px]">
                  <div className="flex flex-[0_0_46px] flex-col items-center">
                    <div
                      aria-hidden="true"
                      className={`font-display flex h-[46px] w-[46px] items-center justify-center rounded-full text-lg font-semibold ${
                        last ? 'bg-mz-amber text-mz-ink' : 'bg-mz-accent text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {!last && <div aria-hidden="true" className="my-1.5 min-h-[24px] w-0.5 flex-1 bg-mz-chip" />}
                  </div>
                  <div className="min-w-0 pb-9">
                    <p className="mb-1 mt-[3px] text-sm font-semibold uppercase tracking-[0.12em] text-mz-muted">
                      <span className="sr-only">Step {index + 1}: </span>
                      {step.when}
                    </p>
                    <h3 className="font-display mb-1.5 text-2xl font-semibold leading-tight">{step.title}</h3>
                    <p className="mb-2 max-w-[520px] text-[17px] text-mz-body">{step.text}</p>
                    <p className="text-base font-semibold text-mz-accent">You get: {step.get}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 rounded-[20px] border border-mz-border bg-white p-7 sm:p-9">
            <h3 className="font-display mb-5 text-2xl font-semibold leading-snug">Meanwhile, every week you wait...</h3>
            <ul className="flex flex-wrap gap-x-8 gap-y-5">
              {COST_OF_WAITING.map((line) => (
                <li key={line} className="min-w-0 flex-[1_1_240px] text-[17px] text-mz-body">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-mz-deep py-20 text-white sm:py-[104px]">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-8">
          <h2 className={`${eyebrow} mb-7 text-mz-amber`}>How we work</h2>
          {HOW_WE_WORK.map((item) => (
            <p
              key={item.lead}
              className="font-display mb-5 text-[24px] font-medium leading-[1.3] tracking-[-0.01em] last:mb-0 sm:text-[36px]"
            >
              <span className="text-mz-amber">{item.lead}</span> {item.rest}
            </p>
          ))}
        </div>
      </section>

      {/* Master classes */}
      <section id="classes" className="bg-mz-soft py-20 sm:py-[104px]">
        <div className={container}>
          <p className={`${eyebrow} text-mz-accent`}>Master classes</p>
          <h2 className={`${sectionHeading} mb-4 max-w-[780px]`}>Learn from someone who does this work every day.</h2>
          <p className="mb-7 max-w-[640px] text-mz-body">
            Live online sessions in product management, product ownership, HR and more, for students and
            early-career professionals. You leave with something you can use straight away: a template for
            work, a clearer way to prioritise, and answers to your own questions.
          </p>
          <ul className="mb-10 flex flex-wrap gap-2.5">
            {CLASS_TOPICS_SHOWN.map((topic) => (
              <li
                key={topic}
                className="inline-flex min-h-[42px] items-center rounded-full border border-mz-chip bg-white px-[18px] text-base"
              >
                {topic}
              </li>
            ))}
          </ul>
          <Link
            href="/student-portal"
            className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-mz-accent px-[30px] text-[17px] font-semibold text-white hover:bg-mz-deep"
          >
            See master classes
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-[104px]">
        <div className="mx-auto max-w-[820px] px-4 sm:px-8">
          <h2 className="font-display mb-8 text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] sm:text-[36px]">
            Things people ask us
          </h2>
          <div className="border-b border-mz-chip">
            {FAQ.map((item) => (
              <details key={item.q} className="group border-t border-mz-chip py-[18px]">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[19px] font-semibold sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl font-normal text-mz-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-mz-body">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="pb-20 sm:pb-[104px]">
        <div className={container}>
          <div className="flex flex-wrap items-stretch overflow-hidden rounded-[28px] bg-mz-deep text-white">
            <div className="min-w-0 flex-[1_1_440px] p-8 sm:p-14">
              <h2 className="font-display mb-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.015em] sm:text-[38px]">
                Let&apos;s talk about what&apos;s in your way.
              </h2>
              <p className="mb-7 text-[19px] text-mz-mist">Send two sentences. We reply within 4 business hours.</p>
              <Link
                href="/#start"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-mz-amber px-8 text-[17px] font-semibold text-mz-ink hover:bg-[#ffbb33]"
              >
                Tell us what you need
              </Link>
            </div>
            <div className="relative hidden h-60 min-w-0 flex-[1_1_320px] overflow-hidden sm:block">
              <Image
                src="/brand/mizra-mark-large.png"
                alt=""
                width={564}
                height={389}
                className="absolute bottom-[-120px] left-1/2 w-[420px] max-w-none -translate-x-1/2"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
