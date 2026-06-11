import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Eye, Award, Users, Globe, TrendingUp, ArrowRight } from 'lucide-react';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'About Us - Leading IT Consulting & Software Development Company',
  description: 'Learn about Mizra Consulting - a trusted IT services partner delivering innovative software solutions, cloud services, and digital transformation expertise worldwide.',
  keywords: [
    'IT consulting company',
    'software development firm',
    'technology consulting',
    'digital transformation experts',
    'IT services provider',
  ],
};

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every project, delivering high-quality solutions that exceed expectations.',
  },
  {
    icon: Users,
    title: 'Client-Centric',
    description: 'Your success is our priority. We build lasting partnerships through transparency and collaboration.',
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'We embrace cutting-edge technologies and innovative approaches to solve complex business challenges.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving clients worldwide with local expertise and global standards of service delivery.',
  },
];

const stats = [
  { value: '2015', label: 'Founded' },
  { value: '100+', label: 'Projects Completed' },
  { value: '50+', label: 'Enterprise Clients' },
  { value: '15+', label: 'Countries' },
];

const expertise = [
  'Custom Software Development',
  'Cloud Architecture & Migration',
  'AI & Machine Learning',
  'DevOps & Automation',
  'Digital Transformation',
  'Enterprise Solutions',
  'Mobile Development',
  'Data Engineering',
];

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Organization',
      name: 'Mizra Consulting',
      description: 'Leading IT consulting firm specializing in custom software development, cloud solutions, and digital transformation.',
      foundingDate: '2015',
      url: 'https://mizraconsulting.com',
      logo: 'https://mizraconsulting.com/mizra-logo.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-92057-10374',
        contactType: 'Customer Service',
        email: 'info@mizraconsulting.com',
      },
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-beige-100">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Mizra Consulting
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering businesses with innovative technology solutions since 2015
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2015, Mizra Consulting emerged from a vision to bridge the gap between 
                  business challenges and technology solutions. What started as a small team of passionate 
                  developers has grown into a full-service IT consulting firm serving clients across the globe.
                </p>
                <p>
                  We specialize in delivering custom software development, cloud solutions, AI/ML implementation, 
                  and comprehensive digital transformation services. Our expertise spans multiple industries, 
                  from FinTech and HealthTech to E-Commerce and Enterprise SaaS.
                </p>
                <p>
                  Today, we&apos;re proud to have delivered 100+ successful projects, partnered with 50+ enterprise 
                  clients, and maintained a 98% client satisfaction rate. Our commitment to excellence, innovation, 
                  and client success drives everything we do.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="card text-center bg-gradient-to-br from-primary-50 to-beige-50">
                  <div className="text-4xl font-bold text-primary-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To empower businesses with innovative, scalable, and secure technology solutions 
                that drive digital transformation and sustainable growth. We&apos;re committed to delivering 
                exceptional value through cutting-edge expertise, agile methodologies, and unwavering 
                dedication to client success.
              </p>
            </div>
            <div className="card">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be the most trusted technology partner for businesses worldwide, recognized for 
                our innovation, excellence, and transformative impact. We envision a future where 
                technology seamlessly enables business success, and we&apos;re at the forefront of making 
                that vision a reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work and relationships
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology capabilities to meet your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {expertise.map((item, index) => (
              <div
                key={index}
                className="bg-white px-6 py-4 rounded-lg text-center font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how we can help transform your business with innovative technology solutions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
