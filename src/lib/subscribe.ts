export type Platform = 'ios' | 'android' | 'browser';

export interface SignupPayload {
  email: string;
  platform?: Platform;
  referrer: string;
  /** honeypot: real people leave this empty */
  company?: string;
}

export async function subscribe(payload: SignupPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const mode = (import.meta.env.VITE_WAITLIST_MODE as string | undefined) ?? 'mock';

  if (mode === 'mock') {
    await new Promise((r) => setTimeout(r, 700));
    console.info('[waitlist:mock] would subscribe', payload);
    return { ok: true };
  }

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? 'Something went wrong. Try again.' };
  } catch {
    return { ok: false, error: 'No signal. Check your connection and try again.' };
  }
}

/** Page URL including UTM tags, so Kit records where each signup came from. */
export function currentReferrer(): string {
  return window.location.href.split('#')[0];
}
