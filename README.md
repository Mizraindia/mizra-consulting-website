# Mizra Consulting website

The website for Mizra Consulting Pvt Ltd (mizraconsulting.com): Salesforce, Zoho,
custom development, consulting, and master classes for students.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS 3. Hosted on Vercel.
Pushing a branch creates a private Vercel preview; merging to `main` publishes the live site.
See `CHANGELOG.md` for what has changed and why.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in test values
npm run dev                  # development server
npm run lint                 # style check
npm run build                # production build (also checks types)
```

The development server can be slow when the project folder is inside OneDrive.

## Configuration

Setting names are listed in `.env.example`. Real values live in Vercel
(Project > Settings > Environment Variables), never in the code.

| Name | What it is | Required |
| --- | --- | --- |
| `LEADS_SHEET_URL` | Web app address of the Apps Script attached to the leads sheet | Yes, or forms show an error |
| `LEADS_SHEET_SECRET` | Shared password; same value as `SHARED_SECRET` in the script | Yes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile bot check. Create the widget in **Invisible** mode; the visible widget is 300px wide and crowds the forms on small phones | No (off when empty) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-...`) | No (analytics and the consent banner are off when empty) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag code | No |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools HTML-tag code | No |

Company facts (legal name, CIN, address, email, WhatsApp, LinkedIn, the four promises)
live in `src/lib/site.ts`. Change them there, not in each page.

## How the forms work

- The enquiry form (homepage, contact page, floating button) and the master-class
  sign-up (`/student-portal`) post to `/api/contact` on this site.
- `/api/contact` checks the input on the server, drops bots (hidden honeypot field,
  too-fast submissions, optional Turnstile), limits each visitor to 5 submissions per
  10 minutes, and sends the lead to the Google Apps Script.
- The script (`integrations/google-apps-script/leads.gs`) saves the row first, then
  emails the owner and sends the visitor an auto-reply. The site shows "success" only
  when the script answers `{"ok": true}`; otherwise the visitor sees an error with the
  email address, and what they typed is kept.
- `/api/contact/razorpay-webhook` is disabled (rejects everything) until the verified
  master-class payment flow replaces it.

To test forms locally, point `LEADS_SHEET_URL` at a test copy of the sheet's script
(never the live sheet), or at a local stand-in that answers `{"ok": true}`. Cloudflare
publishes always-pass Turnstile test keys for local use.

## Analytics and consent

- One tool: Google Analytics 4, switched on by `NEXT_PUBLIC_GA_ID`.
- Visitors in the EU, EEA, UK and Switzerland (or whose country is unknown) see a
  consent banner, and analytics does not load until they click Accept. Others get
  analytics without a banner. The middleware stores the region in the `mz_region` cookie;
  the choice is kept in the browser (`mz_analytics_consent`). "Cookie settings" in the
  footer reopens the banner.
- To see the banner from outside Europe, add `?test-region=consent` to a preview address.
  This switch is ignored on the live site.
- Events: `lead_form_view`, `lead_form_start`, `generate_lead` (each with `form_name`
  `enquiry` or `class_interest`), `email_click`, `whatsapp_click`.

## Pages

| Address | Notes |
| --- | --- |
| `/` | Home (approved design); copy in `src/content/home.ts` |
| `/services` | Short overview linking to the four service pages |
| `/salesforce`, `/zoho`, `/custom-development`, `/consulting` | Service pages; content in `src/content/services/`, layout in `src/components/ServicePage.tsx` |
| `/about` | About |
| `/contact` | Enquiry form, email, WhatsApp, registered office |
| `/student-portal` | "Master classes are coming" holding page with sign-up |
| `/blog` | Coming-soon placeholder; hidden from menus, search and the sitemap until the first article |
| `/privacy`, `/terms` | Drafts awaiting lawyer review; kept out of search results and the sitemap |

Redirects (permanent): `/home` to `/`, `/industries` to `/services`, `/faq` to `/contact`.
Every page sets its own canonical address and sharing tags through `src/lib/metadata.ts`.
The sharing image is `public/og-image.jpg` (1200 x 630).

## Release and rollback

Work happens on the `revamp` branch. A pull request into `main` is merged only after the
owner approves the Vercel preview in writing. To undo a release, use Vercel's
Instant Rollback, or revert the merged pull request on GitHub.

## Contact

info@mizraconsulting.com · https://mizraconsulting.com

© Mizra Consulting Pvt Ltd. All rights reserved.
