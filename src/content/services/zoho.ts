import type { ServiceContent } from './types';

// Source: the owner's Zoho workbook (03-Zoho), homepage workbook (Zoho answers) and
// confirmed-facts.md. Left out on purpose: prices, any certification or partner
// status (the owner holds none), products marked "some experience", and unnamed "others".

export const ZOHO: ServiceContent = {
  slug: 'zoho',
  name: 'Zoho',
  metaTitle: 'Zoho CRM, Zoho One and Zoho Creator Setup',
  metaDescription:
    'Zoho CRM setup, Zoho One roll-outs, Creator apps, migrations and integrations for companies of 10 to 200 people, set up as one connected system.',
  serviceType: 'Zoho CRM, Zoho One and Zoho Creator implementation',
  hero: {
    title: 'One Zoho setup that matches how your business really works, with every tool talking to the others.',
    intro:
      'For companies of 10 to 200 people that want CRM, finance, support and projects in one connected suite, without paying enterprise prices.',
    situations: [
      'Setting up Zoho CRM around your real sales process',
      'Rolling out Zoho One across your departments',
      'Moving to Zoho, or from Zoho to Salesforce',
    ],
    button: 'Get my free Zoho review',
  },
  problems: {
    heading: 'If you have said any of these, we should talk.',
    quotes: [
      'We are wasting so much time on manual paperwork.',
      'We juggle a dozen apps for invoicing, email and leads, and none of them talk to each other.',
      'We need an affordable, all-in-one system without spending a fortune.',
    ],
    boxes: [
      {
        heading: 'When we recommend Zoho',
        bullets: true,
        items: [
          'Smaller teams and tighter budgets',
          'You want CRM, finance and support in one suite',
          'You need to go live quickly',
        ],
      },
      {
        heading: 'When Salesforce is the better choice',
        bullets: true,
        items: [
          'Complex sales processes',
          'Heavy customisation',
          'Many integrations with enterprise systems',
          'Large numbers of users',
        ],
      },
    ],
  },
  offerings: {
    heading: 'What we do',
    items: [
      {
        title: 'Zoho CRM setup and customisation',
        included:
          'Pipelines, fields and layouts around your real sales process, custom modules, role-based access, lead scoring, email templates, workflows and reports.',
        receive: 'A working CRM, documentation and training.',
      },
      {
        title: 'Zoho One roll-outs',
        text: 'We map which departments use which apps, set up users and roles, connect the apps so customer data flows between them, then train each team.',
      },
      {
        title: 'Automation and custom apps with Zoho Creator',
        text: 'Approval flows, quote generation, onboarding checklists, and internal tools that replace spreadsheets.',
      },
      {
        title: 'Lead capture and routing',
        text: 'Leads from your web forms, landing pages and inbound email captured automatically and assigned to the right person straight away.',
      },
      {
        title: 'Billing and document integration',
        text: 'Quotes, sales orders, invoices and payment tracking connected inside Zoho, so closing a sale flows straight into fulfilment.',
      },
      {
        title: 'Migration and integrations',
        text: 'From spreadsheets, HubSpot, Salesforce and older CRMs into Zoho, and from Zoho to Salesforce when a company outgrows it. We also connect Zoho to website forms, WhatsApp, Google Workspace, payment gateways and accounting tools.',
      },
    ],
  },
  method: {
    heading: 'How a Zoho project runs',
    steps: [
      'Map the process',
      'Design the setup',
      'Build in a test environment',
      'Test with real users',
      'Train',
      'Launch',
      'Support',
    ],
    stepsNote: 'You see a working demo every week throughout.',
    details: [
      {
        title: 'One connected system',
        text: 'We set up the whole suite as one connected system, document it, and train your team. A freelancer usually fixes one app at a time.',
      },
      {
        title: 'Moving data without losing it',
        text: 'We map every field, run a trial migration in a test environment, check the results with you, and then migrate for real.',
      },
      {
        title: 'When requirements change',
        text: 'We write the change down with its effect on time and cost, you approve it, and it goes into the plan. No surprises.',
      },
    ],
  },
  products: {
    heading: 'Zoho products we work with',
    groups: [
      {
        title: 'Where most projects start',
        items: ['Zoho CRM', 'Zoho One roll-outs', 'Zoho Creator (custom apps)'],
      },
      {
        title: 'Across the suite',
        items: [
          'Zoho CRM Plus',
          'Zoho Books and Zoho Invoice',
          'Zoho Inventory',
          'Zoho Desk',
          'Zoho Projects',
          'Zoho Forms and Zoho Flow',
          'Zoho Analytics',
          'Zoho Sign',
          'Zoho People and Zoho Recruit',
          'Zoho Commerce, Bookings and SalesIQ',
        ],
      },
    ],
  },
  principles: {
    heading: 'How we work',
    items: [
      "We write down what's in and what's out.",
      'You see working software every week.',
      'You own what we build, once it is paid for.',
    ],
    extra: {
      title: 'Your data stays confidential',
      text: 'We treat all client data as confidential and will sign a non-disclosure agreement on request.',
    },
  },
  faqHeading: 'Questions about Zoho',
  faq: [
    {
      q: 'Should we choose Zoho or Salesforce?',
      a: 'Choose Zoho for smaller teams, tighter budgets, CRM, finance and support in one suite, and a quick go-live. Choose Salesforce for complex sales processes, heavy customisation, many enterprise integrations and large user numbers. We work with both, so we will recommend the one that fits you.',
    },
    {
      q: 'Is Zoho really cheaper?',
      a: 'Often, once you count all the tools it replaces, but the licence is only part of the cost.',
    },
    {
      q: 'Will it grow with us?',
      a: 'Yes, up to a point. We will tell you when it will not.',
    },
    {
      q: 'Can you move us from Zoho to Salesforce, or the other way, without losing data?',
      a: 'Yes. We map every field, run a trial migration in a test environment, check the results with you, and then migrate for real.',
    },
    {
      q: 'Why not just hire a freelancer?',
      a: 'We set up the whole suite as one connected system, document it, and train your team. A freelancer usually fixes one app at a time.',
    },
    {
      q: 'How does pricing work?',
      a: 'Fixed price for a defined scope, and a monthly plan for ongoing work. You get a written estimate within 3 working days of our call.',
    },
    {
      q: 'What happens after launch?',
      a: 'You get 30 days of free bug fixing and a 120-minute training session for your whole team. After that, ongoing help is available on a monthly support plan.',
    },
    {
      q: 'Not sure yet? What is the lowest-risk first step?',
      a: 'A free 30-minute call to map your process. We will tell you honestly which Zoho apps you need and which you do not.',
    },
  ],
  closing: {
    title: 'Tell us how your team works.',
    text: 'We will tell you which Zoho apps you actually need. A real person replies within 4 business hours.',
  },
};
