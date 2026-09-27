import type { CSSProperties, ReactNode } from 'react';
import { layoutLine, lineVar, type LineColor } from '@/lib/lines';

interface LineStripProps {
  steps: string[];
  color: LineColor | null;
  /** Target in ms, drawn as a ghost stop. Only used when the line is timed. */
  targetMs?: number;
  /** Bracket the stretch of line past the target. */
  showOver?: boolean;
  labelWidth?: string;
  className?: string;
  style?: CSSProperties;
  /** Rides on top of the rail (the hero's train). */
  children?: ReactNode;
}

export function LineStrip({
  steps,
  color,
  targetMs,
  showOver = false,
  labelWidth,
  className = '',
  style,
  children,
}: LineStripProps) {
  const { stations, at, timed, totalMs } = layoutLine(steps);
  if (stations.length < 2) return null;

  const target = timed && targetMs && targetMs < totalMs ? (targetMs / totalMs) * 100 : null;
  const over = target !== null ? totalMs - targetMs! : 0;

  return (
    <div
      className={`strip ${className}`}
      data-timed={timed}
      style={{
        ...lineVar(color),
        '--n': stations.length,
        ...(labelWidth ? { '--label-w': labelWidth } : null),
        ...style,
      } as CSSProperties}
    >
      <div className="strip-ghost" aria-hidden />
      <div className="strip-rail" aria-hidden />

      {target !== null && (
        <div className="strip-target" style={{ '--p': target } as CSSProperties} aria-hidden>
          <span className="strip-target-label num">Target {targetMs} ms</span>
        </div>
      )}
      {target !== null && showOver && (
        <div className="strip-over" style={{ '--p': target } as CSSProperties} aria-hidden>
          <span className="strip-over-label num">{over} ms over target</span>
        </div>
      )}

      {timed &&
        stations.slice(1).map((s, i) => (
          <span
            key={`seg-${i}`}
            className="strip-seg num"
            style={{ '--p': (at[i] + at[i + 1]) / 2 } as CSSProperties}
            aria-hidden
          >
            {s.ms} ms
          </span>
        ))}

      <ol className="contents">
        {stations.map((s, i) => (
          <li
            key={`${s.label}-${i}`}
            className="strip-stop"
            data-edge={i === 0 ? 'start' : i === stations.length - 1 ? 'end' : undefined}
            style={{ '--p': at[i], '--room': room(at, i) } as CSSProperties}
          >
            <span className="strip-dot" aria-hidden />
            <span className="strip-name">
              {s.label}
              {timed && i > 0 && <span className="sr-only">, {s.ms} ms after the previous stop</span>}
            </span>
          </li>
        ))}
      </ol>

      {children}

      {timed && target !== null && (
        <p className="sr-only">
          Total {totalMs} ms against a target of {targetMs} ms.
        </p>
      )}
    </div>
  );
}

/** Horizontal room (in % of the line) a stop's name can use before it meets a neighbouring stop. */
function room(at: number[], i: number) {
  const last = at.length - 1;
  if (i === 0) return at[1] - at[0];
  if (i === last) return at[last] - at[last - 1];
  return 2 * Math.min(at[i] - at[i - 1], at[i + 1] - at[i]);
}
