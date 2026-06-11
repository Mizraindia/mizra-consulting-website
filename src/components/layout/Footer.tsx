import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

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
              Leading IT consulting firm delivering innovative software solutions, 
              cloud services, and digital transformation expertise to businesses worldwide.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@mizraconsulting.com"
                className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@mizraconsulting.com</span>
              </a>
              <a
                href="tel:+919560316929"
                className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+91 95603 16929</span>
              </a>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>India | UAE | USA</span>
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
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {currentYear} Mizra Consulting. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="https://linkedin.com/company/mizra-consulting"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/mizraconsulting"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
