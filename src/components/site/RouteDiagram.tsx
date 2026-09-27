'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { describeRoute, lineVar, parseRoute, type LineColor, type RouteItem } from '@/lib/lines';

/*
  Draws a project's route in its real shape: straight runs, parallel tracks that split and merge,
  inputs that fan in, loops the train laps, and gates where it waits. Laid out at the measured
  width so labels stay at their true size; horizontal on wide containers, top to bottom on narrow ones.
  Trains are SVG SMIL animations, started when the diagram scrolls into view or its row is hovered.
*/

type UV = [number, number];
type Dir = 'u-' | 'u+' | 'v-' | 'v+';
type Align = 'center' | 'start' | 'end';

interface LabelBox {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  lines: string[];
}
interface Stop {
  x: number;
  y: number;
  edge: boolean;
  hold: boolean;
  label: LabelBox;
  pops: { train: number; t: number }[];
}
interface Train {
  d: string;
  dur: number;
  keyTimes?: string;
  keyPoints?: string;
}
interface Geo {
  viewBox: string;
  width: number;
  height: number;
  tracks: string[];
  stops: Stop[];
  bars: string[];
  notes: { x: number; y: number; text: string; anchor: 'middle' | 'start' }[];
  signals: { x: number; y: number; greenAt?: { train: number; t: number } }[];
  trains: Train[];
}

const FS = 13;
const LH = 16;
const CHAR = 7.1;
const SPEED = 230; // px per second
const HOLD = 1.1; // seconds a train waits at a gate
const LAPS_SHOWN = 2;
const FAN_GAP = (vertical: boolean) => (vertical ? 38 : 30);

function wrap(text: string, maxW: number) {
  const max = Math.max(5, Math.floor(maxW / CHAR));
  const lines: string[] = [];
  for (const word of text.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last && (last + ' ' + word).length <= max) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  }
  return lines;
}

function layout(items: RouteItem[], W: number): Geo {
  const vertical = W < 560;
  const n = items.length;
  const fan = items[0]?.kind === 'split';
  const midSplit = items.some((it, i) => it.kind === 'split' && i > 0);
  const loopSide = vertical ? 1 : -1;

  // Main-axis positions of each slot. Loops get extra room so their stops and labels breathe.
  const startPad = vertical ? (fan ? 64 : 22) : 26;
  const endPad = vertical ? 26 : 26;
  const weight = items.map((it) => (it.kind === 'loop' ? (vertical ? 2.4 : 1.3) : 1));
  const units = items.slice(1).reduce((sum, _, j) => sum + (weight[j] + weight[j + 1]) / 2, 0);
  const s = vertical ? 66 : (W - startPad - endPad) / Math.max(1, units);
  const slotAt: number[] = [];
  items.forEach((_, i) => slotAt.push(i === 0 ? startPad : slotAt[i - 1] + (s * (weight[i - 1] + weight[i])) / 2));
  const U = (i: number) => slotAt[i];
  const cx = vertical ? (midSplit ? 118 : fan ? 78 : 28) : 0;

  const P = ([u, v]: UV): [number, number] => (vertical ? [cx + v, u] : [u, v]);
  const pt = (p: UV) => P(p).map((c) => +c.toFixed(1)).join(' ');

  const bbox = { minX: 0, maxX: W, minY: Infinity, maxY: -Infinity };
  const grow = (x: number, y: number) => {
    bbox.minY = Math.min(bbox.minY, y);
    bbox.maxY = Math.max(bbox.maxY, y);
  };

  const label = (p: UV, dir: Dir, text: string, maxW: number, align: Align = 'center'): LabelBox => {
    const lines = wrap(text, maxW);
    const k = lines.length;
    const [x, y] = P(p);
    let box: LabelBox;
    const side = (d: Dir): 'above' | 'below' | 'left' | 'right' =>
      vertical
        ? ({ 'u-': 'above', 'u+': 'below', 'v-': 'left', 'v+': 'right' } as const)[d]
        : ({ 'u-': 'left', 'u+': 'right', 'v-': 'above', 'v+': 'below' } as const)[d];
    const where = side(dir);
    if (where === 'below') {
      const anchor = align === 'start' ? 'start' : align === 'end' ? 'end' : 'middle';
      const ax = align === 'start' ? x - 8 : align === 'end' ? x + 8 : x;
      box = { x: ax, y: y + 25, anchor, lines };
      grow(ax, y + 25 + (k - 1) * LH + 5);
    } else if (where === 'above') {
      const anchor = align === 'start' ? 'start' : 'middle';
      const ax = align === 'start' ? x + 4 : x;
      const first = y - 14 - (k - 1) * LH;
      box = { x: ax, y: first, anchor, lines };
      grow(ax, first - 12);
    } else {
      const first = y + 4.5 - ((k - 1) * LH) / 2;
      box = { x: where === 'left' ? x - 14 : x + 14, y: first, anchor: where === 'left' ? 'end' : 'start', lines };
      grow(x, first - 12);
      grow(x, first + (k - 1) * LH + 5);
    }
    return box;
  };

  const labelRoom = (side: 'v+' | 'v-', v: number) =>
    vertical ? (side === 'v+' ? W - (cx + v + 14) - 6 : cx + v - 14 - 4) : s - 10;

  const tracks: string[] = [];
  const stops: Stop[] = [];
  const bars: string[] = [];
  const notes: Geo['notes'] = [];
  const signals: Geo['signals'] = [];

  const addStop = (p: UV, lab: LabelBox, edge = false, hold = false) => {
    const [x, y] = P(p);
    grow(x, y - 10);
    grow(x, y + 10);
    stops.push({ x, y, edge, hold, label: lab, pops: [] });
    return stops.length - 1;
  };
  const bar = (p: UV) => {
    const [x, y] = P(p);
    const d = vertical ? `M${x - 9} ${y}H${x + 9}` : `M${x} ${y - 9}V${y + 9}`;
    bars.push(d);
    grow(x, y - 10);
    grow(x, y + 10);
  };

  const mainSlots = items.map((_, i) => i).filter((i) => !(i === 0 && fan));
  const firstMain = mainSlots[0];
  const lastMain = mainSlots[mainSlots.length - 1];

  // Main line, broken where a mid-route split replaces it with parallel tracks.
  let piece: UV[] = [];
  mainSlots.forEach((i) => {
    if (items[i].kind === 'split') {
      if (piece.length > 1) tracks.push('M' + piece.map(pt).join('L'));
      piece = [];
      return;
    }
    piece.push([U(i), 0]);
  });
  if (piece.length > 1) tracks.push('M' + piece.map(pt).join('L'));

  // Termini.
  if (!fan) {
    bar([U(firstMain) - 12, 0]);
    tracks.push('M' + [pt([U(firstMain) - 12, 0]), pt([U(firstMain), 0])].join('L'));
  }
  bar([U(lastMain) + 12, 0]);
  tracks.push('M' + [pt([U(lastMain), 0]), pt([U(lastMain) + 12, 0])].join('L'));

  // Route geometry per slot, plus stop indices trains will pass.
  const branchPath = (i: number, v: number): UV[] => {
    const a = U(i - 1);
    const b = U(i + 1);
    const e = 26;
    const dv = Math.abs(v);
    if (dv === 0) return [[a, 0], [U(i), 0], [b, 0]];
    return [[a, 0], [a + e, 0], [a + e + dv, v], [U(i), v], [b - e - dv, v], [b - e, 0], [b, 0]];
  };
  const fanPath = (v: number): UV[] => {
    // Merge well before the first shared stop so its label stays clear of the diagonals.
    const e = vertical ? 6 : 40;
    const dv = Math.abs(v);
    return [[U(0), v], [U(1) - e - dv, v], [U(1) - e, 0], [U(1), 0]];
  };

  const stopAt = new Map<string, number>(); // key -> stop index
  const splitOffsets = (m: number, gap: number) => Array.from({ length: m }, (_, k) => (k - (m - 1) / 2) * gap);

  const loopGeo = new Map<number, { uL: number; uR: number; H: number; r: number; stops: { p: UV; seg: 'start' | 'far' | 'end' }[] }>();

  items.forEach((it, i) => {
    if (it.kind === 'stop') {
      const edge = i === firstMain || i === lastMain;
      const align: Align = vertical ? 'center' : i === firstMain ? 'start' : i === lastMain ? 'end' : 'center';
      const room = vertical ? labelRoom('v+', 0) : edge ? s * 0.9 : s - 10;
      const idx = addStop([U(i), 0], label([U(i), 0], 'v+', it.label, room, align), edge, Boolean(it.hold));
      stopAt.set(`s${i}`, idx);
      if (it.hold) {
        const [x, y] = P([U(i) - 16, -22]);
        signals.push({ x, y });
        grow(x, y - 12);
      }
    } else if (it.kind === 'split' && i === 0) {
      const offs = splitOffsets(it.branches.length, FAN_GAP(vertical));
      offs.forEach((v, k) => {
        tracks.push('M' + fanPath(v).map(pt).join('L'));
        bar([U(0) - 12, v]);
        tracks.push('M' + [pt([U(0) - 12, v]), pt([U(0), v])].join('L'));
        const lab = vertical
          ? label([U(0) - 14 - (k % 2 ? 16 : 0), v], 'u-', it.branches[k], 70)
          : label([U(0) + 12, v + 5], 'v-', it.branches[k], s * 0.8, 'start');
        stopAt.set(`f${k}`, addStop([U(0), v], lab));
      });
    } else if (it.kind === 'split') {
      const offs = splitOffsets(it.branches.length, vertical ? 44 : 44);
      offs.forEach((v, k) => {
        tracks.push('M' + branchPath(i, v).map(pt).join('L'));
        const dir: Dir = v < 0 ? 'v-' : 'v+';
        const room = vertical ? labelRoom(dir as 'v+' | 'v-', v) : s - 10;
        stopAt.set(`b${i}-${k}`, addStop([U(i), v], label([U(i), v], dir, it.branches[k], room)));
      });
    } else if (it.kind === 'loop') {
      const lw = vertical ? s * weight[i] * 0.95 : Math.min(s * weight[i] * 0.95, 190);
      const H = vertical ? 92 : 70;
      const r = 16;
      const uL = U(i) - lw / 2;
      const uR = U(i) + lw / 2;
      const far = loopSide * H;
      const q = (u: number, v: number) => pt([u, v]);
      tracks.push(
        `M${q(uL, 0)}L${q(uL, far - loopSide * r)}Q${q(uL, far)} ${q(uL + r, far)}L${q(uR - r, far)}Q${q(uR, far)} ${q(uR, far - loopSide * r)}L${q(uR, 0)}`
      );
      const k = it.stops.length;
      // Wide: stops sit on the start edge, the far edge and the end edge, labels facing outward.
      // Narrow: every stop goes on the far edge, so labels never crowd the stops before and after.
      type Seg = 'start' | 'far' | 'end';
      const places: { p: UV; dir: Dir; seg: Seg }[] = [];
      const farDir: Dir = loopSide < 0 ? 'v-' : 'v+';
      if (vertical || k === 1) {
        const a = uL + r + 10;
        const b = uR - r - 10;
        for (let j = 0; j < k; j++) {
          const u = k === 1 ? U(i) : a + ((b - a) * j) / (k - 1);
          places.push({ p: [u, far], dir: farDir, seg: 'far' });
        }
      } else {
        places.push({ p: [uL, far / 2], dir: 'u-', seg: 'start' });
        for (let j = 1; j <= k - 2; j++) places.push({ p: [uL + (lw * j) / (k - 1), far], dir: farDir, seg: 'far' });
        places.push({ p: [uR, far / 2], dir: 'u+', seg: 'end' });
      }
      const loopStops: { p: UV; seg: Seg }[] = [];
      places.forEach(({ p, dir, seg }, j) => {
        const room = dir === 'u-' || dir === 'u+' ? s * 0.8 : vertical ? labelRoom('v+', H) : lw;
        stopAt.set(`l${i}-${j}`, addStop(p, label(p, dir, it.stops[j], room)));
        loopStops.push({ p, seg });
      });
      const [nx, ny] = P([U(i), far / 2]);
      notes.push({ x: nx, y: ny + 4, text: `up to ${it.laps}×`, anchor: 'middle' });
      loopGeo.set(i, { uL, uR, H: far, r, stops: loopStops });
    }
  });

  // Trains.
  const fanM = fan ? (items[0] as { branches: string[] }).branches.length : 1;
  const splitItem = items.findIndex((it, i) => it.kind === 'split' && i > 0);
  const splitM = splitItem > 0 ? (items[splitItem] as { branches: string[] }).branches.length : 1;
  const trainCount = Math.max(fanM, splitM);
  const fanOffs = fan ? splitOffsets(fanM, FAN_GAP(vertical)) : [];
  const splitOffs = splitItem > 0 ? splitOffsets(splitM, 44) : [];

  const trains: Train[] = [];
  const signalTimes: number[] = [];
  for (let t = 0; t < trainCount; t++) {
    const pts: UV[] = [];
    const segs: string[] = [];
    let len = 0;
    let last: UV | null = null;
    let holdAt: number | null = null;
    const marks: { key: string; at: number }[] = [];
    const to = (p: UV) => {
      if (!last) {
        segs.push('M' + pt(p));
      } else {
        len += Math.hypot(p[0] - last[0], p[1] - last[1]);
        segs.push('L' + pt(p));
      }
      last = p;
      pts.push(p);
    };
    const quad = (c: UV, p: UV) => {
      const chord = Math.hypot(p[0] - last![0], p[1] - last![1]);
      const ctrl = Math.hypot(c[0] - last![0], c[1] - last![1]) + Math.hypot(p[0] - c[0], p[1] - c[1]);
      len += (2 * chord + ctrl) / 3;
      segs.push(`Q${pt(c)} ${pt(p)}`);
      last = p;
    };
    const mark = (key: string) => marks.push({ key, at: len });

    if (fan) {
      fanPath(fanOffs[t % fanM]).forEach((p, j) => {
        to(p);
        if (j === 0) mark(`f${t % fanM}`);
      });
    } else {
      to([U(firstMain), 0]);
    }
    for (let i = fan ? 1 : firstMain; i <= lastMain; i++) {
      const it = items[i];
      if (it.kind === 'stop') {
        to([U(i), 0]);
        mark(`s${i}`);
        if (it.hold) holdAt = len;
      } else if (it.kind === 'split') {
        const k = t % splitM;
        branchPath(i, splitOffs[k]).forEach((p) => {
          to(p);
          if (p[0] === U(i)) mark(`b${i}-${k}`);
        });
      } else if (it.kind === 'loop') {
        const g = loopGeo.get(i)!;
        const laps = Math.min(it.laps, LAPS_SHOWN);
        to([g.uL, 0]);
        const visit = (seg: 'start' | 'far' | 'end') =>
          g.stops.forEach(({ p, seg: sg }, j) => {
            if (sg !== seg) return;
            to(p);
            mark(`l${i}-${j}`);
          });
        for (let lap = 0; lap < laps; lap++) {
          if (lap > 0) to([g.uL, 0]);
          visit('start');
          to([g.uL, g.H - loopSide * g.r]);
          quad([g.uL, g.H], [g.uL + g.r, g.H]);
          visit('far');
          to([g.uR - g.r, g.H]);
          quad([g.uR, g.H], [g.uR, g.H - loopSide * g.r]);
          visit('end');
          to([g.uR, 0]);
        }
      }
    }

    const travel = len / SPEED;
    const total = travel + (holdAt !== null ? HOLD : 0);
    const timeAt = (at: number) => (at / len) * travel + (holdAt !== null && at > holdAt + 0.5 ? HOLD : 0);
    marks.forEach(({ key, at }) => {
      const idx = stopAt.get(key);
      if (idx !== undefined && !(t > 0 && stops[idx].pops.some((p) => Math.abs(p.t - timeAt(at)) < 0.05)))
        stops[idx].pops.push({ train: t, t: +timeAt(at).toFixed(2) });
    });
    const train: Train = { d: segs.join(''), dur: +total.toFixed(2) };
    if (holdAt !== null) {
      const fh = holdAt / len;
      const th = (fh * travel) / total;
      const hd = HOLD / total;
      train.keyTimes = `0;${th.toFixed(4)};${Math.min(1, th + hd).toFixed(4)};1`;
      train.keyPoints = `0;${fh.toFixed(4)};${fh.toFixed(4)};1`;
      signalTimes.push(+(timeAt(holdAt) + HOLD - 0.05).toFixed(2));
    }
    trains.push(train);
  }
  if (signals.length && signalTimes.length) signals.forEach((sg) => (sg.greenAt = { train: 0, t: signalTimes[0] }));

  const pad = 8;
  const minY = Math.floor(bbox.minY - pad);
  const maxY = Math.ceil(bbox.maxY + pad);
  const height = vertical ? Math.ceil(Math.max(...stops.map((st) => st.y)) + 40) : maxY - minY;
  return {
    viewBox: vertical ? `0 0 ${W} ${height}` : `0 ${minY} ${W} ${height}`,
    width: W,
    height,
    tracks,
    stops,
    bars,
    notes,
    signals,
    trains,
  };
}

interface RouteDiagramProps {
  steps: string[];
  color: LineColor | null;
  /** Element whose hover replays the ride (defaults to the closest .line-row). */
  className?: string;
}

export function RouteDiagram({ steps, color, className = '' }: RouteDiagramProps) {
  const items = useMemo(() => parseRoute(steps), [steps]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(720);
  const [motion, setMotion] = useState(false);
  const uid = 'r' + useId().replace(/[^a-zA-Z0-9]/g, '');

  const geo = useMemo(() => layout(items, width), [items, width]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    // Measure now as well: ResizeObserver only reports on the next rendered frame.
    setWidth(Math.round(el.getBoundingClientRect().width) || 720);
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Ride once when the diagram comes into view; hovering its row rides again.
  useEffect(() => {
    const svg = svgRef.current;
    const el = wrapRef.current;
    if (!motion || !svg || !el) return;
    const ride = () =>
      svg.querySelectorAll<SVGAnimationElement>('animateMotion').forEach((a) => {
        try {
          a.beginElement();
        } catch {
          /* SMIL unsupported: the static diagram stands on its own */
        }
      });
    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played) {
          played = true;
          ride();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    const row = el.closest('.line-row') || el;
    row.addEventListener('mouseenter', ride);
    return () => {
      io.disconnect();
      row.removeEventListener('mouseenter', ride);
    };
  }, [motion, geo]);

  if (items.length < 2) return null;

  return (
    <div ref={wrapRef} className={`route ${className}`} style={lineVar(color)}>
      <svg
        ref={svgRef}
        viewBox={geo.viewBox}
        width="100%"
        height={geo.height}
        role="img"
        aria-label={describeRoute(steps)}
        className="block overflow-visible"
      >
        {geo.tracks.map((d, i) => (
          <path key={i} d={d} className="route-track" />
        ))}
        {geo.bars.map((d, i) => (
          <path key={i} d={d} className="route-bar" />
        ))}
        {geo.notes.map((n, i) => (
          <text key={i} x={n.x} y={n.y} textAnchor={n.anchor} className="route-note">
            {n.text}
          </text>
        ))}
        {geo.signals.map((sg, i) => (
          <g key={i} transform={`translate(${sg.x} ${sg.y})`} className="route-signal">
            <rect x={-6} y={-11} width={12} height={22} rx={6} />
            <circle cx={0} cy={-4.5} r={3.2} className="route-signal-stop">
              {motion && sg.greenAt && (
                <>
                  <set attributeName="opacity" to="1" begin={`${uid}t${sg.greenAt.train}.begin`} />
                  <set attributeName="opacity" to="0.22" begin={`${uid}t${sg.greenAt.train}.begin+${sg.greenAt.t}s`} />
                </>
              )}
            </circle>
            <circle cx={0} cy={4.5} r={3.2} className="route-signal-go" opacity={0.22}>
              {motion && sg.greenAt && (
                <>
                  <set attributeName="opacity" to="0.22" begin={`${uid}t${sg.greenAt.train}.begin`} />
                  <set attributeName="opacity" to="1" begin={`${uid}t${sg.greenAt.train}.begin+${sg.greenAt.t}s`} />
                </>
              )}
            </circle>
          </g>
        ))}
        {geo.stops.map((st, i) => (
          <g key={i}>
            <circle cx={st.x} cy={st.y} r={st.edge ? 8.5 : 6.5} className={st.edge ? 'route-stop route-stop-edge' : 'route-stop'}>
              {motion &&
                st.pops.map((p, j) => (
                  <animate
                    key={j}
                    attributeName="r"
                    values={st.edge ? '8.5;11;8.5' : '6.5;9.5;6.5'}
                    dur="0.45s"
                    begin={`${uid}t${p.train}.begin+${p.t}s`}
                  />
                ))}
            </circle>
            <text x={st.label.x} y={st.label.y} textAnchor={st.label.anchor} className="route-label">
              {st.label.lines.map((l, j) => (
                <tspan key={j} x={st.label.x} dy={j === 0 ? 0 : LH}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        ))}
        {motion &&
          geo.trains.map((tr, i) => (
            <g key={`${i}-${width}`} visibility="hidden" className="route-train">
              <set attributeName="visibility" to="visible" begin={`${uid}t${i}.begin`} fill="freeze" />
              <rect x={-10} y={-5} width={20} height={10} rx={3.5} />
              <animateMotion
                id={`${uid}t${i}`}
                path={tr.d}
                dur={`${tr.dur}s`}
                begin="indefinite"
                restart="whenNotActive"
                fill="freeze"
                rotate="auto"
                {...(tr.keyTimes ? { keyTimes: tr.keyTimes, keyPoints: tr.keyPoints, calcMode: 'linear' } : {})}
              />
            </g>
          ))}
      </svg>
    </div>
  );
}
