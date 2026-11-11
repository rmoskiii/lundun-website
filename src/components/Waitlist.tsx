import { useState, type FormEvent } from 'react';
import { currentReferrer, subscribe, type Platform } from '../lib/subscribe';

type Status = 'idle' | 'sending' | 'done' | 'error';

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'ios', label: 'iPhone' },
  { id: 'android', label: 'Android' },
  { id: 'browser', label: 'Browser' },
];

export function Waitlist({ id = 'join' }: { id?: string }) {
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<Platform | undefined>();
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setError('Tick the box so we’re allowed to email you.');
      return;
    }
    setStatus('sending');
    const res = await subscribe({ email: email.trim(), platform, referrer: currentReferrer(), company });
    if (res.ok) setStatus('done');
    else {
      setStatus('error');
      setError(res.error);
    }
  }

  if (status === 'done') {
    return (
      <div className="waitlist waitlist--done" id={id} role="status">
        <p className="waitlist__ok">You’re on the list.</p>
        <p className="waitlist__small">Check your inbox and confirm. If it’s not there, check spam.</p>
      </div>
    );
  }

  return (
    <form className="waitlist" id={id} onSubmit={onSubmit} noValidate={false}>
      <div className="waitlist__row">
        <label className="sr-only" htmlFor={`${id}-email`}>
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Get first access'}
        </button>
      </div>

      <fieldset className="waitlist__platforms">
        <legend>Where will you play? (optional)</legend>
        {PLATFORMS.map((p) => (
          <button
            type="button"
            key={p.id}
            className={`chip ${platform === p.id ? 'is-on' : ''}`}
            aria-pressed={platform === p.id}
            onClick={() => setPlatform((cur) => (cur === p.id ? undefined : p.id))}
          >
            {p.label}
          </button>
        ))}
      </fieldset>

      <label className="waitlist__consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Email me launch news and updates about Lundun After Dark. Unsubscribe any time.{' '}
          <a href="/privacy.html">Privacy</a>
        </span>
      </label>

      {/* honeypot, hidden from people */}
      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        aria-hidden="true"
      />

      {status === 'error' && (
        <p className="waitlist__err" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
