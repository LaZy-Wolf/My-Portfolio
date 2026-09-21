import Image from 'next/image';
import Link from 'next/link';
import type { IProject } from '@/models/Project';
import { ArrowUpRight, Star, Terminal } from 'lucide-react';

interface FeaturedProjectsProps {
  projects: IProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured);
  const displayList = featured.length > 0 ? featured : projects.slice(0, 2);

  if (displayList.length === 0) return null;

  return (
    <section className="border-b border-telemetry-border px-4 sm:px-8 py-16 sm:py-20 max-w-7xl mx-auto w-full space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-telemetry-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-signal text-xs font-mono mb-1">
            <Star className="w-3.5 h-3.5 fill-signal" />
            <span className="telemetry-tag text-signal font-bold">
              [ SECTOR 02 // PINNACLE WORK ]
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Featured Architectures
          </h2>
        </div>
        <p className="text-xs font-mono text-telemetry-muted max-w-sm">
          Deep-dive case studies detailing high-load infrastructure, custom telemetry interfaces, and design engineering.
        </p>
      </div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {displayList.map((project, idx) => (
          <Link
            key={project._id || project.slug}
            href={`/projects/${project.slug}`}
            className="group border border-telemetry-border bg-substrate-surface hover:border-signal transition-all flex flex-col justify-between block relative overflow-hidden"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-video w-full border-b border-telemetry-border overflow-hidden bg-substrate">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={project.thumbnailUrl.startsWith('data:')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-telemetry-faint">
                  NO ASSET REGISTERED
                </div>
              )}

              {/* Status Pill on Asset */}
              <div className="absolute top-3 left-3 bg-substrate/90 border border-telemetry-border px-2.5 py-1 text-[10px] font-mono uppercase text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                PRJ // 0{idx + 1}
              </div>
            </div>

            {/* Content & Metrics */}
            <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-telemetry-muted">
                  <span className="uppercase">{project.role || 'FULL-STACK'}</span>
                  <span>{project.year || '2025'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-signal transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </h3>

                <p className="text-xs sm:text-sm font-mono text-telemetry-muted leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Quantitative Metrics Highlight */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="pt-4 border-t border-telemetry-border/40 grid grid-cols-2 gap-4">
                  {project.metrics.slice(0, 2).map((m, i) => (
                    <div key={i} className="font-mono">
                      <div className="text-[10px] text-telemetry-muted uppercase">
                        {m.label}
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech Stack Chips */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="pt-3 border-t border-telemetry-border/30 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-telemetry-border bg-substrate px-2 py-0.5 text-[10px] font-mono text-telemetry-muted uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
