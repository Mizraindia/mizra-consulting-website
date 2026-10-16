import Link from 'next/link';
import Image from 'next/image';
import { ADDRESS_ONE_LINE, COMPANY, SERVICE_LINKS } from '@/lib/site';
import { CookieSettingsButton } from '@/components/Analytics';

// Resources is left out until the first article is published (owner decision, Phase C).
const companyLinks = [
  { name: 'How it works', href: '/#path' },
  { name: 'Master classes', href: '/student-portal' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// py-2.5 keeps each link a comfortable 44px tap target on phones.
const linkClass = 'inline-block py-2.5 text-mz-lilac hover:text-mz-amber transition-colors';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mz-ink text-mz-lilac">
      <div className="mx-auto flex max-w-[1200px] flex-wrap gap-12 px-4 pb-8 pt-16 sm:px-8 md:pt-[72px]">
        <div className="min-w-0 flex-[1_1_280px]">
          <Link href="/" className="mb-4 inline-flex items-center gap-3">
            <Image
              src="/brand/mizra-logo-horizontal-dark.png"
              alt="Mizra"
              width={168}
              height={38}
              className="h-[38px] w-auto"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Consulting</span>
          </Link>
          <p className="max-w-[320px]">Salesforce, Zoho, custom software and consulting for clients worldwide.</p>
          <p className="mt-3.5 max-w-[320px] text-[15px]">
            Mizra is the direction where the sun rises. Every day is a new chance to move forward.
          </p>
        </div>

        <div className="min-w-0 flex-[1_1_150px]">
          <h2 className="mb-1 font-sans text-base font-semibold text-mz-cream">Services</h2>
          <ul>
            {SERVICE_LINKS.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-[1_1_150px]">
          <h2 className="mb-1 font-sans text-base font-semibold text-mz-cream">Company</h2>
          <ul>
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className={linkClass}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-[1_1_220px]">
          <h2 className="mb-1 font-sans text-base font-semibold text-mz-cream">Say hello</h2>
          <ul>
            <li>
              <a href={`mailto:${COMPANY.email}`} className={linkClass}>
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={COMPANY.whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp {COMPANY.whatsappDisplay}
              </a>
            </li>
            {COMPANY.linkedinUrl && (
              <li>
                <a href={COMPANY.linkedinUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 border-t border-mz-line px-4 pb-10 pt-6 text-sm sm:px-8 md:flex-row md:items-start md:justify-between">
        <p>
          © {currentYear} {COMPANY.legalName} · CIN {COMPANY.cin} · {ADDRESS_ONE_LINE}
        </p>
        <div className="flex flex-shrink-0 items-center gap-6">
          <Link href="/privacy" className={linkClass}>
            Privacy policy
          </Link>
          <Link href="/terms" className={linkClass}>
            Terms
          </Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
