# Lundun After Dark: pre-launch site (Pass 1)

Vite + React + TypeScript. One page: hero with waitlist, interactive district map, closing signup, footer.

## Run it

```bash
npm install
cp .env.example .env     # defaults to mock mode, no emails sent
npm run dev              # http://localhost:5173
```

Brand: **Fog** is the default and the switcher is off. The other two directions are still in the code;
preview them with `?brand=underground` or `?brand=nightbus`, or set `VITE_SHOW_BRAND_SWITCHER=true` to get the switcher back.

## Where things live

| What | File |
| --- | --- |
| Brand colours, fonts, logo styling | `src/styles.css` (top: tokens per brand) |
| Taglines, kicker text, rain amount | `src/brand/themes.ts` |
| Wordmark | `src/components/Logo.tsx` |
| District names, copy, heat, map shapes | `src/data/districts.ts` |
| Map | `src/components/DistrictMap.tsx` |
| Signup form | `src/components/Waitlist.tsx` |
| Serverless signup (Kit) | `api/subscribe.ts` |
| Privacy notice (fill in the [brackets]) | `public/privacy.html` |

## Waitlist: Kit + Vercel

1. Create a free Kit account (kit.com). Make a form called "LAD Waitlist". In its settings, turn **double opt-in on** and write the confirmation email.
2. Add a custom subscriber field called `platform`.
3. Kit > Settings > Developer: create a v4 API key. Note the form's numeric ID from its URL.
4. Push this repo to GitHub, import it on Vercel (framework: Vite). Vercel picks up `api/subscribe.ts` automatically.
5. In Vercel env vars set `KIT_API_KEY`, `KIT_FORM_ID`, `VITE_WAITLIST_MODE=api`, `VITE_BRAND=fog`. Redeploy.
6. Sign up with your own email once and check the confirmation arrives.

`npm run dev` doesn't run the `/api` function. To test the real flow locally use `npx vercel dev`.

Updates later: write a Broadcast in Kit, filter by tag or `platform` (e.g. "iPhone people: TestFlight is open").
