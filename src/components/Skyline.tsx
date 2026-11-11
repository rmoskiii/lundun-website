import { useMemo, type ReactElement } from 'react';

/**
 * Cartoon-ish London skyline, generated once from a fixed seed so it's the same on every load.
 * Back: skyscrapers with window grids. Middle: the big wheel + tower blocks with balconies.
 * Front: a long terrace row (chimneys, bay windows, doors) and street lamps.
 * Colours come from CSS variables, so every brand recolours it.
 */

const W = 1440;
const H = 380;
const GROUND = 330;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function windows(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { cw: number; ch: number; gx: number; gy: number; lit: number; r: () => number; rx?: number },
) {
  const out: ReactElement[] = [];
  const cols = Math.floor((w - opts.gx) / (opts.cw + opts.gx));
  const rows = Math.floor((h - opts.gy) / (opts.ch + opts.gy));
  const padX = (w - cols * (opts.cw + opts.gx) + opts.gx) / 2;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const lit = opts.r() < opts.lit;
      out.push(
        <rect
          key={`${x}-${row}-${col}`}
          x={x + padX + col * (opts.cw + opts.gx)}
          y={y + opts.gy + row * (opts.ch + opts.gy)}
          width={opts.cw}
          height={opts.ch}
          rx={opts.rx ?? 1}
          className={lit ? `win win--on ${opts.r() < 0.15 ? 'win--flicker' : ''}` : 'win'}
        />,
      );
    }
  }
  return out;
}

function useSkyline() {
  return useMemo(() => {
    const r = rng(42);

    // ---- skyscrapers (back) ----
    const towers: ReactElement[] = [];
    const towerSpots = [
      { x: 40, w: 62, h: 137 },
      { x: 150, w: 48, h: 108 },
      { x: 860, w: 56, h: 151 },
      { x: 930, w: 74, h: 194, top: 'pyramid' },
      { x: 1016, w: 52, h: 166, top: 'round' },
      { x: 1080, w: 40, h: 216, top: 'spire' },
      { x: 1132, w: 66, h: 144 },
      { x: 1250, w: 54, h: 176, top: 'round' },
      { x: 1360, w: 70, h: 130 },
    ] as const;
    for (const t of towerSpots) {
      const y = GROUND - t.h;
      towers.push(
        <g key={`t${t.x}`}>
          <rect x={t.x} y={y} width={t.w} height={t.h} rx={4} className="tower" />
          {'top' in t && t.top === 'pyramid' && (
            <path d={`M${t.x + 4} ${y} L${t.x + t.w / 2} ${y - 34} L${t.x + t.w - 4} ${y} Z`} className="tower" />
          )}
          {'top' in t && t.top === 'round' && <ellipse cx={t.x + t.w / 2} cy={y} rx={t.w / 2} ry={16} className="tower" />}
          {'top' in t && t.top === 'spire' && (
            <>
              <rect x={t.x + t.w / 2 - 2} y={y - 46} width={4} height={46} className="tower" />
              <circle cx={t.x + t.w / 2} cy={y - 50} r={3} className="skyline__beacon" />
            </>
          )}
          {windows(t.x, y + 6, t.w, t.h - 20, { cw: 6, ch: 8, gx: 5, gy: 6, lit: 0.22, r })}
        </g>,
      );
    }

    // ---- tower blocks (middle) ----
    const blocks: ReactElement[] = [];
    for (const b of [
      { x: 690, w: 96, h: 137 },
      { x: 1190, w: 84, h: 108 },
      { x: 250, w: 90, h: 115 },
    ]) {
      const y = GROUND - b.h;
      blocks.push(
        <g key={`b${b.x}`}>
          <rect x={b.x} y={y} width={b.w} height={b.h} rx={3} className="block" />
          <rect x={b.x - 4} y={y - 6} width={b.w + 8} height={8} rx={2} className="block block--edge" />
          {Array.from({ length: Math.floor((b.h - 20) / 22) }).map((_, i) => (
            <rect key={i} x={b.x - 3} y={y + 22 + i * 22} width={b.w + 6} height={3} rx={1.5} className="block--edge" />
          ))}
          {windows(b.x, y + 4, b.w, b.h - 14, { cw: 10, ch: 9, gx: 7, gy: 13, lit: 0.3, r, rx: 1.5 })}
        </g>,
      );
    }

    // ---- terrace (front) ----
    const houses: ReactElement[] = [];
    let x = -10;
    let i = 0;
    while (x < W) {
      const w = 58 + Math.floor(r() * 14);
      const h = 74 + Math.floor(r() * 18);
      const y = GROUND - h;
      const roof = r() < 0.55 ? 'pitch' : 'flat';
      const lit = (p: number) => (r() < p ? 'win win--on' : 'win');
      houses.push(
        <g key={`h${i}`} className="house">
          {roof === 'pitch' ? (
            <path d={`M${x - 2} ${y + 2} L${x + w / 2} ${y - 22} L${x + w + 2} ${y + 2} Z`} className="house__roof" />
          ) : (
            <rect x={x - 2} y={y - 6} width={w + 4} height={8} rx={2} className="house__roof" />
          )}
          {/* chimney with pots */}
          <rect x={x + w * 0.68} y={y - 30} width={12} height={22} rx={2} className="house__body" />
          <rect x={x + w * 0.68 + 1} y={y - 35} width={4} height={6} rx={1} className="house__body" />
          <rect x={x + w * 0.68 + 7} y={y - 34} width={4} height={5} rx={1} className="house__body" />
          <rect x={x} y={y} width={w} height={h + 2} className="house__body" />
          {/* upstairs */}
          <rect x={x + 8} y={y + 12} width={14} height={18} rx={2} className={lit(0.35)} />
          <rect x={x + w - 22} y={y + 12} width={14} height={18} rx={2} className={lit(0.25)} />
          {/* bay window */}
          <path
            d={`M${x + 6} ${y + 46} l4 -6 h22 l4 6 v22 h-30 z`}
            className="house__bay"
          />
          <rect x={x + 11} y={y + 46} width={20} height={18} rx={1.5} className={lit(0.3)} />
          {/* door + fanlight */}
          <rect x={x + w - 20} y={y + h - 30} width={13} height={30} rx={6} className="house__door" />
          <rect x={x + w - 18} y={y + h - 36} width={9} height={4} rx={2} className={lit(0.5)} />
        </g>,
      );
      x += w;
      i++;
    }

    // ---- street lamps ----
    const lamps = [120, 420, 740, 1060, 1340].map((lx) => (
      <g key={`l${lx}`}>
        <circle cx={lx + 10} cy={GROUND - 54} r={26} className="lamp__glow" />
        <rect x={lx} y={GROUND - 56} width={4} height={56} rx={2} className="lamp" />
        <path d={`M${lx + 2} ${GROUND - 56} q0 -6 8 -6 h6`} className="lamp lamp--arm" />
        <rect x={lx + 12} y={GROUND - 60} width={10} height={6} rx={2} className="lamp__head" />
      </g>
    ));

    return { towers, blocks, houses, lamps };
  }, []);
}

export function Skyline() {
  const { towers, blocks, houses, lamps } = useSkyline();
  return (
    <svg className="skyline" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g className="layer layer--far">{towers}</g>

      {/* the big wheel */}
      <g className="wheel">
        <g className="wheel__spin">
          <circle cx="560" cy="196" r="80" className="wheel__rim" />
          <circle cx="560" cy="196" r="72" className="wheel__rim wheel__rim--in" />
          {Array.from({ length: 16 }).map((_, k) => {
            const a = (k / 16) * Math.PI * 2;
            return (
              <g key={k}>
                <line x1="560" y1="150" x2={560 + Math.cos(a) * 76} y2={196 + Math.sin(a) * 76} className="wheel__spoke" />
                <rect
                  x={560 + Math.cos(a) * 82 - 6}
                  y={196 + Math.sin(a) * 82 - 4}
                  width="12"
                  height="8"
                  rx="4"
                  className={k % 3 === 0 ? 'wheel__pod wheel__pod--on' : 'wheel__pod'}
                />
              </g>
            );
          })}
        </g>
        <circle cx="560" cy="196" r="8" className="wheel__hub" />
        <path d="M560 196 L516 330 M560 196 L604 330" className="wheel__leg" />
      </g>

      {/* crane */}
      <g className="crane">
        <path d="M1310 330 L1310 124 M1250 134 L1430 134 M1310 124 L1350 134 M1310 124 L1270 134" />
        <line x1="1410" y1="134" x2="1410" y2="180" className="crane__cable" />
        <rect x="1402" y="180" width="16" height="10" rx="2" />
      </g>
      <circle className="skyline__beacon skyline__beacon--late" cx="1310" cy="120" r="3" />

      <g className="layer layer--mid">{blocks}</g>
      <g className="layer layer--near">{houses}</g>
      <rect x="0" y={GROUND} width={W} height={H - GROUND} className="street" />
      <g>{lamps}</g>
    </svg>
  );
}
