import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { Target, Eye, Award, Users, Globe, TrendingUp, ArrowRight } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import Promises from '@/components/Promises';
import { organizationData } from '@/lib/site';

export const metadata = pageMetadata({
  path: '/about',
  title: 'About Us - Salesforce, Zoho, Custom Development & Consulting',
  description:
    'Mizra Consulting helps companies implement Salesforce and Zoho, build custom web and mobile software, and fix the processes behind them. Based in Gurugram, India, working with clients worldwide.',
});

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
    title: 'Wherever You Are',
    description: 'Calls scheduled in your time zone and clear written updates, wherever you are in the world.',
  },
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
    mainEntity: organizationData(),
  };

  return (
    <>
      <StructuredData data={structuredData} />
      
      <section className="pt-16 pb-20 bg-gradient-to-br from-gray-50 to-beige-100">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Mizra Consulting
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Salesforce, Zoho, custom development and consulting, from Gurugram, India, for clients worldwide
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
                  Mizra means &ldquo;the direction where the sun rises.&rdquo; The sun stands for a fresh
                  start, and the forward mark on it stands for the path forward: every day is a new chance
                  to do something productive.
                </p>
                <p>
                  We help companies implement Salesforce and Zoho, build custom web and mobile software,
                  and fix the processes behind them. We are based in Gurugram, India, and work with clients
                  worldwide, with calls scheduled in your time zone.
                </p>
                <p>
                  Every project gets a written scope and a fixed estimate before work starts, a working
                  demo every week, and a full handover at the end.
                </p>
              </div>
            </div>
            <div>
              <h2 className="sr-only">Our promises to you</h2>
              <Promises variant="cards" />
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
