import { useEffect, useState } from 'react';
import { BRANDS, resolveBrand, type BrandId } from './brand/themes';
import { Logo } from './components/Logo';
import { Rain } from './components/Atmosphere';
import { Skyline } from './components/Skyline';
import { Waitlist } from './components/Waitlist';
import { DistrictMap } from './components/DistrictMap';
import { BrandSwitcher } from './components/BrandSwitcher';

const SHOW_SWITCHER = (import.meta.env.VITE_SHOW_BRAND_SWITCHER ?? 'false') === 'true';

export default function App() {
  const [brandId, setBrandId] = useState<BrandId>(resolveBrand);
  const brand = BRANDS[brandId];

  useEffect(() => {
    document.documentElement.dataset.brand = brandId;
    if (SHOW_SWITCHER) {
      const url = new URL(window.location.href);
      url.searchParams.set('brand', brandId);
      window.history.replaceState(null, '', url);
    }
  }, [brandId]);

  return (
    <>
      <div className="grain" aria-hidden="true" />

      <section className="hero">
        <Rain key={brandId} drops={brand.rain} />
        <div className="hero__haze" aria-hidden="true" />
        <Skyline />
        {brandId === 'nightbus' && (
          <div className="cctv" aria-hidden="true">
            <span className="cctv__rec">● REC</span>
            <span>CAM 04 · PECKAM HIGH ST</span>
            <span className="cctv__time">23:59:41</span>
          </div>
        )}

        <div className="hero__inner">
          <p className="eyebrow">{brand.kicker}</p>
          <h1 className="sr-only">Lundun After Dark</h1>
          <Logo brand={brandId} />
          <p className="hero__tag">{brand.tagline}</p>
          <Waitlist id="join" />
        </div>

        <a className="hero__scroll" href="#map">
          The city <span aria-hidden="true">↓</span>
        </a>
      </section>

      <DistrictMap />

      <section className="closing">
        <p className="eyebrow">First in, first out</p>
        <h2>Get on the list before the lights go out.</h2>
        <Waitlist id="join-bottom" />
      </section>

      <footer className="footer">
        <Logo brand={brandId} size="small" />
        <nav>
          <a href="https://www.tiktok.com/" rel="noopener">TikTok</a>
          <a href="https://www.instagram.com/" rel="noopener">Instagram</a>
          <a href="/privacy.html">Privacy</a>
        </nav>
        <p className="footer__small">© {new Date().getFullYear()} Infinity Oryn Ltd. A work of fiction. Any resemblance is the point.</p>
      </footer>

      {SHOW_SWITCHER && <BrandSwitcher brand={brandId} onChange={setBrandId} />}
    </>
  );
}
