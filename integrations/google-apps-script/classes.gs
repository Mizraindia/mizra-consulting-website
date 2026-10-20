/**
 * Mizra master classes: classes and registrations kept in this Google Sheet.
 *
 * This is a SEPARATE sheet and script from the leads sheet. Paste this file into the
 * new sheet's Apps Script editor (Extensions > Apps Script), then run setup() once.
 *
 * Project Settings > Script Properties (never in this file):
 *   SHARED_SECRET  long random password; the same value as CLASSES_SCRIPT_SECRET in Vercel
 *   OWNER_EMAIL    replies to confirmation emails go here, e.g. info@mizraconsulting.com
 *   SITE_URL       the website address used in cancel links, e.g. https://mizraconsulting.com
 *                  (for the TEST sheet: the Vercel preview address)
 *
 * Project Settings > "Show appsscript.json": set "timeZone": "Asia/Kolkata".
 * After pasting a new version of this file, run setup() again: it adds any new columns and
 * the reminder timer (every 15 minutes), then deploy a new version.
 *
 * The owner manages classes by editing the Classes tab. The website only ever reads the
 * public class list (never Meet links, never personal data) and asks this script to register.
 */

var CLASSES_SHEET = 'Classes';
var REGISTRATIONS_SHEET = 'Registrations';

var CLASS_HEADERS = [
  'Class ID',             // A  short, letters/numbers/hyphens, used in the web address; never change once open
  'Title',                // B
  'Topic',                // C  one of TOPICS (dropdown added by setup)
  'Start (India time)',   // D  date and time
  'Duration (minutes)',   // E
  'Seats',                // F
  'Price (USD)',          // G  0 for a free class
  'Meet link (private)',  // H  never shown on the website; sent only by email
  'Status',               // I  open | closed
  'Description (optional)', // J
  'Faculty role',         // K  e.g. Product Owner; empty = no "Taught by" line
  'Faculty name (optional)', // L
  'Faculty LinkedIn (optional)', // M  only https://www.linkedin.com/ addresses are used
  "Who it's for (optional)", // N  e.g. "Students and early-career professionals"
];

var REGISTRATION_HEADERS = [
  'Registered at (UTC)',  // A
  'Class ID',             // B
  'Class title',          // C
  'Registrant type',      // D  self | parent or guardian
  'Name',                 // E  the registrant (for a child: the parent or guardian)
  'Email',                // F
  'WhatsApp',             // G
  'Student first name',   // H  only when a parent or guardian registers a child
  'Status',               // I  registered | awaiting payment | paid | expired | waitlisted | cancelled | refunded | CHECK: ...
  'Payment ID',           // J
  'Cancel token',         // K
  'Consent at (UTC)',     // L
  'Consent wording',      // M
  'Time zone',            // N  the registrant's own time zone, for emails
  'Source',               // O
  'Confirmation email',   // P  yes | FAILED | after payment
  'Reminder 24h',         // Q  sent
  'Reminder 1h',          // R  sent
];

// The class topics, in the order the website shows them. Keep in step with
// src/lib/class-topics.ts (CLASS_TOPICS) on the website.
var TOPICS = [
  'Product',
  'Salesforce and CRM',
  'Zoho',
  'Careers',
  'Agile and software delivery',
  'Small business and automation',
  'AI tools for work',
];
// Older topic names still found in existing rows, read as their new topic (lowercase keys).
var OLD_TOPICS = { 'product management': 'Product', 'product ownership': 'Product' };
// Statuses that always hold a seat. "awaiting payment" holds one only for HOLD_MINUTES.
var HOLDS_SEAT = ['registered', 'paid'];
var AWAITING = 'awaiting payment';
var HOLD_MINUTES = 30;
var LOCK_WAIT_MS = 20000;
var REFUND_RULE = 'Full refund until 24 hours before the class. After that, we offer a place in the next class instead.';
var REMINDER_MINUTES = 15; // how often the reminder timer runs
var DAY_MS = 24 * 60 * 60 * 1000;
var HOUR_MS = 60 * 60 * 1000;

/** Run once from the editor: creates the two tabs, headers, dropdowns and time zone. */
function setup() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  book.setSpreadsheetTimeZone('Asia/Kolkata');

  var classes = ensureSheet_(book, CLASSES_SHEET, CLASS_HEADERS);
  var rule = function (values) {
    return SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  };
  // Topic dropdown. Only new typing is checked: existing cells are never changed. A cell that
  // still holds an older topic shows a small red corner until a topic is picked from the list.
  classes.getRange('C2:C').setDataValidation(rule(TOPICS));
  classes.getRange('I2:I').setDataValidation(rule(['open', 'closed']));
  classes.getRange('D2:D').setNumberFormat('yyyy-mm-dd hh:mm');

  ensureSheet_(book, REGISTRATIONS_SHEET, REGISTRATION_HEADERS);

  // The reminder timer. Safe to run setup() again: it never adds a second timer.
  var exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'sendReminders'; });
  if (!exists) ScriptApp.newTrigger('sendReminders').timeBased().everyMinutes(REMINDER_MINUTES).create();
}

/**
 * Creates the tab or adds missing header cells at the end. Never moves or deletes data:
 * if a header cell already holds something different, it stops with a clear message
 * instead of overwriting it.
 */
function ensureSheet_(book, name, headers) {
  var sheet = book.getSheetByName(name) || book.insertSheet(name);
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  var current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  headers.forEach(function (header, i) {
    var found = String(current[i]).trim();
    if (found !== '' && found !== header) {
      throw new Error('Setup stopped, nothing was changed in this column: in the "' + name + '" tab, column ' +
        columnLetter_(i + 1) + ' is headed "' + found + '" but should be "' + header + '". ' +
        'Move that column to the right of the last expected column, then run setup again.');
    }
  });
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function columnLetter_(n) {
  var s = '';
  for (; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + (n - 1) % 26) + s;
  return s;
}

function doGet() {
  return reply_({ ok: false, error: 'use POST' });
}

function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    // Trimmed on both sides: a stray space or line break pasted with the password must not lock the site out.
    var secret = String(PropertiesService.getScriptProperties().getProperty('SHARED_SECRET') || '').trim();
    if (!secret) {
      console.error('Refused: the SHARED_SECRET script property is not set.');
      return reply_({ ok: false, error: 'unauthorised' });
    }
    if (!request || typeof request.secret !== 'string' || request.secret.trim() !== secret) {
      console.error('Refused: the password from the website does not match SHARED_SECRET.');
      return reply_({ ok: false, error: 'unauthorised' });
    }

    if (request.action === 'list') {
      var list = classList_();
      console.log('list: ' + list.classes.length + ' class(es) shown' +
        (list.problems.length ? '; not shown: ' + list.problems.map(problemText_).join('; ') : '') +
        (list.notes.length ? '; faculty: ' + list.notes.map(function (n) { return 'row ' + n.row + ' (' + n.classId + '): ' + n.note; }).join('; ') : ''));
      return reply_({ ok: true, classes: list.classes, problems: list.problems, notes: list.notes });
    }
    if (request.action === 'register') return reply_(register_(request));
    if (request.action === 'markPaid') return reply_(markPaid_(request));
    if (request.action === 'lookup') return reply_(lookup_(request));
    if (request.action === 'cancel') return reply_(cancel_(request));
    return reply_({ ok: false, error: 'unknown action' });
  } catch (error) {
    console.error(error);
    return reply_({ ok: false, error: 'script error' });
  }
}

// ---------- Reading the sheet ----------

function readClasses_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLASSES_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, CLASS_HEADERS.length).getValues()
    .map(function (row, i) {
      return {
        rowNumber: i + 2,
        id: String(row[0]).trim(),
        title: String(row[1]).trim(),
        topic: canonicalTopic_(row[2]),
        topicTyped: oneLine_(row[2], 60),
        start: startDate_(row[3]),
        duration: Number(row[4]),
        seats: Number(row[5]),
        // An empty or non-number price (for example "$10") is a problem, never silently free.
        price: String(row[6]).trim() === '' ? NaN : Number(row[6]),
        meetLink: String(row[7]).trim(),
        status: String(row[8]).trim().toLowerCase(),
        description: String(row[9] || '').trim(),
        facultyRole: oneLine_(row[10], 60),
        facultyName: oneLine_(row[11], 80),
        linkedIn: linkedIn_(row[12]),
        audience: oneLine_(row[13], 160),
      };
    })
    .filter(function (c) { return c.id !== ''; });
}

function oneLine_(value, max) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Reads the Faculty LinkedIn cell. Common forms are tidied first: spaces and line breaks
 * removed, https:// added when missing, http:// upgraded, and linkedin.com with or without
 * www or a country prefix (in.linkedin.com, uk.linkedin.com) rewritten to www.linkedin.com.
 * Every other site is refused, including look-alikes such as linkedin.com.evil.com.
 * Returns { url, status }: url is '' when nothing is used; status explains why, and never
 * contains the address itself (it usually includes the person's name).
 */
function linkedIn_(value) {
  var raw = String(value == null ? '' : value).replace(/\s+/g, '');
  if (raw === '') return { url: '', status: 'empty' };
  var tidied = [];
  var scheme = raw.match(/^([a-z][a-z0-9+.-]*):\/\//i);
  if (!scheme) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^[^:\/]+\.[a-z]{2,}(:|\/|$)/i.test(raw)) {
      return { url: '', status: 'ignored: not a web address' };
    }
    raw = 'https://' + raw.replace(/^\/\//, '');
    tidied.push('added https://');
  } else if (scheme[1].toLowerCase() === 'http') {
    raw = 'https://' + raw.slice(scheme[0].length);
    tidied.push('changed http:// to https://');
  } else if (scheme[1].toLowerCase() !== 'https') {
    return { url: '', status: 'ignored: not a web address' };
  }
  var m = raw.match(/^https:\/\/([^\/?#]*)([\/?#].*)?$/i);
  if (!m) return { url: '', status: 'ignored: not a web address' };
  var host = m[1].toLowerCase();
  var rest = m[2] || '';
  if (host.indexOf('@') >= 0 || host.indexOf(':') >= 0) {
    return { url: '', status: 'ignored: the address hides another site (contains @ or a port)' };
  }
  if (host !== 'linkedin.com' && !/^[a-z]{2,3}\.linkedin\.com$/.test(host)) {
    return { url: '', status: 'ignored: not a LinkedIn address (only linkedin.com is accepted)' };
  }
  if (host !== 'www.linkedin.com') tidied.push('changed the site name to www.linkedin.com');
  rest = rest.replace(/#.*$/, '');
  if (rest.charAt(0) !== '/') rest = '/' + rest;
  if (rest === '/' || rest.charAt(1) === '?') return { url: '', status: 'ignored: it is the LinkedIn home page, not a profile' };
  try {
    // Letters such as é or ö in a profile address, written the way browsers send them.
    rest = rest.replace(/[^\x00-\x7F]+/g, function (s) { return encodeURIComponent(s); });
  } catch (e) {
    return { url: '', status: 'ignored: contains characters a LinkedIn address cannot have' };
  }
  if (!/^\/[A-Za-z0-9\-._~%\/?=&+]*$/.test(rest)) {
    return { url: '', status: 'ignored: contains characters a LinkedIn address cannot have' };
  }
  var url = 'https://www.linkedin.com' + rest;
  if (url.length > 200) return { url: '', status: 'ignored: longer than 200 characters' };
  return { url: url, status: tidied.length ? 'used, after tidying (' + tidied.join(', ') + ')' : 'used' };
}

/** What happens to the faculty line of a class, for logs. Never includes names or addresses. */
function facultyNote_(c) {
  if (!c.facultyName) return '';
  if (!c.facultyRole) return 'faculty name not shown: Faculty role is empty, so there is no "Taught by" line';
  if (c.linkedIn.status === 'empty') return 'faculty name shown without a link (no LinkedIn address given)';
  return 'faculty LinkedIn ' + c.linkedIn.status;
}

/**
 * The topic exactly as listed in TOPICS, ignoring case and extra spaces. Older names
 * ("Product management", "Product ownership") are read as Product. '' if it is not a topic.
 */
function canonicalTopic_(value) {
  var wanted = String(value).replace(/\s+/g, ' ').trim().toLowerCase();
  for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].toLowerCase() === wanted) return TOPICS[i];
  return OLD_TOPICS.hasOwnProperty(wanted) ? OLD_TOPICS[wanted] : '';
}

/**
 * The class start as a Date. Sheets normally gives a Date already. If the cell holds text
 * instead (formatted as plain text, or typed with a leading apostrophe), "2026-11-06 19:00"
 * is read as India time (UTC+5:30, no daylight saving). Anything else gives null.
 */
function startDate_(value) {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  var m = String(value).trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})$/);
  if (!m) return null;
  var utc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - 330 * 60000;
  var date = new Date(utc);
  return isNaN(date.getTime()) ? null : date;
}

function readRegistrations_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATIONS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, REGISTRATION_HEADERS.length).getValues()
    .map(function (row, i) {
      return {
        rowNumber: i + 2,
        registeredAt: new Date(row[0]),
        classId: String(row[1]).trim(),
        type: String(row[3]).trim(),
        name: String(row[4]).replace(/^'/, '').trim(),
        email: String(row[5]).trim().toLowerCase(),
        child: String(row[7]).replace(/^'/, '').trim(),
        status: String(row[8]).trim().toLowerCase(),
        paymentId: String(row[9]).trim(),
        token: String(row[10]).trim(),
        timeZone: String(row[13]).trim(),
        confirmation: String(row[15]).trim(),
        reminder24: String(row[16]).trim(),
        reminder1: String(row[17]).trim(),
      };
    });
}

/** An unpaid registration still within its payment window. */
function isActiveHold_(r, now) {
  return r.status === AWAITING && now - r.registeredAt.getTime() < HOLD_MINUTES * 60000;
}

function setCells_(rowNumber, values) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATIONS_SHEET);
  Object.keys(values).forEach(function (header) {
    var col = REGISTRATION_HEADERS.indexOf(header) + 1;
    sheet.getRange(rowNumber, col).setValue(safeCell_(values[header]));
  });
}

/**
 * Why a class row is not shown on the website, or '' when it is shown. "closed" and "past"
 * are normal; every other reason means the row needs fixing.
 */
function classProblem_(c) {
  if (c.status !== 'open') return 'closed';
  if (!(c.start instanceof Date)) return 'Start is not a date and time (type it like 2026-11-06 19:00)';
  if (c.start.getTime() <= Date.now()) return 'past';
  if (!/^[a-z0-9-]{3,60}$/.test(c.id)) return 'Class ID must be 3 to 60 lowercase letters, numbers or hyphens';
  if (c.title === '') return 'Title is empty';
  if (c.topic === '') {
    return (c.topicTyped ? 'Topic "' + c.topicTyped + '" is not one of the topics' : 'Topic is empty') +
      '; pick one from the list: ' + TOPICS.join(', ');
  }
  if (!(c.duration > 0)) return 'Duration must be a number of minutes';
  if (!(c.seats > 0)) return 'Seats must be a number above 0';
  if (!(c.price >= 0)) return 'Price must be a number (0 for free)';
  if (!/^https:\/\//i.test(c.meetLink)) return 'Meet link is empty or does not start with https://';
  return '';
}

/** A class the website may show and take registrations for. */
function isOpenUpcoming_(c) {
  return classProblem_(c) === '';
}

/** The problem as one line for logs. Never includes the Meet link. */
function problemText_(p) {
  return 'row ' + p.row + ' (' + p.classId + '): ' + p.reason;
}

function seatsTaken_(registrations, classId, exceptRow) {
  var now = Date.now();
  return registrations.filter(function (r) {
    return r.classId === classId && r.rowNumber !== exceptRow &&
      (HOLDS_SEAT.indexOf(r.status) >= 0 || isActiveHold_(r, now));
  }).length;
}

/**
 * Public class list, plus the rows that need fixing (row number, Class ID and reason only).
 * NEVER add the Meet link or any registration details here.
 */
function classList_() {
  var registrations = readRegistrations_();
  var rows = readClasses_();
  var problems = [];
  rows.forEach(function (c) {
    var reason = classProblem_(c);
    if (reason && reason !== 'closed' && reason !== 'past') {
      problems.push({ row: c.rowNumber, classId: c.id.slice(0, 60), reason: reason });
    }
  });
  var classes = rows
    .filter(isOpenUpcoming_)
    .sort(function (a, b) { return a.start.getTime() - b.start.getTime(); })
    .map(function (c) {
      return {
        id: c.id,
        title: c.title,
        topic: c.topic,
        startUtc: c.start.toISOString(),
        durationMinutes: c.duration,
        seats: c.seats,
        seatsLeft: Math.max(0, c.seats - seatsTaken_(registrations, c.id)),
        priceUsd: c.price,
        description: c.description,
        facultyRole: c.facultyRole,
        facultyName: c.facultyRole ? c.facultyName : '',
        facultyLinkedIn: c.facultyRole && c.facultyName ? c.linkedIn.url : '',
        audience: c.audience,
      };
    });
  // For every shown class with a faculty name: whether the LinkedIn address is used, and why not.
  var notes = rows.filter(isOpenUpcoming_).filter(function (c) { return facultyNote_(c) !== ''; })
    .map(function (c) { return { row: c.rowNumber, classId: c.id, note: facultyNote_(c) }; });
  return { classes: classes, problems: problems, notes: notes };
}

/**
 * Run from the editor (function list > checkClasses > Run) to see, in the Execution log,
 * exactly what the website receives and why any row is hidden. Needs no password and
 * never prints Meet links or personal details.
 */
function checkClasses() {
  readClasses_().forEach(function (c) {
    var reason = classProblem_(c);
    console.log('Row ' + c.rowNumber + ' (' + c.id + '): ' +
      (reason === '' ? 'SHOWN, starts ' + c.start.toISOString() + ' UTC' :
       reason === 'closed' ? 'hidden: Status is not "open"' :
       reason === 'past' ? 'hidden: the start time has passed (' + c.start.toISOString() + ' UTC)' :
       'hidden: ' + reason) +
      (c.topic && c.topicTyped.toLowerCase() !== c.topic.toLowerCase()
        ? '; Topic "' + c.topicTyped + '" is read as "' + c.topic + '" (pick it from the list to remove the red corner)' : '') +
      (facultyNote_(c) ? '; ' + facultyNote_(c) : ''));
  });
  var list = classList_();
  // Faculty names and LinkedIn addresses are personal data: say only whether they are set.
  var shown = list.classes.map(function (c) {
    var copy = JSON.parse(JSON.stringify(c));
    copy.facultyName = c.facultyName ? '(set)' : '';
    copy.facultyLinkedIn = c.facultyLinkedIn ? '(set)' : '';
    return copy;
  });
  console.log('The website receives ' + shown.length + ' class(es): ' + JSON.stringify(shown));
  console.log('Script time zone: ' + Session.getScriptTimeZone() +
    '; sheet time zone: ' + SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone());
}

// ---------- Registering ----------

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var WHATSAPP_PATTERN = /^\+?[0-9 ()-]{7,20}$/;

function text_(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function register_(request) {
  // The website checks all of this too; the script never trusts its input.
  var classId = text_(request.classId, 60);
  var type = request.registrantType === 'parent' ? 'parent' : request.registrantType === 'self' ? 'self' : '';
  var name = text_(request.name, 80);
  var email = text_(request.email, 254).toLowerCase();
  var whatsapp = text_(request.whatsapp, 25);
  var child = type === 'parent' ? text_(request.studentFirstName, 40) : '';
  var timeZone = validTimeZone_(text_(request.timeZone, 64));
  if (!classId || !type || name.length < 2 || !EMAIL_PATTERN.test(email) || !WHATSAPP_PATTERN.test(whatsapp) ||
      (type === 'parent' && child.length < 1) || request.consent !== true) {
    return { ok: false, error: 'invalid' };
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_WAIT_MS)) return { ok: false, error: 'busy' };

  var cls, rowNumber, token;
  try {
    cls = readClasses_().filter(function (c) { return c.id === classId; })[0];
    if (!cls) return { ok: false, error: 'not_found' };
    if (!isOpenUpcoming_(cls)) return { ok: false, error: 'closed' };

    var registrations = readRegistrations_();
    var nowMs = Date.now();
    var mine = registrations.filter(function (r) { return r.classId === cls.id && r.email === email; });
    var settled = mine.some(function (r) {
      return HOLDS_SEAT.indexOf(r.status) >= 0 || r.status === 'waitlisted' || r.status.indexOf('check') === 0;
    });
    if (settled) return { ok: false, error: 'duplicate' };
    var held = mine.filter(function (r) { return isActiveHold_(r, nowMs); })[0];
    if (held) {
      // Came back to pay within the payment window: reuse the seat that is already held.
      return { ok: true, status: 'awaiting_payment', token: held.token, amountCents: Math.round(cls.price * 100), currency: 'USD', title: cls.title };
    }
    var full = seatsTaken_(registrations, cls.id) >= cls.seats;
    var paid = cls.price > 0 && !full;
    var status = full ? 'waitlisted' : paid ? AWAITING : 'registered';
    token = Utilities.getUuid();
    var now = new Date();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATIONS_SHEET);
    sheet.appendRow([
      now.toISOString(), cls.id, cls.title,
      type === 'parent' ? 'parent or guardian' : 'self',
      name, email, whatsapp, child,
      status, '', token,
      text_(request.consentAt, 40) || now.toISOString(), text_(request.consentText, 600),
      timeZone, text_(request.source, 200), paid ? 'after payment' : 'pending', '', '',
    ].map(safeCell_));
    SpreadsheetApp.flush();
    rowNumber = sheet.getLastRow();
    if (paid) {
      // No email yet: the confirmation (with the Meet link) is sent once payment is verified.
      return { ok: true, status: 'awaiting_payment', token: token, amountCents: Math.round(cls.price * 100), currency: 'USD', title: cls.title };
    }
  } finally {
    lock.releaseLock();
  }

  // Email after the row is saved and the lock released, so a slow email never blocks others.
  var person = { name: name, email: email, child: child, timeZone: timeZone, token: token };
  var emailed = full
    ? deliver_(rowNumber, 'waiting list', 'waiting list email sent', function () { sendWaitlisted_(cls, person); })
    : deliver_(rowNumber, 'confirmation', 'yes', function () { sendConfirmation_(cls, person); });

  return { ok: true, status: full ? 'waitlisted' : 'registered', emailed: emailed };
}

// ---------- Cancelling and the waiting list ----------

var TOKEN_PATTERN = /^[0-9a-f-]{32,36}$/i;

function findByToken_(token) {
  var ref = String(token).replace(/-/g, '').toLowerCase();
  return readRegistrations_().filter(function (r) { return r.token.replace(/-/g, '').toLowerCase() === ref; })[0];
}

/** For the cancel page: class name, start time and status only. No personal data. */
function lookup_(request) {
  var token = text_(request.token, 64);
  if (!TOKEN_PATTERN.test(token)) return { ok: false, error: 'invalid' };
  var row = findByToken_(token);
  if (!row) return { ok: false, error: 'not_found' };
  var cls = readClasses_().filter(function (c) { return c.id === row.classId; })[0];
  if (!cls || !(cls.start instanceof Date)) return { ok: false, error: 'not_found' };
  return { ok: true, classTitle: cls.title, startUtc: cls.start.toISOString(), status: row.status };
}

function cancel_(request) {
  var token = text_(request.token, 64);
  if (!TOKEN_PATTERN.test(token)) return { ok: false, error: 'invalid' };

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_WAIT_MS)) return { ok: false, error: 'busy' };

  var row, cls, promoted = null, ownerNote = '';
  try {
    row = findByToken_(token);
    if (!row) return { ok: false, error: 'not_found' };
    if (row.status === 'cancelled') return { ok: true, status: 'cancelled', repeat: true };
    cls = readClasses_().filter(function (c) { return c.id === row.classId; })[0];
    if (!cls || !(cls.start instanceof Date) || cls.start.getTime() <= Date.now()) return { ok: false, error: 'too_late' };
    var cancellable = HOLDS_SEAT.indexOf(row.status) >= 0 || row.status === AWAITING || row.status === 'waitlisted';
    if (!cancellable) return { ok: false, error: 'not_cancellable' };

    var heldSeat = HOLDS_SEAT.indexOf(row.status) >= 0 || isActiveHold_(row, Date.now());
    setCells_(row.rowNumber, { 'Status': 'cancelled' });
    if (row.status === 'paid') {
      var early = cls.start.getTime() - Date.now() >= DAY_MS;
      ownerNote = 'Paid registration cancelled (payment ' + row.paymentId + '). ' +
        (early ? 'More than 24 hours before the class: refund in full.' : 'Less than 24 hours before the class: offer a place in the next class.');
    }

    // Give the freed seat to the first person on the waiting list (even if new
    // registrations are closed: they already asked for a place).
    if (heldSeat) {
      var next = readRegistrations_().filter(function (r) { return r.classId === cls.id && r.status === 'waitlisted'; })[0];
      if (next) {
        if (cls.price > 0) {
          // Paid class: hold the seat for 30 minutes from now and invite them to pay.
          setCells_(next.rowNumber, { 'Status': AWAITING, 'Registered at (UTC)': new Date().toISOString() });
        } else {
          setCells_(next.rowNumber, { 'Status': 'registered' });
        }
        promoted = next;
      }
    }
  } finally {
    lock.releaseLock();
  }

  if (ownerNote) alertOwner_('Master class cancellation: refund decision needed', ownerNote + '\n\nRegistrant: ' + row.name + ' <' + row.email + '>\nClass: ' + row.classId);
  if (promoted) {
    var who = { name: promoted.name, email: promoted.email, child: promoted.child, timeZone: validTimeZone_(promoted.timeZone), token: promoted.token };
    console.log('Row ' + row.rowNumber + ' cancelled; row ' + promoted.rowNumber + ' moved up from the waiting list.');
    if (cls.price > 0) {
      deliver_(promoted.rowNumber, 'place to pay', 'place offered, awaiting payment', function () { sendPlaceToPay_(cls, who); });
    } else {
      deliver_(promoted.rowNumber, PLACE_OPENED, 'yes (' + PLACE_OPENED + ')', function () { sendConfirmation_(cls, who, true); });
    }
  } else if (heldSeat) {
    console.log('Row ' + row.rowNumber + ' cancelled; nobody is on the waiting list, so the seat is free again.');
  }
  return { ok: true, status: 'cancelled', promoted: Boolean(promoted) };
}

// ---------- Reminders (run by the 15-minute timer created in setup) ----------

function sendReminders() {
  // A separate lock from registrations, so sending many reminders never makes the
  // registration form say "busy". It only stops two reminder runs from overlapping.
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) return; // the previous run is still sending; try again next time

  var due = [];
  try {
    var now = Date.now();
    var classes = {};
    readClasses_().forEach(function (c) {
      if (c.start instanceof Date && c.start.getTime() > now && c.meetLink) classes[c.id] = c;
    });
    retryFailedEmails_(classes);
    readRegistrations_().forEach(function (r) {
      var cls = classes[r.classId];
      if (!cls || HOLDS_SEAT.indexOf(r.status) < 0) return;
      var until = cls.start.getTime() - now;
      if (until <= HOUR_MS && !r.reminder1) {
        due.push({ r: r, cls: cls, kind: '1h' });
      } else if (until <= DAY_MS && until > HOUR_MS && !r.reminder24 &&
                 r.registeredAt.getTime() <= cls.start.getTime() - DAY_MS) {
        // People who registered within the last 24 hours already have a fresh confirmation.
        due.push({ r: r, cls: cls, kind: '24h' });
      }
    });

    var quota = MailApp.getRemainingDailyQuota();
    if (due.length > quota) {
      alertOwner_('Master class reminders: daily email limit reached',
        due.length + ' reminders are due but Google allows only ' + quota + ' more emails today. ' +
        'The rest will be sent when the limit resets. Consider a WhatsApp message to your group.');
      due = due.slice(0, Math.max(0, quota - 1));
    }

    due.forEach(function (item) {
      try {
        sendReminder_(item.cls, {
          name: item.r.name, email: item.r.email, child: item.r.child,
          timeZone: validTimeZone_(item.r.timeZone), token: item.r.token,
        }, item.kind);
        setCells_(item.r.rowNumber, item.kind === '1h' ? { 'Reminder 1h': 'sent' } : { 'Reminder 24h': 'sent' });
      } catch (error) {
        console.error('Reminder failed for row ' + item.r.rowNumber + ': ' + error);
      }
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Called by the website after it has verified Razorpay's signature (from the payment
 * notification or the visitor's return from the payment page). Safe to call more than once
 * for the same payment: the payment ID makes repeats harmless.
 */
function markPaid_(request) {
  var ref = text_(request.token, 64).replace(/-/g, '');
  var paymentId = text_(request.paymentId, 64);
  var amountCents = Number(request.amountCents);
  var currency = text_(request.currency, 3).toUpperCase();
  if (!ref || !/^pay_[A-Za-z0-9]+$/.test(paymentId) || !isFinite(amountCents)) return { ok: false, error: 'invalid' };

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_WAIT_MS)) return { ok: false, error: 'busy' };

  var row, cls, problem = '', sendEmail = false;
  try {
    row = readRegistrations_().filter(function (r) { return r.token.replace(/-/g, '') === ref; })[0];
    if (!row) return { ok: false, error: 'not_found' };
    cls = readClasses_().filter(function (c) { return c.id === row.classId; })[0];

    if (row.status === 'paid') {
      if (row.paymentId === paymentId) return { ok: true, status: 'paid', repeat: true };
      problem = 'Second payment ' + paymentId + ' for a seat already paid by ' + row.paymentId + '. Refund the second payment.';
    } else if (!cls || amountCents !== Math.round(cls.price * 100) || currency !== 'USD') {
      problem = 'Payment ' + paymentId + ' of ' + (amountCents / 100) + ' ' + currency + ' does not match the class price. Check before confirming.';
      setCells_(row.rowNumber, { 'Status': 'CHECK: amount', 'Payment ID': paymentId });
    } else if (row.status === AWAITING || row.status === 'expired') {
      var seatFree = isActiveHold_(row, Date.now()) ||
        seatsTaken_(readRegistrations_(), row.classId, row.rowNumber) < cls.seats;
      if (seatFree) {
        setCells_(row.rowNumber, { 'Status': 'paid', 'Payment ID': paymentId });
        sendEmail = true;
      } else {
        problem = 'Payment ' + paymentId + ' arrived after the payment window and the class is now full. Refund, or add a seat and confirm by hand.';
        setCells_(row.rowNumber, { 'Status': 'CHECK: paid but no seat', 'Payment ID': paymentId });
      }
    } else {
      problem = 'Payment ' + paymentId + ' received for a registration with status "' + row.status + '". Check and refund if needed.';
      setCells_(row.rowNumber, { 'Payment ID': paymentId });
    }
  } finally {
    lock.releaseLock();
  }

  if (problem) {
    alertOwner_('Master class payment needs your attention', problem + '\n\nRegistrant: ' + row.name + ' <' + row.email + '>\nClass: ' + row.classId);
    return { ok: true, status: 'needs_attention' };
  }
  var emailed = false;
  if (sendEmail) {
    var payer = { name: row.name, email: row.email, child: row.child, timeZone: validTimeZone_(row.timeZone), token: row.token, paymentId: paymentId };
    emailed = deliver_(row.rowNumber, 'confirmation', 'yes', function () { sendConfirmation_(cls, payer); });
  }
  return { ok: true, status: 'paid', emailed: emailed };
}

var PLACE_OPENED = 'place opened up';
var MAX_EMAIL_ATTEMPTS = 5;

/**
 * Sends one email to a registrant and records the outcome in the row's "Confirmation email"
 * cell, so each email is sent exactly once:
 *   - before sending, the cell says "sending (...)": if Google stops the script half-way, the
 *     row is never sent a second copy automatically;
 *   - after sending, the cell holds okValue;
 *   - if it cannot be sent, the cell says "FAILED (what, attempt N): reason", the reason is
 *     logged (Apps Script > Executions), and the 15-minute timer tries again (up to
 *     MAX_EMAIL_ATTEMPTS times, until the class starts). The owner is emailed on the first failure.
 * Returns true when the email was sent.
 */
function deliver_(rowNumber, what, okValue, sendFn, attempt) {
  attempt = attempt || 1;
  var reason = '';
  var left = MailApp.getRemainingDailyQuota();
  if (left < 1) {
    reason = "Google's daily email limit for this account is used up (it resets within 24 hours)";
  } else {
    setCells_(rowNumber, { 'Confirmation email': 'sending (' + what + ')' });
    try {
      sendFn();
    } catch (error) {
      reason = String(error && error.message ? error.message : error);
    }
  }
  if (!reason) {
    setCells_(rowNumber, { 'Confirmation email': okValue });
    console.log('Row ' + rowNumber + ': ' + what + ' email sent.');
    return true;
  }
  setCells_(rowNumber, { 'Confirmation email': 'FAILED (' + what + ', attempt ' + attempt + '): ' + reason.slice(0, 200) });
  console.error('Row ' + rowNumber + ': ' + what + ' email NOT sent (attempt ' + attempt + '). Reason: ' + reason);
  if (attempt === 1 && left >= 1) {
    alertOwner_('Master class email not sent',
      'The ' + what + ' email for row ' + rowNumber + ' of the Registrations tab could not be sent.\n\nReason: ' + reason +
      '\n\nThe script will try again every 15 minutes until the class starts.');
  }
  return false;
}

/** Retries confirmation and "place opened up" emails that failed (run by the 15-minute timer). */
function retryFailedEmails_(classes) {
  readRegistrations_().forEach(function (r) {
    var m = r.confirmation.match(/^FAILED \((confirmation|place opened up), attempt (\d+)\)/);
    var cls = classes[r.classId];
    if (!m || !cls || HOLDS_SEAT.indexOf(r.status) < 0 || Number(m[2]) >= MAX_EMAIL_ATTEMPTS) return;
    var fromWaitlist = m[1] === PLACE_OPENED;
    var person = { name: r.name, email: r.email, child: r.child, timeZone: validTimeZone_(r.timeZone), token: r.token };
    if (r.status === 'paid') person.paymentId = r.paymentId;
    deliver_(r.rowNumber, m[1], fromWaitlist ? 'yes (' + PLACE_OPENED + ')' : 'yes',
      function () { sendConfirmation_(cls, person, fromWaitlist); }, Number(m[2]) + 1);
  });
}

function alertOwner_(subject, body) {
  var owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  if (!owner) return;
  try {
    MailApp.sendEmail({ to: owner, subject: subject, body: body });
  } catch (error) {
    console.error('Owner alert failed: ' + error);
  }
}

function validTimeZone_(tz) {
  if (!tz || !/^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){0,2}$/.test(tz)) return 'Asia/Kolkata';
  try {
    Utilities.formatDate(new Date(), tz, 'Z');
    return tz;
  } catch (e) {
    return 'Asia/Kolkata';
  }
}

// Stop a registrant's text from being treated as a spreadsheet formula.
function safeCell_(value) {
  var text = value == null ? '' : String(value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

// ---------- Emails and calendar file ----------

function formatWhen_(date, tz) {
  return Utilities.formatDate(date, tz, "EEEE d MMMM yyyy, h:mm a") + ' (' + tz + ')';
}

function cancelUrl_(token) {
  var site = PropertiesService.getScriptProperties().getProperty('SITE_URL') || 'https://mizraconsulting.com';
  return site.replace(/\/+$/, '') + '/student-portal/cancel?token=' + encodeURIComponent(token);
}

function greeting_(person) {
  return 'Hi ' + person.name.split(' ')[0] + ',';
}

function whenLines_(cls, person) {
  var lines = ['When: ' + formatWhen_(cls.start, person.timeZone)];
  if (person.timeZone !== 'Asia/Kolkata') lines.push('India time: ' + formatWhen_(cls.start, 'Asia/Kolkata'));
  return lines;
}

function send_(person, subject, lines, attachments) {
  var owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  var message = {
    to: person.email,
    name: 'Mizra Consulting',
    subject: subject,
    body: lines.concat(['', 'Questions? Just reply to this email.', '', 'Mizra Consulting']).join('\n'),
  };
  if (attachments) message.attachments = attachments;
  if (owner) message.replyTo = owner;
  MailApp.sendEmail(message);
}

function sendConfirmation_(cls, person, fromWaitlist) {
  var end = new Date(cls.start.getTime() + cls.duration * 60000);
  var who = person.child ? person.child : 'you';
  var lines = [greeting_(person), ''];
  if (fromWaitlist) lines.push('Good news: a place opened up, and it is yours.', '');
  lines.push(
    person.child
      ? 'You have registered ' + person.child + ' for ' + cls.title + ' (' + cls.topic + ').'
      : 'You are registered for ' + cls.title + ' (' + cls.topic + ').',
    ''
  );
  lines = lines.concat(whenLines_(cls, person));
  lines.push('Length: ' + cls.duration + ' minutes', 'Join link: ' + cls.meetLink);
  if (person.paymentId) {
    lines.push('', 'Payment received: $' + cls.price + ' (payment ID ' + person.paymentId + ').', REFUND_RULE);
  }
  lines.push(
    '',
    'A calendar file is attached. Please keep the join link to yourself.',
    "Can't make it? Please cancel so someone on the waiting list can have " + (who === 'you' ? 'your' : who + "'s") + ' place: ' + cancelUrl_(person.token)
  );
  send_(person, "You're registered: " + cls.title, lines,
    [Utilities.newBlob(icsFile_(cls, end, person.token), 'text/calendar', 'mizra-master-class.ics')]);
}

function sendWaitlisted_(cls, person) {
  var lines = [greeting_(person), '',
    (person.child ? person.child + ' is' : 'You are') + ' on the waiting list for ' + cls.title + ' (' + cls.topic + '). The class is full right now.',
    '',
  ].concat(whenLines_(cls, person)).concat([
    '',
    'If a place opens up, we will email you straight away with the join link. You do not need to do anything.',
    'No longer interested? Leave the waiting list here: ' + cancelUrl_(person.token),
  ]);
  send_(person, 'Waiting list: ' + cls.title, lines);
}

function sendPlaceToPay_(cls, person) {
  var site = PropertiesService.getScriptProperties().getProperty('SITE_URL') || 'https://mizraconsulting.com';
  var lines = [greeting_(person), '',
    'Good news: a place opened up in ' + cls.title + ', and we are holding it for ' + HOLD_MINUTES + ' minutes.',
    '',
    'To take it, register again on the class page with this email address and complete the payment:',
    site.replace(/\/+$/, '') + '/student-portal/' + cls.id,
    '',
    'Not interested any more? Let it go here: ' + cancelUrl_(person.token),
  ];
  send_(person, 'A place opened up: ' + cls.title, lines);
}

function sendReminder_(cls, person, kind) {
  var lines = [greeting_(person), '',
    (kind === '1h' ? 'Starting in about an hour: ' : 'Tomorrow: ') + cls.title + (person.child ? ' (for ' + person.child + ')' : '') + '.',
    '',
  ].concat(whenLines_(cls, person)).concat([
    'Join link: ' + cls.meetLink,
  ]);
  lines.push('', "Can't make it any more? Please cancel so someone else can have the place: " + cancelUrl_(person.token));
  send_(person, (kind === '1h' ? 'Starting soon: ' : 'Reminder: ') + cls.title, lines);
}

function icsDate_(date) {
  return Utilities.formatDate(date, 'UTC', "yyyyMMdd'T'HHmmss'Z'");
}

function icsText_(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

// Calendar lines longer than 75 characters must be folded (RFC 5545).
function icsFold_(line) {
  var out = [];
  while (line.length > 75) {
    out.push(line.slice(0, 75));
    line = ' ' + line.slice(75);
  }
  out.push(line);
  return out.join('\r\n');
}

function icsFile_(cls, end, token) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mizra Consulting//Master classes//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + token + '@mizraconsulting.com',
    'DTSTAMP:' + icsDate_(new Date()),
    'DTSTART:' + icsDate_(cls.start),
    'DTEND:' + icsDate_(end),
    'SUMMARY:' + icsText_('Mizra master class: ' + cls.title),
    'DESCRIPTION:' + icsText_('Join link: ' + cls.meetLink),
    'LOCATION:' + icsText_(cls.meetLink),
    'URL:' + cls.meetLink,
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(icsFold_).join('\r\n') + '\r\n';
}

function reply_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
