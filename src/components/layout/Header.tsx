'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SERVICES_MENU } from '@/lib/site';

const navigation = [
  { name: 'Master classes', href: '/student-portal' },
  { name: 'How it works', href: '/#path' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const servicesMenu = useRef<HTMLDetailsElement>(null);

  // Close the Services menu on Escape or a click elsewhere.
  useEffect(() => {
    const close = (e: Event) => {
      const menu = servicesMenu.current;
      if (!menu?.open) return;
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !menu.contains(e.target as Node)) {
        menu.open = false;
      }
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  const closeAll = () => {
    setMobileMenuOpen(false);
    if (servicesMenu.current) servicesMenu.current.open = false;
  };

  return (
    <header className="sticky top-0 z-50 bg-mz-ink text-mz-cream">
      <nav aria-label="Main" className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-4 py-3 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-3" onClick={closeAll}>
          <Image
            src="/brand/mizra-logo-horizontal-dark.png"
            alt="Mizra"
            width={168}
            height={38}
            priority
            className="h-[34px] w-auto sm:h-[38px]"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mz-lilac">Consulting</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <details ref={servicesMenu} className="relative">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1.5 font-medium [&::-webkit-details-marker]:hidden">
              Services
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </summary>
            <div className="absolute left-[-16px] top-full z-10 min-w-[240px] rounded-lg border border-mz-line bg-mz-night py-2">
              {SERVICES_MENU.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={closeAll}
                  className="flex min-h-[44px] items-center px-5 hover:bg-mz-line focus-visible:bg-mz-line"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </details>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="inline-flex min-h-[44px] items-center font-medium hover:text-mz-amber"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/#start"
            onClick={closeAll}
            className="hidden min-h-[46px] items-center justify-center rounded-full bg-mz-amber px-[22px] text-[15px] font-semibold text-mz-ink hover:bg-[#ffbb33] sm:inline-flex"
          >
            Tell us what you need
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-mz-night lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-mz-line px-4 pb-6 pt-2 lg:hidden">
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-mz-lilac">Services</p>
          <ul className="mt-1">
            {SERVICES_MENU.map((service) => (
              <li key={service.name}>
                <Link href={service.href} onClick={closeAll} className="flex min-h-[44px] items-center text-lg">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-3 border-t border-mz-line pt-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link href={item.href} onClick={closeAll} className="flex min-h-[44px] items-center text-lg">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#start"
            onClick={closeAll}
            className="mt-4 flex min-h-[50px] items-center justify-center rounded-full bg-mz-amber font-semibold text-mz-ink"
          >
            Tell us what you need
          </Link>
        </div>
      )}
    </header>
  );
}
