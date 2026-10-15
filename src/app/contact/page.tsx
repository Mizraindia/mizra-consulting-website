import { pageMetadata } from '@/lib/metadata';
import { Mail, MessageCircle, MapPin, Clock, Linkedin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import StructuredData from '@/components/StructuredData';
import { ADDRESS_ONE_LINE, COMPANY, PROMISES, organizationData } from '@/lib/site';

export const metadata = pageMetadata({
  path: '/contact',
  title: 'Contact Us - Get in Touch with Our IT Consulting Team',
  description:
    'Tell Mizra Consulting what you need: Salesforce, Zoho, custom development or consulting. We reply within 4 business hours, Monday to Friday, India time.',
});

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: COMPANY.whatsappDisplay,
    href: COMPANY.whatsappUrl,
  },
  ...(COMPANY.linkedinUrl
    ? [{ icon: Linkedin, title: 'LinkedIn', value: 'Mizra Consulting on LinkedIn', href: COMPANY.linkedinUrl }]
    : []),
  {
    icon: MapPin,
    title: 'Registered office',
    value: ADDRESS_ONE_LINE,
    href: null,
  },
  {
    icon: Clock,
    title: 'Working hours',
    value: COMPANY.hours,
    href: null,
  },
];

export default function ContactPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    mainEntity: organizationData(),
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
                Tell us what you need. We reply within 4 business hours (Monday to Friday, India time).
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
                  Our promises to you
                </h3>
                <ul className="space-y-2 text-gray-700">
                  {PROMISES.map((promise) => (
                    <li key={promise.value}>✓ {promise.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Based in India, working worldwide
          </h2>
          <p className="text-lg text-gray-600">
            We work from Gurugram, India, with clients anywhere. Calls are booked in India mornings
            for Europe and the Middle East, afternoons for Australia, and evenings for the US East Coast.
          </p>
        </div>
      </section>
    </>
  );
}
