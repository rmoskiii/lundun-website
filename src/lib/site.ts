/** Canonical public address. Used for share links so they never point at localhost or a preview URL. */
export const SITE_URL = 'https://www.lundunafterdark.com';

export function shareUrl(): string {
    return `${SITE_URL}/?utm_source=friend&utm_medium=share`;
}