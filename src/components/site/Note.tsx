import type { ReactNode } from 'react';

type Arrow = 'down-right' | 'down-left' | 'up-right' | 'up-left' | 'left' | 'right';

/**
 * A handwritten margin note with a pen-drawn arrow, the way you'd annotate your own printed map.
 * The arrow draws itself in when it scrolls into view.
 */
export function Note({ children, arrow = 'down-right', className = '' }: { children: ReactNode; arrow?: Arrow; className?: string }) {
  return (
    <span className={`note ${className}`} data-arrow={arrow}>
      <span className="note-text">{children}</span>
      <svg className="note-arrow" viewBox="0 0 64 44" width="58" height="40" aria-hidden>
        <path pathLength={100} d="M5 7c9-3.5 21-3 30.5 3.5C43 15.6 49 22 52.5 30.5" />
        <path pathLength={100} d="M43.5 27.8l9.3 3.4 1.9-10" />
      </svg>
    </span>
  );
}
