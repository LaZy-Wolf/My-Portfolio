'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { IProject } from '@/models/Project';
import {
  Search,
  FolderKanban,
  Compass,
  Link as LinkIcon,
  Lock,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: IProject[];
}

export function CommandPalette({
  isOpen,
  onClose,
  projects = [],
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    if (path.startsWith('#')) {
      const el = document.querySelector(path);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      router.push(path);
    }
  };

  const lowerQuery = query.toLowerCase().trim();

  // Filtered Navigation items
  const navigationItems = [
    { label: 'Featured Work & Projects', path: '#projects', hint: 'Jump to project showcase' },
    { label: 'Manifesto & About Operator', path: '#about', hint: 'Philosophy & bio' },
    { label: 'Technical Arsenal & Stack', path: '#skills', hint: 'Skills & technologies' },
    { label: 'Initiate Transmission / Contact', path: '#contact', hint: 'Direct email dispatch' },
    { label: 'Admin Control Plane', path: '/admin', hint: 'Restricted management gate' },
  ].filter((item) =>
    item.label.toLowerCase().includes(lowerQuery) || item.hint.toLowerCase().includes(lowerQuery)
  );

  // Filtered Projects
  const filteredProjects = projects
    .filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.summary.toLowerCase().includes(lowerQuery) ||
        p.techStack?.some((t) => t.toLowerCase().includes(lowerQuery))
    )
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-12 overflow-y-auto">
      <div
        className="w-full max-w-2xl border border-telemetry-border bg-substrate-surface shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-telemetry-border px-4 py-3 bg-substrate">
          <Search className="w-4 h-4 text-signal shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="TYPE COMMAND OR QUERY (e.g. Chronos, Docker, About, Admin)..."
            className="flex-1 bg-transparent text-sm font-mono text-white placeholder:text-telemetry-faint outline-none uppercase"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-telemetry-muted hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono text-telemetry-faint border border-telemetry-border px-1.5 py-0.5">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div className="space-y-2">
              <span className="telemetry-tag text-telemetry-muted block px-2">
                [ PROJECTS & CASE STUDIES ]
              </span>
              <div className="space-y-1">
                {filteredProjects.map((project) => (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => navigateTo(`/projects/${project.slug}`)}
                    className="w-full p-2.5 text-left border border-transparent hover:border-signal hover:bg-substrate flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban className="w-4 h-4 text-signal shrink-0" />
                      <div className="truncate">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-signal uppercase">
                          {project.title}
                        </span>
                        <span className="text-[11px] font-mono text-telemetry-muted ml-2 truncate">
                          {project.summary}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-telemetry-faint group-hover:text-signal shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {navigationItems.length > 0 && (
            <div className="space-y-2">
              <span className="telemetry-tag text-telemetry-muted block px-2">
                [ NAVIGATION DESTINATIONS ]
              </span>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigateTo(item.path)}
                    className="w-full p-2.5 text-left border border-transparent hover:border-signal hover:bg-substrate flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-telemetry-muted group-hover:text-white shrink-0" />
                      <div>
                        <span className="font-mono text-xs text-white uppercase group-hover:text-signal">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-mono text-telemetry-muted ml-2">
                          &bull; {item.hint}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-telemetry-faint group-hover:text-signal shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && navigationItems.length === 0 && (
            <div className="py-12 text-center font-mono text-xs text-telemetry-muted">
              [ NO MATCHING TELEMETRY RECORDS FOUND FOR &ldquo;{query}&rdquo; ]
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="border-t border-telemetry-border px-4 py-2 bg-substrate flex items-center justify-between text-[10px] font-mono text-telemetry-muted">
          <span>NAVIGATION PROTOCOL // FAST INDEX</span>
          <span>PRESS ESC TO DISMISS</span>
        </div>
      </div>
    </div>
  );
}
