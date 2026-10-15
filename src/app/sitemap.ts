import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Only real, finished pages. /privacy and /terms are left out until a lawyer has
// reviewed them (they are also marked noindex until then).
const routes = ['', '/services', '/about', '/contact', '/student-portal', '/blog'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route || '/'}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
