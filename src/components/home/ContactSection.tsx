import { Mail, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';
import type { IProfile } from '@/models/Profile';

interface ContactSectionProps {
  profile: IProfile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section id="contact" className="border-b border-telemetry-border px-4 sm:px-8 py-16 sm:py-24 max-w-7xl mx-auto w-full space-y-12">
      {/* Section Header */}
      <div className="border-b border-telemetry-border/40 pb-4">
        <span className="telemetry-tag text-signal font-bold">
          [ SECTOR 06 // TRANSMISSION GATEWAY ]
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
          Initiate Transmission
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Primary Contact Action Box (8 cols) */}
        <div className="lg:col-span-8 border border-telemetry-border bg-substrate-surface p-8 sm:p-12 flex flex-col justify-between space-y-8 relative">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-terminal/40 bg-terminal/10 px-3 py-1 text-terminal font-mono text-xs uppercase">
              <span className="w-2 h-2 rounded-full bg-terminal animate-ping" />
              {profile.availability || 'OPEN TO ARCHITECTURAL CONSULTING & CONTRACT'}
            </div>

            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Let&rsquo;s Engineer Something Formidable.
            </h3>

            <p className="text-sm font-mono text-telemetry-muted max-w-xl leading-relaxed">
              Available for technical leadership, high-concurrency systems design, industrial design systems, and full-stack web products. Direct email is monitored round the clock.
            </p>
          </div>

          <div className="pt-6 border-t border-telemetry-border flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="brutalist-btn brutalist-btn-accent px-8 py-4 text-xs font-mono flex items-center gap-3 font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>TRANSMIT DIRECT DISPATCH: {profile.email.toUpperCase()}</span>
            </a>
          </div>
        </div>

        {/* Telemetry Metrics & Socials (4 cols) */}
        <div className="lg:col-span-4 border border-telemetry-border bg-substrate-surface p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-3">
              <span className="text-telemetry-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-signal" />
                RESPONSIVENESS:
              </span>
              <span className="text-white font-bold">&lt; 12 HOURS</span>
            </div>

            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-3">
              <span className="text-telemetry-muted flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-terminal" />
                ENCRYPTION:
              </span>
              <span className="text-terminal font-bold">TLS 1.3 / STRICT</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-telemetry-muted">LOCATION:</span>
              <span className="text-white">{profile.location || 'ZURICH // REMOTE'}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2 pt-4 border-t border-telemetry-border/40">
            <span className="telemetry-tag text-telemetry-muted block mb-1">
              NETWORK CHANNELS:
            </span>
            {Object.entries(profile.socials || {}).map(([key, url]) => {
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-1.5 px-2 border border-telemetry-border hover:border-signal bg-substrate font-mono text-xs uppercase text-telemetry-muted hover:text-white transition-colors group"
                >
                  <span>{key}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-signal" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
