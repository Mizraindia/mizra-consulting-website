import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with Our IT Consulting Team',
  description: 'Contact Mizra Consulting for expert IT services, custom software development, and digital transformation solutions. Schedule a free consultation today.',
  keywords: [
    'contact IT consulting',
    'software development inquiry',
    'IT services consultation',
    'technology consulting contact',
  ],
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'info@mizraconsulting.com',
    href: 'mailto:info@mizraconsulting.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+91 95603 16929',
    href: 'tel:+919560316929',
  },
  {
    icon: MapPin,
    title: 'Locations',
    value: 'India | UAE | USA',
    href: null,
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon-Fri: 9AM - 6PM IST',
    href: null,
  },
];

export default function ContactPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Mizra Consulting',
      url: 'https://mizraconsulting.com',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-92057-10374',
        contactType: 'Customer Service',
        email: 'info@mizraconsulting.com',
        availableLanguage: ['English'],
      },
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-beige-100">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your business with innovative IT solutions? 
            Let&apos;s start a conversation.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Reach out to us through any of the following channels. We&apos;re here to help!
              </p>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="card hover:shadow-lg border transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-gray-600 hover:text-primary-500 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card bg-gradient-to-br from-primary-50 to-beige-50 mt-8">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Why Choose Us?
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ Free initial consultation</li>
                  <li>✓ 24-hour response time</li>
                  <li>✓ Flexible engagement models</li>
                  <li>✓ Transparent pricing</li>
                  <li>✓ Proven track record</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Global Presence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Serving clients worldwide with offices in India, UAE, and USA
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center border">
              <div className="text-4xl mb-3">🇮🇳</div>
              <h3 className="font-semibold text-gray-900 mb-2">India</h3>
              <p className="text-gray-600 text-sm">Development Hub</p>
            </div>
            <div className="card text-center border">
              <div className="text-4xl mb-3">🇦🇪</div>
              <h3 className="font-semibold text-gray-900 mb-2">UAE</h3>
              <p className="text-gray-600 text-sm">Middle East Operations</p>
            </div>
            <div className="card text-center border">
              <div className="text-4xl mb-3">🇺🇸</div>
              <h3 className="font-semibold text-gray-900 mb-2">USA</h3>
              <p className="text-gray-600 text-sm">North America Office</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
