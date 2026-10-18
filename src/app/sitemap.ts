import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getAllPosts } from '@/lib/blog';
import { getClasses, isRegistrationOpen } from '@/lib/classes';

// Only real, finished pages. /privacy and /terms are left out until a lawyer has
// reviewed them (they are also marked noindex until then). Articles are added
// automatically from src/content/blog.
const routes = [
  '',
  '/services',
  '/salesforce',
  '/zoho',
  '/custom-development',
  '/consulting',
  '/about',
  '/contact',
  '/student-portal',
  '/blog',
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route || '/'}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  const articles: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Class pages exist only while registration is switched on.
  const classes: MetadataRoute.Sitemap = isRegistrationOpen()
    ? ((await getClasses()) ?? []).map((c) => ({
        url: `${SITE_URL}/student-portal/${c.id}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.6,
      }))
    : [];

  return [...pages, ...articles, ...classes];
}
