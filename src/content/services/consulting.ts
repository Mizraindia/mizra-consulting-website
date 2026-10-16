import type { ServiceContent } from './types';

// Source: the owner's consulting workbook (05-Consulting), homepage workbook and
// confirmed-facts.md. Left out on purpose: prices. The owner chose a 30 to 60 day plan
// for the typical first engagement (16 October 2026) and asked for no personal years
// of experience anywhere on the site.

export const CONSULTING: ServiceContent = {
  slug: 'consulting',
  name: 'Consulting',
  metaTitle: 'CRM, Process and Product Consulting',
  metaDescription:
    'CRM and process strategy, workflow audits, product ownership and roadmaps, Agile delivery and HR consulting. Every engagement ends with a written plan.',
  serviceType: 'CRM, process, product and delivery consulting',
  hero: {
    title: 'We help leaders decide what to build, in what order, and how to run delivery so it actually finishes.',
    intro:
      'For founders and heads of product at companies of 20 to 300 people that have outgrown their first processes.',
    situations: [
      'Your operation is leaking, but you do not know where',
      'Your developers keep building the wrong things',
      'You need a clear plan before, or instead of, a build',
    ],
    button: 'Book a free review',
  },
  problems: {
    heading: 'If you have said any of these, we should talk.',
    quotes: [
      'We know something in our operations is leaking, but not where, or what to fix first.',
      'Our developers keep building the wrong things.',
      'We need an outside expert to look under the hood and give us a clear game plan.',
    ],
    boxes: [
      {
        heading: 'A good fit',
        items: [
          'A founder or head of product at a company of 20 to 300 people that has outgrown its first processes.',
        ],
      },
      {
        heading: 'Not a good fit',
        items: [
          'Companies looking for someone to write code only, or those who want advice without any intention of acting on it.',
        ],
      },
    ],
  },
  offerings: {
    heading: 'What we do',
    items: [
      {
        title: 'CRM and process strategy',
        text: 'How your CRM and your processes should fit together, so any Salesforce or Zoho work starts from a clear plan.',
      },
      {
        title: 'Workflow and process audits',
        text: 'Current-state mapping of your operation to find the bottlenecks, data silos and repeated manual steps.',
      },
      {
        title: 'Tool-stack strategy',
        text: 'A prioritised technology roadmap and platform selection guide that fits your budget and stage of growth.',
      },
      {
        title: 'Product ownership and roadmaps',
        text: 'When developers keep building the wrong things, we run a backlog and priority workshop, set up a roadmap and coach your product owner.',
      },
      {
        title: 'Product management and Agile delivery',
        text: 'Backlog refinement, sprint planning and product requirement documents, so your development team is lined up and delivery finishes.',
      },
      {
        title: 'HR consulting',
      },
    ],
  },
  method: {
    heading: 'How a consulting engagement runs',
    steps: ['Call', 'Scope', 'Discovery', 'Findings', 'Plan'],
    stepsNote: 'Each step ends with something written.',
    details: [
      {
        title: 'What you receive',
        text: 'A written findings report, a prioritised 30 to 60 day plan, and a one-page summary for your leadership team.',
      },
      {
        title: 'What we need from you',
        text: 'Access to the people who make decisions, honest data, and a named contact on your side.',
      },
      {
        title: 'Formats',
        text: 'A fixed two-week audit, a one-day workshop, or a monthly advisory retainer.',
      },
    ],
    timeline: {
      label: 'A typical first engagement.',
      text: 'A two-week CRM health check: in week one, interviews and a review of your systems; in week two, our findings and a prioritised 30 to 60 day plan. Fixed price.',
    },
  },
  principles: {
    heading: 'How we work',
    items: [
      'We flag problems early, in writing.',
      'Every engagement ends with a plan you can start on Monday.',
      'We spend the first week listening.',
    ],
    extra: {
      title: 'Your data stays confidential',
      text: 'We treat all client data as confidential and will sign a non-disclosure agreement on request.',
    },
  },
  faqHeading: 'Questions about consulting',
  faq: [
    {
      q: 'How do I know this is not just slides?',
      a: 'Every engagement ends with a plan you can start on Monday.',
    },
    {
      q: 'What if you do not understand our business?',
      a: 'We spend the first week listening.',
    },
    {
      q: 'What do we get at the end?',
      a: 'A written findings report, a prioritised 30 to 60 day plan, and a one-page summary for your leadership team.',
    },
    {
      q: 'How does pricing work?',
      a: 'Fixed price for audits and workshops, and a monthly rate for retainers. You get a written estimate within 3 working days of our call.',
    },
    {
      q: 'Not sure yet? What is the lowest-risk first step?',
      a: 'A free 30-minute review call, or a one-day paid workshop.',
    },
  ],
  closing: {
    title: 'Tell us what is slowing your team down.',
    text: 'We will tell you where we would start. A real person replies within 4 business hours.',
  },
};
