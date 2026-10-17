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

var TOPICS = ['Product management', 'Product ownership', 'HR'];
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
  classes.getRange('C2:C').setDataValidation(rule(TOPICS));
  classes.getRange('I2:I').setDataValidation(rule(['open', 'closed']));
  classes.getRange('D2:D').setNumberFormat('yyyy-mm-dd hh:mm');

  ensureSheet_(book, REGISTRATIONS_SHEET, REGISTRATION_HEADERS);

  // The reminder timer. Safe to run setup() again: it never adds a second timer.
  var exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'sendReminders'; });
  if (!exists) ScriptApp.newTrigger('sendReminders').timeBased().everyMinutes(REMINDER_MINUTES).create();
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

/** A class the website may show and take registrations for. */
function isOpenUpcoming_(c) {
  return c.status === 'open' &&
    c.start instanceof Date && !isNaN(c.start.getTime()) && c.start.getTime() > Date.now() &&
    /^[a-z0-9-]{3,60}$/.test(c.id) &&
    c.title !== '' && TOPICS.indexOf(c.topic) >= 0 &&
    c.duration > 0 && c.seats > 0 && c.price >= 0;
}

function seatsTaken_(registrations, classId, exceptRow) {
  var now = Date.now();
  return registrations.filter(function (r) {
    return r.classId === classId && r.rowNumber !== exceptRow &&
      (HOLDS_SEAT.indexOf(r.status) >= 0 || isActiveHold_(r, now));
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
  var emailed = false;
  try {
    if (full) sendWaitlisted_(cls, person);
    else sendConfirmation_(cls, person);
    emailed = true;
  } catch (error) {
    console.error('Email failed: ' + error);
  }
  setCells_(rowNumber, { 'Confirmation email': emailed ? 'yes' : 'FAILED' });

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
    try {
      if (cls.price > 0) sendPlaceToPay_(cls, who);
      else sendConfirmation_(cls, who, true);
      setCells_(promoted.rowNumber, { 'Confirmation email': 'yes' });
    } catch (error) {
      console.error('Waiting-list email failed: ' + error);
      setCells_(promoted.rowNumber, { 'Confirmation email': 'FAILED' });
    }
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
    try {
      sendConfirmation_(cls, { name: row.name, email: row.email, child: row.child, timeZone: validTimeZone_(row.timeZone), token: row.token, paymentId: paymentId });
      emailed = true;
    } catch (error) {
      console.error('Confirmation email failed: ' + error);
    }
    setCells_(row.rowNumber, { 'Confirmation email': emailed ? 'yes' : 'FAILED' });
  }
  return { ok: true, status: 'paid', emailed: emailed };
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
