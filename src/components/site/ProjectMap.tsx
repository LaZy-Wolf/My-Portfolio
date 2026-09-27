'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { lineVar, routeLetter, type LineColor } from '@/lib/lines';
import { navigateWithTransition, TransitionLink } from './TransitionLink';
import { RouteBullet } from './RouteBullet';
import { Note } from './Note';

export interface MapLine {
  slug: string;
  title: string;
  tag: string;
  domain?: string;
  color: LineColor;
  chips: string[];
  /** The project's real pipeline stages, in order. They become the stops on its line. */
  stops: string[];
}

/*
  The hero's project map. Each featured project is a line that starts beside its name, runs into one
  shared interchange and leaves off the right edge. The stops on each line are that project's real
  pipeline stages: hover one to read it, click to open the case study.
  Rows are laid out by CSS; the SVG measures them and draws the track to meet.
*/

type Pt = [number, number];
type Geo = { W: number; stacked: boolean; ys: number[]; x0: number; hx: number; top: number; bottom: number; cx0: number; cx1: number; paths: string[] };
type Stop = { x: number; y: number; label: string };

const GAP = 10; // centre to centre in the interchange
const MAX_STOPS = 6;
const SLOPE = 0.75; // horizontal run per unit of drop: a little steeper than 45 degrees, so short cards still get a straight start

const f = (n: number) => Math.round(n * 10) / 10;

/** A polyline with its corners rounded off, the way a line bends on a real map. */
function rounded(pts: Pt[], r: number) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(x - px, y - py);
    const l2 = Math.hypot(nx - x, ny - y);
    if (l1 < 0.5 || l2 < 0.5) continue;
    const k = Math.min(r, l1 / 2, l2 / 2);
    d += `L${f(x - ((x - px) / l1) * k)} ${f(y - ((y - py) / l1) * k)}`;
    d += `Q${f(x)} ${f(y)} ${f(x + ((nx - x) / l2) * k)} ${f(y + ((ny - y) / l2) * k)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d}L${f(lx)} ${f(ly)}`;
}

function layout(W: number, ys: number[], stacked: boolean): Geo {
  const n = ys.length;
  const mid = (n - 1) / 2;
  const x0 = stacked ? 18 : 2;
  const span = W - x0;
  const hx = x0 + span * 0.44;
  const hy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const half = Math.min(84, span * 0.16);
  const cx0 = hx - half;
  const cx1 = hx + half;

  const paths = ys.map((y, i) => {
    const yc = hy + (i - mid) * GAP;
    // The outer lines climb back to their own level; the inner ones settle closer to the middle.
    const yr = n > 2 && (i === 0 || i === n - 1) ? y : hy + (y - hy) * 0.45;
    // Straight starts where there is room; steeper bends where the card is narrow.
    const a = Math.max(x0 + 14, cx0 - Math.abs(y - yc) * SLOPE);
    const b = Math.min(cx1 + Math.abs(yr - yc) * SLOPE, W - 120);
    return rounded(
      [
        [x0, y],
        [a, y],
        [cx0, yc],
        [cx1, yc],
        [b, yr],
        [W + 30, yr],
      ],
      22
    );
  });

  return { W, stacked, ys, x0, hx, cx0, cx1, top: hy - mid * GAP - 11, bottom: hy + mid * GAP + 11, paths };
}

export function ProjectMap({ lines }: { lines: MapLine[] }) {
  const router = useRouter();
  const id = useId().replace(/:/g, '');
  const list = useRef<HTMLOListElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [stops, setStops] = useState<Stop[][]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<(Stop & { color: LineColor }) | null>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const a = area.current;
    const l = list.current;
    if (!a || !l) return;
    const measure = () => {
      const ar = a.getBoundingClientRect();
      const stacked = l.getBoundingClientRect().bottom <= ar.top + 1;
      const n = lines.length;
      const ys = stacked
        ? lines.map((_, i) => 30 + (i * (ar.height - 60)) / Math.max(1, n - 1))
        : [...l.querySelectorAll('.bullet')].map((b) => {
            const r = b.getBoundingClientRect();
            return r.top + r.height / 2 - ar.top;
          });
      if (ys.length === n && ar.width > 0) setGeo(layout(ar.width, ys, stacked));
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(a);
    ro.observe(l);
    return () => ro.disconnect();
  }, [lines.length]);

  // Stops go on the drawn track, evenly spaced, clear of the interchange and the faded ends.
  useEffect(() => {
    if (!geo || !svg.current) return;
    const tracks = [...svg.current.querySelectorAll<SVGPathElement>('.network-track')];
    setStops(
      tracks.map((t, i) => {
        const names = lines[i].stops;
        const total = t.getTotalLength();
        const kept: DOMPoint[] = [];
        for (let s = 0; s <= total; s += 3) {
          const p = t.getPointAtLength(s);
          if (p.x > geo.x0 + 10 && p.x < geo.W - 70 && (p.x < geo.cx0 - 18 || p.x > geo.cx1 + 18)) kept.push(p);
        }
        // Roughly one stop per 48px of open track, so short lines on a phone don't bunch up.
        const k = Math.min(names.length, MAX_STOPS, Math.floor((kept.length * 3) / 48));
        if (!kept.length || k < 1) return [];
        return Array.from({ length: k }, (_, j) => {
          const p = kept[Math.min(kept.length - 1, Math.round(((j + 0.5) * kept.length) / k))];
          const name = names[k === 1 ? 0 : Math.round((j * (names.length - 1)) / (k - 1))];
          return { x: p.x, y: p.y, label: name };
        });
      })
    );
  }, [geo, lines]);

  // Trains only run while the map is on screen.
  useEffect(() => {
    if (!motion || !area.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) svg.current?.unpauseAnimations();
      else svg.current?.pauseAnimations();
    });
    io.observe(area.current);
    return () => io.disconnect();
  }, [motion, geo === null]);

  const dim = (i: number) => (active === null || active === i ? 1 : 0.16);
  const open = (i: number) => navigateWithTransition(`/projects/${lines[i].slug}`, router.push);
  const domains = lines.filter((l) => l.domain);

  return (
    <div className="network" onMouseLeave={() => setActive(null)}>
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div>
          <p className="text-[0.8125rem] font-bold uppercase tracking-[0.08em]">Project map</p>
          <p className="mt-1 text-[0.875rem] leading-snug text-ink-2">
            Each line is a system I built.
            <br />
            Click a stop to explore.
          </p>
        </div>
        {domains.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem] text-ink-2" aria-label="Line colours">
            {domains.map((l) => (
              <li key={l.slug} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[rgb(var(--line))]" style={lineVar(l.color)} aria-hidden />
                {l.domain}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pm-body relative mt-6 grid md:grid-cols-[13.5rem_1fr]">
        <ol ref={list} className="relative z-10 grid gap-x-6 gap-y-6 sm:grid-cols-2 md:grid-cols-1 md:gap-y-5">
          {lines.map((l, i) => (
            <li key={l.slug} data-vt-scope>
              <TransitionLink
                href={`/projects/${l.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex items-start gap-3 rounded-lg"
                style={{ opacity: active === null || active === i ? 1 : 0.45, transition: 'opacity 280ms var(--ease-out)' }}
              >
                <RouteBullet title={l.title} color={l.color} size="lg" vtName />
                <span className="min-w-0">
                  <span
                    data-vt-title
                    className="block w-fit text-[0.9375rem] font-bold leading-tight decoration-2 underline-offset-4 group-hover:underline"
                  >
                    {l.title}
                  </span>
                  <span className="block text-[0.8125rem] text-ink-2">{l.tag}</span>
                  {l.chips.length > 0 && (
                    <span className="mt-2 flex flex-wrap gap-1">
                      {l.chips.map((c) => (
                        <span key={c} className="pm-chip">
                          {c}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </TransitionLink>
            </li>
          ))}
        </ol>

        <div ref={area} className="pm-area relative mt-6 h-[16rem] md:mt-0 md:h-auto md:min-h-[20rem]">
          {geo && (
            <svg ref={svg} className="network-lines absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1={geo.W - 150} x2={geo.W - 6}>
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={-40} y={-40} width={geo.W + 120} height={2000}>
                  <rect x={-40} y={-40} width={geo.W + 120} height={2000} fill={`url(#${id}-fade)`} />
                </mask>
              </defs>

              <g mask={`url(#${id}-mask)`}>
                {geo.paths.map((d, i) => (
                  <g
                    key={lines[i].slug}
                    className="network-line"
                    style={{ ...lineVar(lines[i].color), opacity: dim(i), '--i': i } as CSSProperties}
                  >
                    <path d={d} className="network-hit" onMouseEnter={() => setActive(i)} onClick={() => open(i)} />
                    <path d={d} pathLength={1} className="network-track" />
                    {motion && (
                      <g className="network-train" opacity={0}>
                        <rect x={-10} y={-4.5} width={20} height={9} rx={3} />
                        <set attributeName="opacity" to="1" begin={`${1.7 + i * 0.14}s`} fill="freeze" />
                        <animateMotion
                          path={d}
                          dur={`${16 + i * 2.4}s`}
                          begin={`${1.7 + i * 0.14}s`}
                          repeatCount="indefinite"
                          rotate="auto"
                          keyPoints="0;0.8;0.8;0;0"
                          keyTimes="0;0.44;0.52;0.96;1"
                          calcMode="linear"
                        />
                      </g>
                    )}
                    {stops[i]?.map((s, j) => (
                      <circle
                        key={j}
                        cx={s.x}
                        cy={s.y}
                        r={6}
                        className="pm-stop"
                        onMouseEnter={() => {
                          setActive(i);
                          setTip({ ...s, color: lines[i].color });
                        }}
                        onMouseLeave={() => setTip(null)}
                        onClick={() => open(i)}
                      />
                    ))}
                  </g>
                ))}
              </g>

              {/* The interchange every line passes through. */}
              <rect x={geo.hx - 11} y={geo.top} width={22} height={geo.bottom - geo.top} rx={11} className="pm-hub" />
              {!geo.stacked && (
                <text x={geo.hx} y={geo.bottom + 28} textAnchor="middle" className="pm-hub-label">
                  <tspan x={geo.hx}>Different problems.</tspan>
                  <tspan x={geo.hx} dy={17}>
                    Same engineering mindset.
                  </tspan>
                </text>
              )}

              {/* On a phone the names sit above the map, so each line starts at its own bullet. */}
              {geo.stacked &&
                geo.ys.map((y, i) => (
                  <g key={`b-${lines[i].slug}`} style={{ ...lineVar(lines[i].color), opacity: dim(i) } as CSSProperties}>
                    <circle cx={geo.x0} cy={y} r={12} className="pm-bullet" />
                    <text x={geo.x0} y={y + 4.5} textAnchor="middle" className="pm-bullet-text" data-line={lines[i].color}>
                      {routeLetter(lines[i].title)}
                    </text>
                  </g>
                ))}
            </svg>
          )}

          {geo && !geo.stacked && (
            <Note arrow="down-left" className="pm-note absolute right-0 top-0">
              pick a stop to explore
            </Note>
          )}

          {tip && (
            <span
              className="pm-tip"
              style={{ left: tip.x, top: tip.y, ...lineVar(tip.color) } as CSSProperties}
              role="status"
            >
              {tip.label}
            </span>
          )}
        </div>
      </div>

      <p className="mt-6 hidden items-center gap-3 text-[0.75rem] text-ink-2 sm:flex" aria-label="How each system grows">
        <span>Ideas</span>
        <span className="pm-dash" aria-hidden />
        {['Build', 'Evaluate', 'Improve'].map((s) => (
          <span key={s} className="inline-flex items-center gap-3">
            {s}
            <ArrowRight className="h-3 w-3 text-ink-3" strokeWidth={1.75} aria-hidden />
          </span>
        ))}
        <span>Real-world use</span>
        <span className="pm-dash" aria-hidden />
        <ArrowRight className="-ml-2 h-3 w-3 text-ink-3" strokeWidth={1.75} aria-hidden />
      </p>
    </div>
  );
}
