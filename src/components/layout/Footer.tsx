import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageCircle, MapPin, Linkedin } from 'lucide-react';
import { ADDRESS_ONE_LINE, COMPANY } from '@/lib/site';
import { CookieSettingsButton } from '@/components/Analytics';

const footerLinks = {
  services: [
    { name: 'Custom Software Development', href: '/services#software' },
    { name: 'Cloud Solutions', href: '/services#cloud' },
    { name: 'AI & Machine Learning', href: '/services#ai' },
    { name: 'Digital Transformation', href: '/services#digital' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Master classes', href: '/student-portal' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/mizra-logo.svg"
                alt="Mizra Consulting"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-white">
                Mizra <span className="text-primary-500">Consulting</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Salesforce, Zoho, custom development and consulting. Based in India, working with
              clients worldwide.
            </p>
            <div className="space-y-3">
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>{COMPANY.email}</span>
              </a>
              <a
                href={COMPANY.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>WhatsApp {COMPANY.whatsappDisplay}</span>
              </a>
              {COMPANY.linkedinUrl && (
                <a
                  href={COMPANY.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
                >
                  <Linkedin className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              )}
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Registered office: {ADDRESS_ONE_LINE}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">
          <p>
            © {currentYear} {COMPANY.legalName}. CIN {COMPANY.cin}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-primary-500 transition-colors">
              Terms
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
