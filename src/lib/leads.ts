// Server-side only: import this from route handlers, never from a client component.
// Everything the site does with a form submission lives here: checking it,
// filtering bots, and saving it to the owner's Google Sheet (which also sends
// the emails). Configuration comes from environment variables set in Vercel.

import { CLASS_TOPICS } from './class-topics';

export type LeadKind = 'enquiry' | 'class-interest';

export interface Lead {
  kind: LeadKind;
  name: string;
  email: string;
  message: string;
  topics: string[];
  source: string;
}

export type FieldErrors = Partial<Record<'name' | 'email' | 'message' | 'topics' | 'ageConfirmed', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_PATTERN = /(https?:\/\/|www\.|:\/\/)/i;
const MIN_FILL_TIME_MS = 2500;

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export type CheckResult =
  | { ok: true; lead: Lead }
  | { ok: false; reason: 'invalid'; fields: FieldErrors }
  | { ok: false; reason: 'bot' };

/** Validate a raw request body. Never trust what the browser checked. */
export function checkSubmission(body: unknown): CheckResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, reason: 'invalid', fields: {} };
  }
  const data = body as Record<string, unknown>;

  // Hidden honeypot field: people never see it, simple bots fill it in.
  if (text(data.company_website, 200) !== '') return { ok: false, reason: 'bot' };

  // Bots submit instantly; people take at least a few seconds.
  const startedAt = Number(data.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return { ok: false, reason: 'bot' };
  }

  const kind: LeadKind = data.kind === 'class-interest' ? 'class-interest' : 'enquiry';
  const name = text(data.name, 80);
  const email = text(data.email, 254).toLowerCase();
  const message = text(data.message, 2000);
  const topics = Array.isArray(data.topics)
    ? data.topics.filter((t): t is string => (CLASS_TOPICS as readonly string[]).includes(t as string))
    : [];
  const fields: FieldErrors = {};

  if (name.length < 2) fields.name = 'Please enter your name.';
  else if (URL_PATTERN.test(name) || /[\r\n<>]/.test(name)) fields.name = 'Please enter just your name.';

  if (!EMAIL_PATTERN.test(email)) fields.email = 'Please enter a valid email address, like name@company.com.';

  if (kind === 'enquiry' && message.length < 10) {
    fields.message = 'Please tell us a little more (at least 10 characters).';
  }
  if (kind === 'class-interest') {
    if (topics.length === 0) fields.topics = 'Please choose at least one topic.';
    if (data.ageConfirmed !== true) {
      fields.ageConfirmed = 'Please confirm you are 18 or older, or a parent or guardian signing up for your child.';
    }
  }

  if (Object.keys(fields).length > 0) return { ok: false, reason: 'invalid', fields };

  return {
    ok: true,
    lead: { kind, name, email, message, topics, source: text(data.source, 300) },
  };
}

// Best-effort limit per visitor. Vercel may run several copies of the server,
// each with its own memory, so this slows abuse rather than stopping it outright.
// Each form has its own bucket. Class registration allows more, because a whole college or
// office often registers over one network (one IP address).
const RATE_LIMITS = { enquiry: 5, classes: 20 } as const;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentRequests = new Map<string, number[]>();

export function isRateLimited(ip: string, bucket: keyof typeof RATE_LIMITS = 'enquiry'): boolean {
  const now = Date.now();
  const key = `${bucket}:${ip}`;
  const hits = (recentRequests.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentRequests.set(key, hits);
  if (recentRequests.size > 5000) {
    for (const [key, times] of recentRequests) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentRequests.delete(key);
    }
  }
  return hits.length > RATE_LIMITS[bucket];
}

/**
 * Cloudflare Turnstile, the invisible bot check. Switched on only when
 * TURNSTILE_SECRET_KEY is set in Vercel; until then this always passes.
 */
export async function passesBotCheck(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== 'string' || token === '') return false;

  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip !== 'unknown') form.append('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error('Turnstile check failed to run:', error);
    return false;
  }
}

export type SaveResult = { saved: true; emailed: boolean } | { saved: false; problem: string };

/**
 * Send the lead to the Google Apps Script attached to the owner's sheet.
 * Only a reply of {"ok": true} from the script counts as saved.
 */
export async function saveLead(lead: Lead): Promise<SaveResult> {
  const url = process.env.LEADS_SHEET_URL;
  const secret = process.env.LEADS_SHEET_SECRET;
  if (!url || !secret) {
    return { saved: false, problem: 'LEADS_SHEET_URL or LEADS_SHEET_SECRET is not set' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, receivedAt: new Date().toISOString(), ...lead }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const raw = await res.text();
    let reply: { ok?: boolean; emailed?: boolean; error?: string } = {};
    try {
      reply = JSON.parse(raw);
    } catch {
      return { saved: false, problem: `sheet replied with non-JSON (HTTP ${res.status})` };
    }
    if (reply.ok !== true) {
      return { saved: false, problem: `sheet refused the lead: ${reply.error ?? `HTTP ${res.status}`}` };
    }
    return { saved: true, emailed: reply.emailed === true };
  } catch (error) {
    return { saved: false, problem: `could not reach the sheet: ${String(error)}` };
  }
}
