# Changelog

Plain-English record of changes to the Mizra Consulting website. Newest first.

## Unreleased (branch `revamp`)

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
