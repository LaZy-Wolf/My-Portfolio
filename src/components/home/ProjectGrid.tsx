import Image from 'next/image';
import Link from 'next/link';
import type { IProject } from '@/models/Project';
import { ArrowUpRight } from 'lucide-react';

interface ProjectGridProps {
  projects: IProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="border-b border-telemetry-border px-4 sm:px-8 py-16 sm:py-20 max-w-7xl mx-auto w-full space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-telemetry-border/40 pb-4">
        <div>
          <span className="telemetry-tag text-signal font-bold">
            [ SECTOR 03 // COMPLETE INVENTORY ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            All Projects & Deployments
          </h2>
        </div>
        <span className="text-xs font-mono text-telemetry-muted">
          TOTAL REGISTERED: {projects.length} SYSTEMS
        </span>
      </div>

      {/* Blueprint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <Link
            key={project._id || project.slug}
            href={`/projects/${project.slug}`}
            className="group border border-telemetry-border bg-substrate-surface hover:border-signal transition-all flex flex-col justify-between block relative"
          >
            {/* Asset Thumbnail */}
            <div className="relative aspect-[16/10] w-full border-b border-telemetry-border overflow-hidden bg-substrate">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={project.thumbnailUrl.startsWith('data:')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-telemetry-faint">
                  NO PREVIEW
                </div>
              )}

              <div className="absolute top-2 left-2 bg-substrate/85 border border-telemetry-border px-2 py-0.5 text-[9px] font-mono text-white">
                0{idx + 1}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-telemetry-muted">
                  <span className="uppercase">{project.role || 'ENGINEERING'}</span>
                  <span>{project.year || '2025'}</span>
                </div>

                <h3 className="text-base font-black uppercase text-white group-hover:text-signal transition-colors flex items-center justify-between">
                  <span className="truncate">{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>

                <p className="text-xs font-mono text-telemetry-muted line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Stack Pills */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="pt-3 border-t border-telemetry-border/30 flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="border border-telemetry-border bg-substrate px-1.5 py-0.5 text-[9px] font-mono text-telemetry-muted uppercase"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-[9px] font-mono text-telemetry-faint self-center">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
