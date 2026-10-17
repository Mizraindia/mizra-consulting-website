import Link from 'next/link';
import ClassInterestForm from '@/components/ClassInterestForm';
import ClassList from '@/components/classes/ClassList';
import MasterClassesComing from '@/components/classes/MasterClassesComing';
import { getClasses, isRegistrationOpen } from '@/lib/classes';
import { pageMetadata } from '@/lib/metadata';

// Master classes portal (Phase D). While CLASS_REGISTRATION_OPEN is not "true" this shows
// the "Master classes are coming" holding page, and nothing is fetched from the classes sheet.
// The class list is refreshed from the sheet every 10 seconds (matches CLASS_DATA_SECONDS).
export const revalidate = 10;

export function generateMetadata() {
  return isRegistrationOpen()
    ? pageMetadata({
        path: '/student-portal',
        title: 'Live Master Classes in Product Management, Product Ownership and HR',
        description:
          'Live online master classes in product management, product ownership and HR. Register with your name, email and WhatsApp number. Times shown in your time zone.',
      })
    : pageMetadata({
        path: '/student-portal',
        title: 'Master Classes Are Coming',
        description:
          'Live online master classes from Mizra Consulting in product management, product ownership, HR and more. Free for now. Leave your email to hear when registration opens.',
      });
}

const STEPS = [
  { title: 'Pick a class', text: 'Filter by topic and choose the session that suits you.' },
  { title: 'Register in a minute', text: 'Name, email and WhatsApp number are all we need. No account to create.' },
  { title: 'Get your link', text: 'Your join link and calendar invite arrive by email.' },
  { title: 'Join live', text: 'Learn from a practising product owner and ask your own questions.' },
];

const FAQ = [
  {
    q: 'Do I need an account to register?',
    a: 'No. Your name, email and WhatsApp number are enough. Students under 18 are registered by a parent or guardian, who receives all messages.',
  },
  { q: 'How much does a class cost?', a: 'Classes are free for now.' },
  {
    q: 'Which time zone are the classes in?',
    a: 'Every class time is shown in your own time zone, with the UTC offset, so you always see when it starts for you.',
  },
];

const container = 'mx-auto max-w-[1200px] px-4 sm:px-8';

export default async function StudentPortalPage() {
  if (!isRegistrationOpen()) return <MasterClassesComing />;

  const classes = await getClasses();

  return (
    <div className="bg-mz-cream text-[17px] leading-relaxed text-mz-ink">
      <section className="pb-10 pt-14 sm:pt-16">
        <div className={container}>
          <p className="mb-4 font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-mz-accent">
            Master classes
          </p>
          <h1 className="font-display mb-5 max-w-[820px] text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[46px]">
            Live master classes in product management, product ownership and HR.
          </h1>
          <p className="max-w-[640px] text-[19px] text-mz-body sm:text-[20px]">
            Pick a class, register with your name, email and WhatsApp number, and get your join link and a
            calendar invite. No account needed. Students under 18 are registered by a parent or guardian.
          </p>
        </div>
      </section>

      <section className="pb-20 pt-4 sm:pb-24">
        <div className={container}>
          {classes === null ? (
            <p role="status" className="rounded-[20px] border border-mz-border bg-white p-7 text-mz-body">
              We could not load the class list just now. Please try again in a few minutes.
            </p>
          ) : classes.length === 0 ? (
            <div className="max-w-2xl">
              <p className="mb-6 text-mz-body">
                New classes are being scheduled. Leave your email and we&apos;ll tell you as soon as dates are open
                for registration.
              </p>
              <ClassInterestForm />
            </div>
          ) : (
            <ClassList classes={classes} />
          )}
        </div>
      </section>

      <section className="border-y border-mz-border bg-white py-16 sm:py-20">
        <div className={container}>
          <h2 className="font-display mb-10 text-[30px] font-semibold leading-tight sm:text-[34px]">How it works</h2>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <p aria-hidden="true" className="font-display mb-2.5 text-[40px] font-semibold leading-none text-mz-accent">
                  {i + 1}
                </p>
                <h3 className="mb-1.5 font-sans text-xl font-semibold">{step.title}</h3>
                <p className="text-base text-mz-body">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[820px] px-4 sm:px-8">
          <h2 className="font-display mb-8 text-[30px] font-semibold leading-tight sm:text-[34px]">Questions</h2>
          <div className="border-b border-mz-chip">
            {FAQ.map((item) => (
              <details key={item.q} className="group border-t border-mz-chip py-[18px]">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[19px] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl font-normal text-mz-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-mz-body">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-mz-body">
            Is there a topic you would like us to teach?{' '}
            <Link href="/#start" className="font-semibold text-mz-accent underline">
              Tell us.
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
