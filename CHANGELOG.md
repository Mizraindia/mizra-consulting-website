# Changelog

Plain-English record of changes to the Mizra Consulting website. Newest first.

## Unreleased (branch `revamp`)

### Phase C, step 3: Zoho, Custom development, Consulting, services overview, restyle

- New `/zoho`, `/custom-development` and `/consulting` pages from the owner's workbooks,
  using the Salesforce page template (same layout, sections and components).
  Left out until confirmed: prices, Zoho certifications or partner status (none held),
  Zoho products marked "some experience", demo projects, the public code repository,
  the gym and e-commerce examples, the consulting experience line, and the plan length
  in the typical first consulting engagement.
- All four service pages show the owner's line next to the main button: "We match the
  right expert to your scope: an experienced practitioner with 5 to 10+ years in the
  field, or a specialist with 20 years when your project needs one." No personal years
  of experience, names or profile links appear anywhere on the site.
- Consulting: the typical first engagement ends with a prioritised 30 to 60 day plan.
- `/services` is now a short overview in the new style linking to the four pages,
  replacing the old cloud, AI and "digital transformation" content.
- Header Services menu: All services, Salesforce, Zoho, Custom development, Consulting.
  Homepage, footer and sitemap link to all four service pages.
- About, Contact, the master-classes holding page and Privacy/Terms now use the brand
  colours and fonts (the older colour names map to the brand palette; buttons and cards
  restyled). Wording on the master-classes page and Privacy/Terms is unchanged,
  checked word for word against the live site.
- About: removed the Mission, Vision and Expertise sections and the "Innovation" value
  (it said "cutting-edge"); the story, promises, other values and closing box remain.
- Contact: new intro "Tell us what you need. We will reply with a plan, not a
  brochure." and a LinkedIn card; the rest is unchanged.
- Removed the site-wide meta keywords list, which advertised services Mizra does not
  offer (cloud, AI, DevOps, staff augmentation, "digital transformation").

### Phase C, step 2: Salesforce page

- New `/salesforce` page from the owner's Salesforce workbook: the buyer's problems
  and what they cost, signs a setup needs rescuing, five services (implementation,
  migration, clean-up, integrations, ongoing support), the method, testing, training,
  timeline (8 to 12 weeks), products and tools, three rules, data security, nine
  questions and answers, and the enquiry form.
- Left out until confirmed: certifications, named project leads, claims of past
  results, prices, and the founder's personal history.
- Shared service-page template (`src/components/ServicePage.tsx`) with content in
  `src/content/services/`, plus search-engine data (Service, FAQ, breadcrumb).
- Salesforce links in the menu, footer and homepage now point to `/salesforce`;
  `/salesforce` added to the sitemap.
- LinkedIn company page link switched on (footer, contact page, search-engine data).
- Floating contact button recoloured to the brand and hidden on pages that already
  have the form.

### Phase C, step 1: New homepage

- New homepage built from the approved design: hero with the enquiry form, "Sound
  familiar?", the four services, the six-step project path, "How we work", the master
  classes strip, questions and answers, and a closing banner.
- Copy follows the owner's confirmed facts and decisions: no prices, no start-slot
  card or badge, no class dates, titles or prices, no Resources section, and the
  closing banner says "We reply within 4 business hours". Unconfirmed design lines
  were left out. Copy lives in `src/content/home.ts`.
- The four confirmed promises now appear in the hero and the project path (the
  separate promises band is replaced by the new design).
- New site-wide header (dark, Services menu, Master classes, How it works, Contact,
  "Tell us what you need") and footer (services, company links, email, WhatsApp, CIN
  and registered office). Blog and Resources links removed until the first article;
  `/blog` is hidden from search and the sitemap but still opens.
- Brand fonts (Poppins, Instrument Sans) served from the site; brand colours added.
- The homepage FAQ is marked up for search engines (FAQPage).
- Accessibility: "Skip to content" link, labelled menu button, 44px tap targets in the
  footer, jump links clear the sticky header, smooth scrolling respects "reduce motion".
- The HTTPS redirect now skips `localhost`, so a production build can be tested on a
  computer (Vercel already enforces HTTPS).

### Phase B: Clean-up

**Client claims removed (B1)**
- Homepage: the 100+ / 50+ / 15+ / 98% band is replaced by the four confirmed promises
  (reply within 4 business hours; written fixed estimate within 3 working days of the call;
  30 days of free bug fixing after launch; you own the code, data and configuration).
- Homepage: "Trusted by 50+ enterprise clients", "24-hour response time guaranteed",
  "Proven Track Record" and "Expert Team" replaced with confirmed facts; the
  "Industries We Serve" section removed (it implied past clients).
- About: the invented "founded in 2015" story and its numbers replaced with the name's
  meaning and confirmed facts; the number cards replaced by the four promises.
- Contact: "Proven track record" list replaced by the four promises; "Our Global
  Presence" (India, UAE, USA offices) replaced by "Based in India, working worldwide".
- "Leading IT consulting firm" removed from the site description, footer and
  search-engine data; "proven methodology" reworded on Services.
- README rewritten without unmeasured claims (Lighthouse scores, WCAG compliance, load times).

**Phone numbers removed (B2)**
- Both numbers removed from every page, the search-engine data and the README.
- Footer and contact page now show email, WhatsApp (+91 92057 10374), the registered
  office and the CIN. The unconfirmed Twitter link is removed. The LinkedIn link is
  ready but hidden until a real company page exists.
- Header "Get Started" button no longer shows a phone icon; the menu item "Student" is
  now "Master classes".

**Sitemap, broken pages and search fixes (B3)**
- Sitemap now lists Home, Services, About, Contact, Student Portal and Blog.
- `/industries` and `/faq` (listed before but never built) now redirect permanently to
  `/services` and `/contact`.
- Fixed: every page told search engines that its "real" address was the homepage
  (canonical tag). Each page now declares its own address.

**Share image (B4)**
- New `public/og-image.jpg` (1200 x 630, stacked logo on deep violet with the four
  services). Every page now sets its own title, description and image for sharing.

**Privacy policy and terms (B5)**
- New `/privacy` and `/terms`, drafted from the owner's workbook, marked "Draft: lawyer
  review needed", and kept out of search results and the sitemap until reviewed.
- Linked from the footer and from the consent line under both forms.
- Consent banner for visitors in the EU, EEA, UK and Switzerland; analytics only loads
  after they accept. "Cookie settings" in the footer lets them change their mind.

**Analytics (B6)**
- Google Analytics 4 only (Tag Manager removed). Off until `NEXT_PUBLIC_GA_ID` is set.
- Events: form seen, form started, lead sent, email click, WhatsApp click.
- Optional Bing Webmaster Tools verification tag (`NEXT_PUBLIC_BING_SITE_VERIFICATION`).

### Phase A: Stop the damage

**Forms tell the truth**
- The contact form is now three fields (name, email, "What do you need?") instead of
  a phone-first three-step form. It shows "Thanks, we have it" only after the Google
  Sheet confirms the save. If saving fails, the visitor sees a clear error with the
  email address, and what they typed is kept.
- Reply promise near the form changed from "24 hours" to "within 4 business hours
  (Monday to Friday, India time)".
- Send buttons stay disabled until the page has fully loaded, and forms are marked
  `method="post"`, so a fast click can never put a visitor's details in the web address.

**Saving, emails and spam**
- New server route `/api/contact` checks every submission on the server, filters bots
  (hidden honeypot field, too-fast submissions, optional Cloudflare Turnstile), and
  limits each visitor to 5 submissions per 10 minutes.
- New Google Apps Script (`integrations/google-apps-script/leads.gs`) for the owner's
  sheet: saves the row first, then emails the owner and sends the visitor an
  auto-reply. It refuses requests without the shared password.
- The Google Apps Script web address is no longer written in the page code. It is read
  from Vercel settings (`LEADS_SHEET_URL`, `LEADS_SHEET_SECRET`).

**Unsafe payment code removed**
- Removed the "Payment Successful" pop-up that appeared for anyone who added
  `?payment=success` to the address.
- Removed the Razorpay payment link from the site.
- The Razorpay notification address (`/api/contact/razorpay-webhook`) now rejects every
  request and writes nothing. It will be deleted once verified master-class payments exist.

**Old course retired**
- `/student-portal` is now a "Master classes are coming" holding page with a short
  sign-up (name, email, topics, 18+ or parent/guardian confirmation). The Corporate
  Readiness Program, demo-call form and enrol form are gone. The address still works.

**Also fixed**
- Search-engine data (JSON-LD) is now written into the page HTML. The old version was
  only added by JavaScript after the page loaded.

**Housekeeping**
- `docs/revamp/` and `.claude/` are kept out of the public repository.
- Added `.env.example` listing setting names (no values).
