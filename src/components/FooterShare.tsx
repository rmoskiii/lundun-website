import { useState } from 'react';
import { shareUrl } from '../lib/site';

const TEXT = 'Lundun After Dark: an open-world crime game set in a London that never quite sleeps. Get on the first-access list:';

export function FooterShare() {
    const [copied, setCopied] = useState(false);

    async function onClick() {
        const url = shareUrl();
        if (typeof navigator.share === 'function') {
            try {
                await navigator.share({ title: 'Lundun After Dark', text: TEXT, url });
            } catch {
                /* share sheet closed */
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('Copy this link', url);
        }
    }

    return (
        <button type="button" className="footer__share" onClick={onClick}>
            {copied ? 'Link copied' : 'Share'}
        </button>
    );
}