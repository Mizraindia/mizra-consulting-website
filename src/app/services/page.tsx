import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, Cloud, Brain, Zap, Users, Cog, ArrowRight, CheckCircle } from 'lucide-react';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'IT Services - Custom Software, Cloud, AI/ML Solutions',
  description: 'Comprehensive IT consulting services including custom software development, cloud solutions, AI/ML, DevOps, digital transformation, and IT staff augmentation.',
  keywords: [
    'custom software development',
    'cloud computing services',
    'AI machine learning',
    'DevOps consulting',
    'digital transformation',
    'IT staff augmentation',
    'enterprise software',
    'SaaS development',
  ],
};

const services = [
  {
    id: 'software',
    icon: Code,
    title: 'Custom Software Development',
    description: 'Build scalable, secure, and high-performance software solutions tailored to your business needs.',
    features: [
      'Web Application Development',
      'Mobile App Development (iOS/Android)',
      'Enterprise Software Solutions',
      'API Development & Integration',
      'Legacy System Modernization',
      'MVP & Product Development',
    ],
    technologies: ['React', 'Node.js', 'Python', 'Java', '.NET', 'Flutter'],
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'Cloud Solutions & DevOps',
    description: 'Accelerate your digital transformation with scalable cloud infrastructure and DevOps practices.',
    features: [
      'Cloud Migration & Strategy',
      'AWS, Azure, GCP Solutions',
      'CI/CD Pipeline Implementation',
      'Infrastructure as Code (IaC)',
      'Container Orchestration (Kubernetes)',
      'Cloud Security & Compliance',
    ],
    technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Leverage artificial intelligence and machine learning to unlock data-driven insights and automation.',
    features: [
      'Machine Learning Model Development',
      'Natural Language Processing (NLP)',
      'Computer Vision Solutions',
      'Predictive Analytics',
      'AI-Powered Automation',
      'Data Engineering & Analytics',
    ],
    technologies: ['TensorFlow', 'PyTorch', 'Python', 'Scikit-learn', 'OpenAI', 'Hugging Face'],
  },
  {
    id: 'digital',
    icon: Zap,
    title: 'Digital Transformation',
    description: 'Modernize your business operations with end-to-end digital transformation strategies.',
    features: [
      'Business Process Automation',
      'Digital Strategy Consulting',
      'System Integration',
      'Workflow Optimization',
      'Change Management',
      'Technology Roadmap Planning',
    ],
    technologies: ['Low-Code Platforms', 'RPA', 'Integration Tools', 'Analytics'],
  },
  {
    id: 'consulting',
    icon: Cog,
    title: 'IT Consulting',
    description: 'Expert guidance to align technology with your business objectives and drive growth.',
    features: [
      'Technology Assessment',
      'Architecture Design',
      'Security Audits',
      'Performance Optimization',
      'Scalability Planning',
      'Technical Due Diligence',
    ],
    technologies: ['Best Practices', 'Industry Standards', 'Frameworks'],
  },
  {
    id: 'staffing',
    icon: Users,
    title: 'IT Staff Augmentation',
    description: 'Scale your team with skilled IT professionals to meet project demands and deadlines.',
    features: [
      'Dedicated Development Teams',
      'Contract-to-Hire Options',
      'Specialized Skill Sets',
      'Flexible Engagement Models',
      'Quick Onboarding',
      'Quality Assurance',
    ],
    technologies: ['Full-Stack', 'Frontend', 'Backend', 'DevOps', 'QA', 'Mobile'],
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    description: 'Understand your business goals, challenges, and requirements',
  },
  {
    step: '02',
    title: 'Strategy',
    description: 'Design a tailored solution architecture and implementation plan',
  },
  {
    step: '03',
    title: 'Development',
    description: 'Build and iterate using agile methodologies with continuous feedback',
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Deploy, test, and ensure seamless integration with your systems',
  },
  {
    step: '05',
    title: 'Support',
    description: 'Provide ongoing maintenance, updates, and technical support',
  },
];

export default function ServicesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'IT Consulting Services',
    provider: {
      '@type': 'Organization',
      name: 'Mizra Consulting',
      url: 'https://mizraconsulting.com',
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IT Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
        },
      })),
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-beige-100">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive IT Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From custom software development to cloud solutions and AI implementation, 
            we deliver technology solutions that drive business growth.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6">
                  <service.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {service.description}
                </p>
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`card bg-gradient-to-br from-primary-50 to-beige-50 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="aspect-video bg-white/50 rounded-lg flex items-center justify-center">
                  <service.icon className="w-24 h-24 text-primary-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Development Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven methodology that ensures quality, transparency, and timely delivery
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
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
              Let&apos;s Build Something Great Together
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Ready to start your project? Get in touch with our team for a free consultation.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
