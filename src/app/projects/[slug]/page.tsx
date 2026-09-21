import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Project, type IProject } from '@/models/Project';
import { Settings } from '@/models/Settings';
import { fallbackProjects, fallbackSettings } from '@/lib/fallbackData';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CaseStudyRenderer } from '@/components/projects/CaseStudyRenderer';
import { ProcessTimeline } from '@/components/projects/ProcessTimeline';
import { AssistantOrb } from '@/components/ai/AssistantOrb';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<{
  project: IProject | null;
  prevProject: { slug: string; title: string } | null;
  nextProject: { slug: string; title: string } | null;
}> {
  try {
    await connectDB();
    const doc = await Project.findOne({ slug }).lean();
    if (doc && doc.status === 'published') {
      const allProjects = await Project.find({ status: 'published' })
        .sort({ order: 1 })
        .select('slug title')
        .lean();

      const currentIndex = allProjects.findIndex((p) => p.slug === slug);
      const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
      const next =
        currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

      return {
        project: JSON.parse(JSON.stringify(doc)),
        prevProject: prev ? { slug: prev.slug, title: prev.title } : null,
        nextProject: next ? { slug: next.slug, title: next.title } : null,
      };
    }
  } catch (error) {
    console.warn('DB fetch in project page failed, searching fallbacks:', error);
  }

  // Fallback search
  const fallback = fallbackProjects.find((p) => p.slug === slug);
  if (fallback) {
    const currentIndex = fallbackProjects.findIndex((p) => p.slug === slug);
    const prev = currentIndex > 0 ? fallbackProjects[currentIndex - 1] : null;
    const next =
      currentIndex < fallbackProjects.length - 1 ? fallbackProjects[currentIndex + 1] : null;

    return {
      project: fallback as unknown as IProject,
      prevProject: prev ? { slug: prev.slug, title: prev.title } : null,
      nextProject: next ? { slug: next.slug, title: next.title } : null,
    };
  }

  return { project: null, prevProject: null, nextProject: null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await getProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found // Telemetry Error 404',
    };
  }

  return {
    title: `${project.title} // Systems Architecture Case Study`,
    description: project.summary,
    openGraph: {
      title: `${project.title} // Case Study`,
      description: project.summary,
      images: project.thumbnailUrl ? [project.thumbnailUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const { project, prevProject, nextProject } = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-[100dvh] bg-substrate text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-telemetry-border pb-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-telemetry-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO COMPLETE INVENTORY</span>
          </Link>

          <span className="telemetry-tag text-signal">
            [ DEPLOYMENT ID: {project.slug.toUpperCase()} ]
          </span>
        </div>

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {project.featured && (
              <span className="telemetry-tag bg-signal/20 text-signal border border-signal/40 px-2 py-0.5 font-bold">
                FEATURED ARCHITECTURE
              </span>
            )}
            <span className="telemetry-tag bg-substrate-surface border border-telemetry-border px-2 py-0.5 text-telemetry-muted">
              {project.status.toUpperCase()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg font-mono text-telemetry-muted max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-telemetry-border/60 text-xs font-mono">
            <div>
              <div className="text-telemetry-muted uppercase text-[10px] flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-signal" />
                ROLE
              </div>
              <div className="text-white font-bold mt-1 uppercase">
                {project.role || 'FULL-STACK LEAD'}
              </div>
            </div>

            <div>
              <div className="text-telemetry-muted uppercase text-[10px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-signal" />
                YEAR
              </div>
              <div className="text-white font-bold mt-1">
                {project.year || '2025'}
              </div>
            </div>

            <div>
              <div className="text-telemetry-muted uppercase text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-signal" />
                TIMELINE
              </div>
              <div className="text-white font-bold mt-1">
                {project.timeline || '8 WEEKS'}
              </div>
            </div>

            <div>
              <div className="text-telemetry-muted uppercase text-[10px]">
                ACTIONS
              </div>
              <div className="flex items-center gap-3 mt-1">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal hover:underline flex items-center gap-1 font-bold"
                  >
                    LIVE <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {project.links?.repository && (
                  <a
                    href={project.links.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-telemetry-muted hover:text-white flex items-center gap-1"
                  >
                    CODE <Github className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack Ribbon */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="border border-telemetry-border bg-substrate-surface px-2.5 py-1 text-xs font-mono text-telemetry-muted uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hero Visual Asset */}
        {project.thumbnailUrl && (
          <div className="relative aspect-video w-full border border-telemetry-border bg-substrate-surface overflow-hidden">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1200px"
              unoptimized={project.thumbnailUrl.startsWith('data:')}
            />
          </div>
        )}

        {/* Quantitative Metrics Highlight */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.metrics.map((metric, i) => (
              <div
                key={i}
                className="border border-telemetry-border bg-substrate-surface p-6 font-mono"
              >
                <div className="text-[10px] text-telemetry-muted uppercase">
                  {metric.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Execution Process Steps */}
        {project.processSteps && project.processSteps.length > 0 && (
          <ProcessTimeline steps={project.processSteps} />
        )}

        {/* Case Study Modular Content Blocks */}
        <div className="pt-6">
          <CaseStudyRenderer blocks={project.caseStudyBlocks || []} />
        </div>

        {/* Previous / Next Project Navigation Bar */}
        <div className="border-t border-telemetry-border pt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="border border-telemetry-border bg-substrate-surface p-5 hover:border-signal transition-colors group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-telemetry-muted flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5 text-signal" /> PREVIOUS ARCHITECTURE
                </span>
                <div className="font-mono text-xs uppercase font-bold text-white group-hover:text-signal truncate">
                  {prevProject.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="border border-telemetry-border bg-substrate-surface p-5 hover:border-signal transition-colors group flex items-center justify-between text-right"
            >
              <div className="space-y-1 w-full">
                <span className="text-[10px] font-mono text-telemetry-muted flex items-center justify-end gap-1">
                  NEXT ARCHITECTURE <ChevronRight className="w-3.5 h-3.5 text-signal" />
                </span>
                <div className="font-mono text-xs uppercase font-bold text-white group-hover:text-signal truncate">
                  {nextProject.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>

      <AssistantOrb />
      <Footer settings={fallbackSettings} />
    </div>
  );
}
