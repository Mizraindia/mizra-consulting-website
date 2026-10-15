// Confirmed company facts, in one place. Used by the footer, contact page,
// legal pages and search-engine data. Change a fact here, not in each page.

export const SITE_URL = 'https://mizraconsulting.com';

export const COMPANY = {
  name: 'Mizra Consulting',
  legalName: 'Mizra Consulting Pvt Ltd',
  cin: 'U62090HR2025PTC133377',
  email: 'info@mizraconsulting.com',
  privacyEmail: 'privacy@mizraconsulting.com',
  whatsappDisplay: '+91 92057 10374',
  whatsappUrl: 'https://wa.me/919205710374',
  // Set to the real company page address once it exists. The link is hidden while this is null.
  linkedinUrl: null as string | null,
  address: {
    street: '7th Floor, Palm Court, 704, Mehrauli Gurugram Road',
    city: 'Gurugram',
    postalCode: '122007',
    country: 'India',
  },
  hours: '9 am to 7 pm India time (IST), Monday to Friday',
};

/** The four services. Point these at the service pages once they exist (Phase C, step 2). */
export const SERVICE_LINKS = [
  { name: 'Salesforce', href: '/#salesforce' },
  { name: 'Zoho', href: '/#zoho' },
  { name: 'Custom development', href: '/#custom-development' },
  { name: 'Consulting', href: '/#consulting' },
];

export const ADDRESS_ONE_LINE = `${COMPANY.address.street}, ${COMPANY.address.city} ${COMPANY.address.postalCode}, ${COMPANY.address.country}`;

/** The four promises the owner confirmed (shown where the old number blocks were). */
export const PROMISES = [
  { value: '4 hours', label: 'Reply within 4 business hours (Monday to Friday, India time)' },
  { value: '3 days', label: 'A written fixed estimate within 3 working days of our call' },
  { value: '30 days', label: 'Free bug fixing for 30 days after launch' },
  { value: 'Yours', label: 'You own the code, data and configuration' },
];

/** Organization data for search engines (JSON-LD). No phone number, by owner decision. */
export function organizationData() {
  return {
    '@type': 'Organization',
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/mizra-logo.png`,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.city,
      postalCode: COMPANY.address.postalCode,
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: COMPANY.email,
      availableLanguage: ['English'],
    },
    ...(COMPANY.linkedinUrl ? { sameAs: [COMPANY.linkedinUrl] } : {}),
  };
}
