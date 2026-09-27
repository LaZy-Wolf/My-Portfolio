'use client';

import { useEffect, useState } from 'react';

/** The case study's headings as stops on a line, with "you are here" following the reader. */
export function CaseStudyRoute({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;
  const at = Math.max(0, headings.findIndex((h) => h.id === active));

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <ol className="relative">
        <span className="absolute bottom-[0.6rem] left-[6px] top-[0.6rem] w-[4px] rounded-full bg-rule-strong" aria-hidden />
        <span
          className="absolute left-[6px] top-[0.6rem] w-[4px] rounded-full transition-[height] duration-500 ease-out"
          style={{
            background: 'rgb(var(--line))',
            height: `calc((100% - 1.2rem) * ${at / (headings.length - 1)})`,
          }}
          aria-hidden
        />
        {headings.map((h, i) => (
          <li key={h.id} className="relative pb-4 pl-8 last:pb-0">
            <span
              className={`absolute left-0 top-[0.3rem] h-4 w-4 rounded-full transition-colors duration-300 ${
                i <= at ? 'bg-paper shadow-[inset_0_0_0_3.5px_rgb(var(--ink))]' : 'bg-paper shadow-[inset_0_0_0_3px_rgb(var(--rule-strong))]'
              }`}
              aria-hidden
            />
            <a
              href={`#${h.id}`}
              aria-current={h.id === active ? 'location' : undefined}
              className={`block text-[0.9375rem] leading-snug transition-colors ${
                h.id === active ? 'font-semibold text-ink' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
