// Server side only: master classes, read from the classes Google Apps Script
// (integrations/google-apps-script/classes.gs). Configuration lives in Vercel:
//   CLASS_REGISTRATION_OPEN  "true" switches the portal on; anything else shows the holding page
//   CLASSES_SCRIPT_URL       web app address of the classes script
//   CLASSES_SCRIPT_SECRET    shared password; same value as SHARED_SECRET in the script

import { paymentsConfigured } from './razorpay';

export interface PublicClass {
  id: string;
  title: string;
  topic: string;
  startUtc: string;
  durationMinutes: number;
  seats: number;
  seatsLeft: number;
  priceUsd: number;
  description: string;
  /** For example "Product Owner". Empty: no "Taught by" line. */
  facultyRole?: string;
  facultyName?: string;
  facultyLinkedIn?: string;
  /** "Who it's for" line; empty or missing shows nothing. */
  audience?: string;
}

/** The faculty line for a class page, or null when no role is set. */
export function facultyOf(cls: PublicClass): { role: string; name: string; linkedIn: string } | null {
  const role = (cls.facultyRole ?? '').trim();
  if (!role) return null;
  const name = (cls.facultyName ?? '').trim();
  return { role, name, linkedIn: name ? safeLinkedIn(cls.facultyLinkedIn) : '' };
}

/** Only https://www.linkedin.com/ addresses; anything else is ignored. Checked here as well as in the script. */
export function safeLinkedIn(value: unknown): string {
  if (typeof value !== 'string' || value.length > 200) return '';
  try {
    const url = new URL(value.trim());
    const ok = url.protocol === 'https:' && url.hostname === 'www.linkedin.com' && !url.username && !url.password && !url.port;
    return ok ? url.href : '';
  } catch {
    return '';
  }
}

/** The owner's switch for the master classes portal and registration. */
export function isRegistrationOpen(): boolean {
  return process.env.CLASS_REGISTRATION_OPEN === 'true';
}

/**
 * Priced classes can be booked only when Razorpay is fully configured, so nobody can
 * register for a paid class without paying.
 */
export function paymentsReady(): boolean {
  return paymentsConfigured();
}

// Script answers that are part of normal use and need no log line.
const EXPECTED_ERRORS = ['duplicate', 'full', 'closed', 'not_found', 'too_late', 'not_cancellable', 'busy', 'invalid'];

const HINTS: Record<string, string> = {
  unauthorised: 'CLASSES_SCRIPT_SECRET in Vercel does not match SHARED_SECRET in the script (or SHARED_SECRET is not set)',
  'script error': 'the script hit an error; open Apps Script > Executions for details',
  'unknown action': 'the deployed script is an older version; deploy a new version',
};

/**
 * Calls the classes script. Every failure is logged to Vercel's logs with a plain reason.
 * Logs never include the secret, the script address, the Meet link or personal details.
 */
async function callScript<T>(body: Record<string, unknown>, revalidate?: number): Promise<T | null> {
  const action = String(body.action);
  // Trimmed: a space or line break pasted into Vercel with the value must not break the call.
  const url = process.env.CLASSES_SCRIPT_URL?.trim();
  const secret = process.env.CLASSES_SCRIPT_SECRET?.trim();
  if (!url || !secret) {
    const missing = [!url && 'CLASSES_SCRIPT_URL', !secret && 'CLASSES_SCRIPT_SECRET'].filter(Boolean).join(' and ');
    console.error(`Classes script "${action}" not called: ${missing} is not set for this environment`);
    return null;
  }
  // Web app addresses end in /exec (Workspace accounts have /a/macros/<domain>/ in the middle).
  // A /dev address works only for the signed-in owner, never for the website.
  if (!/^https:\/\/script\.google\.com\/(a\/macros\/[^/]+|macros)\/s\/[^/]+\/exec$/.test(url) && !/^http:\/\/localhost:\d+/.test(url)) {
    console.error(
      `Classes script "${action}": CLASSES_SCRIPT_URL does not look like a deployed web app address ending in /exec${url.endsWith('/dev') ? ' (it ends in /dev, the test address)' : ''}`,
    );
  }
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, ...body }),
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
      ...(revalidate === undefined ? { cache: 'no-store' as const } : { next: { revalidate } }),
    });
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError' ? 'no answer within 25 seconds' : String(error);
    console.error(`Classes script "${action}" could not be reached: ${reason}`);
    return null;
  }
  const text = await res.text().catch(() => '');
  let reply: unknown;
  try {
    reply = JSON.parse(text);
  } catch {
    const page = /<html|<!doctype/i.test(text) ? 'a web page (often a Google sign-in page: check "Who has access: Anyone")' : 'something that is not JSON';
    console.error(`Classes script "${action}" answered HTTP ${res.status} with ${page}, not the expected data`);
    return null;
  }
  if (!res.ok) console.error(`Classes script "${action}" answered HTTP ${res.status}`);
  const error = (reply as { ok?: unknown; error?: unknown })?.ok === false ? String((reply as { error?: unknown }).error) : '';
  if (error && !EXPECTED_ERRORS.includes(error)) {
    console.error(`Classes script refused "${action}": ${error}${HINTS[error] ? ` (${HINTS[error]})` : ''}`);
  }
  return reply as T;
}

/** How often seat counts are refreshed from the sheet, in seconds. */
export const CLASS_DATA_SECONDS = 10;

/** Upcoming open classes, refreshed about every 10 seconds. null means the list could not be loaded. */
export async function getClasses(): Promise<PublicClass[] | null> {
  if (!isRegistrationOpen()) return [];
  const reply = await callScript<{ ok?: boolean; classes?: PublicClass[]; problems?: ClassProblem[] }>(
    { action: 'list' },
    CLASS_DATA_SECONDS,
  );
  if (!reply) return null;
  if (!reply.ok) return null; // reason already logged by callScript
  if (!Array.isArray(reply.classes)) {
    console.error('Classes script "list" answered without a class list; deploy the latest script version');
    return null;
  }
  logClassProblems(reply.problems);
  logFacultyNotes((reply as { notes?: unknown }).notes);
  return reply.classes;
}

/**
 * Whether this deployment talks to a classes sheet at all. Without both settings (Production
 * today) the cancel page and cancel endpoint answer 404, as if they did not exist.
 */
export function classesConfigured(): boolean {
  return Boolean(process.env.CLASSES_SCRIPT_URL?.trim() && process.env.CLASSES_SCRIPT_SECRET?.trim());
}

/** A Classes row the script did not show, and why. Row number, Class ID and reason only. */
interface ClassProblem {
  row: number;
  classId: string;
  reason: string;
}

// The list is fetched about every 10 seconds; repeat the same line at most every 10 minutes.
const lastWarned = new Map<string, number>();

function logOnce(line: string, level: 'warn' | 'info') {
  const now = Date.now();
  if (now - (lastWarned.get(line) ?? 0) < 10 * 60 * 1000) return;
  lastWarned.set(line, now);
  console[level](line);
}

function logClassProblems(problems: unknown) {
  if (!Array.isArray(problems)) return;
  for (const p of problems as ClassProblem[]) {
    logOnce(`Classes sheet row ${Number(p.row)} (${String(p.classId).slice(0, 60)}) is not shown: ${String(p.reason).slice(0, 200)}`, 'warn');
  }
}

/**
 * For each shown class with a faculty name: whether its LinkedIn address is used or ignored,
 * and why. The script never includes the name or the address in these notes.
 */
function logFacultyNotes(notes: unknown) {
  if (!Array.isArray(notes)) return;
  for (const n of notes as { row: number; classId: string; note: string }[]) {
    const note = String(n.note).slice(0, 200);
    const line = `Classes sheet row ${Number(n.row)} (${String(n.classId).slice(0, 60)}): ${note}`;
    logOnce(line, /ignored|not shown/.test(note) ? 'warn' : 'info');
  }
}

export async function getClass(id: string): Promise<PublicClass | null | undefined> {
  const classes = await getClasses();
  if (classes === null) return null;
  return classes.find((c) => c.id === id);
}

export type RegisterReply =
  | { ok: true; status: 'registered' | 'waitlisted'; emailed?: boolean }
  | { ok: true; status: 'awaiting_payment'; token: string; amountCents: number; currency: string; title: string }
  | { ok: false; error: string };

export async function registerWithScript(payload: Record<string, unknown>): Promise<RegisterReply> {
  const reply = await callScript<RegisterReply>({ action: 'register', ...payload });
  return reply ?? { ok: false, error: 'unavailable' };
}

export type MarkPaidReply =
  | { ok: true; status: 'paid' | 'needs_attention'; emailed?: boolean; repeat?: boolean }
  | { ok: false; error: string };

/** Only call this after Razorpay's signature has been verified. Safe to repeat. */
export async function markPaidWithScript(p: {
  token: string;
  paymentId: string;
  amountCents: number;
  currency: string;
}): Promise<MarkPaidReply> {
  const reply = await callScript<MarkPaidReply>({ action: 'markPaid', ...p });
  return reply ?? { ok: false, error: 'unavailable' };
}

// ---------- Cancelling (link in every email) ----------

export const TOKEN_PATTERN = /^[0-9a-f-]{32,36}$/i;

/** Class name, start and status for the cancel page. The script never returns personal data here. */
export async function lookupRegistration(
  token: string,
): Promise<{ ok: true; classTitle: string; startUtc: string; status: string } | { ok: false; error: string }> {
  if (!TOKEN_PATTERN.test(token)) return { ok: false, error: 'invalid' };
  const reply = await callScript<{ ok: true; classTitle: string; startUtc: string; status: string } | { ok: false; error: string }>(
    { action: 'lookup', token },
  );
  return reply ?? { ok: false, error: 'unavailable' };
}

export async function cancelWithScript(
  token: string,
): Promise<{ ok: true; status: 'cancelled'; promoted?: boolean; repeat?: boolean } | { ok: false; error: string }> {
  if (!TOKEN_PATTERN.test(token)) return { ok: false, error: 'invalid' };
  const reply = await callScript<{ ok: true; status: 'cancelled'; promoted?: boolean; repeat?: boolean } | { ok: false; error: string }>(
    { action: 'cancel', token },
  );
  return reply ?? { ok: false, error: 'unavailable' };
}

// ---------- Checking a registration on the server ----------

export interface Registration {
  classId: string;
  registrantType: 'self' | 'parent';
  name: string;
  email: string;
  whatsapp: string;
  studentFirstName: string;
  timeZone: string;
}

export type RegistrationFieldErrors = Partial<
  Record<'registrantType' | 'name' | 'email' | 'whatsapp' | 'studentFirstName' | 'consent', string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_PATTERN = /^\+?[0-9 ()-]{7,20}$/;
const URL_PATTERN = /(https?:\/\/|www\.|:\/\/)/i;

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function checkRegistration(
  body: Record<string, unknown>,
): { ok: true; registration: Registration } | { ok: false; fields: RegistrationFieldErrors } {
  const fields: RegistrationFieldErrors = {};
  const registrantType = body.registrantType === 'parent' ? 'parent' : body.registrantType === 'self' ? 'self' : null;
  const name = text(body.name, 80);
  const email = text(body.email, 254).toLowerCase();
  const whatsapp = text(body.whatsapp, 25);
  const studentFirstName = registrantType === 'parent' ? text(body.studentFirstName, 40) : '';

  if (!registrantType) fields.registrantType = 'Please choose who this registration is for.';
  if (name.length < 2) fields.name = 'Please enter your name.';
  else if (URL_PATTERN.test(name) || /[\r\n<>]/.test(name)) fields.name = 'Please enter just your name.';
  if (!EMAIL_PATTERN.test(email)) fields.email = 'Please enter a valid email address, like name@example.com.';
  if (!WHATSAPP_PATTERN.test(whatsapp)) {
    fields.whatsapp = 'Please enter your WhatsApp number with the country code, like +91 98765 43210.';
  }
  if (registrantType === 'parent' && (studentFirstName.length < 1 || /[\r\n<>]|https?:/i.test(studentFirstName))) {
    fields.studentFirstName = "Please enter the student's first name.";
  }
  if (body.consent !== true) fields.consent = 'Please confirm the statement above to register.';

  if (Object.keys(fields).length > 0 || !registrantType) return { ok: false, fields };
  return {
    ok: true,
    registration: {
      classId: text(body.classId, 60),
      registrantType,
      name,
      email,
      whatsapp,
      studentFirstName,
      timeZone: text(body.timeZone, 64),
    },
  };
}
