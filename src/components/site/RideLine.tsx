'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { IProject } from '@/models/Project';
import { layoutLine, metricNumber, type LineColor } from '@/lib/lines';
import { LineStrip } from './LineStrip';

/**
 * A timed line drawn to scale. When it scrolls into view a train runs it at real speed,
 * counting the milliseconds; hovering its row (or tapping the line) runs it again.
 */
export function RideLine({ project, color, className = '' }: { project: IProject; color: LineColor | null; className?: string }) {
  const { totalMs } = layoutLine(project.processSteps);
  const targetMs = metricNumber(project, /^target/i);
  const [ride, setRide] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const running = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const go = () => {
      if (!running.current) setRide((r) => r + 1);
    };
    let seen = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen) {
          seen = true;
          window.setTimeout(go, 250);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    const row = el.closest('.line-row');
    row?.addEventListener('mouseenter', go);
    return () => {
      io.disconnect();
      row?.removeEventListener('mouseenter', go);
    };
  }, []);

  useEffect(() => {
    if (!ride) return;
    running.current = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(totalMs, now - start);
      if (counter.current) counter.current.textContent = `${Math.round(elapsed)} ms`;
      if (elapsed < totalMs) raf = requestAnimationFrame(tick);
      else running.current = false;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ride, totalMs]);

  return (
    <div ref={wrap} className={`ride-line ${className}`} onClick={() => !running.current && setRide((r) => r + 1)}>
      <LineStrip
        key={ride}
        steps={project.processSteps}
        color={color}
        targetMs={targetMs}
        showOver
        labelWidth="9.5rem"
        className={ride ? 'ride' : ''}
        style={{ '--dur': `${totalMs}ms` } as CSSProperties}
      >
        {ride > 0 && (
          <div className="train-carrier" aria-hidden>
            <span ref={counter} className="train num">
              0 ms
            </span>
          </div>
        )}
      </LineStrip>
    </div>
  );
}
