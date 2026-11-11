import { useEffect, useRef } from 'react';

/** Full-bleed rain on a canvas. Pauses when the tab is hidden; off for reduced motion. */
export function Rain({ drops }: { drops: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || drops === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const make = () => ({
      x: Math.random() * w * 1.2,
      y: Math.random() * -h,
      len: 8 + Math.random() * 18,
      speed: 6 + Math.random() * 8,
      alpha: 0.08 + Math.random() * 0.22,
    });
    const field = Array.from({ length: drops }, () => {
      const d = make();
      d.y = Math.random() * h;
      return d;
    });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (const d of field) {
        ctx.strokeStyle = `rgba(200,210,230,${d.alpha})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.18, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= d.speed * 0.18;
        if (d.y > h) Object.assign(d, make(), { y: -20 });
      }
      raf = requestAnimationFrame(tick);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [drops]);

  return <canvas ref={ref} className="rain" aria-hidden="true" />;
}
