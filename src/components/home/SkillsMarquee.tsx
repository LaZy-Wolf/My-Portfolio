import type { ISkill } from '@/models/Skill';
import { Wrench } from 'lucide-react';

interface SkillsMarqueeProps {
  skills: ISkill[];
}

export function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  if (skills.length === 0) return null;

  // Flatten items for the marquee ribbon
  const allItems = skills.flatMap((s) => s.items);

  return (
    <section id="skills" className="border-b border-telemetry-border py-16 sm:py-20 space-y-12 overflow-hidden">
      {/* Marquee Ribbon Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 border-b border-telemetry-border/40 pb-4 flex items-end justify-between">
        <div>
          <span className="telemetry-tag text-signal font-bold">
            [ SECTOR 05 // TAXONOMY & TOOLING ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Technical Arsenal
          </h2>
        </div>
        <span className="text-xs font-mono text-telemetry-muted hidden sm:inline">
          AUTONOMIC TICKER // PAUSE ON HOVER
        </span>
      </div>

      {/* Infinite Marquee Ticker */}
      <div className="border-y border-telemetry-border bg-substrate-surface/50 py-3 relative flex overflow-x-hidden group">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {allItems.concat(allItems).map((item, i) => (
            <div
              key={i}
              className="font-mono text-xs uppercase font-bold tracking-widest text-telemetry-muted flex items-center gap-4 shrink-0"
            >
              <span className="text-white hover:text-signal transition-colors">{item}</span>
              <span className="text-signal">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized Skills Blueprint Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((category, idx) => (
          <div
            key={category._id || idx}
            className="border border-telemetry-border bg-substrate-surface p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-3">
              <span className="text-xs font-mono font-bold text-signal">
                0{idx + 1}
              </span>
              <h3 className="font-mono text-xs uppercase font-bold text-white tracking-wide truncate">
                {category.category}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {category.items.map((item, itemIdx) => (
                <span
                  key={itemIdx}
                  className="border border-telemetry-border bg-substrate px-2.5 py-1 text-xs font-mono text-telemetry-muted hover:text-white hover:border-signal transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
