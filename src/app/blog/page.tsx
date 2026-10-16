import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { formatDate, getAllPosts } from '@/lib/blog';
import { pageMetadata } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

// Resources index: one card per article in src/content/blog, newest first.
export const metadata = pageMetadata({
  path: '/blog',
  title: 'Resources',
  description:
    'Straight answers to the questions people ask before choosing a CRM or starting a software project, from the Mizra Consulting team.',
});

export default function BlogPage() {
  const posts = getAllPosts();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mizra Consulting resources',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="bg-mz-cream text-[18px] leading-relaxed text-mz-ink">
      <StructuredData data={structuredData} />

      <section className="bg-mz-ink pb-14 pt-10 text-mz-cream sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-mz-lilac">
            <Link href="/" className="hover:text-mz-amber">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Resources</span>
          </nav>
          <h1 className="font-display mb-5 text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[52px]">
            Resources
          </h1>
          <p className="max-w-[640px] text-[19px] text-mz-mist sm:text-[21px]">
            Straight answers to the questions everyone asks us.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex h-full flex-col rounded-[20px] border border-mz-border bg-white p-7 transition-shadow hover:shadow-lg focus-visible:shadow-lg"
                >
                  <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-mz-accent">
                    {post.category}
                  </p>
                  <h2 className="font-display mb-3 text-[24px] font-semibold leading-[1.3]">{post.title}</h2>
                  <p className="mb-6 flex-1 text-[17px] text-mz-body">{post.description}</p>
                  <p className="text-[15px] text-mz-muted">
                    {post.readTime}
                    <span aria-hidden="true"> · </span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
