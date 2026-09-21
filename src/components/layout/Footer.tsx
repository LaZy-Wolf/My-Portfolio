'use client';

import Link from 'next/link';
import { Terminal, Lock, ArrowUp } from 'lucide-react';
import type { ISettings } from '@/models/Settings';

interface FooterProps {
  settings: ISettings;
  name?: string;
}

export function Footer({ settings, name = 'Alex Vance' }: FooterProps) {
  const footerText = settings?.footer?.text || 'TELEMETRY ENGINE ACTIVE // ZERO DOWNTIME';
  const showAdminLink = settings?.footer?.showAdminLink ?? true;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-telemetry-border bg-substrate-surface/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-telemetry-border/40 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-substrate border border-telemetry-border flex items-center justify-center">
              <Terminal className="w-4 h-4 text-signal" />
            </div>
            <div>
              <div className="font-mono text-xs font-black uppercase text-white">
                {name} // PORTFOLIO
              </div>
              <div className="text-[10px] font-mono text-telemetry-muted">
                {footerText}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="brutalist-btn text-xs py-2 px-3 self-start sm:self-auto flex items-center gap-2"
            title="Return to top of page"
          >
            <ArrowUp className="w-3.5 h-3.5 text-signal" />
            TOP
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-telemetry-muted">
          <div>
            &copy; {new Date().getFullYear()} {name}. BUILT WITH NEXT.JS 15 & MONGODB ATLAS M0.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-terminal flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
              FREE-TIER ARCHITECTURE
            </span>

            {showAdminLink && (
              <Link
                href="/admin"
                className="text-telemetry-faint hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                title="Administrator Telemetry Portal"
              >
                <Lock className="w-3 h-3" />
                <span>ADMIN</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
