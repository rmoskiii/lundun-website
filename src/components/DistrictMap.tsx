import { useState } from 'react';
import { DISTRICTS, RIVER_PATH, type DistrictId } from '../data/districts';

export function DistrictMap() {
  // hover previews, click/tap/Enter pins. On touch, tap = pin.
  const [hover, setHover] = useState<DistrictId | null>(null);
  const [pinned, setPinned] = useState<DistrictId | null>(null);
  const activeId = hover ?? pinned;
  const active = DISTRICTS.find((d) => d.id === activeId) ?? null;

  const toggle = (id: DistrictId) => setPinned((p) => (p === id ? null : id));

  return (
    <section className="map" id="map" aria-labelledby="map-title">
      <header className="map__head">
        <p className="eyebrow">Intercepted · City plan</p>
        <h2 id="map-title">Four districts. One river.</h2>
        <p className="map__hint">Hover or tap a district.</p>
      </header>

      <div className="map__stage">
        <svg
          className="map__svg"
          viewBox="0 0 800 520"
          role="group"
          aria-label="Map of Lundun"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <pattern id="pat-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M22 0H0V22" fill="none" stroke="var(--map-line)" strokeWidth="1" />
            </pattern>
            <pattern id="pat-towers" width="18" height="30" patternUnits="userSpaceOnUse">
              <rect x="3" y="4" width="8" height="22" fill="var(--map-line)" />
            </pattern>
            <pattern id="pat-terrace" width="40" height="12" patternUnits="userSpaceOnUse">
              <path d="M0 6H40" stroke="var(--map-line)" strokeWidth="2" strokeDasharray="6 3" />
            </pattern>
            <pattern id="pat-blocks" width="34" height="34" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="14" height="14" fill="none" stroke="var(--map-line)" strokeWidth="1.5" />
            </pattern>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="800" height="520" fill="var(--map-bg)" />

          {DISTRICTS.map((d) => {
            const on = d.id === activeId;
            return (
              <g
                key={d.id}
                className={`district ${on ? 'is-active' : ''} ${activeId && !on ? 'is-dim' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={pinned === d.id}
                aria-label={`${d.name}, ${d.bank}. ${d.line}`}
                onMouseEnter={() => setHover(d.id)}
                onFocus={() => setHover(d.id)}
                onBlur={() => setHover(null)}
                onClick={() => toggle(d.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(d.id);
                  }
                }}
              >
                <polygon className="district__base" points={d.shape} />
                <polygon className="district__pattern" points={d.shape} fill={`url(#${d.pattern})`} />
                <polygon className="district__edge" points={d.shape} filter={on ? 'url(#glow)' : undefined} />
                <text className="district__label" x={d.label[0]} y={d.label[1]} textAnchor="middle">
                  {d.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* the river, painted over the districts */}
          <path d={RIVER_PATH} className="river river--bank" />
          <path d={RIVER_PATH} className="river" />
          <path d={RIVER_PATH} className="river river--shimmer" />

          <text className="map__compass" x="770" y="506" textAnchor="end">
            N ↑ · NOT TO SCALE
          </text>
        </svg>

        <aside className={`card ${active ? 'is-open' : ''}`} aria-live="polite">
          {active ? (
            <>
              <p className="card__bank">{active.bank}</p>
              <h3 className="card__name">{active.name}</h3>
              <p className="card__line">{active.line}</p>
              <p className="card__blurb">{active.blurb}</p>
              <ul className="card__tags">
                {active.sightings.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="card__heat" aria-label={`Heat ${active.heat} out of 5`}>
                <span>Heat</span>
                <span className="card__bars" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <i key={n} className={n <= active.heat ? 'on' : ''} />
                  ))}
                </span>
              </div>
            </>
          ) : (
            <p className="card__empty">Select a district.<br />Some places look different after dark.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
