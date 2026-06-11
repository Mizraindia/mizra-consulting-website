import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, Cloud, Brain, Zap } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import ContactForm from '@/components/ContactForm';

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
    title: 'Expert Team',
    description: 'Seasoned professionals with deep expertise in modern technologies and industry best practices.',
  },
  {
    title: 'Proven Track Record',
    description: 'Successfully delivered 100+ projects across diverse industries with measurable business impact.',
  },
  {
    title: 'Agile Approach',
    description: 'Flexible, iterative development process ensuring rapid delivery and continuous improvement.',
  },
  {
    title: 'Cost-Effective',
    description: 'Competitive pricing with transparent billing and no hidden costs for maximum ROI.',
  },
];

const industries = [
  { name: 'FinTech', icon: '💰' },
  { name: 'HealthTech', icon: '🏥' },
  { name: 'EdTech', icon: '📚' },
  { name: 'E-Commerce', icon: '🛒' },
  { name: 'SaaS', icon: '☁️' },
  { name: 'Enterprise', icon: '🏢' },
];

const stats = [
  { value: '100+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '15+', label: 'Countries Served' },
  { value: '98%', label: 'Client Satisfaction' },
];

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mizra Consulting',
    description: 'Leading IT consulting firm specializing in custom software development, cloud solutions, AI/ML, and digital transformation services.',
    url: 'https://mizraconsulting.com',
    logo: 'https://mizraconsulting.com/mizra-logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-92057-10374',
      contactType: 'Customer Service',
      email: 'info@mizraconsulting.com',
    },
    sameAs: [
      'https://linkedin.com/company/mizra-consulting',
      'https://twitter.com/mizraconsulting',
    ],
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
                  <span className="text-gray-700">Free consultation & project assessment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700">24-hour response time guaranteed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-700">Trusted by 50+ enterprise clients</span>
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
                    Get a free consultation in 3 simple steps
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
              Partner with a team that delivers excellence
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

      {/* Industries Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Delivering specialized solutions across diverse sectors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="card text-center border hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold text-gray-900">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-500 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
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
