import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Only real, finished pages. /privacy and /terms are left out until a lawyer has
// reviewed them (they are also marked noindex until then). /blog (Resources) is left
// out until the first article is published.
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route || '/'}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
