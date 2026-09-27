'use client';

import { useEffect, useRef, useState } from 'react';

const DIGIT = /\d/;

/**
 * A measured value on a departure board: when it scrolls into view each digit flips through
 * a few numbers before landing, left to right. Letters and units stay put.
 */
export function FlapValue({ value, className = '' }: { value: string; className?: string }) {
  const [chars, setChars] = useState(() => value.split(''));
  const [flips, setFlips] = useState(() => value.split('').map(() => 0));
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || !DIGIT.test(value) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = value.split('');
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // Each digit gets a few more flips than the one before it, so the board settles left to right.
        const remaining = target.map((c, i) => (DIGIT.test(c) ? 4 + i * 2 : 0));
        const step = () => {
          let busy = false;
          setChars((prev) =>
            prev.map((c, i) => {
              if (remaining[i] <= 0) return target[i];
              busy = true;
              remaining[i] -= 1;
              return remaining[i] === 0 ? target[i] : String(Math.floor(Math.random() * 10));
            })
          );
          setFlips((prev) => prev.map((f, i) => (DIGIT.test(target[i]) && remaining[i] >= 0 ? f + 1 : f)));
          if (busy) timer = window.setTimeout(step, 60);
        };
        step();
      },
      { threshold: 0.8 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [value]);

  return (
    <span ref={el} className={`flap ${className}`} aria-label={value}>
      {chars.map((c, i) =>
        DIGIT.test(value[i]) ? (
          <span key={i} className="flap-cell" aria-hidden>
            <span key={flips[i]} className="flap-char">
              {c}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden>
            {c}
          </span>
        )
      )}
    </span>
  );
}
