import Image from 'next/image';
import type { IProfile } from '@/models/Profile';
import { Terminal, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface AboutSectionProps {
  profile: IProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="border-b border-telemetry-border px-4 sm:px-8 py-16 sm:py-20 max-w-7xl mx-auto w-full space-y-12">
      {/* Section Header */}
      <div className="border-b border-telemetry-border/40 pb-4">
        <span className="telemetry-tag text-signal font-bold">
          [ SECTOR 04 // IDENTITY & PHILOSOPHY ]
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
          Architectural Manifesto
        </h2>
      </div>

      {/* Blueprint Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar & Meta Data (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {profile.avatarUrl && (
            <div className="relative aspect-square w-full border border-telemetry-border bg-substrate-surface overflow-hidden">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
                unoptimized={profile.avatarUrl.startsWith('data:')}
              />
              <div className="absolute bottom-2 left-2 bg-substrate/90 border border-telemetry-border px-2 py-0.5 text-[10px] font-mono text-white">
                OPERATOR // {profile.name.toUpperCase()}
              </div>
            </div>
          )}

          <div className="border border-telemetry-border bg-substrate-surface p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-2">
              <span className="text-telemetry-muted">LOCATION:</span>
              <span className="text-white font-bold">{profile.location || 'GLOBAL // REMOTE'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-2">
              <span className="text-telemetry-muted">AVAILABILITY:</span>
              <span className="text-terminal font-bold">{profile.availability}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-telemetry-muted">PRIMARY EMAIL:</span>
              <a
                href={`mailto:${profile.email}`}
                className="text-signal hover:underline truncate max-w-[180px]"
              >
                {profile.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Narrative & Manifesto (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="border border-telemetry-border bg-substrate-surface p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-signal">
              <Terminal className="w-4 h-4" />
              <span>THE LONG FORM DISCIPLINE</span>
            </div>
            <p className="text-sm sm:text-base font-mono text-telemetry-muted leading-relaxed whitespace-pre-line">
              {profile.longBio || profile.shortBio}
            </p>
          </div>

          {profile.designPhilosophy && (
            <div className="border-l-2 border-signal bg-substrate-surface/60 p-6 space-y-3">
              <span className="telemetry-tag text-signal">
                [ MANIFESTO // CORE PHILOSOPHY ]
              </span>
              <blockquote className="text-sm sm:text-base font-mono text-white italic leading-relaxed">
                &ldquo;{profile.designPhilosophy}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Social Network Coordinates */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(profile.socials || {}).map(([key, url]) => {
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-telemetry-border bg-substrate-surface p-3 hover:border-signal transition-colors flex items-center justify-between group"
                >
                  <span className="font-mono text-xs uppercase text-telemetry-muted group-hover:text-white transition-colors">
                    {key}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-telemetry-faint group-hover:text-signal transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
