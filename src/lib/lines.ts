import type { CSSProperties } from 'react';
import type { IProject } from '@/models/Project';

export type LineColor = 'red' | 'blue' | 'green' | 'amber' | 'violet';
const LINE_COLORS: LineColor[] = ['red', 'blue', 'green', 'amber', 'violet'];

export interface Station {
  label: string;
  /** Measured ms from the previous stop, when the admin wrote "Label @ 165". */
  ms?: number;
}

export interface LineLayout {
  stations: Station[];
  /** Position of each stop along the line, 0 to 100. */
  at: number[];
  /** True when every stop after the first carries a time: the line is drawn to scale. */
  timed: boolean;
  totalMs: number;
}

export function parseStations(steps: string[] = []): Station[] {
  return steps
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^(.*?)\s*@\s*(\d+(?:\.\d+)?)\s*(?:ms)?$/i);
      return m ? { label: m[1].trim(), ms: Number(m[2]) } : { label: s };
    });
}

export function layoutLine(steps: string[] = []): LineLayout {
  const stations = parseStations(steps);
  const n = stations.length;
  const timed = n > 1 && stations.slice(1).every((s) => typeof s.ms === 'number' && s.ms > 0);

  if (!timed) {
    return { stations, timed, totalMs: 0, at: stations.map((_, i) => (n < 2 ? 0 : (i / (n - 1)) * 100)) };
  }

  let t = 0;
  const cumulative = stations.map((s, i) => (i === 0 ? 0 : (t += s.ms!)));
  return { stations, timed, totalMs: t, at: cumulative.map((c) => (c / t) * 100) };
}

/** First number in a metric whose label matches, e.g. "Target" -> 900. */
export function metricNumber(project: Pick<IProject, 'metrics'>, label: RegExp): number | undefined {
  const m = project.metrics?.find((x) => label.test(x.label));
  const n = m ? parseFloat(m.value.replace(/,/g, '')) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

/** Featured projects take the metro line colours in their admin order; everything else runs grey. */
export function lineColorFor(slug: string, projects: Pick<IProject, 'slug' | 'featured'>[]): LineColor | null {
  const i = projects.filter((p) => p.featured).findIndex((p) => p.slug === slug);
  return i === -1 ? null : LINE_COLORS[i % LINE_COLORS.length];
}

export function routeLetter(title: string) {
  return (title.match(/[A-Za-z0-9]/)?.[0] || '?').toUpperCase();
}

export function lineVar(color: LineColor | null) {
  return { '--line': color ? `var(--line-${color})` : 'var(--ink-3)' } as CSSProperties;
}

/* ------------------------------------------------------------------
   Route shapes. A project's stops can describe its real architecture:
     "Label"                    a stop
     "Label @ 165"              a stop reached 165 ms after the previous one
     "hold: Human approval"     a stop where the train waits (a gate)
     "Dense | BM25"             parallel tracks; as the first entry, separate inputs that merge
     "loop 3: A, B, C"          a loop the train can lap up to 3 times before going on
   ------------------------------------------------------------------ */

export type RouteItem =
  | { kind: 'stop'; label: string; ms?: number; hold?: boolean }
  | { kind: 'split'; branches: string[] }
  | { kind: 'loop'; laps: number; stops: string[] };

export function parseRoute(steps: string[] = []): RouteItem[] {
  return steps
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s): RouteItem => {
      const loop = s.match(/^loop\s*(\d+)?\s*:\s*(.+)$/i);
      if (loop) {
        const stops = loop[2].split(',').map((t) => t.trim()).filter(Boolean);
        return { kind: 'loop', laps: Math.max(1, Number(loop[1] || 2)), stops };
      }
      if (s.includes('|')) return { kind: 'split', branches: s.split('|').map((t) => t.trim()).filter(Boolean) };
      const hold = s.match(/^hold\s*:\s*(.+)$/i);
      const label = hold ? hold[1].trim() : s;
      const timed = label.match(/^(.*?)\s*@\s*(\d+(?:\.\d+)?)\s*(?:ms)?$/i);
      return {
        kind: 'stop',
        label: timed ? timed[1].trim() : label,
        ms: timed ? Number(timed[2]) : undefined,
        hold: Boolean(hold),
      };
    });
}

/** Plain-English route, for the AI assistant and screen readers. */
export function describeRoute(steps: string[] = []) {
  return parseRoute(steps)
    .map((i) => {
      if (i.kind === 'split') return `${i.branches.join(' and ')} in parallel`;
      if (i.kind === 'loop') return `a loop through ${i.stops.join(', ')} (up to ${i.laps} passes)`;
      return `${i.label}${i.ms ? ` (${i.ms} ms)` : ''}${i.hold ? ' (waits for human approval)' : ''}`;
    })
    .join(' -> ');
}

/** Stop names only, flattened, for places that just list stations. */
export function stopNames(steps: string[] = []) {
  return parseRoute(steps).flatMap((i) =>
    i.kind === 'stop' ? [i.label] : i.kind === 'split' ? i.branches : i.stops
  );
}
