import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Project, type IProject } from '@/models/Project';
import { Profile, type IProfile } from '@/models/Profile';
import { Settings, type ISettings } from '@/models/Settings';
import { fallbackProfile, fallbackProjects, fallbackSettings } from '@/lib/fallbackData';
import { layoutLine, lineColorFor, lineVar } from '@/lib/lines';
import { SiteShell, container } from '@/components/site/SiteShell';
import { RideLine } from '@/components/site/RideLine';
import { RouteDiagram } from '@/components/site/RouteDiagram';
import { RouteBullet } from '@/components/site/RouteBullet';
import { FlapValue } from '@/components/site/FlapValue';
import { Note } from '@/components/site/Note';
import { CaseStudyRenderer, headingsOf } from '@/components/projects/CaseStudyRenderer';
import { CaseStudyRoute } from '@/components/projects/CaseStudyRoute';
import { TransitionLink } from '@/components/site/TransitionLink';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
  let projects: IProject[] = fallbackProjects;
  let profile: IProfile = fallbackProfile;
  let settings: ISettings = fallbackSettings;

  try {
    await connectDB();
    const [dbProjects, dbProfile, dbSettings] = await Promise.all([
      Project.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean(),
      Profile.findById('main').lean(),
      Settings.findById('main').lean(),
    ]);
    if (dbProjects?.length) projects = JSON.parse(JSON.stringify(dbProjects));
    if (dbProfile) profile = JSON.parse(JSON.stringify(dbProfile));
    if (dbSettings) settings = JSON.parse(JSON.stringify(dbSettings));
  } catch (err) {
    console.warn('Project page is using the bundled content; database unavailable:', err);
  }

  const index = projects.findIndex((p) => p.slug === slug);
  return {
    project: index === -1 ? null : projects[index],
    prev: index > 0 ? projects[index - 1] : null,
    next: index !== -1 && index < projects.length - 1 ? projects[index + 1] : null,
    projects,
    profile,
    settings,
  };
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const docs = await Project.find({ status: 'published' }).select('slug').lean();
    if (docs.length) return docs.map((d) => ({ slug: d.slug }));
  } catch {
    /* build without a database: use the bundled content */
  }
  return fallbackProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { project, profile } = await getData(slug);
  if (!project) return { title: 'Project not found' };

  const title = `${project.title}, a case study by ${profile.name}`;
  return {
    title,
    description: project.summary,
    openGraph: {
      title,
      description: project.summary,
      ...(project.thumbnailUrl ? { images: [project.thumbnailUrl] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { project, prev, next, projects, profile, settings } = await getData(slug);
  if (!project) notFound();

  const color = lineColorFor(project.slug, projects);
  const headings = headingsOf(project.caseStudyBlocks);
  const facts = [
    { label: 'Year', value: project.year },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
  ].filter((f) => f.value);

  return (
    <SiteShell profile={profile} settings={settings} projects={projects}>
      <article style={lineVar(color)}>
        <header className={`${container} pb-10 pt-8 md:pt-12`}>
          <TransitionLink
            href="/#work"
            className="-ml-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[0.9375rem] text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
            All work
          </TransitionLink>

          <div className="mt-8 flex items-center gap-4 md:mt-12">
            <RouteBullet title={project.title} color={color} size="lg" vtName={`vt-bullet-${project.slug}`} />
            <h1
              className="text-[clamp(2.75rem,1.5rem+4.2vw,5rem)] font-bold leading-[0.98] tracking-[-0.038em]"
              style={{ fontStretch: '94%', viewTransitionName: `vt-title-${project.slug}` }}
            >
              {project.title}
            </h1>
          </div>
          <p className="mt-6 max-w-[44rem] text-[1.1875rem] leading-[1.55] text-ink-2 md:text-[1.3125rem]">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-x-12 gap-y-6">
            {facts.length > 0 && (
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[0.8125rem] text-ink-3">{f.label}</dt>
                    <dd className="mt-0.5 text-[0.9375rem] font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="flex flex-wrap gap-3">
              {project.links?.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn-ink">
                  Live demo
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </a>
              )}
              {project.links?.repository && (
                <a href={project.links.repository} target="_blank" rel="noopener noreferrer" className="btn-quiet">
                  Code on GitHub
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                </a>
              )}
            </div>
          </div>
        </header>

        {project.processSteps?.length > 1 && (
          <div className={`${container} pb-6 pt-8`}>
            {layoutLine(project.processSteps).timed ? (
              <RideLine project={project} color={color} />
            ) : (
              <RouteDiagram steps={project.processSteps} color={color} />
            )}
            {project.note && (
              <div className="mt-1 flex justify-end pr-2">
                <Note arrow="up-left">{project.note}</Note>
              </div>
            )}
          </div>
        )}

        {project.metrics?.length > 0 && (
          <div className={container}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-rule py-8 md:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="text-[0.8125rem] leading-snug text-ink-2">{m.label}</dt>
                  <dd className="num mt-1.5 text-[1.5rem] font-semibold tracking-[-0.015em]">
                    <FlapValue value={m.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className={`${container} grid gap-x-12 py-16 md:py-24 lg:grid-cols-12`}>
          <aside className="hidden lg:col-span-3 lg:block">
            <CaseStudyRoute headings={headings} />
          </aside>
          <div className="min-w-0 lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-5">
            <CaseStudyRenderer blocks={project.caseStudyBlocks} />

            {project.techStack?.length > 0 && (
              <div className="mt-16 border-t border-rule pt-8">
                <h2 className="text-[0.9375rem] font-semibold">Built with</h2>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-2">{project.techStack.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        {(prev || next) && (
          <nav aria-label="More projects" className="border-t border-rule">
            <div className={`${container} grid gap-4 py-10 sm:grid-cols-2`}>
              {prev ? <Neighbour project={prev} projects={projects} dir="prev" /> : <span />}
              {next && <Neighbour project={next} projects={projects} dir="next" />}
            </div>
          </nav>
        )}
      </article>
    </SiteShell>
  );
}

function Neighbour({ project, projects, dir }: { project: IProject; projects: IProject[]; dir: 'prev' | 'next' }) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      data-vt-scope
      className={`group flex items-center gap-4 rounded-[14px] p-4 transition-colors hover:bg-ink/[0.04] ${
        dir === 'next' ? 'sm:flex-row-reverse sm:text-right' : ''
      }`}
    >
      {dir === 'prev' ? (
        <ArrowLeft className="h-5 w-5 shrink-0 text-ink-3 transition-transform duration-300 ease-out group-hover:-translate-x-1" strokeWidth={2} aria-hidden />
      ) : (
        <ArrowRight className="h-5 w-5 shrink-0 text-ink-3 transition-transform duration-300 ease-out group-hover:translate-x-1" strokeWidth={2} aria-hidden />
      )}
      <RouteBullet title={project.title} color={lineColorFor(project.slug, projects)} size="md" vtName />
      <span className="min-w-0">
        <span className="block text-[0.8125rem] text-ink-3">{dir === 'prev' ? 'Previous' : 'Next'}</span>
        <span data-vt-title className="block truncate text-[1.125rem] font-semibold">
          {project.title}
        </span>
      </span>
    </TransitionLink>
  );
}
