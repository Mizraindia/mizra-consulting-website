import type { ServiceContent } from './types';

// Source: the owner's Salesforce workbook (02-Salesforce) and confirmed-facts.md.
// Left out on purpose until the owner confirms them: certifications, named project
// leads, claims of past results, prices, and the founder's personal history.

export const SALESFORCE: ServiceContent = {
  slug: 'salesforce',
  name: 'Salesforce',
  metaTitle: 'Salesforce Implementation, Migration and Clean-up',
  metaDescription:
    'Salesforce implementation, data migration, clean-up, integrations and ongoing support for companies of 20 to 1,000 people. Fixed price for a defined scope.',
  serviceType: 'Salesforce implementation, data migration and support',
  hero: {
    title: 'A Salesforce setup your team actually uses, with clean data and the reports your leaders ask for.',
    intro:
      'For companies of 20 to 1,000 people with a sales or service team. Software, data and workflows that fit how your business runs, so your team stops fighting the tools.',
    situations: [
      'Buying Salesforce for the first time',
      'Moving from another CRM or from spreadsheets',
      'Rescuing a Salesforce setup nobody trusts',
    ],
    button: 'Get my free review',
  },
  problems: {
    heading: 'If you have said any of these, we should talk.',
    quotes: [
      'Nobody updates the CRM.',
      'We have three versions of every customer.',
      'Our forecast is a guess.',
      'The last consultant left and nobody knows how it works.',
      'Reports take a day to build.',
    ],
    costs: [
      'Duplicate records mean two reps call the same customer.',
      'Missing data means leaders do not trust reports, so they decide on instinct.',
    ],
    signs: {
      heading: 'Signs your Salesforce needs a rescue',
      items: [
        'Many custom fields that nobody uses',
        'Automation nobody can explain',
        'Admins who have left',
        'Reports that disagree with each other',
      ],
    },
  },
  offerings: {
    heading: 'What we do',
    items: [
      {
        title: 'Implementation and customisation',
        included:
          'Discovery workshops, configuration of objects and fields, page layouts, Flows, reports and dashboards, and user training.',
        receive: 'A working Salesforce org, documentation and training recordings.',
        need: 'A decision-maker, and a process owner for each team.',
      },
      {
        title: 'Data migration',
        text: 'From HubSpot, Zoho, spreadsheets or an older CRM into Salesforce. We map every field, test in a sandbox, run a trial migration, and only then migrate for real. We keep a backup of the source and a full record of what moved.',
      },
      {
        title: 'Data clean-up and governance',
        text: 'De-duplication, standard picklists, validation rules, ownership rules, and a short data-quality guide so the mess does not come back.',
      },
      {
        title: 'Integrations and automation',
        text: 'Website forms, email, accounting, support tools and Zoho or other CRMs, connected using native Salesforce tools, Flow, Apex or an integration platform where it is the right choice.',
      },
      {
        title: 'Ongoing support and product ownership',
        text: 'A monthly plan with a fixed number of hours for admin tasks and small changes, and a roadmap review each quarter or whenever you ask.',
      },
    ],
  },
  method: {
    heading: 'How a Salesforce project runs',
    steps: ['Discover', 'Design', 'Build in a sandbox', 'Test with real users', 'Train', 'Launch', 'Support'],
    stepsNote: 'You see a working demo every week throughout.',
    details: [
      {
        title: 'Testing',
        text: 'Every change is built and tested in a sandbox. Real users test with real scenarios before launch, and we keep a list of what was tested.',
      },
      {
        title: 'Training',
        text: 'Short live sessions by team, recorded for new joiners, plus one-page guides for the five things each role does every day.',
      },
      {
        title: 'When requirements change',
        text: 'We write the change down with its effect on time and cost, you approve it, and it goes into the plan. No surprises.',
      },
    ],
    timeline:
      'Most implementations take 8 to 12 weeks. More teams, more integrations, messy data and slow decisions make a project take longer and cost more.',
  },
  products: {
    heading: 'Salesforce products and tools',
    groups: [
      {
        title: 'Products',
        items: [
          'Sales Cloud and Service Cloud, in depth',
          'Experience Cloud, for customer portals',
          'Marketing Cloud, on request',
        ],
      },
      {
        title: 'Tools',
        items: [
          'Flow first',
          'Apex and Lightning Web Components when needed',
          'Data Loader and similar tools for migration',
        ],
      },
    ],
    saysNo:
      'What we say no to: heavy CPQ and Marketing Cloud programmes that need large specialist teams, unless we bring in a partner.',
  },
  principles: {
    heading: 'Three rules we never break',
    items: ['Never migrate without a trial run.', 'Never build in production.', 'Never leave without documentation.'],
    extra: {
      title: 'Your data stays safe',
      text: 'Least-privilege access, no data on personal devices, a non-disclosure agreement before any data is shared, and our access removed on the last day.',
    },
  },
  faq: [
    {
      q: 'How do you handle scope changes mid-project?',
      a: 'When a new requirement comes up, we work out its exact effect on your timeline and cost, explain the trade-off, and get your sign-off before changing a single field or workflow.',
    },
    {
      q: 'What do you do about our messy data and old systems?',
      a: 'We look under the hood before building anything. We audit your existing data, clean out obsolete fields and plan the integrations, so you are not putting a new interface over a broken data foundation.',
    },
    {
      q: 'How do you make sure our team actually uses it after go-live?',
      a: 'We involve your daily users during discovery, keep layouts simple, and train your people thoroughly so they trust the tool instead of going back to spreadsheets.',
    },
    {
      q: 'What happens after launch?',
      a: 'You get 30 days of free bug fixing and a 120-minute training session for your whole team. After that, ongoing help is available on a monthly support plan.',
    },
    {
      q: 'What is included in the price?',
      a: 'You get a fixed price for a defined scope, in writing, within 3 working days of our call. If something is not in the agreed scope, we discuss it with you before it ever reaches an invoice.',
    },
    {
      q: 'How do we know the project worked?',
      a: 'We agree concrete measures of success with you before we build anything, such as faster sales cycles, no lost leads, or clear real-time pipeline reports for leadership.',
    },
    {
      q: 'Can you work with our existing admin?',
      a: 'Yes. We document everything and hand it over.',
    },
    {
      q: 'What if you disappear?',
      a: 'Everything is documented, and you own the org, the data and the configuration.',
    },
    {
      q: 'Not sure yet? What is the lowest-risk first step?',
      a: 'A free 30-minute review of your current setup, or a short paid discovery that ends with a written plan you can take to anyone.',
    },
  ],
  closing: {
    title: 'Tell us what is not working in your Salesforce.',
    text: 'We will tell you honestly what we would do. A real person replies within 4 business hours.',
  },
};
