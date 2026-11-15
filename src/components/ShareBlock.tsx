import { useState } from 'react';
import { shareUrl } from '../lib/site';

const TEXT = 'Lundun After Dark: an open-world crime game set in a London that never quite sleeps. Get on the first-access list:';

export function ShareBlock() {
    const [copied, setCopied] = useState(false);
    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    async function copy() {
        try {
            await navigator.clipboard.writeText(shareUrl());
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('Copy this link', shareUrl());
        }
    }

    async function nativeShare() {
        try {
            await navigator.share({ title: 'Lundun After Dark', text: TEXT, url: shareUrl() });
        } catch {
            /* user closed the share sheet, nothing to do */
        }
    }

    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${TEXT} ${shareUrl()}`)}`;

    return (
        <div className="share">
            <p className="share__title">Know someone who’d play this? Send it to them.</p>
            <div className="share__row">
                {canShare && (
                    <button type="button" className="share__btn share__btn--main" onClick={nativeShare}>
                        Share
                    </button>
                )}
                <a className="share__btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                </a>
                <button type="button" className="share__btn" onClick={copy}>
                    {copied ? 'Copied' : 'Copy link'}
                </button>
            </div>
        </div>
    );
}