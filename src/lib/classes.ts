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
}

/** The owner's switch. Registration stays off until the lawyer approves the consent wording. */
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

async function callScript<T>(body: Record<string, unknown>, revalidate?: number): Promise<T | null> {
  const url = process.env.CLASSES_SCRIPT_URL;
  const secret = process.env.CLASSES_SCRIPT_SECRET;
  if (!url || !secret) {
    console.error('CLASSES_SCRIPT_URL or CLASSES_SCRIPT_SECRET is not set');
    return null;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, ...body }),
      redirect: 'follow',
      signal: AbortSignal.timeout(25000),
      ...(revalidate === undefined ? { cache: 'no-store' as const } : { next: { revalidate } }),
    });
    return (await res.json()) as T;
  } catch (error) {
    console.error('Classes script call failed:', error);
    return null;
  }
}

/** How often seat counts are refreshed from the sheet, in seconds. */
export const CLASS_DATA_SECONDS = 10;

/** Upcoming open classes, refreshed about every 10 seconds. null means the list could not be loaded. */
export async function getClasses(): Promise<PublicClass[] | null> {
  if (!isRegistrationOpen()) return [];
  const reply = await callScript<{ ok?: boolean; classes?: PublicClass[] }>({ action: 'list' }, CLASS_DATA_SECONDS);
  if (!reply?.ok || !Array.isArray(reply.classes)) return null;
  return reply.classes;
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
