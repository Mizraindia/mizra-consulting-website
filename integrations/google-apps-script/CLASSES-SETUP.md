# Setting up the master classes sheet and script

Two copies, so testing never touches real students:

| | Sheet name | Used by |
| --- | --- | --- |
| TEST | Mizra classes TEST | Vercel **Preview** (the private preview links) |
| LIVE | Mizra classes LIVE | Vercel **Production** (mizraconsulting.com) |

Create both with the **Google Workspace** account that should send the class emails
(for example info@mizraconsulting.com). A free Gmail account can email only 100 people a day.

## 1. Create each sheet and its script (do this twice: TEST, then LIVE)

1. Go to **sheets.new**. Name the file **Mizra classes TEST** (then, the second time, **Mizra classes LIVE**).
2. Click **Extensions → Apps Script**. Rename the project (top left) to **Mizra classes TEST** (or LIVE).
3. In `Code.gs`, delete everything. Paste the whole of `integrations/google-apps-script/classes.gs`
   from GitHub (open the file, click **Raw**, select all, copy). Click **Save** (disk icon).
4. Click **Project Settings** (gear, left). Tick **Show "appsscript.json" manifest file in editor**.
   Go back to **Editor**, open `appsscript.json`, and set `"timeZone": "Asia/Kolkata"`. Save.
5. **Project Settings → Script Properties → Add script property**, three times:
   - `SHARED_SECRET`: a long random password (32+ characters) from your password manager's generator.
     Use a **different** one for TEST and LIVE. Do not paste it into chat or email.
   - `OWNER_EMAIL`: the inbox that should receive replies, for example `info@mizraconsulting.com`.
   - `SITE_URL`: where the cancel links in emails point. LIVE: `https://mizraconsulting.com`.
     TEST: your `revamp` preview address from Vercel (Deployments → newest `revamp` deployment →
     the address under **Domains** that contains `git-revamp`), without a slash at the end.
   Click **Save script properties**.
6. Back in **Editor**, choose **setup** in the function list at the top and click **Run**.
   Approve the permissions with the same Google account. If Google says the app isn't verified,
   click **Advanced → Go to Mizra classes (unsafe)**; it is your own script.
   The sheet now has two tabs, **Classes** and **Registrations**, and a timer that checks every
   15 minutes for reminder emails to send (see **Triggers**, the clock icon on the left).
7. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Description: `v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

**Whenever the script code changes later:** paste the new code, save, run **setup** once more
(it adds any new columns and the reminder timer, and never creates a second timer), then
**Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The web address stays
the same. Without this step the old version keeps running.

## 2. The Classes tab

One row per class. Never put a sample or test class in the LIVE sheet.

| Column | What to enter |
| --- | --- |
| Class ID | Short, lowercase letters, numbers and hyphens, for example `pm-basics-nov-21`. It becomes the web address. Do not change it once the class is open. |
| Title | The class name |
| Topic | Pick from the list: Product management, Product ownership, HR |
| Start (India time) | Date and time in India time, for example `2026-11-21 19:00` |
| Duration (minutes) | For example `90` |
| Seats | For example `100` |
| Price (USD) | `0` for now (classes are free; the website shows "Free") |
| Meet link (private) | The Google Meet link, starting with `https://`. Required: a class without one is not shown. Never shown on the website; sent only by email. |
| Status | `open` to show it on the site, `closed` to hide it |
| Description (optional) | A short description, or leave empty |

A class appears on the website only when every column except Description is filled, the status is
`open` and the start time is in the future. Changes, including the "seats left" number, show on the
website within about 10 seconds (reload the page to see them).

**Emails the script sends by itself**

- Confirmation (join link, calendar file, cancel link) as soon as someone registers.
- Waiting list: when a class is full, people can join the waiting list. If someone cancels, the first
  person on the list gets the place automatically and is emailed the join link.
- Reminders 24 hours and 1 hour before the class, each sent once. Someone who registers less than
  24 hours before the class gets only the 1-hour reminder. The **Reminder 24h** and **Reminder 1h**
  columns show "sent".
- Every email has a cancel link. Opening it shows the class and a button; nothing is cancelled until
  the button is pressed. Cancelling still works after you switch registration off.
- If the day's email allowance is nearly used up, you get an email saying how many reminders could
  not be sent.

## 3. Settings in Vercel

Vercel → your project → **Settings → Environment Variables**. Add each name twice where shown, once
for **Preview** and once for **Production**, with different values:

| Name | Preview | Production |
| --- | --- | --- |
| `CLASSES_SCRIPT_URL` | TEST web app URL | LIVE web app URL |
| `CLASSES_SCRIPT_SECRET` | TEST `SHARED_SECRET` | LIVE `SHARED_SECRET` |
| `CLASS_REGISTRATION_OPEN` | `true` | leave **unset** until the lawyer approves and you say go |

Then **Deployments → newest `revamp` deployment → ⋯ → Redeploy**. Settings only take effect after a
redeploy.

## 4. What to check on the preview (TEST sheet)

In the TEST sheet add a class with **Price 0**, a start time a few days ahead, your own Meet link,
status `open`. (Paid classes need the payment stage.)

1. `/student-portal` lists the class; the time is shown in your time zone.
2. Open the class and register yourself. You see "You are registered."
3. The email arrives with the Meet link and a calendar file; opening the file adds the class at the right time.
4. The Registrations tab has your row, with **Confirmation email: yes**.
5. Register again with the same email: "This email is already registered for this class."
6. Choose **My child (under 18)** with another email: the row shows "parent or guardian" and only the child's first name.
7. Set **Seats** to the number of rows already registered: within about 10 seconds (reload) the class
   shows **Full (waiting list open)** and the button says **Join the waiting list**.
8. Join the waiting list with a third email you can read: "You are on the waiting list." The email
   has no join link, only a link to leave the list. The row says **waitlisted**.
9. Open the cancel link from your first confirmation email and press **Cancel my place**. Your row
   says **cancelled**; the waiting-list row changes to **registered** and that inbox gets
   "a place opened up" with the join link.
10. Open the same cancel link again: "This place is already cancelled."
11. Reminders: add a class starting about 2 hours from now and register. Within about 1 hour 15 minutes
    the "Starting soon" email arrives and **Reminder 1h** says "sent". (A class 1 to 2 days ahead tests
    the 24-hour reminder.)
12. Set **Status** to `closed`: within about 10 seconds (reload) the class disappears.
13. On the class page press Ctrl+F and search `meet.google`: nothing is found.

On the live site, `/student-portal` must still say "Master classes are coming" until
`CLASS_REGISTRATION_OPEN` is set to `true` for Production and the site is redeployed.

## If a class does not show on the website

1. **Ask the script directly (no password needed).** In the Apps Script editor, choose
   **checkClasses** in the function list at the top and click **Run**. The Execution log lists every
   row of the Classes tab as **SHOWN** or **hidden: reason** (for example "Start is not a date and
   time"), then exactly what the website receives. It never prints Meet links or personal details.
   If you pasted a new version of the script, save it first.
2. **Look at the page message.** "New classes are being scheduled" means the script answered but
   no row qualified: use step 1. "We could not load the class list just now" means the call failed:
   use step 3.
3. **Read Vercel's logs.** Vercel → project → **Logs** (or the deployment → **Runtime Logs**), and search
   for `Classes`. Each failure has a plain reason, for example "CLASSES_SCRIPT_SECRET in Vercel does
   not match SHARED_SECRET in the script", "CLASSES_SCRIPT_URL is not set for this environment", or
   "Classes sheet row 2 (product-101) is not shown: Meet link is empty". Logs never contain the
   password, the script address or Meet links.
4. **Apps Script's own record.** **Executions** (left menu) → click a run of `doPost`. A refused call
   says "Refused: the password from the website does not match SHARED_SECRET". A list call says how
   many classes were shown and which rows were not. A run marked **Completed** only means the script
   answered, not that it answered with classes.

## 5. Razorpay for paid classes (not needed while classes are free)

Classes are free for now, so skip this section; free classes need no Razorpay settings. The payment
code stays in place, unused, for later. Paid classes cannot be booked until all three Razorpay settings exist. Use **Test Mode** keys
for Preview and **Live Mode** keys for Production. Never paste a key secret into chat or email.

**Check that USD payments are enabled**

1. Log in to the Razorpay Dashboard. Open **Account & Settings** (or **Settings**) → **Payment methods**
   and look for **International payments**. The status shows as active, pending or not requested.
2. If it is not active, click **Request** (or **Enable**) and complete the form. Razorpay's partners
   approve it; it can take from a few days to about two weeks.
3. Razorpay asks for these pages on your website: Terms and Conditions, Privacy policy, Refund and
   Cancellation policy, and Shipping (delivery) policy. Mizra has draft Terms and Privacy pages; the
   Refund and Cancellation and the Shipping pages still need to be written and approved.
4. Final check: in Test Mode, open **Payment Links → Create Payment Link** and look for **USD** in the
   currency list. If USD is missing, international payments are not active on the account yet.

**Get the API keys (Test Mode)**

1. Switch the dashboard to **Test Mode** (toggle at the top).
2. **Account & Settings → API Keys → Generate Test Key**. Copy the **Key ID** (`rzp_test_...`) and the
   **Key Secret** (shown once).
3. In Vercel add, for **Preview** only: `RAZORPAY_KEY_ID` = the Key ID, `RAZORPAY_KEY_SECRET` = the Key Secret.

**Create the webhook (Test Mode)**

1. Still in Test Mode: **Account & Settings → Webhooks → Add New Webhook**.
2. Webhook URL: your Vercel **preview** address followed by `/api/classes/razorpay-webhook`.
   (Preview links are protected by Vercel login, so Razorpay cannot reach them. Either turn on
   Vercel's **Protection Bypass for Automation** for this test, or test the webhook after release
   with the live site, and rely on the payment-complete page during preview testing.)
3. Secret: a new long random password from your password manager. Copy it.
4. Active events: tick **payment_link.paid** only. Save.
5. In Vercel add, for **Preview**: `RAZORPAY_WEBHOOK_SECRET` = that secret. Redeploy the preview.

**Test a payment**

1. In the TEST sheet add a class with **Price 10**.
2. Register on the preview. The button says "Continue to payment ($10)" and opens Razorpay's page.
3. Pay with one of Razorpay's published **test cards** (see Razorpay's "Test card details" page).
4. You return to "Payment received. You are registered.", the email arrives with the Meet link and
   "Payment received: $10", and the Registrations row says **paid** with a `pay_...` ID.
5. Close the payment page without paying instead: the row stays "awaiting payment", and the seat is
   released after 30 minutes.

**Going live** (only after the lawyer's approval and your go): repeat the keys and the webhook in
**Live Mode**, pointing the webhook at `https://mizraconsulting.com/api/classes/razorpay-webhook`, and
add the three settings for **Production**. If you ever see an email titled "Master class payment
needs your attention", the script has flagged a payment for you to check (for example a duplicate
payment to refund).
