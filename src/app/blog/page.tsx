import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - IT Insights, Tech Trends & Best Practices',
  description: 'Stay updated with the latest insights on software development, cloud computing, AI/ML, and digital transformation from Mizra Consulting experts.',
  keywords: [
    'IT blog',
    'software development blog',
    'technology insights',
    'cloud computing articles',
    'AI ML tutorials',
    'digital transformation tips',
  ],
};

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-beige-100">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog & Insights
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights on software development, cloud solutions, AI/ML, and digital transformation
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card bg-gradient-to-br from-primary-50 to-beige-50 text-center max-w-3xl mx-auto">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Blog Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We&apos;re working on bringing you valuable insights, tutorials, and industry best practices. 
              This section will be integrated for regular updates on technology trends, 
              case studies, and expert opinions.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-700">Technical tutorials and how-to guides</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-700">Industry trends and analysis</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-700">Case studies and success stories</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-gray-700">Best practices and expert tips</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              <span>Contact Us for Updates</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
