'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun } from 'lucide-react';

// Same order as the sections on the home page.
const LINKS = [
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function openPalette() {
  window.dispatchEvent(new CustomEvent('palette:open'));
}

export function SiteHeader({ name }: { name: string }) {
  const onHome = usePathname() === '/';
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!onHome) return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  return (
    <>
      <header
        className="sticky top-0 z-nav border-b border-rule bg-paper"
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-[88rem] items-center gap-6 px-5 sm:px-8 lg:px-10"
        >
          <Link href="/" className="group mr-auto flex min-w-0 items-center gap-3 rounded-full">
            <span className="relative flex h-[18px] w-7 shrink-0 items-center" aria-hidden>
              <span className="h-[5px] w-full rounded-full bg-line-red" />
              <span className="absolute right-0 h-[13px] w-[13px] rounded-full bg-paper shadow-[inset_0_0_0_3px_rgb(var(--ink))] transition-transform duration-300 ease-out group-hover:scale-110" />
            </span>
            <span className="truncate text-[0.9375rem] font-semibold tracking-[-0.01em]">
              <span className="sm:hidden">{name.split(' ').slice(-2).join(' ')}</span>
              <span className="hidden sm:inline">{name}</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <Link
                  href={onHome ? `#${l.id}` : `/#${l.id}`}
                  aria-current={active === l.id ? 'location' : undefined}
                  className={`relative rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors ${
                    active === l.id ? 'text-ink' : 'text-ink/75 hover:text-ink'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-ink transition-transform duration-300 ease-out ${
                      active === l.id ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Phones have no room for the links, so the menu opens the section list instead. */}
            <button
              type="button"
              onClick={openPalette}
              className="flex h-10 items-center gap-2 rounded-full px-3.5 text-[0.875rem] text-ink-2 ring-1 ring-inset ring-rule-strong transition-colors hover:text-ink md:hidden"
            >
              <Menu className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Menu
            </button>
            <ThemeToggle />
          </div>
        </nav>
        {/* The header's own rule is a line you ride down the page. */}
        <span className="header-progress" aria-hidden />
      </header>
    </>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    const onChange = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    window.addEventListener('theme:change', onChange);
    return () => window.removeEventListener('theme:change', onChange);
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setThemeTo(next)}
      className="btn h-9 w-9 px-0 text-ink-2 hover:bg-ink/[0.06] hover:text-ink"
      aria-label={`Switch to ${next === 'dark' ? 'night' : 'day'} map`}
      title={`Switch to ${next === 'dark' ? 'night' : 'day'} map`}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}

export function setThemeTo(theme: 'light' | 'dark') {
  const apply = () => {
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent('theme:change'));
  };
  try {
    localStorage.setItem('theme', theme);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Crossfade the whole map where the browser supports it.
  if (!reduce && 'startViewTransition' in document) {
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply);
  } else {
    apply();
  }
}
