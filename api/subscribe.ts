/**
 * Vercel serverless function: POST /api/subscribe
 * Adds an email to your Kit (kit.com) form. The Kit key never reaches the browser.
 *
 * Env vars (Vercel > Project > Settings > Environment Variables):
 *   KIT_API_KEY   v4 API key (Kit > Settings > Developer)
 *   KIT_FORM_ID   numeric form ID
 *
 * Flow: create/update the subscriber as "inactive", then add them to the form.
 * If the form has double opt-in on, Kit sends the confirmation ("incentive") email.
 * Do one real test signup after deploying to confirm the email arrives.
 */

const KIT = 'https://api.kit.com/v4';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLATFORMS = new Set(['ios', 'android', 'browser']);

interface Req {
  method?: string;
  body?: unknown;
}
interface Res {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (k: string, v: string) => void;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  if (!key || !formId) return res.status(500).json({ error: 'Waitlist is not configured yet.' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as Record<string, unknown>;

  // honeypot: bots fill every field. Pretend success, do nothing.
  if (typeof body.company === 'string' && body.company.length > 0) return res.status(200).json({ ok: true });

  const email = String(body.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: 'That email doesn’t look right.' });

  const platform = PLATFORMS.has(String(body.platform)) ? String(body.platform) : undefined;
  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : undefined;

  const headers = { 'Content-Type': 'application/json', 'X-Kit-Api-Key': key };

  try {
    // 1. create (or update) the subscriber. "platform" must exist as a custom field in Kit
    //    (Subscribers > any subscriber > Add a field) or Kit will ignore it.
    const create = await fetch(`${KIT}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email_address: email,
        state: 'inactive',
        ...(platform ? { fields: { platform } } : {}),
      }),
    });
    if (!create.ok) {
      console.error('Kit create failed', create.status, await create.text());
      return res.status(502).json({ error: 'Couldn’t reach the list. Try again in a minute.' });
    }

    // 2. add to the form (triggers double opt-in email)
    const add = await fetch(`${KIT}/forms/${formId}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: email, ...(referrer ? { referrer } : {}) }),
    });
    if (!add.ok) {
      console.error('Kit add-to-form failed', add.status, await add.text());
      return res.status(502).json({ error: 'Couldn’t reach the list. Try again in a minute.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Couldn’t reach the list. Try again in a minute.' });
  }
}
