import type { Metadata } from 'next';
import { COMPANY } from './site';

const SHARE_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Mizra: Salesforce, Zoho, custom development and consulting',
};

/**
 * Title, description, canonical address and social-sharing tags for one page.
 * Each page must declare its own canonical address; otherwise it inherits the
 * homepage's and search engines may treat it as a copy of the homepage.
 */
export function pageMetadata({
  path,
  title,
  description,
  noindex = false,
}: {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: COMPANY.name,
      url: path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SHARE_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
