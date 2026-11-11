import type { BrandId } from '../brand/themes';

interface Props {
  brand: BrandId;
  size?: 'hero' | 'small';
}

/**
 * LUNDUN wordmark. The two U's get the "under" treatment, styled per brand in CSS:
 *  underground: U's drop below a street-level line
 *  fog:         U's are flipped upside down (∩)
 *  nightbus:    U's knocked out of red blocks
 */
export function Logo({ brand, size = 'hero' }: Props) {
  const letters = ['L', 'U', 'N', 'D', 'U', 'N'];
  return (
    <div className={`logo logo--${brand} logo--${size}`} role="img" aria-label="Lundun After Dark">
      <span className="logo__word" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className={ch === 'U' ? 'logo__ch logo__u' : 'logo__ch'}>
            {ch}
          </span>
        ))}
        {brand === 'underground' && <span className="logo__street" />}
      </span>
      <span className="logo__sub" aria-hidden="true">
        After Dark
      </span>
    </div>
  );
}
