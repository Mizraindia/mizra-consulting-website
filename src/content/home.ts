// Homepage copy. Every line comes from the approved design (docs/revamp/design/Main.dc.html)
// checked against the owner's confirmed facts and workbook answers. Do not add claims,
// numbers, dates or prices here unless the owner has confirmed them.

export const HERO = {
  eyebrow: 'Salesforce · Zoho · Software · Consulting',
  intro:
    "We're Mizra. We set up Salesforce and Zoho, build the software around them, and help you think it through. Tell us what's getting in your way and we'll tell you honestly how we'd fix it.",
  points: [
    'A real person replies within 4 business hours',
    "You'll get a fixed scope and price before we start",
    'Your code and your data stay yours',
  ],
};

export const PAINS = [
  {
    quote:
      'Our customer data is scattered across spreadsheets and emails, and I have no idea which deals are closing.',
    link: "That's what our Salesforce work is for",
    href: '/salesforce',
  },
  {
    quote: 'We juggle a dozen apps for invoicing, email and leads, and none of them talk to each other.',
    link: "That's what our Zoho work is for",
    href: '/zoho',
  },
  {
    quote:
      'Every off-the-shelf tool forces us to change how we work. We need something built around our process.',
    link: "You'll see working software every week",
    href: '/custom-development',
  },
  {
    quote: 'We know something in our operations is leaking, but not where, or what to fix first.',
    link: "Let's find the leaks and decide what to fix first",
    href: '/consulting',
  },
];

// `page` is set once the service has its own page; the name then links to it.
export const SERVICES: { id: string; name: string; page?: string; text: string }[] = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    page: '/salesforce',
    text: 'Objects and sales stages that match your real sales cycle, automated lead routing and follow-ups, and dashboards your leaders can trust.',
  },
  {
    id: 'zoho',
    name: 'Zoho',
    page: '/zoho',
    text: 'Zoho CRM set up around how you work, leads routed straight from your forms, and quotes, invoices and payments connected in one place.',
  },
  {
    id: 'custom-development',
    name: 'Custom development',
    page: '/custom-development',
    text: 'We turn your needs into clear specs, connect your systems through APIs, and build the web tools and apps you need, shown to you every week.',
  },
  {
    id: 'consulting',
    name: 'Consulting',
    page: '/consulting',
    text: 'We map where your process leaks, give you a prioritised tool roadmap, and line your team up on product and backlog.',
  },
];

export const STEPS = [
  {
    when: 'Day 0',
    title: 'You send your query',
    text: 'Two sentences through the form, about 30 seconds. No sales call needed.',
    get: 'Confirmation straight away',
  },
  {
    when: 'Within 4 business hours',
    title: 'We reply with a first plan',
    text: 'A real person reads your message and replies with questions and a first view of the approach.',
    get: 'A clear next step, not a brochure',
  },
  {
    when: 'Within 2 to 3 days',
    title: 'Free project review',
    text: 'A short call to understand your goal, your data, your deadline and your budget.',
    get: 'A written scope and a fixed estimate within 3 working days of the call',
  },
  {
    when: 'Usually within 2 weeks',
    title: 'You approve and pick a start date',
    text: 'You approve the scope and we agree a kickoff date, depending on open slots.',
    get: 'A named kickoff date and a project plan',
  },
  {
    when: 'Week 1 onwards',
    title: 'We build in weekly steps',
    text: 'Short build cycles, each ending with a working demo you can see and comment on.',
    get: 'Visible progress every week',
  },
  {
    when: 'Launch and after',
    title: 'Go live and clean handover',
    text: 'We launch, train your people and document everything. Your code and data are yours.',
    get: 'Documentation, a 120-minute team training and 30 days of free bug fixing',
  },
];

// The owner's own words (homepage workbook, Q20).
export const COST_OF_WAITING = [
  'Leads are followed up late.',
  'Forecasts are guesses.',
  'Your team builds workarounds that will have to be undone later.',
];

// Each statement is a confirmed promise (confirmed facts; homepage workbook Q9 and Q34).
export const HOW_WE_WORK = [
  { lead: "We write down what's in and what's out.", rest: 'So there are no surprises on the invoice.' },
  { lead: 'You see working software every week.', rest: 'Not a status report, the real thing.' },
  {
    lead: 'We flag problems early, in writing.',
    rest: 'If we miss an agreed milestone because of us, we fix it at no extra cost.',
  },
  {
    lead: 'And if your job is smaller than a week of effort,',
    rest: "we'll tell you, and point you to someone who suits it better.",
  },
];

// A few example topics for the homepage chips (the full list is in lib/class-topics).
export const CLASS_TOPICS_SHOWN = ['Product', 'Salesforce and CRM', 'Careers', 'AI tools for work'];

export const FAQ = [
  {
    q: 'Should we choose Salesforce or Zoho?',
    a: "Choose Salesforce when you need deep customisation, complex sales processes or enterprise-scale integrations. Choose Zoho when you want a lower-cost suite that is quick to set up and covers CRM, finance, support and more. We work with both, so we'll recommend the one that fits you.",
  },
  {
    q: 'Do you build mobile apps as well as websites?',
    a: 'Yes. We build websites and web applications, mobile apps, and the APIs and integrations that connect them.',
  },
  {
    q: 'How much will it cost?',
    a: 'Fixed price for a defined scope, and a written estimate within 3 working days of our call.',
  },
  {
    q: "We're in another country. Can you work with us?",
    a: 'Yes. We work remotely with clients around the world. We take calls in India mornings for Europe and the Middle East, India afternoons for Australia, and India evenings for the US East Coast.',
  },
  {
    q: 'Who owns the code and the data?',
    a: 'You do. We hand over documentation and full admin access on the last day, after final payment.',
  },
];
