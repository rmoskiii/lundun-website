export type BrandId = 'underground' | 'fog' | 'nightbus';

export interface Brand {
  id: BrandId;
  label: string;
  /** One-line idea behind the direction, shown in the switcher only */
  idea: string;
  tagline: string;
  kicker: string;
  rain: number; // drops on screen, 0 = none
}

export const BRANDS: Record<BrandId, Brand> = {
  underground: {
    id: 'underground',
    label: 'A · Underground',
    idea: 'The two U’s sink below street level. Sodium orange on wet black.',
    tagline: 'After dark, the city goes under.',
    kicker: 'Signal incoming · End of 2026',
    rain: 140,
  },
  fog: {
    id: 'fog',
    label: 'B · Fog',
    idea: 'Thin, quiet, expensive. The U’s turn upside down: the under-world.',
    tagline: 'Some of it you can see. Most of it, you can’t.',
    kicker: 'Coming end of 2026',
    rain: 40,
  },
  nightbus: {
    id: 'nightbus',
    label: 'C · Night Bus',
    idea: 'Loud, blocky, CCTV. The U’s are cut out of red, like a warning.',
    tagline: 'Last bus left an hour ago.',
    kicker: 'REC · End of 2026',
    rain: 220,
  },
};

export const BRAND_IDS = Object.keys(BRANDS) as BrandId[];

export function resolveBrand(): BrandId {
  const fromUrl = new URLSearchParams(window.location.search).get('brand');
  if (fromUrl && fromUrl in BRANDS) return fromUrl as BrandId;
  const fromEnv = import.meta.env.VITE_BRAND as string | undefined;
  if (fromEnv && fromEnv in BRANDS) return fromEnv as BrandId;
  return 'fog';
}
