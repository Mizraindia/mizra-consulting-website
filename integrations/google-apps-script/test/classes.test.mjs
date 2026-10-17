// Tests for classes.gs, run with:  npm run test:scripts
// Apps Script cannot run here, so Google's services are replaced with small in-memory
// stand-ins and the real script file is loaded into a sandbox.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SOURCE = readFileSync(new URL('../classes.gs', import.meta.url), 'utf8');
const SECRET = 'test-secret';
const DAY = 24 * 60 * 60 * 1000;

// --- Minimal stand-ins for Google services ---

function makeSheet(name) {
  const rows = [];
  let maxColumns = 26;
  const cell = (r, c) => (rows[r - 1] || [])[c - 1];
  return {
    name,
    rows,
    getMaxColumns: () => maxColumns,
    insertColumnsAfter(after, n) { maxColumns += n; },
    getLastRow: () => rows.length,
    appendRow: (values) => rows.push([...values]),
    setFrozenRows() {},
    getRange(a, b, c, d) {
      if (typeof a === 'string') {
        return { setDataValidation() { return this; }, setNumberFormat() { return this; } };
      }
      const [row, col, numRows = 1, numCols = 1] = [a, b, c, d];
      return {
        getValues: () =>
          Array.from({ length: numRows }, (_, i) =>
            Array.from({ length: numCols }, (_, j) => cell(row + i, col + j) ?? ''),
          ),
        setValues(values) {
          if (col + values[0].length - 1 > maxColumns) throw new Error('outside the sheet');
          values.forEach((v, i) => { const r = (rows[row - 1 + i] = rows[row - 1 + i] || []); v.forEach((x, j) => { r[col - 1 + j] = x; }); });
          return this;
        },
        setValue(value) {
          rows[row - 1] = rows[row - 1] || [];
          rows[row - 1][col - 1] = value;
          return this;
        },
        setFontWeight() { return this; },
      };
    },
  };
}

// Java-style date patterns used by the script, via Intl.
function formatDate(date, tz, pattern) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
      minute: '2-digit', second: '2-digit', hourCycle: 'h23', weekday: 'long',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  );
  if (pattern === 'Z') return '+0000';
  if (pattern === "yyyyMMdd'T'HHmmss'Z'") return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}Z`;
  const monthName = new Intl.DateTimeFormat('en-GB', { timeZone: tz, month: 'long' }).format(date);
  const h = Number(parts.hour);
  return `${parts.weekday} ${Number(parts.day)} ${monthName} ${parts.year}, ${h % 12 || 12}:${parts.minute} ${h < 12 ? 'AM' : 'PM'}`;
}

const uuidFor = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

function load({ lockFree = true, quota = 1000, secretProperty = SECRET } = {}) {
  const sheets = {};
  const logs = [];
  const sent = [];
  const triggers = [];
  const mail = { failWith: null };
  let uuid = 0;
  const book = {
    setSpreadsheetTimeZone() {},
    getSpreadsheetTimeZone: () => 'Asia/Kolkata',
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => (sheets[n] = makeSheet(n)),
  };
  const context = {
    console: { log: (m) => logs.push(String(m)), warn: (m) => logs.push(String(m)), error: (m) => logs.push(String(m)) },
    Session: { getScriptTimeZone: () => 'Asia/Kolkata' },
    Date,
    JSON,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => book,
      flush() {},
      newDataValidation: () => ({ requireValueInList() { return this; }, setAllowInvalid() { return this; }, build() { return {}; } }),
    },
    LockService: {
      getScriptLock: () => ({ tryLock: () => lockFree, releaseLock() {} }),
      getDocumentLock: () => ({ tryLock: () => true, releaseLock() {} }),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => ({ SHARED_SECRET: secretProperty, OWNER_EMAIL: 'owner@example.com', SITE_URL: 'https://example.test/' })[k] ?? null,
      }),
    },
    MailApp: {
      sendEmail: (m) => { if (mail.failWith) throw new Error(mail.failWith); sent.push(m); },
      getRemainingDailyQuota: () => quota,
    },
    ScriptApp: {
      getProjectTriggers: () => triggers,
      newTrigger: (handler) => {
        const t = { handler, getHandlerFunction: () => handler };
        const chain = { timeBased: () => chain, everyMinutes: (m) => { t.minutes = m; return chain; }, create: () => { triggers.push(t); return t; } };
        return chain;
      },
    },
    Utilities: {
      getUuid: () => uuidFor(++uuid),
      newBlob: (content, type, name) => ({ content, type, name }),
      formatDate: (date, tz, pattern) => {
        new Intl.DateTimeFormat('en', { timeZone: tz }); // throws on an unknown zone, like Apps Script
        return formatDate(date, tz, pattern);
      },
    },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (text) => ({ setMimeType: () => ({ body: JSON.parse(text) }) }),
    },
  };
  vm.createContext(context);
  vm.runInContext(SOURCE, context);
  context.setup();
  const call = (body) => context.doPost({ postData: { contents: JSON.stringify(body) } }).body;
  return { sheets, sent, call, context, triggers, logs, mail };
}

function addClass(env, overrides = {}) {
  const c = {
    id: 'pm-basics', title: 'Product management basics', topic: 'Product management',
    start: new Date(Date.now() + 7 * DAY), duration: 90, seats: 2, price: 0,
    meet: 'https://meet.google.com/abc-defg-hij', status: 'open', description: '', ...overrides,
  };
  env.sheets.Classes.appendRow([c.id, c.title, c.topic, c.start, c.duration, c.seats, c.price, c.meet, c.status, c.description,
    c.facultyRole ?? '', c.facultyName ?? '', c.facultyLinkedIn ?? '']);
  return c;
}

const person = (overrides = {}) => ({
  secret: SECRET, action: 'register', classId: 'pm-basics', registrantType: 'self',
  name: 'Asha Rao', email: 'asha@example.com', whatsapp: '+91 98765 43210', consent: true,
  timeZone: 'Europe/London', consentAt: '2026-10-16T10:00:00.000Z', consentText: 'consent v1', source: '/student-portal/pm-basics',
  ...overrides,
});

// --- Tests ---

test('rejects requests without the shared secret', () => {
  const env = load();
  assert.equal(env.call({ action: 'list' }).error, 'unauthorised');
  assert.equal(env.call({ secret: 'wrong', action: 'list' }).error, 'unauthorised');
});

test('public list shows only open, upcoming, complete classes and never the Meet link or personal data', () => {
  const env = load();
  addClass(env);
  addClass(env, { id: 'closed-one', status: 'closed' });
  addClass(env, { id: 'past-one', start: new Date(Date.now() - DAY) });
  addClass(env, { id: 'bad-topic', topic: 'Cooking' });
  addClass(env, { id: 'Bad ID!' });
  env.call(person());

  const list = env.call({ secret: SECRET, action: 'list' });
  assert.equal(list.ok, true);
  assert.deepEqual(list.classes.map((c) => c.id), ['pm-basics']);
  const json = JSON.stringify(list);
  assert.ok(!json.includes('meet.google.com'), 'Meet link must never appear');
  assert.ok(!json.includes('asha'), 'personal data must never appear');
  assert.deepEqual(Object.keys(list.classes[0]).sort(),
    ['description', 'durationMinutes', 'facultyLinkedIn', 'facultyName', 'facultyRole', 'id', 'priceUsd', 'seats', 'seatsLeft', 'startUtc', 'title', 'topic']);
  assert.equal(list.classes[0].seatsLeft, 1);
});

test('the owner\'s sample row is listed, also when the start was typed as text or the topic in other letter case', () => {
  const env = load();
  // Exactly the row from the owner's report, with a real date from the sheet.
  addClass(env, { id: 'product-101', title: 'Product Management 101', start: new Date('2030-11-06T13:30:00Z'), duration: 60, seats: 50 });
  // The same kind of row, but the start cell holds text and the topic was typed differently.
  addClass(env, { id: 'text-date', start: '2030-11-06 19:00', topic: ' product  MANAGEMENT ' });
  const list = env.call({ secret: SECRET, action: 'list' });
  assert.deepEqual(list.classes.map((c) => c.id), ['product-101', 'text-date']);
  // 19:00 India time is 13:30 UTC.
  assert.equal(list.classes[1].startUtc, '2030-11-06T13:30:00.000Z');
  assert.equal(list.classes[1].topic, 'Product management');
  assert.equal(list.classes[0].priceUsd, 0);
  assert.deepEqual(list.problems, []);
});

test('faculty: role, optional name and LinkedIn; only https://www.linkedin.com/ links are passed on', () => {
  const env = load();
  const li = 'https://www.linkedin.com/in/asha-rao-123/';
  addClass(env, { id: 'full', facultyRole: 'Product Owner', facultyName: 'Asha Rao', facultyLinkedIn: li });
  addClass(env, { id: 'no-name', facultyRole: 'HR Business Partner', facultyLinkedIn: li });
  addClass(env, { id: 'no-role', facultyName: 'Asha Rao', facultyLinkedIn: li });
  addClass(env, { id: 'bad-link-1', facultyRole: 'Product Manager', facultyName: 'A B', facultyLinkedIn: 'http://www.linkedin.com/in/x' });
  addClass(env, { id: 'bad-link-2', facultyRole: 'Product Manager', facultyName: 'A B', facultyLinkedIn: 'https://www.linkedin.com.evil.example/in/x' });
  addClass(env, { id: 'bad-link-3', facultyRole: 'Product Manager', facultyName: 'A B', facultyLinkedIn: 'https://linkedin.com/in/x' });
  addClass(env, { id: 'bad-link-4', facultyRole: 'Product Manager', facultyName: 'A B', facultyLinkedIn: 'https://www.linkedin.com/in/x"><script>' });
  const byId = Object.fromEntries(env.call({ secret: SECRET, action: 'list' }).classes.map((c) => [c.id, c]));
  assert.deepEqual([byId.full.facultyRole, byId.full.facultyName, byId.full.facultyLinkedIn], ['Product Owner', 'Asha Rao', li]);
  assert.deepEqual([byId['no-name'].facultyName, byId['no-name'].facultyLinkedIn], ['', '']);
  assert.deepEqual([byId['no-role'].facultyRole, byId['no-role'].facultyName, byId['no-role'].facultyLinkedIn], ['', '', '']);
  for (const id of ['bad-link-1', 'bad-link-2', 'bad-link-3', 'bad-link-4']) {
    assert.equal(byId[id].facultyLinkedIn, '', id);
    assert.equal(byId[id].facultyName, 'A B', id);
  }
});

test('setup adds the faculty columns to an existing Classes tab without moving or deleting data', () => {
  const env = load();
  const tab = env.sheets.Classes;
  // An older Classes tab: 10 headers, one class, and only 10 columns in the sheet.
  tab.rows[0] = tab.rows[0].slice(0, 10);
  const old = ['pm-old', 'Old class', 'HR', new Date(Date.now() + DAY), 60, 5, 0, 'https://meet.google.com/x', 'open', 'desc'];
  tab.appendRow(old);
  env.context.setup();
  assert.deepEqual(tab.rows[0].slice(10), ['Faculty role', 'Faculty name (optional)', 'Faculty LinkedIn (optional)']);
  assert.deepEqual(tab.rows[1], old);
  assert.equal(env.call({ secret: SECRET, action: 'list' }).classes[0].id, 'pm-old');

  // A different heading where a new column should go: setup stops and changes nothing.
  tab.rows[0][11] = 'My notes';
  assert.throws(() => env.context.setup(), /column L is headed "My notes"/);
  assert.equal(tab.rows[0][11], 'My notes');
});

test('rows that cannot be shown are reported with row number and reason, never the Meet link', () => {
  const env = load();
  addClass(env, { id: 'no-link', meet: '' });
  addClass(env, { id: 'dollar-price', price: '$10' });
  addClass(env, { id: 'empty-price', price: '' });
  addClass(env, { id: 'bad-date', start: '6/11/2030 7pm' });
  addClass(env, { id: 'bad-topic', topic: 'Cooking' });
  addClass(env, { id: 'closed-one', status: 'closed' });
  addClass(env, { id: 'past-one', start: new Date(Date.now() - DAY) });
  const list = env.call({ secret: SECRET, action: 'list' });
  assert.deepEqual(list.classes, []);
  // Closed and past classes are normal, so they are not reported.
  assert.deepEqual(list.problems.map((p) => [p.row, p.classId]), [[2, 'no-link'], [3, 'dollar-price'], [4, 'empty-price'], [5, 'bad-date'], [6, 'bad-topic']]);
  assert.match(list.problems[0].reason, /Meet link/);
  assert.match(list.problems[1].reason, /Price/);
  assert.match(list.problems[3].reason, /Start/);
  assert.match(list.problems[4].reason, /Topic/);
  assert.ok(!JSON.stringify(list).includes('meet.google.com'));
  assert.ok(env.logs.some((l) => l.includes('row 2 (no-link)')), 'the reason is in the Apps Script log too');
  // A class without a join link cannot be booked either.
  assert.equal(env.call(person({ classId: 'no-link' })).error, 'closed');
});

test('a space or line break around the shared password does not lock the website out', () => {
  const env = load({ secretProperty: `  ${SECRET}\n` });
  addClass(env);
  assert.equal(env.call({ secret: `${SECRET}\n`, action: 'list' }).classes.length, 1);
  assert.equal(env.call({ secret: 'other', action: 'list' }).error, 'unauthorised');
  assert.ok(env.logs.some((l) => l.includes('does not match SHARED_SECRET')));
  assert.ok(!env.logs.some((l) => l.includes(SECRET)), 'the password is never logged');
  assert.equal(load({ secretProperty: null }).call({ secret: '', action: 'list' }).error, 'unauthorised');
});

test('checkClasses explains every row in the log without the Meet link', () => {
  const env = load();
  addClass(env, { id: 'product-101' });
  addClass(env, { id: 'closed-one', status: 'closed' });
  addClass(env, { id: 'no-link', meet: '' });
  env.context.checkClasses();
  const log = env.logs.join('\n');
  assert.match(log, /Row 2 \(product-101\): SHOWN/);
  assert.match(log, /Row 3 \(closed-one\): hidden: Status/);
  assert.match(log, /Row 4 \(no-link\): hidden: Meet link/);
  assert.match(log, /The website receives 1 class/);
  assert.ok(!log.includes('meet.google.com'));
});

test('registers, saves the row and emails the Meet link with a calendar file', () => {
  const env = load();
  const cls = addClass(env, { start: new Date('2030-03-10T13:30:00Z') });
  const result = env.call(person());
  assert.deepEqual(result, { ok: true, status: 'registered', emailed: true });

  const row = env.sheets.Registrations.rows[1];
  assert.equal(row[1], 'pm-basics');
  assert.equal(row[3], 'self');
  assert.equal(row[5], 'asha@example.com');
  assert.equal(row[8], 'registered');
  assert.equal(row[10], uuidFor(1));
  assert.equal(row[13], 'Europe/London');
  assert.equal(row[15], 'yes');

  const mail = env.sent[0];
  assert.equal(mail.to, 'asha@example.com');
  assert.equal(mail.replyTo, 'owner@example.com');
  assert.ok(mail.body.includes(cls.meet));
  assert.ok(mail.body.includes('(Europe/London)'));
  assert.ok(mail.body.includes('India time:'));
  const ics = mail.attachments[0];
  assert.equal(ics.type, 'text/calendar');
  assert.ok(ics.content.includes('DTSTART:20300310T133000Z'));
  assert.ok(ics.content.includes('DTEND:20300310T150000Z'));
  assert.ok(ics.content.split('\r\n').every((line) => line.length <= 75), 'calendar lines are folded');
});

test('a parent registering a child: messages go to the parent, only the first name is stored', () => {
  const env = load();
  addClass(env);
  assert.equal(env.call(person({ registrantType: 'parent', studentFirstName: '' })).error, 'invalid');
  const ok = env.call(person({ registrantType: 'parent', studentFirstName: 'Meera' }));
  assert.equal(ok.status, 'registered');
  const row = env.sheets.Registrations.rows[1];
  assert.equal(row[3], 'parent or guardian');
  assert.equal(row[7], 'Meera');
  assert.equal(env.sent[0].to, 'asha@example.com');
  assert.ok(env.sent[0].body.includes('You have registered Meera'));
});

test('one registration per email per class, ignoring letter case', () => {
  const env = load();
  addClass(env, { seats: 5 });
  assert.equal(env.call(person()).ok, true);
  assert.equal(env.call(person({ email: 'ASHA@example.com' })).error, 'duplicate');
});

test('never sells more seats than the class has; the next person joins the waiting list', () => {
  const env = load();
  const cls = addClass(env, { seats: 2 });
  assert.equal(env.call(person({ email: 'a@example.com' })).status, 'registered');
  assert.equal(env.call(person({ email: 'b@example.com' })).status, 'registered');
  assert.equal(env.call(person({ email: 'c@example.com' })).status, 'waitlisted');
  const statuses = env.sheets.Registrations.rows.slice(1).map((r) => r[8]);
  assert.deepEqual(statuses, ['registered', 'registered', 'waitlisted']);
  const waitMail = env.sent.find((m) => m.to === 'c@example.com');
  assert.ok(waitMail.subject.startsWith('Waiting list'));
  assert.ok(!waitMail.body.includes(cls.meet), 'no Meet link for the waiting list');
  assert.ok(waitMail.body.includes('https://example.test/student-portal/cancel?token='));
  assert.equal(env.call(person({ email: 'c@example.com' })).error, 'duplicate', 'cannot join the list twice');
});

test('closed, past and unknown classes cannot be booked', () => {
  const env = load();
  addClass(env, { id: 'closed-one', status: 'closed' });
  addClass(env, { id: 'past-one', start: new Date(Date.now() - DAY) });
  assert.equal(env.call(person({ classId: 'closed-one' })).error, 'closed');
  assert.equal(env.call(person({ classId: 'past-one' })).error, 'closed');
  assert.equal(env.call(person({ classId: 'nope' })).error, 'not_found');
});

test('rejects bad input and missing consent', () => {
  const env = load();
  addClass(env);
  for (const bad of [
    { consent: false }, { email: 'not-an-email' }, { whatsapp: 'call me' }, { name: 'A' }, { registrantType: 'robot' },
  ]) {
    assert.equal(env.call(person(bad)).error, 'invalid', JSON.stringify(bad));
  }
});

test('when the lock is busy, asks the visitor to try again instead of overbooking', () => {
  const env = load({ lockFree: false });
  addClass(env);
  assert.equal(env.call(person()).error, 'busy');
  assert.equal(env.sheets.Registrations.rows.length, 1);
});

// --- Payment (stage 2) ---

const paidClass = (env, overrides = {}) => addClass(env, { id: 'paid-po', topic: 'Product ownership', price: 10, ...overrides });
const markPaid = (env, token, overrides = {}) =>
  env.call({ secret: SECRET, action: 'markPaid', token: token.replace(/-/g, ''), paymentId: 'pay_ABC123', amountCents: 1000, currency: 'USD', ...overrides });

test('a paid class holds the seat while awaiting payment and sends no email yet', () => {
  const env = load();
  paidClass(env, { seats: 1 });
  const r = env.call(person({ classId: 'paid-po' }));
  assert.equal(r.status, 'awaiting_payment');
  assert.equal(r.amountCents, 1000);
  assert.equal(r.currency, 'USD');
  assert.equal(env.sheets.Registrations.rows[1][8], 'awaiting payment');
  assert.equal(env.sent.length, 0, 'no Meet link before payment');
  // The held seat counts, so a second person goes on the waiting list.
  assert.equal(env.call(person({ classId: 'paid-po', email: 'other@example.com' })).status, 'waitlisted');
  assert.equal(env.call({ secret: SECRET, action: 'list' }).classes[0].seatsLeft, 0);
});

test('coming back within the payment window reuses the held seat', () => {
  const env = load();
  paidClass(env);
  const first = env.call(person({ classId: 'paid-po' }));
  const again = env.call(person({ classId: 'paid-po' }));
  assert.equal(again.status, 'awaiting_payment');
  assert.equal(again.token, first.token);
  assert.equal(env.sheets.Registrations.rows.length - 1, 1);
});

test('an expired hold frees the seat', () => {
  const env = load();
  paidClass(env, { seats: 1 });
  env.call(person({ classId: 'paid-po' }));
  env.sheets.Registrations.rows[1][0] = new Date(Date.now() - 31 * 60000).toISOString();
  assert.equal(env.call(person({ classId: 'paid-po', email: 'next@example.com' })).status, 'awaiting_payment');
});

test('verified payment marks the row paid and emails the Meet link with the payment and refund rule', () => {
  const env = load();
  const cls = paidClass(env);
  const r = env.call(person({ classId: 'paid-po' }));
  const paid = markPaid(env, r.token);
  assert.equal(paid.status, 'paid');
  const row = env.sheets.Registrations.rows[1];
  assert.equal(row[8], 'paid');
  assert.equal(row[9], 'pay_ABC123');
  assert.equal(row[15], 'yes');
  assert.equal(env.sent.length, 1);
  assert.ok(env.sent[0].body.includes(cls.meet));
  assert.ok(env.sent[0].body.includes('Payment received: $10 (payment ID pay_ABC123)'));
  assert.ok(env.sent[0].body.includes('Full refund until 24 hours before the class'));
});

test('the same payment reported twice is handled once', () => {
  const env = load();
  paidClass(env);
  const r = env.call(person({ classId: 'paid-po' }));
  markPaid(env, r.token);
  const repeat = markPaid(env, r.token);
  assert.equal(repeat.repeat, true);
  assert.equal(env.sent.length, 1, 'only one confirmation email');
});

test('a second, different payment for a paid seat alerts the owner instead of double-booking', () => {
  const env = load();
  paidClass(env);
  const r = env.call(person({ classId: 'paid-po' }));
  markPaid(env, r.token);
  const second = markPaid(env, r.token, { paymentId: 'pay_SECOND9' });
  assert.equal(second.status, 'needs_attention');
  assert.equal(env.sheets.Registrations.rows[1][9], 'pay_ABC123', 'first payment kept');
  const alert = env.sent.find((m) => m.to === 'owner@example.com');
  assert.ok(alert && alert.body.includes('pay_SECOND9'));
});

test('a payment with the wrong amount or currency is flagged, not confirmed', () => {
  const env = load();
  paidClass(env);
  const r = env.call(person({ classId: 'paid-po' }));
  assert.equal(markPaid(env, r.token, { amountCents: 100 }).status, 'needs_attention');
  assert.equal(env.sheets.Registrations.rows[1][8], 'CHECK: amount');
  assert.ok(!env.sent.some((m) => m.to === 'asha@example.com'), 'no Meet link sent');

  const env2 = load();
  paidClass(env2);
  const r2 = env2.call(person({ classId: 'paid-po' }));
  assert.equal(markPaid(env2, r2.token, { currency: 'INR' }).status, 'needs_attention');
});

test('payment after the window when the class has filled up is flagged for a refund', () => {
  const env = load();
  paidClass(env, { seats: 1 });
  const late = env.call(person({ classId: 'paid-po' }));
  env.sheets.Registrations.rows[1][0] = new Date(Date.now() - 31 * 60000).toISOString();
  const other = env.call(person({ classId: 'paid-po', email: 'quick@example.com' }));
  markPaid(env, other.token, { paymentId: 'pay_QUICK1' });
  const result = markPaid(env, late.token, { paymentId: 'pay_LATE1' });
  assert.equal(result.status, 'needs_attention');
  assert.equal(env.sheets.Registrations.rows[1][8], 'CHECK: paid but no seat');
});

test('payment notices with unknown references or bad payment IDs are rejected', () => {
  const env = load();
  paidClass(env);
  assert.equal(markPaid(env, 'nosuchtoken').error, 'not_found');
  const r = env.call(person({ classId: 'paid-po' }));
  assert.equal(markPaid(env, r.token, { paymentId: 'not-a-payment' }).error, 'invalid');
});

// --- Stage 3: cancel link, waiting list, reminders ---

const tokenOf = (env, email) => env.sheets.Registrations.rows.find((r) => r[5] === email)[10];
const statusOf = (env, email) => env.sheets.Registrations.rows.find((r) => r[5] === email)[8];

test('every confirmation email has a cancel link and a line about cancelling', () => {
  const env = load();
  addClass(env);
  env.call(person());
  const body = env.sent[0].body;
  assert.ok(body.includes(`https://example.test/student-portal/cancel?token=${uuidFor(1)}`));
  assert.ok(body.includes("Can't make it? Please cancel so someone on the waiting list can have your place"));
});

test('the cancel page lookup shows class details only, never personal data', () => {
  const env = load();
  addClass(env);
  env.call(person());
  const found = env.call({ secret: SECRET, action: 'lookup', token: uuidFor(1) });
  assert.deepEqual(Object.keys(found).sort(), ['classTitle', 'ok', 'startUtc', 'status']);
  assert.ok(!JSON.stringify(found).includes('asha'));
  assert.equal(env.call({ secret: SECRET, action: 'lookup', token: 'not-a-token' }).error, 'invalid');
});

test('cancelling frees the seat and gives it to the first person on the waiting list', () => {
  const env = load();
  const cls = addClass(env, { seats: 1 });
  env.call(person({ email: 'first@example.com' }));
  env.call(person({ email: 'wait1@example.com' }));
  env.call(person({ email: 'wait2@example.com' }));
  const result = env.call({ secret: SECRET, action: 'cancel', token: tokenOf(env, 'first@example.com') });
  assert.deepEqual(result, { ok: true, status: 'cancelled', promoted: true });
  assert.equal(statusOf(env, 'first@example.com'), 'cancelled');
  assert.equal(statusOf(env, 'wait1@example.com'), 'registered');
  assert.equal(statusOf(env, 'wait2@example.com'), 'waitlisted');
  const promotedMail = env.sent.filter((m) => m.to === 'wait1@example.com').pop();
  assert.ok(promotedMail.body.includes('a place opened up'));
  assert.ok(promotedMail.body.includes(cls.meet));
  assert.equal(promotedMail.attachments[0].type, 'text/calendar');
});

const confirmationOf = (env, email) => env.sheets.Registrations.rows.find((r) => r[5] === email)[15];

test('the person moved up from the waiting list gets the "place opened up" email exactly once', () => {
  const env = load();
  addClass(env, { seats: 1 });
  env.call(person({ email: 'first@example.com' }));
  env.call(person({ email: 'wait1@example.com', name: 'Ravi Kumar', timeZone: 'America/New_York' }));
  assert.equal(confirmationOf(env, 'wait1@example.com'), 'waiting list email sent');
  const before = env.sent.length;

  const token = tokenOf(env, 'first@example.com');
  env.call({ secret: SECRET, action: 'cancel', token });
  env.call({ secret: SECRET, action: 'cancel', token }); // pressed twice
  env.context.sendReminders(); // the timer runs: nothing is re-sent
  const toWait1 = env.sent.slice(before).filter((m) => m.to === 'wait1@example.com');
  assert.equal(toWait1.length, 1);
  assert.equal(toWait1[0].subject, "You're registered: Product management basics");
  assert.ok(toWait1[0].body.startsWith('Hi Ravi,\n\nGood news: a place opened up, and it is yours.'));
  assert.equal(confirmationOf(env, 'wait1@example.com'), 'yes (place opened up)');
  assert.ok(env.logs.some((l) => l.includes('moved up from the waiting list')));
  assert.ok(env.logs.some((l) => /Row \d+: place opened up email sent/.test(l)));
});

test('if the "place opened up" email fails, the reason is logged and recorded, the owner is told, and the timer sends it once', () => {
  const env = load();
  addClass(env, { seats: 1 });
  env.call(person({ email: 'first@example.com' }));
  env.call(person({ email: 'wait1@example.com' }));
  env.mail.failWith = 'Invalid email: wait1@example.com';
  env.call({ secret: SECRET, action: 'cancel', token: tokenOf(env, 'first@example.com') });
  assert.equal(statusOf(env, 'wait1@example.com'), 'registered');
  assert.equal(confirmationOf(env, 'wait1@example.com'), 'FAILED (place opened up, attempt 1): Invalid email: wait1@example.com');
  assert.ok(env.logs.some((l) => l.includes('place opened up email NOT sent (attempt 1). Reason: Invalid email')));

  env.mail.failWith = null;
  // The owner alert could not go out either while mail was failing; now the timer retries.
  env.context.sendReminders();
  env.context.sendReminders();
  const toWait1 = env.sent.filter((m) => m.to === 'wait1@example.com' && m.body.includes('a place opened up'));
  assert.equal(toWait1.length, 1);
  assert.equal(confirmationOf(env, 'wait1@example.com'), 'yes (place opened up)');
});

test('with the daily email limit used up, nothing is attempted, the reason is recorded, and the timer sends it later', () => {
  let quota = 5;
  const env = load();
  env.context.MailApp.getRemainingDailyQuota = () => quota;
  addClass(env, { seats: 1 });
  env.call(person({ email: 'first@example.com' }));
  env.call(person({ email: 'wait1@example.com' }));
  quota = 0;
  env.call({ secret: SECRET, action: 'cancel', token: tokenOf(env, 'first@example.com') });
  assert.match(confirmationOf(env, 'wait1@example.com'), /^FAILED \(place opened up, attempt 1\): Google's daily email limit/);
  quota = 5;
  env.context.sendReminders();
  assert.equal(confirmationOf(env, 'wait1@example.com'), 'yes (place opened up)');
  assert.equal(env.sent.filter((m) => m.to === 'wait1@example.com' && m.body.includes('a place opened up')).length, 1);
});

test('an email stuck as "sending" (script stopped half-way) is never re-sent automatically', () => {
  const env = load();
  addClass(env);
  env.call(person());
  env.sheets.Registrations.rows[1][15] = 'sending (confirmation)';
  const before = env.sent.length;
  env.context.sendReminders();
  assert.equal(env.sent.length, before);
});

test('cancelling twice is harmless, and leaving the waiting list promotes nobody', () => {
  const env = load();
  addClass(env, { seats: 1 });
  env.call(person({ email: 'first@example.com' }));
  env.call(person({ email: 'wait1@example.com' }));
  env.call(person({ email: 'wait2@example.com' }));
  const token = tokenOf(env, 'wait1@example.com');
  assert.equal(env.call({ secret: SECRET, action: 'cancel', token }).promoted, false);
  assert.equal(env.call({ secret: SECRET, action: 'cancel', token }).repeat, true);
  assert.equal(statusOf(env, 'wait2@example.com'), 'waitlisted');
  assert.equal(statusOf(env, 'first@example.com'), 'registered');
});

test('cannot cancel after the class has started, or with an unknown link', () => {
  const env = load();
  addClass(env);
  env.call(person());
  env.sheets.Classes.rows[1][3] = new Date(Date.now() - 60000);
  assert.equal(env.call({ secret: SECRET, action: 'cancel', token: uuidFor(1) }).error, 'too_late');
  assert.equal(env.call({ secret: SECRET, action: 'cancel', token: uuidFor(99) }).error, 'not_found');
});

test('setup creates exactly one 15-minute reminder timer, even when run again', () => {
  const env = load();
  env.context.setup();
  assert.equal(env.triggers.length, 1);
  assert.equal(env.triggers[0].handler, 'sendReminders');
  assert.equal(env.triggers[0].minutes, 15);
});

test('24-hour and 1-hour reminders go once each, with the join and cancel links', () => {
  const env = load();
  const soon = addClass(env, { id: 'in-23h', start: new Date(Date.now() + 23 * 3600000) });
  addClass(env, { id: 'in-50m', start: new Date(Date.now() + 50 * 60000) });
  env.call(person({ classId: 'in-23h', email: 'early@example.com' }));
  env.call(person({ classId: 'in-23h', email: 'late@example.com' }));
  env.call(person({ classId: 'in-50m', email: 'hour@example.com' }));
  env.call(person({ classId: 'in-23h', email: 'gone@example.com' }));
  // early@ registered two days ago; late@ registered just now (inside the 24 hours).
  env.sheets.Registrations.rows.find((r) => r[5] === 'early@example.com')[0] = new Date(Date.now() - 2 * DAY).toISOString();
  env.sheets.Registrations.rows.find((r) => r[5] === 'gone@example.com')[0] = new Date(Date.now() - 2 * DAY).toISOString();
  env.call({ secret: SECRET, action: 'cancel', token: tokenOf(env, 'gone@example.com') });
  const before = env.sent.length;

  env.context.sendReminders();
  env.context.sendReminders(); // the timer runs again: nothing is sent twice
  const reminders = env.sent.slice(before);
  assert.deepEqual(reminders.map((m) => m.to).sort(), ['early@example.com', 'hour@example.com']);
  const day = reminders.find((m) => m.to === 'early@example.com');
  assert.ok(day.subject.startsWith('Reminder: '));
  assert.ok(day.body.includes(soon.meet));
  assert.ok(day.body.includes('/student-portal/cancel?token='));
  const hour = reminders.find((m) => m.to === 'hour@example.com');
  assert.ok(hour.subject.startsWith('Starting soon: '));
  assert.ok(hour.body.includes('/student-portal/cancel?token='));
  assert.equal(env.sheets.Registrations.rows.find((r) => r[5] === 'early@example.com')[16], 'sent');
});

test('when the daily email limit is nearly used up, the owner is told and nothing is over-sent', () => {
  const env = load({ quota: 2 });
  addClass(env, { id: 'in-50m', start: new Date(Date.now() + 50 * 60000), seats: 10 });
  for (const n of [1, 2, 3, 4]) env.call(person({ classId: 'in-50m', email: `p${n}@example.com` }));
  const before = env.sent.length;
  env.context.sendReminders();
  const sentNow = env.sent.slice(before);
  assert.ok(sentNow.some((m) => m.to === 'owner@example.com' && m.subject.includes('daily email limit')));
  assert.equal(sentNow.filter((m) => m.to !== 'owner@example.com').length, 1);
});

test('stops a name from becoming a spreadsheet formula, and falls back on unknown time zones', () => {
  const env = load();
  addClass(env);
  env.call(person({ name: '=HYPERLINK("http://x","y")', timeZone: 'Mars/Olympus' }));
  const row = env.sheets.Registrations.rows[1];
  assert.ok(row[4].startsWith("'="));
  assert.equal(row[13], 'Asia/Kolkata');
});
