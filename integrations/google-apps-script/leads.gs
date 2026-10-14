/**
 * Mizra website leads: saves each form submission to this Google Sheet,
 * then emails the owner and sends the visitor a short auto-reply.
 *
 * Paste this into the sheet's Apps Script editor (Extensions > Apps Script).
 * Set these in Project Settings > Script Properties (never in this file):
 *   SHARED_SECRET  a long random password, the same value as LEADS_SHEET_SECRET in Vercel
 *   OWNER_EMAIL    where enquiry notifications go, e.g. info@mizraconsulting.com
 *   WHATSAPP_URL   optional, e.g. https://wa.me/919205710374 (shown in the auto-reply)
 *
 * The website only reports success when this script answers {"ok": true}.
 */

var SHEETS = {
  'enquiry': {
    name: 'Enquiries',
    headers: ['Received (UTC)', 'Name', 'Email', 'What they need', 'Source', 'Emails sent'],
    row: function (lead) {
      return [lead.receivedAt, lead.name, lead.email, lead.message, lead.source];
    },
  },
  'class-interest': {
    name: 'Class interest',
    headers: ['Received (UTC)', 'Name', 'Email', 'Topics', 'Source', 'Emails sent'],
    row: function (lead) {
      return [lead.receivedAt, lead.name, lead.email, (lead.topics || []).join(', '), lead.source];
    },
  },
};

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('SHARED_SECRET');
    var lead = JSON.parse(e.postData.contents);

    if (!secret || !lead || lead.secret !== secret) {
      return reply({ ok: false, error: 'unauthorised' });
    }
    var config = SHEETS[lead.kind];
    if (!config) return reply({ ok: false, error: 'unknown kind' });

    // 1. Save first, so a failed email never loses the lead.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    var sheet, rowNumber;
    try {
      sheet = sheetFor(config);
      sheet.appendRow(config.row(lead).map(safeCell).concat(['pending']));
      rowNumber = sheet.getLastRow();
    } finally {
      lock.releaseLock();
    }

    // 2. Then email. Failures are recorded in the sheet but do not undo the save.
    var emailed = false;
    try {
      sendEmails(lead, props);
      emailed = true;
    } catch (mailError) {
      console.error('Email failed: ' + mailError);
    }
    sheet.getRange(rowNumber, config.headers.length).setValue(emailed ? 'yes' : 'FAILED');

    return reply({ ok: true, emailed: emailed });
  } catch (error) {
    console.error(error);
    return reply({ ok: false, error: 'script error' });
  }
}

function sheetFor(config) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(config.name);
  if (!sheet) {
    sheet = book.insertSheet(config.name);
    sheet.appendRow(config.headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stop a visitor's text from being treated as a spreadsheet formula.
function safeCell(value) {
  var text = value == null ? '' : String(value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function sendEmails(lead, props) {
  var owner = props.getProperty('OWNER_EMAIL');
  var whatsapp = props.getProperty('WHATSAPP_URL');
  var firstName = String(lead.name).split(' ')[0];

  if (lead.kind === 'enquiry') {
    if (owner) {
      MailApp.sendEmail({
        to: owner,
        replyTo: lead.email,
        subject: 'New website enquiry from ' + lead.name,
        body:
          'Name: ' + lead.name + '\n' +
          'Email: ' + lead.email + '\n' +
          'Source: ' + lead.source + '\n\n' +
          'What they need:\n' + lead.message + '\n\n' +
          'Reply to this email to answer them. Promise on the site: within 4 business hours, Monday to Friday, India time.',
      });
    }
    // The auto-reply never repeats the visitor's message, so the form cannot be used to send spam.
    MailApp.sendEmail(withReplyTo({
      to: lead.email,
      name: 'Mizra Consulting',
      subject: 'We have your message',
      body:
        'Hi ' + firstName + ',\n\n' +
        'Thanks for writing. We have your message and we will reply within 4 business hours ' +
        '(Monday to Friday, India time). Messages sent at the weekend are answered on Monday morning.\n\n' +
        (whatsapp ? 'If it is urgent, message us on WhatsApp: ' + whatsapp + '\n\n' : '') +
        'Talk soon,\nMizra Consulting',
    }, owner));
  } else {
    if (owner) {
      MailApp.sendEmail({
        to: owner,
        replyTo: lead.email,
        subject: 'Master-class interest: ' + lead.name,
        body:
          'Name: ' + lead.name + '\nEmail: ' + lead.email +
          '\nTopics: ' + (lead.topics || []).join(', ') + '\nSource: ' + lead.source,
      });
    }
    MailApp.sendEmail(withReplyTo({
      to: lead.email,
      name: 'Mizra Consulting',
      subject: "You're on the master-class list",
      body:
        'Hi ' + firstName + ',\n\n' +
        'Thanks for your interest in Mizra master classes (' + (lead.topics || []).join(', ') + '). ' +
        'We will email you as soon as dates are open for registration.\n\n' +
        'If you did not sign up, ignore this email and we will not contact you again.\n\n' +
        'Mizra Consulting',
    }, owner));
  }
}

function withReplyTo(message, owner) {
  if (owner) message.replyTo = owner;
  return message;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
