import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, Cloud, Brain, Zap } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import ContactForm from '@/components/ContactForm';
import Promises from '@/components/Promises';
import { organizationData } from '@/lib/site';
import { pageMetadata } from '@/lib/metadata';

const HOME_TITLE = 'Mizra Consulting - IT Services & Digital Transformation Solutions';

export const metadata = {
  ...pageMetadata({
    path: '/',
    title: HOME_TITLE,
    description:
      'Mizra Consulting implements Salesforce and Zoho, builds custom web and mobile software, and offers consulting. Based in India, working with clients worldwide. Reply within 4 business hours.',
  }),
  title: { absolute: HOME_TITLE },
};

const services = [
  {
    icon: Code,
    title: 'Custom Software Development',
    description: 'Tailored software solutions built with cutting-edge technologies to meet your unique business needs.',
    href: '/services#software',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions & DevOps',
    description: 'Scalable cloud infrastructure and DevOps practices to accelerate your digital transformation.',
    href: '/services#cloud',
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Intelligent automation and data-driven insights powered by advanced AI and ML technologies.',
    href: '/services#ai',
  },
  {
    icon: Zap,
    title: 'Digital Transformation',
    description: 'End-to-end digital transformation services to modernize your business operations and processes.',
    href: '/services#digital',
  },
];

const whyChooseUs = [
  {
    title: 'Scope agreed in writing',
    description: 'Scope is written and approved before work starts. Any change is written down with its effect on time and cost, and approved before we do it.',
  },
  {
    title: 'A working demo every week',
    description: 'You see real progress every week, not a big reveal at the end.',
  },
  {
    title: 'Calls in your time zone',
    description: 'India mornings for Europe and the Middle East, afternoons for Australia, evenings for the US East Coast.',
  },
  {
    title: 'Training and handover',
    description: 'A 120-minute training session for your whole team, then documentation and full admin access on the last day.',
  },
];

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    ...organizationData(),
    description:
      'Salesforce, Zoho, custom web and mobile development, and consulting. Based in India, working with clients worldwide.',
  };

  return (
    <>
      <StructuredData data={structuredData} />
      
      {/* Hero Section with Form */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-beige-100">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Mobile: Form First, Desktop: Content First */}
            <div className="order-2 lg:order-1 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Business with
                <span className="text-primary-500"> Cutting-Edge IT Solutions</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Expert software development, cloud solutions, and digital transformation services 
                that drive innovation and accelerate growth.
              </p>
              
              {/* Benefits List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700">Free review call to understand what you need</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700">Reply within 4 business hours (Monday to Friday, India time)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700">A written fixed estimate before any work starts</span>
                </div>
              </div>

              <Link href="/services" className="btn-secondary inline-flex items-center justify-center">
                Explore Our Services
              </Link>
            </div>

            {/* Mobile: Form on Top, Desktop: Form on Right */}
            <div className="order-1 lg:order-2 animate-slide-in">
              <div className="bg-white rounded-2xl border shadow-xl p-6 md:p-8 lg:sticky lg:top-24">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Start Your Project Today
                  </h2>
                  <p className="text-gray-600">
                    Tell us what you need. We reply within 4 business hours.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive IT solutions tailored to your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="card group border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <service.icon className="w-12 h-12 text-primary-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <span className="text-primary-500 font-medium inline-flex items-center space-x-1 group-hover:space-x-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mizra Consulting
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              How every project runs, from the first call to handover
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our promises (replaces the old client-number band) */}
      <section className="section-padding bg-[#1A0036] text-white" aria-labelledby="promises-heading">
        <div className="container-custom">
          <h2 id="promises-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our promises to you
          </h2>
          <Promises variant="band" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our IT solutions can help you achieve your business goals
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
