import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mizraconsulting.com';
  const routes = [
    '',
    '/about',
    '/services',
    '/industries',
    '/faq',
    '/contact',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route || '/'}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}


