// Shape of a service page's content. Each service page has its own file in this folder;
// src/components/ServicePage.tsx lays it out using the homepage design.

export interface ServiceOffering {
  title: string;
  text?: string;
  included?: string;
  receive?: string;
  need?: string;
}

export interface ServiceBox {
  heading: string;
  items: string[];
  /** Show the items as a bulleted list (otherwise as plain lines). */
  bullets?: boolean;
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
    /** One or two cards under the quotes. */
    boxes: ServiceBox[];
  };
  offerings: { heading: string; items: ServiceOffering[] };
  method: {
    heading: string;
    steps: string[];
    stepsNote?: string;
    details: { title: string; text: string }[];
    timeline?: { label: string; text: string };
  };
  products?: {
    heading: string;
    groups: { title: string; items: string[] }[];
    saysNo?: string;
  };
  principles?: { heading: string; items: string[]; extra?: { title: string; text: string } };
  faqHeading: string;
  faq: { q: string; a: string }[];
  closing: { title: string; text: string };
}
