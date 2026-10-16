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
  const cell = (r, c) => (rows[r - 1] || [])[c - 1];
  return {
    name,
    rows,
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
          values.forEach((v, i) => { rows[row - 1 + i] = [...v]; });
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

function load({ lockFree = true } = {}) {
  const sheets = {};
  const sent = [];
  let uuid = 0;
  const book = {
    setSpreadsheetTimeZone() {},
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => (sheets[n] = makeSheet(n)),
  };
  const context = {
    console,
    Date,
    JSON,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => book,
      flush() {},
      newDataValidation: () => ({ requireValueInList() { return this; }, setAllowInvalid() { return this; }, build() { return {}; } }),
    },
    LockService: { getScriptLock: () => ({ tryLock: () => lockFree, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => ({ SHARED_SECRET: SECRET, OWNER_EMAIL: 'owner@example.com' })[k] ?? null }) },
    MailApp: { sendEmail: (m) => sent.push(m) },
    Utilities: {
      getUuid: () => `uuid-${++uuid}`,
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
  return { sheets, sent, call, context };
}

function addClass(env, overrides = {}) {
  const c = {
    id: 'pm-basics', title: 'Product management basics', topic: 'Product management',
    start: new Date(Date.now() + 7 * DAY), duration: 90, seats: 2, price: 0,
    meet: 'https://meet.google.com/abc-defg-hij', status: 'open', description: '', ...overrides,
  };
  env.sheets.Classes.appendRow([c.id, c.title, c.topic, c.start, c.duration, c.seats, c.price, c.meet, c.status, c.description]);
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
    ['description', 'durationMinutes', 'id', 'priceUsd', 'seats', 'seatsLeft', 'startUtc', 'title', 'topic']);
  assert.equal(list.classes[0].seatsLeft, 1);
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
  assert.equal(row[10], 'uuid-1');
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

test('never sells more seats than the class has', () => {
  const env = load();
  addClass(env, { seats: 2 });
  assert.equal(env.call(person({ email: 'a@example.com' })).ok, true);
  assert.equal(env.call(person({ email: 'b@example.com' })).ok, true);
  assert.equal(env.call(person({ email: 'c@example.com' })).error, 'full');
  assert.equal(env.sheets.Registrations.rows.length - 1, 2);
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

test('stops a name from becoming a spreadsheet formula, and falls back on unknown time zones', () => {
  const env = load();
  addClass(env);
  env.call(person({ name: '=HYPERLINK("http://x","y")', timeZone: 'Mars/Olympus' }));
  const row = env.sheets.Registrations.rows[1];
  assert.ok(row[4].startsWith("'="));
  assert.equal(row[13], 'Asia/Kolkata');
});
