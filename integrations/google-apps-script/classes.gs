/**
 * Mizra master classes: classes and registrations kept in this Google Sheet.
 *
 * This is a SEPARATE sheet and script from the leads sheet. Paste this file into the
 * new sheet's Apps Script editor (Extensions > Apps Script), then run setup() once.
 *
 * Project Settings > Script Properties (never in this file):
 *   SHARED_SECRET  long random password; the same value as CLASSES_SCRIPT_SECRET in Vercel
 *   OWNER_EMAIL    replies to confirmation emails go here, e.g. info@mizraconsulting.com
 *
 * Project Settings > "Show appsscript.json": set "timeZone": "Asia/Kolkata".
 *
 * The owner manages classes by editing the Classes tab. The website only ever reads the
 * public class list (never Meet links, never personal data) and asks this script to register.
 */

var CLASSES_SHEET = 'Classes';
var REGISTRATIONS_SHEET = 'Registrations';

var CLASS_HEADERS = [
  'Class ID',             // A  short, letters/numbers/hyphens, used in the web address; never change once open
  'Title',                // B
  'Topic',                // C  Product management | Product ownership | HR
  'Start (India time)',   // D  date and time
  'Duration (minutes)',   // E
  'Seats',                // F
  'Price (USD)',          // G  0 for a free class
  'Meet link (private)',  // H  never shown on the website; sent only by email
  'Status',               // I  open | closed
  'Description (optional)', // J
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
  'Status',               // I  registered | waitlisted | cancelled | paid | refunded
  'Payment ID',           // J
  'Cancel token',         // K
  'Consent at (UTC)',     // L
  'Consent wording',      // M
  'Time zone',            // N  the registrant's own time zone, for emails
  'Source',               // O
  'Confirmation email',   // P  yes | FAILED
];

var TOPICS = ['Product management', 'Product ownership', 'HR'];
// Statuses that hold a seat.
var HOLDS_SEAT = ['registered', 'paid'];
var LOCK_WAIT_MS = 20000;

/** Run once from the editor: creates the two tabs, headers, dropdowns and time zone. */
function setup() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  book.setSpreadsheetTimeZone('Asia/Kolkata');

  var classes = ensureSheet_(book, CLASSES_SHEET, CLASS_HEADERS);
  var rule = function (values) {
    return SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  };
  classes.getRange('C2:C').setDataValidation(rule(TOPICS));
  classes.getRange('I2:I').setDataValidation(rule(['open', 'closed']));
  classes.getRange('D2:D').setNumberFormat('yyyy-mm-dd hh:mm');

  ensureSheet_(book, REGISTRATIONS_SHEET, REGISTRATION_HEADERS);
}

function ensureSheet_(book, name, headers) {
  var sheet = book.getSheetByName(name) || book.insertSheet(name);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function doGet() {
  return reply_({ ok: false, error: 'use POST' });
}

function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!secret || !request || request.secret !== secret) return reply_({ ok: false, error: 'unauthorised' });

    if (request.action === 'list') return reply_({ ok: true, classes: publicClasses_() });
    if (request.action === 'register') return reply_(register_(request));
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
    .map(function (row) {
      return {
        id: String(row[0]).trim(),
        title: String(row[1]).trim(),
        topic: String(row[2]).trim(),
        start: row[3],
        duration: Number(row[4]),
        seats: Number(row[5]),
        price: Number(row[6]) || 0,
        meetLink: String(row[7]).trim(),
        status: String(row[8]).trim().toLowerCase(),
        description: String(row[9] || '').trim(),
      };
    })
    .filter(function (c) { return c.id !== ''; });
}

function readRegistrations_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATIONS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, REGISTRATION_HEADERS.length).getValues()
    .map(function (row) {
      return {
        classId: String(row[1]).trim(),
        email: String(row[5]).trim().toLowerCase(),
        status: String(row[8]).trim().toLowerCase(),
      };
    });
}

/** A class the website may show and take registrations for. */
function isOpenUpcoming_(c) {
  return c.status === 'open' &&
    c.start instanceof Date && !isNaN(c.start.getTime()) && c.start.getTime() > Date.now() &&
    /^[a-z0-9-]{3,60}$/.test(c.id) &&
    c.title !== '' && TOPICS.indexOf(c.topic) >= 0 &&
    c.duration > 0 && c.seats > 0 && c.price >= 0;
}

function seatsTaken_(registrations, classId) {
  return registrations.filter(function (r) {
    return r.classId === classId && HOLDS_SEAT.indexOf(r.status) >= 0;
  }).length;
}

/** Public class list. NEVER add the Meet link or any registration details here. */
function publicClasses_() {
  var registrations = readRegistrations_();
  return readClasses_()
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
      };
    });
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
    var duplicate = registrations.some(function (r) {
      return r.classId === cls.id && r.email === email && r.status !== 'cancelled';
    });
    if (duplicate) return { ok: false, error: 'duplicate' };
    if (seatsTaken_(registrations, cls.id) >= cls.seats) return { ok: false, error: 'full' };

    token = Utilities.getUuid();
    var now = new Date();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATIONS_SHEET);
    sheet.appendRow([
      now.toISOString(), cls.id, cls.title,
      type === 'parent' ? 'parent or guardian' : 'self',
      name, email, whatsapp, child,
      'registered', '', token,
      text_(request.consentAt, 40) || now.toISOString(), text_(request.consentText, 600),
      timeZone, text_(request.source, 200), 'pending',
    ].map(safeCell_));
    SpreadsheetApp.flush();
    rowNumber = sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }

  // Email after the seat is saved and the lock released, so a slow email never blocks others.
  var emailed = false;
  try {
    sendConfirmation_(cls, { name: name, email: email, child: child, timeZone: timeZone, token: token });
    emailed = true;
  } catch (error) {
    console.error('Confirmation email failed: ' + error);
  }
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATIONS_SHEET)
    .getRange(rowNumber, REGISTRATION_HEADERS.length).setValue(emailed ? 'yes' : 'FAILED');

  return { ok: true, status: 'registered', emailed: emailed };
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

function sendConfirmation_(cls, person) {
  var owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  var firstName = person.name.split(' ')[0];
  var end = new Date(cls.start.getTime() + cls.duration * 60000);
  var lines = [
    'Hi ' + firstName + ',',
    '',
    person.child
      ? 'You have registered ' + person.child + ' for ' + cls.title + ' (' + cls.topic + ').'
      : 'You are registered for ' + cls.title + ' (' + cls.topic + ').',
    '',
    'When: ' + formatWhen_(cls.start, person.timeZone),
  ];
  if (person.timeZone !== 'Asia/Kolkata') lines.push('India time: ' + formatWhen_(cls.start, 'Asia/Kolkata'));
  lines.push(
    'Length: ' + cls.duration + ' minutes',
    'Join link: ' + cls.meetLink,
    '',
    'A calendar file is attached. Please keep the join link to yourself.',
    '',
    'Questions? Just reply to this email.',
    '',
    'Mizra Consulting'
  );

  var message = {
    to: person.email,
    name: 'Mizra Consulting',
    subject: "You're registered: " + cls.title,
    body: lines.join('\n'),
    attachments: [Utilities.newBlob(icsFile_(cls, end, person.token), 'text/calendar', 'mizra-master-class.ics')],
  };
  if (owner) message.replyTo = owner;
  MailApp.sendEmail(message);
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
