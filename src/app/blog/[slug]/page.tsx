import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from '@/components/Markdown';
import StructuredData from '@/components/StructuredData';
import { formatDate, getAllPosts, getPost } from '@/lib/blog';
import { pageMetadata } from '@/lib/metadata';
import { COMPANY, SITE_URL, organizationData } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Only the articles that exist; anything else under /blog/ is a 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) return {};
  const base = pageMetadata({ path: `/blog/${post.slug}`, title: post.title, description: post.description });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const organization = organizationData();
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: COMPANY.name, url: SITE_URL },
        publisher: organization,
        image: `${SITE_URL}/og-image.jpg`,
        mainEntityOfPage: url,
        url,
      },
      ...(post.faq.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: post.faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            },
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="bg-mz-cream text-[18px] leading-relaxed text-mz-ink">
      <StructuredData data={structuredData} />

      <section className="bg-mz-ink pb-14 pt-10 text-mz-cream sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-[820px] px-4 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-mz-lilac">
            <Link href="/" className="hover:text-mz-amber">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href="/blog" className="hover:text-mz-amber">
              Resources
            </Link>
          </nav>
          <p className="mb-5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-mz-amber">
            {post.category}
          </p>
          <h1 className="font-display mb-6 text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[42px] lg:text-[48px]">
            {post.title}
          </h1>
          <p className="text-[16px] text-mz-lilac">
            <span>{post.author}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{post.readTime}</span>
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-[820px] px-4 py-14 sm:px-8 sm:py-16">
        <Markdown tokens={post.body} />

        <aside
          aria-labelledby="article-cta"
          className="mt-14 rounded-[28px] bg-mz-deep p-8 text-white sm:p-12"
        >
          <h2 id="article-cta" className="font-display mb-3 text-[28px] font-semibold leading-tight sm:text-[34px]">
            {post.cta.heading}
          </h2>
          <p className="mb-7 text-[19px] text-mz-mist">{post.cta.text}</p>
          <Link
            href="/#start"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-mz-amber px-8 text-[17px] font-semibold text-mz-ink hover:bg-[#ffbb33]"
          >
            Tell us what you need
          </Link>
        </aside>
      </article>
    </div>
  );
}
