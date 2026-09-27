'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import { RouteBullet } from '@/components/site/RouteBullet';
import { setThemeTo } from '@/components/site/SiteHeader';
import { navigateWithTransition } from '@/components/site/TransitionLink';
import type { LineColor } from '@/lib/lines';

export interface PaletteProject {
  slug: string;
  title: string;
  summary: string;
  keywords: string;
  color: LineColor | null;
}

interface CommandPaletteProps {
  projects: PaletteProject[];
  email: string;
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
  assistantEnabled?: boolean;
}

interface Item {
  id: string;
  group: 'Projects' | 'Go to' | 'Actions';
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void;
}

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'builds', label: 'Smaller builds' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const icon = 'h-4 w-4 shrink-0 text-ink-2';

export function CommandPalette({
  projects,
  email,
  github,
  linkedin,
  resumeUrl,
  assistantEnabled,
}: CommandPaletteProps) {
  const router = useRouter();
  const onHome = usePathname() === '/';
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);

  const close = () => dialog.current?.close();

  useEffect(() => {
    const open = () => {
      if (dialog.current?.open) return;
      setDark(document.documentElement.dataset.theme === 'dark');
      setQuery('');
      setActive(0);
      setCopied(false);
      dialog.current?.showModal();
      input.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    window.addEventListener('palette:open', open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('palette:open', open);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = (href: string) => {
    close();
    if (href.startsWith('#')) {
      if (onHome) document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      else router.push(`/${href}`);
    } else navigateWithTransition(href, router.push);
  };
  const external = (href: string) => {
    close();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        group: 'Projects' as const,
        label: p.title,
        hint: p.summary,
        keywords: p.keywords,
        icon: <RouteBullet title={p.title} color={p.color} size="sm" />,
        run: () => go(`/projects/${p.slug}`),
      })),
      ...SECTIONS.map((s) => ({
        id: `s-${s.id}`,
        group: 'Go to' as const,
        label: s.label,
        icon: <CornerDownLeft className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => go(`#${s.id}`),
      })),
      {
        id: 'a-email',
        group: 'Actions',
        label: 'Email me',
        hint: email,
        keywords: 'contact mail hire',
        icon: <Mail className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => {
          close();
          window.location.href = `mailto:${email}`;
        },
      },
      {
        id: 'a-copy',
        group: 'Actions',
        label: copied ? 'Email address copied' : 'Copy email address',
        keywords: 'contact clipboard',
        icon: <Copy className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => {
          navigator.clipboard?.writeText(email).then(() => setCopied(true));
        },
      },
    ];
    if (assistantEnabled)
      list.push({
        id: 'a-ai',
        group: 'Actions',
        label: 'Ask the AI about my work',
        keywords: 'chat twin assistant question',
        icon: <MessageCircle className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => {
          close();
          window.dispatchEvent(new CustomEvent('assistant:open'));
        },
      });
    if (resumeUrl)
      list.push({
        id: 'a-cv',
        group: 'Actions',
        label: 'Download résumé',
        keywords: 'resume cv pdf',
        icon: <FileText className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => external(resumeUrl),
      });
    if (github)
      list.push({
        id: 'a-gh',
        group: 'Actions',
        label: 'GitHub',
        hint: github.replace(/^https?:\/\//, ''),
        keywords: 'code repositories',
        icon: <Github className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => external(github),
      });
    if (linkedin)
      list.push({
        id: 'a-li',
        group: 'Actions',
        label: 'LinkedIn',
        keywords: 'profile',
        icon: <Linkedin className={icon} strokeWidth={1.75} aria-hidden />,
        run: () => external(linkedin),
      });
    list.push({
      id: 'a-theme',
      group: 'Actions',
      label: dark ? 'Switch to day map' : 'Switch to night map',
      keywords: 'theme dark light mode',
      icon: dark ? (
        <Sun className={icon} strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon className={icon} strokeWidth={1.75} aria-hidden />
      ),
      run: () => {
        setThemeTo(dark ? 'light' : 'dark');
        setDark(!dark);
      },
    });
    return list;
    // go/external close over router state that does not change between renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, email, github, linkedin, resumeUrl, assistantEnabled, copied, dark, onHome]);

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter((i) => `${i.label} ${i.hint ?? ''} ${i.keywords ?? ''} ${i.group}`.toLowerCase().includes(q))
    : items;
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((current + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((current - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[current]?.run();
    }
  };

  const activeId = results[current]?.id;
  useEffect(() => {
    if (dialog.current?.open) document.getElementById(`cmd-${activeId}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  let lastGroup = '';

  return (
    <dialog
      ref={dialog}
      aria-label="Search and actions"
      onClick={(e) => e.target === dialog.current && close()}
      className="palette m-0 mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] max-w-none rounded-[14px] bg-paper-raised p-0 text-ink shadow-[0_24px_80px_-24px_rgb(0_0_0/0.45)] ring-1 ring-rule backdrop:bg-ink/25"
    >
      <div className="flex items-center gap-3 border-b border-rule px-4">
        <Search className="h-[1.1rem] w-[1.1rem] shrink-0 text-ink-2" strokeWidth={1.75} aria-hidden />
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          placeholder="Search projects, sections and actions"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmd-list"
          aria-activedescendant={results[current] ? `cmd-${results[current].id}` : undefined}
          className="h-14 flex-1 bg-transparent text-base text-ink placeholder:text-ink-3 focus:outline-none"
        />
        <kbd className="rounded-md bg-ink/[0.06] px-1.5 py-0.5 text-[0.75rem] text-ink-2">Esc</kbd>
      </div>

      <ul id="cmd-list" role="listbox" data-lenis-prevent className="max-h-[min(26rem,60vh)] overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-3 py-10 text-center text-[0.9375rem] text-ink-2">
            Nothing matches &ldquo;{query}&rdquo;. Try a project name or a tool.
          </li>
        )}
        {results.map((item, i) => {
          const heading = item.group !== lastGroup ? item.group : null;
          lastGroup = item.group;
          return (
            <li key={item.id} role="presentation">
              {heading && (
                <div className="px-3 pb-1.5 pt-3 text-[0.8125rem] font-medium text-ink-3" role="presentation">
                  {heading}
                </div>
              )}
              <div
                id={`cmd-${item.id}`}
                role="option"
                aria-selected={i === current}
                onMouseMove={() => setActive(i)}
                onClick={() => item.run()}
                className={`flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 ${
                  i === current ? 'bg-ink/[0.06]' : ''
                }`}
              >
                <span className="grid w-6 place-items-center">{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-medium">{item.label}</span>
                  {item.hint && <span className="block truncate text-[0.8125rem] text-ink-2">{item.hint}</span>}
                </span>
                {item.id.startsWith('a-gh') || item.id.startsWith('a-li') || item.id.startsWith('a-cv') ? (
                  <ArrowUpRight className="h-4 w-4 text-ink-3" strokeWidth={1.75} aria-hidden />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </dialog>
  );
}
