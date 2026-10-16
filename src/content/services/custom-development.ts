import type { ServiceContent } from './types';

// Source: the owner's custom development workbook (04-Custom-Development), homepage
// workbook and confirmed-facts.md. Left out on purpose until confirmed: prices, demo
// projects, the public code repository, and the gym and e-commerce project examples.

export const CUSTOM_DEVELOPMENT: ServiceContent = {
  slug: 'custom-development',
  name: 'Custom development',
  metaTitle: 'Custom Web Apps, Mobile Apps, APIs and MVPs',
  metaDescription:
    'Websites, web apps, mobile apps, APIs, integrations, internal tools and MVPs. Fixed scope up front, a working demo every week, and code you own.',
  serviceType: 'Custom software development: web applications, mobile apps, APIs and integrations',
  hero: {
    title: 'Software that does what you asked for, delivered on the date we agreed, with code you own.',
    intro:
      'For founders with an idea for an app, and operations heads who need a tool to replace a tangle of spreadsheets and emails.',
    situations: [
      'Launching an MVP fast',
      'Replacing spreadsheets with a proper internal tool',
      'Connecting the systems you already use',
    ],
    button: 'Describe my project',
  },
  problems: {
    heading: 'If you have said any of these, we should talk.',
    quotes: [
      'Every off-the-shelf tool forces us to change how we work just to fit its template.',
      'None of the software we look at matches our workflow.',
      'We need a tool built around our exact process.',
      'Our team runs on a tangle of spreadsheets and emails.',
    ],
    boxes: [
      {
        heading: 'How we are different',
        bullets: true,
        items: [
          'A fixed scope up front',
          'A working demo every week',
          'No work starts before you have seen the plan',
          'Agile delivery in short iterations, so you stay updated and heard',
        ],
      },
      {
        heading: 'How we choose technology',
        items: [
          "The simplest option that will still work in three years, that scales, and that your own people can maintain.",
        ],
      },
    ],
  },
  offerings: {
    heading: 'What we build',
    items: [
      {
        title: 'Web applications and internal tools',
        text: 'For example, a web app that replaces a team\'s spreadsheets with one place for requests, approvals and reports. Admin panels and workflow tools built around how you actually operate.',
      },
      {
        title: 'Websites and e-commerce',
        text: 'Fast, responsive websites and online stores.',
      },
      {
        title: 'Mobile apps',
        text: 'Cross-platform apps for iOS and Android.',
      },
      {
        title: 'APIs and integrations',
        text: 'Custom middleware and API connectors that bridge third-party software, payment processors and older databases.',
      },
      {
        title: 'MVPs for a fast launch',
        text: 'A first version with just what you need to launch and learn, built in weekly steps.',
      },
      {
        title: 'Scoping and architecture',
        text: 'We turn your requirements into clear user stories, technical specs and database designs before we build.',
      },
    ],
  },
  method: {
    heading: 'How a build runs',
    steps: ['Discover', 'Scope', 'Design', 'Build in weekly steps', 'Test', 'Launch', 'Support'],
    stepsNote: 'You see a working demo at the end of every week.',
    details: [
      {
        title: 'Testing and security',
        text: 'Automated tests for the important parts, code review on every change, and basic security checks before launch.',
      },
      {
        title: 'After launch',
        text: '30 days of free bug fixing, documentation and a handover session. After that, a support plan if you want one.',
      },
      {
        title: 'Your code',
        text: 'You own the code and the designs. We hand over the full source code and access to everything on the last day.',
      },
    ],
    timeline: {
      label: 'Ways to work with us.',
      text: 'Fixed price for a defined scope, a monthly retainer for ongoing work, dedicated resources for longer builds, or an hourly rate for consultation.',
    },
  },
  products: {
    heading: 'Technology we use',
    groups: [
      {
        title: 'Web',
        items: ['React and Next.js for the front end', 'Node.js or Python for the back end', 'PostgreSQL'],
      },
      {
        title: 'Mobile and hosting',
        items: ['React Native or Flutter for mobile', 'Hosted on AWS or similar'],
      },
    ],
    saysNo: 'What we say no to: games, gambling apps, and any app built to defraud people.',
  },
  principles: {
    heading: 'How we work',
    items: [
      "We write down what's in and what's out.",
      'You see working software every week.',
      'You own the code, once it is paid for.',
    ],
    extra: {
      title: 'Your data stays confidential',
      text: 'We treat all client data as confidential and will sign a non-disclosure agreement on request.',
    },
  },
  faqHeading: 'Questions about custom development',
  faq: [
    {
      q: 'What if I do not know exactly what I want?',
      a: 'We help you scope it in a paid discovery.',
    },
    {
      q: 'Can you work with my existing team?',
      a: 'Yes.',
    },
    {
      q: 'Can we start small?',
      a: 'Yes. We can run a small paid pilot first, with a written agreement that we may describe it as a case study if you agree.',
    },
    {
      q: 'How does pricing work?',
      a: 'Every project gets a fixed written estimate within 3 working days of our call. For ongoing work we offer a monthly retainer, and dedicated resources for longer builds.',
    },
    {
      q: 'What if we need changes mid-project?',
      a: 'We write the change down with its effect on time and cost, you approve it, and it goes into the plan.',
    },
    {
      q: 'Who owns the code?',
      a: 'You do. We hand over the full source code and access to everything on the last day, after final payment.',
    },
    {
      q: 'What happens after launch?',
      a: '30 days of free bug fixing, documentation and a handover session. After that, a support plan if you want one.',
    },
  ],
  closing: {
    title: 'Tell us what you want to build.',
    text: 'We will tell you what it takes. A real person replies within 4 business hours.',
  },
};
