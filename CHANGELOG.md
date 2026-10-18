# Changelog

Plain-English record of changes to the Mizra Consulting website. Newest first.

## Unreleased (branch `revamp`)

### Release preparation: wording, LinkedIn addresses, switched-off pages

- Master classes holding page and "How it works": "a practising product owner" is now
  "practising professionals". The per-class "Taught by a practising {role}: {name}" line is unchanged.
- Faculty LinkedIn: common forms are tidied before checking (spaces and line breaks removed,
  `https://` added, `http://` upgraded, `linkedin.com` and country hosts such as `in.linkedin.com`
  rewritten to `www.linkedin.com`). Every other site is still refused, including look-alikes such as
  `linkedin.com.evil.com` and `evil-linkedin.com`. checkClasses and Vercel's logs say, for each
  class with a faculty name, whether the address is used or ignored and why, without printing
  names or addresses. checkClasses no longer prints faculty names or addresses.
- While classes are switched off, every `/student-portal/...` address (class pages, cancel,
  payment-complete) now returns the site's ordinary ready-made 404 page, identical to today's live
  site. The cancel and payment endpoints answer 404 unless their settings exist.
- Info lines are kept in production logs alongside errors and warnings.
- 2 new tests with 27 LinkedIn cases (39 tests in total).

### Waiting-list email reliability and faculty per class

- Every class email now goes through one path that records the outcome in the "Confirmation
  email" column (`yes`, `yes (place opened up)`, `waiting list email sent`, or
  `FAILED (..., attempt N): reason`), logs a clear reason in Apps Script's Executions, emails the
  owner on the first failure, and is retried by the 15-minute timer (up to 5 times, until the class
  starts). It is never sent twice: a send cut off half-way is marked "sending" and not retried.
  Before, a failed "place opened up" email was swallowed with a short log line and the column
  looked the same as a sent waiting-list email.
- If Google's daily email limit is used up, the script records that instead of trying, and the
  timer sends the email after the reset.
- Classes tab: new columns "Faculty role", "Faculty name (optional)", "Faculty LinkedIn
  (optional)", added by setup at the end without moving data (setup stops with a clear message if
  a different heading is in the way). The class page shows "Taught by a practising {role}: {name}",
  with the name linked to LinkedIn (new tab, `rel="noopener noreferrer"`), only the role when
  there is no name, and nothing when there is no role. Only `https://www.linkedin.com/` addresses
  are used. The named person is added to the Event structured data as the performer.
- 6 new tests (37 in total).

### Classes not showing: diagnosis and fixes

- Production builds were removing every log line, including errors, so Vercel's logs could never
  show why a form or the classes sheet failed. Errors and warnings are now kept (debug lines are still removed).
- Every failed call to the classes script is logged with a plain reason (setting missing, password
  mismatch, web page instead of data, no answer). Logs never contain the password, script address or Meet links.
- The script reports rows it cannot show (row number, Class ID, reason); the website logs them.
  New `checkClasses` function to run from the Apps Script editor.
- More forgiving sheet reading: a start typed as text (`2026-11-06 19:00`, India time) and a topic
  in different letter case now work; spaces or line breaks around the shared password are ignored.
- Stricter where it matters: a class with no Meet link, or a price that is empty or not a number
  (for example `$10`), is no longer shown, instead of being shown without a join link or as free.
- 4 new tests (31 in total).

### Phase D, stage 3: free classes, waiting list, reminders, cancel links (registration still switched OFF)

- Master classes are free for now: the holding page and the FAQ say "Classes are free for now", and
  a class with price 0 shows "Free". Free classes need no Razorpay settings; the payment code stays
  in place, unused. Refund and Shipping policy pages are not needed while classes are free.
- Waiting list: a full class shows "Full (waiting list open)" and a "Join the waiting list" form.
  When someone cancels, the first person waiting gets the place and the join link by email.
- Every class email has a cancel link to `/student-portal/cancel`, which shows the class and
  cancels only when the button is pressed. The confirmation email has one line about cancelling.
- Reminder emails 24 hours and 1 hour before each class, each sent once, from a 15-minute timer
  in the classes script. The owner is emailed if the daily email allowance runs short.
- "Seats left" and the class list refresh from the sheet every 10 seconds (was 60).
- The script needs a new `SITE_URL` property and `setup` run again; see `CLASSES-SETUP.md`.
- 8 new tests (27 in total, `npm run test:scripts`).

### Phase D, stage 2: payment with Razorpay (registration still switched OFF)

- Paid classes: the seat is held for 30 minutes as "awaiting payment", the visitor pays on a
  Razorpay Payment Link (USD, exact class price), and the registration becomes "paid" with the
  payment ID. The confirmation email (Meet link, payment, refund rule) is sent only after payment.
- Payments are recorded only after Razorpay's signature is verified: on the payment
  notification (`/api/classes/razorpay-webhook`, HMAC-SHA256 of the raw body) and on the visitor's
  return (`/student-portal/payment-complete`, signed fields, amount re-checked with Razorpay).
  Repeated notices are harmless (keyed on the payment ID). Duplicate payments, wrong amounts and
  late payments for a full class are flagged to the owner by email instead of confirmed.
- The old disabled `/api/contact/razorpay-webhook` is deleted.
- Setup steps, including test mode and checking USD, in `integrations/google-apps-script/CLASSES-SETUP.md`.
- 9 new payment tests (19 in total, `npm run test:scripts`).

### Phase D, stage 1: master classes portal (registration switched OFF)

- New classes sheet script (`integrations/google-apps-script/classes.gs`): public class list (never Meet links or personal data), registration with a lock, one per email per class, seat limit, confirmation email with Meet link and calendar file. 10 automated tests (`npm run test:scripts`).
- `/student-portal` shows the unchanged holding page until `CLASS_REGISTRATION_OPEN` is `true`; then the class list, class pages with Event data, and the registration form. Paid classes cannot be booked until payment (stage 2).
- Class registration has its own rate limit (20 per 10 minutes per network).
- Removed the old global loading spinner so missing pages return a real 404.

### Resources go live

- First article, "Salesforce vs HubSpot vs Zoho: how to choose the right CRM", at
  `/blog/salesforce-vs-hubspot-vs-zoho`, with the owner's wording unchanged. Article,
  FAQ and breadcrumb data for search engines, its own canonical address, the share
  image, and a closing box that links to the enquiry form. The comparison table is a
  table on wider screens and one card per CRM on phones.
- `/blog` is now the Resources index (cards with title, description, read time and
  date), open to search engines and listed in the sitemap with the article.
- "Resources" is back in the header menu and the footer; the homepage shows the
  Resources section again with a card for the article.
- Articles are Markdown files in `src/content/blog/`, read at build time with `marked`
  (build-time only; nothing extra is sent to visitors).

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
- `/blog` is now a one-line holding page in the new style, "Resources are coming.",
  with all old cloud, AI and "digital transformation" wording removed. It stays out of
  the menus and the sitemap and hidden from search engines until the first article.

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

