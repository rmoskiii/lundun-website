import { BRANDS, BRAND_IDS, type BrandId } from '../brand/themes';

/** Dev/review only. Hide by setting VITE_SHOW_BRAND_SWITCHER=false. */
export function BrandSwitcher({ brand, onChange }: { brand: BrandId; onChange: (b: BrandId) => void }) {
  return (
    <div className="switcher" role="radiogroup" aria-label="Brand direction">
      {BRAND_IDS.map((id) => (
        <button
          key={id}
          role="radio"
          aria-checked={brand === id}
          className={brand === id ? 'is-on' : ''}
          title={BRANDS[id].idea}
          onClick={() => onChange(id)}
        >
          {BRANDS[id].label}
        </button>
      ))}
    </div>
  );
}
