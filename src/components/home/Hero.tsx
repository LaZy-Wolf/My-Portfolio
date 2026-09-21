'use client';

import { ArrowDown, Mail, Terminal, Activity } from 'lucide-react';
import type { IProfile } from '@/models/Profile';
import type { ISettings } from '@/models/Settings';

interface HeroProps {
  profile: IProfile;
  settings: ISettings;
}

export function Hero({ profile, settings }: HeroProps) {
  const headline = settings?.hero?.headline || profile.tagline || 'DESIGNING HIGH-CONCURRENCY ARCHITECTURES THAT SCALE.';
  const subtext = settings?.hero?.subtext || profile.shortBio || 'Full-stack engineer & systems designer building expressive, resilient digital products with precision telemetry.';
  const primaryCta = settings?.hero?.primaryCtaLabel || 'View Work';
  const secondaryCta = settings?.hero?.secondaryCtaLabel || 'Contact';
  const availability = profile.availability || 'AVAILABLE FOR HIRE // CONTRACT';

  return (
    <section className="relative min-h-[90dvh] flex flex-col justify-between border-b border-telemetry-border px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto w-full">
      {/* Top telemetry HUD tag row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-telemetry-border/40 pb-6">
        <div className="flex items-center gap-3">
          <span className="telemetry-tag text-signal flex items-center gap-1.5 font-bold">
            <Activity className="w-3.5 h-3.5" />
            [ PROTOCOL: TEL-01 // PRODUCTION ]
          </span>
          <span className="text-telemetry-faint">/</span>
          <span className="text-telemetry-muted font-mono text-xs">
            {profile.location || 'GLOBAL REMOTE // UTC+1'}
          </span>
        </div>

        {settings?.hero?.showAvailabilityBadge && (
          <div className="inline-flex items-center gap-2 border border-terminal/40 bg-terminal/10 px-3 py-1 text-terminal font-mono text-[11px] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-terminal animate-ping" />
            {availability}
          </div>
        )}
      </div>

      {/* Main Structural Macro-Typography */}
      <div className="my-auto py-8 sm:py-12 space-y-6">
        <div className="text-[11px] font-mono text-telemetry-muted uppercase tracking-[0.2em] flex items-center gap-2">
          <Terminal className="w-3 h-3 text-signal" />
          SYSTEMS ARCHITECTURE & INTERACTION DESIGN
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white max-w-5xl">
          {headline}
        </h1>

        <p className="text-sm sm:text-base font-mono text-telemetry-muted max-w-2xl leading-relaxed">
          {subtext}
        </p>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="brutalist-btn brutalist-btn-accent px-6 py-3.5 text-xs font-mono flex items-center gap-2"
          >
            <span>{primaryCta.toUpperCase()}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#contact"
            className="brutalist-btn px-6 py-3.5 text-xs font-mono flex items-center gap-2"
          >
            <Mail className="w-4 h-4 text-signal" />
            <span>{secondaryCta.toUpperCase()}</span>
          </a>
        </div>
      </div>

      {/* Bottom Telemetry Matrix */}
      <div className="pt-6 border-t border-telemetry-border/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <div className="text-[10px] text-telemetry-muted uppercase tracking-wider">
            SPECIFICATION
          </div>
          <div className="text-white font-bold mt-0.5">FULL-STACK // NEXT 15</div>
        </div>
        <div>
          <div className="text-[10px] text-telemetry-muted uppercase tracking-wider">
            DATA LAYER
          </div>
          <div className="text-white font-bold mt-0.5">MONGODB ATLAS M0</div>
        </div>
        <div>
          <div className="text-[10px] text-telemetry-muted uppercase tracking-wider">
            INTELLIGENCE
          </div>
          <div className="text-white font-bold mt-0.5">GROQ / LLAMA 3.3</div>
        </div>
        <div>
          <div className="text-[10px] text-telemetry-muted uppercase tracking-wider">
            LAYOUT SHIFT
          </div>
          <div className="text-terminal font-bold mt-0.5">0.00 CLS // OPTIMIZED</div>
        </div>
      </div>
    </section>
  );
}
