// Shape of a service page's content. Each service page has its own file in this folder;
// src/components/ServicePage.tsx lays it out using the homepage design.

export interface ServiceOffering {
  title: string;
  text?: string;
  included?: string;
  receive?: string;
  need?: string;
}

export interface ServiceContent {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  /** Used in search-engine data (schema.org Service). */
  serviceType: string;
  hero: {
    title: string;
    intro: string;
    situations: string[];
    button: string;
  };
  problems: {
    heading: string;
    quotes: string[];
    costs: string[];
    signs?: { heading: string; items: string[] };
  };
  offerings: { heading: string; items: ServiceOffering[] };
  method: {
    heading: string;
    steps: string[];
    stepsNote?: string;
    details: { title: string; text: string }[];
    timeline?: string;
  };
  products?: {
    heading: string;
    groups: { title: string; items: string[] }[];
    saysNo?: string;
  };
  principles?: { heading: string; items: string[]; extra?: { title: string; text: string } };
  faq: { q: string; a: string }[];
  closing: { title: string; text: string };
}
