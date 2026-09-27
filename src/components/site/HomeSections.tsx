import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, BrainCircuit, Briefcase, ChartColumn, Database, FileText, Mail, MapPin, RefreshCw, Wrench } from 'lucide-react';
import type { IProfile, IWorkProduct } from '@/models/Profile';
import type { IProject } from '@/models/Project';
import type { ISkill } from '@/models/Skill';
import type { ISettings } from '@/models/Settings';
import { layoutLine, lineColorFor, lineVar, stopNames } from '@/lib/lines';
import { brandIcon } from '@/lib/brandIcons';
import { container } from './SiteShell';
import { ProjectMap, type MapLine } from './ProjectMap';
import { RideLine } from './RideLine';
import { RouteDiagram } from './RouteDiagram';
import { RouteBullet } from './RouteBullet';
import { CopyEmail } from './CopyEmail';
import { FlapValue } from './FlapValue';
import { TransitionLink } from './TransitionLink';
import { Note } from './Note';
import { Portrait } from './Portrait';

const h2 = 'text-[clamp(2rem,1.35rem+2.2vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.03em]';
const lead = 'mt-4 max-w-[40rem] text-[1.0625rem] leading-relaxed text-ink-2 md:text-[1.125rem]';

/* ------------------------------------------------------------------ Hero */

/** "AI systems, *measured* stop by stop." puts a pen stroke under the starred words. */
function underlined(text: string) {
  return text.split('*').map((part, i) =>
    i % 2 ? (
      <span key={i} className="scribble">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Languages every project shares say nothing on a chip; show the tools that make each one different.
const GENERIC = /^(python|typescript|javascript|react|next\.js.*)$/i;

export function Hero({ profile, settings, projects }: { profile: IProfile; settings: ISettings; projects: IProject[] }) {
  const featured = projects.filter((p) => p.featured);
  const lines: MapLine[] = featured.map((p) => ({
    slug: p.slug,
    title: p.title,
    tag: p.tags?.[0] || p.role,
    domain: p.tags?.[1],
    color: lineColorFor(p.slug, projects)!,
    chips: (p.techStack || []).filter((t) => !GENERIC.test(t)).slice(0, 2),
    stops: stopNames(p.processSteps),
  }));
  const available = settings.hero?.showAvailabilityBadge && profile.availability;
  const current = profile.experience?.find((e) => /present/i.test(e.period));
  const meta = 'flex items-center gap-3';
  const dot = 'grid w-4 shrink-0 place-items-center';

  return (
    <section id="top" aria-label="Introduction" className="scroll-mt-20 overflow-x-clip pt-8 md:pt-10">
      <div className={`${container} grid gap-x-12 gap-y-14 xl:grid-cols-12 xl:items-center`}>
        <div className="xl:col-span-5">
          <div className="flex items-center gap-5">
          {profile.avatarUrl && <Portrait src={profile.avatarUrl} name={profile.name} />}
          <ul className="space-y-2 text-[0.9375rem]">
            <li className={`${meta} text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-2`}>
              <span className={dot} aria-hidden>
                <span className="h-2 w-2 rounded-full bg-line-red" />
              </span>
              {profile.role}
            </li>
            {profile.location && (
              <li className={`${meta} text-ink-2`}>
                <span className={dot} aria-hidden>
                  <MapPin className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
                </span>
                {profile.location}
              </li>
            )}
            {current && (
              <li className={`${meta} text-ink-2`}>
                <span className={dot} aria-hidden>
                  <Briefcase className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
                </span>
                {/* Title only: the internship ends soon, and the company is named further down the page. */}
                <span>{current.role.replace(/\s+intern$/i, '')}</span>
              </li>
            )}
            {available && (
              <li className={meta}>
                <span className={dot} aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-line-green" />
                </span>
                {profile.availability}
              </li>
            )}
          </ul>
          </div>
          <h1 className="mt-9 text-[clamp(3rem,1.2rem+4.3vw,5.25rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            {underlined(settings.hero?.headline || profile.tagline)}
          </h1>
          <p className="mt-8 max-w-[34rem] text-[1.1875rem] leading-[1.45] text-ink-2 md:text-[1.3125rem]">
            {settings.hero?.subtext || profile.shortBio}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="btn-ink group h-12 px-6">
              {settings.hero?.primaryCtaLabel || 'Explore the systems'}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
            </a>
            <a href={`mailto:${profile.email}`} className="btn-quiet h-12 px-6">
              <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              {settings.hero?.secondaryCtaLabel || 'Email me'}
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet h-12 px-6">
                <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Résumé
              </a>
            )}
          </div>
        </div>

        {lines.length > 0 && (
          <div className="min-w-0 xl:col-span-7">
            <ProjectMap lines={lines} />
          </div>
        )}
      </div>

      <Numbers stats={settings.stats || []} quote={settings.hero?.quote} />
    </section>
  );
}

/** The numbers strip under the hero, with a handwritten line at the end. */
function Numbers({ stats, quote }: { stats: { value: string; label: string }[]; quote?: string }) {
  if (!stats.length && !quote) return null;
  return (
    <div className="mt-14 border-y border-rule md:mt-16">
      <div className={`${container} grid grid-cols-2 gap-x-8 gap-y-7 py-8 md:grid-cols-4 xl:grid-cols-12 xl:items-start`}>
        {stats.map((s) => (
          <div key={s.label} className="xl:col-span-2">
            <p className="num text-[2rem] font-bold leading-none tracking-[-0.03em]">{s.value}</p>
            <p className="mt-2 text-[0.9375rem] leading-snug text-ink-2">{s.label}</p>
          </div>
        ))}
        {quote && (
          <figure className="col-span-2 md:col-span-4 xl:col-span-4 xl:border-l xl:border-rule xl:py-2 xl:pl-10">
            <blockquote className="font-hand text-[1.3125rem] leading-snug text-ink-2 [rotate:-1.5deg]">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <svg className="ml-auto mr-6 mt-1 block text-ink-3" width="64" height="10" viewBox="0 0 64 10" aria-hidden>
              <path d="M2 6c10-4 22-5 34-3s18 3 26-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </figure>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Industry */

/** Products built in the current role. They belong to the employer, and the copy says so. */
export function Industry({ profile }: { profile: IProfile }) {
  const job = profile.experience?.find((e) => e.products?.length);
  if (!job) return null;
  const [first, ...rest] = job.products!;

  return (
    <section id="experience" aria-labelledby="industry-title" className="scroll-mt-20 border-t border-rule py-20 md:py-24">
      <div className={container}>
        <p className="flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-2">
          <span className="h-2 w-2 rounded-full bg-line-red" aria-hidden />
          {job.role}, {job.period.replace(' - ', ' to ')}
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <h2 id="industry-title" className={h2}>
            Shipped at {job.company}
          </h2>
          <Note arrow="down-left" className="pb-1">
            what I worked on as an intern
          </Note>
        </div>
        <p className={lead}>
          The products I worked on as an intern at{' '}
          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink">
              {job.company}
            </a>
          ) : (
            job.company
          )}
          . They are {job.company}&rsquo;s products; the links open
          their live sites.
        </p>

        <div className="mt-12 grid gap-x-10 gap-y-14 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          <WorkProduct product={first} wide />
          {rest.map((p) => (
            <WorkProduct key={p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkProduct({ product: p, wide = false }: { product: IWorkProduct; wide?: boolean }) {
  const shot = (
    <div className="shot">
      <div className="shot-bar" aria-hidden>
        <span />
        <span />
        <span />
        <span className="shot-url">{p.url ? p.url.replace(/^https?:\/\//, '') : 'localhost'}</span>
      </div>
      <Image
        src={p.image}
        alt={`${p.name} landing page`}
        width={1440}
        height={900}
        sizes={wide ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw'}
        className="block h-auto w-full"
      />
    </div>
  );

  return (
    <article className={wide ? 'grid gap-x-12 gap-y-8 md:col-span-2 lg:col-span-3 lg:grid-cols-12 lg:items-center' : ''}>
      <div className={wide ? 'lg:col-span-7' : ''}>
        {p.url ? (
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block" tabIndex={-1} aria-hidden>
            <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">{shot}</div>
          </a>
        ) : (
          shot
        )}
      </div>
      <div className={wide ? 'lg:col-span-5' : 'mt-6'}>
        <p className="text-[0.8125rem] text-ink-3">{p.kind}</p>
        <h3 className={`mt-1 font-bold tracking-[-0.025em] ${wide ? 'text-[2rem] leading-none' : 'text-[1.5rem] leading-tight'}`}>
          {p.name}
        </h3>
        <p className="mt-3 max-w-[46ch] text-[1rem] leading-relaxed text-ink-2">{p.summary}</p>
        {p.points.length > 0 && (
          <ul className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2">
            {p.points.map((pt) => (
              <li key={pt} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-[5px] before:w-[5px] before:rounded-full before:bg-ink-3">
                {pt}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-[0.9375rem]">
          {p.url ? (
            <ExternalLink href={p.url}>Visit {p.name}</ExternalLink>
          ) : (
            <span className="text-ink-3">{p.note || 'Not public right now.'}</span>
          )}
        </p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ How I build */

const STEP_ICONS = [Database, BrainCircuit, Wrench, ChartColumn, RefreshCw];

export function Approach({ settings, projects }: { settings: ISettings; projects: IProject[] }) {
  const a = settings.approach;
  if (!a?.steps?.length) return null;

  // The tools that turn up in the most projects, as they are written in each repo's stack.
  const counts = new Map<string, number>();
  projects.forEach((p) => new Set(p.techStack).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  const tools = [...counts.entries()]
    .sort((x, y) => y[1] - x[1] || Number(!!brandIcon(y[0])) - Number(!!brandIcon(x[0])))
    .slice(0, 10)
    .map(([t]) => t);

  return (
    <section id="approach" aria-labelledby="approach-title" className="scroll-mt-20 py-16 md:py-20">
      <div className={`${container} grid gap-x-12 gap-y-14 xl:grid-cols-12`}>
        <div className="xl:col-span-5">
          <p className="flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-2">
            <span className="h-2 w-2 rounded-full bg-line-red" aria-hidden />
            How I build
          </p>
          <h2
            id="approach-title"
            className="mt-6 text-[clamp(2rem,1.3rem+2vw,2.875rem)] font-bold leading-[1.04] tracking-[-0.035em]"
          >
            {a.title}
            {a.subtitle && <span className="mt-1 block font-normal text-ink-3">{a.subtitle}</span>}
          </h2>
        </div>

        <div className="xl:col-span-7 xl:pt-4">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {a.steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <li key={step.title} className="relative flex flex-col items-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-paper-raised text-ink ring-1 ring-rule">
                    <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
                  </span>
                  <p className="mt-4 text-[0.8125rem] font-bold uppercase tracking-[0.06em]">{step.title}</p>
                  <p className="mt-1 max-w-[13ch] text-[0.875rem] leading-snug text-ink-2">{step.text}</p>
                  {i < a.steps.length - 1 && (
                    <ArrowRight
                      className="absolute -right-3 top-[1.5rem] hidden h-4 w-4 translate-x-1/2 text-ink-3 lg:block"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {tools.length > 0 && (
            <ul className="mt-14 flex flex-wrap gap-2.5" aria-label="Tools I use most">
              {tools.map((t) => {
                const icon = brandIcon(t);
                return (
                  <li key={t} className="tool-chip">
                    {icon && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                        <path d={icon.path} fill={icon.color} />
                      </svg>
                    )}
                    {t}
                  </li>
                );
              })}
              <li>
                <a href="#stack" className="tool-chip hover:text-ink" aria-label="Everything I work with">
                  &hellip;
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Work */

/** The map key: what each mark on a line means. */
function MapKey() {
  const item = 'inline-flex items-center gap-2';
  return (
    <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[0.8125rem] text-ink-2" aria-label="Map key">
      <li className={item}>
        <svg width="34" height="14" aria-hidden className="text-ink">
          <path d="M2 7H32" stroke="rgb(var(--ink-3))" strokeWidth="4" strokeLinecap="round" />
          <circle cx="17" cy="7" r="5" fill="rgb(var(--paper))" stroke="currentColor" strokeWidth="3" />
        </svg>
        A stage in the pipeline
      </li>
      <li className={item}>
        <svg width="34" height="18" aria-hidden>
          <path
            d="M2 9H8L13 3H22L27 9H32M8 9L13 15H22L27 9"
            fill="none"
            stroke="rgb(var(--ink-3))"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        Runs in parallel
      </li>
      <li className={item}>
        <svg width="34" height="18" aria-hidden>
          <path
            d="M2 15H32M9 15V7Q9 3 13 3H21Q25 3 25 7V15"
            fill="none"
            stroke="rgb(var(--ink-3))"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        Loops until it passes
      </li>
      <li className={item}>
        <svg width="14" height="22" aria-hidden>
          <rect x="1" y="1" width="12" height="20" rx="6" fill="rgb(var(--ink))" />
          <circle cx="7" cy="7" r="3" fill="rgb(var(--signal-stop))" />
          <circle cx="7" cy="15" r="3" fill="rgb(var(--signal-go))" opacity="0.3" />
        </svg>
        Waits for a human
      </li>
      <li className={item}>
        <svg width="20" height="18" aria-hidden>
          <path d="M10 1V17" stroke="rgb(var(--ink-3))" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
        Target it has to beat
      </li>
    </ul>
  );
}

export function Work({ projects }: { projects: IProject[] }) {
  const featured = projects.filter((p) => p.featured);
  if (featured.length === 0) {
    return (
      <section id="work" className="scroll-mt-20 border-t border-rule py-24">
        <div className={container}>
          <h2 className={h2}>Work</h2>
          <p className={lead}>New lines are being drawn. Check back soon, or ask me directly.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="scroll-mt-20 border-t border-rule pb-8 pt-20 md:pt-28">
      <div className={container}>
        <div className="flex flex-wrap items-end gap-x-12 gap-y-3">
          <h2 className={h2}>Work</h2>
          <Note arrow="down-left" className="pb-1">each one drawn the way it actually runs</Note>
        </div>
        <p className={lead}>
          Systems I built on my own time. Every stop is a real stage, the numbers come from each repo, and hovering a
          line sends a train down it.
        </p>
        <MapKey />

        <ol className="lines mt-10 divide-y divide-rule md:mt-14">
          {featured.map((p) => {
            const color = lineColorFor(p.slug, projects);
            const facts = (p.metrics || []).slice(0, 4);
            const timed = layoutLine(p.processSteps).timed;
            return (
              <li key={p.slug} data-vt-scope className="line-row grid gap-x-12 gap-y-10 py-14 lg:grid-cols-12 lg:py-20">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-3.5">
                    <RouteBullet title={p.title} color={color} size="lg" vtName />
                    <h3 className="text-[2rem] font-bold leading-none tracking-[-0.03em]">
                      <TransitionLink
                        href={`/projects/${p.slug}`}
                        className="hover:underline hover:decoration-2 hover:underline-offset-4"
                      >
                        <span data-vt-title>{p.title}</span>
                      </TransitionLink>
                    </h3>
                  </div>
                  <p className="mt-3 text-[0.875rem] text-ink-3">
                    {p.year} &middot; {p.tags?.[0] || p.role}
                  </p>
                  <p className="mt-4 max-w-[38ch] text-[1rem] leading-relaxed text-ink-2">{p.summary}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <TransitionLink href={`/projects/${p.slug}`} className="btn-quiet group h-10 px-4 text-sm">
                      Case study
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </TransitionLink>
                    {p.links?.live && <ExternalLink href={p.links.live}>Live demo</ExternalLink>}
                    {p.links?.repository && <ExternalLink href={p.links.repository}>Code</ExternalLink>}
                  </div>
                </div>

                <div className="min-w-0 lg:col-span-8">
                  {timed ? (
                    <RideLine project={p} color={color} />
                  ) : (
                    <RouteDiagram steps={p.processSteps} color={color} />
                  )}
                  {p.note && (
                    <div className="mt-1 flex justify-end pr-2">
                      <Note arrow="up-left">{p.note}</Note>
                    </div>
                  )}
                  {facts.length > 0 && (
                    <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-rule pt-6 sm:grid-cols-4">
                      {facts.map((m) => (
                        <div key={m.label}>
                          <dt className="text-[0.8125rem] leading-snug text-ink-2">{m.label}</dt>
                          <dd
                            className={`num mt-1.5 font-semibold tracking-[-0.01em] ${
                              m.value.length > 14 ? 'text-[1rem] leading-snug' : 'text-[1.375rem]'
                            }`}
                          >
                            <FlapValue value={m.value} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[0.9375rem] font-medium text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
    </a>
  );
}

/* ------------------------------------------------------------------ Smaller builds */

export function Builds({ projects }: { projects: IProject[] }) {
  const rest = projects.filter((p) => !p.featured);
  if (rest.length === 0) return null;

  return (
    <section id="builds" className="scroll-mt-20 pb-24 pt-16 md:pb-32">
      <div className={container}>
        <h2 className="text-[1.5rem] font-bold tracking-[-0.02em]">Smaller builds</h2>
        <ul className="mt-8 grid gap-x-12 gap-y-10 border-t border-rule pt-8 md:grid-cols-3">
          {rest.map((p) => (
            <li key={p.slug} data-vt-scope className="group relative">
              <p className="flex items-baseline gap-2">
                <TransitionLink
                  href={`/projects/${p.slug}`}
                  className="text-[1.0625rem] font-semibold after:absolute after:inset-0 after:content-['']"
                >
                  <span data-vt-title>{p.title}</span>
                </TransitionLink>
                <span className="timetable-leader" aria-hidden />
                <span className="num text-[0.9375rem] text-ink-2">{p.year}</span>
              </p>
              <p className="mt-1 text-[0.875rem] text-ink-3">{p.tags?.[0]}</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{p.summary}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-ink transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                Case study
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Stack */

export function Stack({ skills }: { skills: ISkill[] }) {
  if (!skills.length) return null;
  return (
    <section id="stack" className="scroll-mt-20 border-t border-rule py-20 md:py-24">
      <div className={container}>
        <h2 className={h2}>Everything I work with</h2>
        <dl className="mt-10 grid gap-x-10 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <div key={s.category}>
              <dt className="text-[0.9375rem] font-semibold">{s.category}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{s.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ About */

export function About({ profile }: { profile: IProfile }) {
  const stops = [
    ...(profile.experience || []).map((e) => ({
      when: e.period,
      title: e.role,
      where: [e.company, e.location].filter(Boolean).join(', '),
      detail: e.points,
      now: /present/i.test(e.period),
    })),
    ...(profile.education || []).map((e) => ({
      when: e.period,
      title: e.degree,
      where: e.institution,
      detail: [e.cgpa && `CGPA ${e.cgpa}`, e.coursework && `Coursework: ${e.coursework}`].filter(Boolean) as string[],
      now: false,
    })),
  ];

  return (
    <section id="about" className="scroll-mt-20 border-t border-rule py-24 md:py-32">
      <div className={`${container} grid gap-x-16 gap-y-16 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <h2 className={h2}>About</h2>
          <LineCard profile={profile} />
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink-2 md:text-[1.125rem]">
            {profile.longBio
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
          {profile.designPhilosophy && (
            <div className="mt-10">
              <span className="mb-4 flex h-[18px] w-10 items-center" aria-hidden>
                <span className="h-[5px] w-full rounded-full bg-line-red" />
              </span>
              <p className="text-[1.375rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
                {profile.designPhilosophy}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <h3 className="text-[1.25rem] font-bold tracking-[-0.015em]">Career and education</h3>
          <ol className="relative mt-8">
            <span className="career-rail absolute bottom-3 left-[7px] top-3 w-[5px] rounded-full bg-ink" aria-hidden />
            {stops.map((s, i) => (
              <li key={i} className="relative pb-12 pl-12 last:pb-0">
                <span
                  className={`absolute left-0 top-[0.2rem] h-[19px] w-[19px] rounded-full ${
                    s.now ? 'bg-ink' : 'bg-paper'
                  } shadow-[inset_0_0_0_4.5px_rgb(var(--ink))]`}
                  aria-hidden
                />
                <p className="num text-[0.875rem] text-ink-2">
                  {s.when}
                  {s.now && <span className="ml-2 font-semibold text-ink">Now</span>}
                </p>
                <p className="mt-1 text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em]">{s.title}</p>
                <p className="mt-0.5 text-[0.9375rem] text-ink-2">{s.where}</p>
                {s.detail.length > 0 && (
                  <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                    {s.detail.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          {((profile.achievements?.length ?? 0) > 0 || (profile.certifications?.length ?? 0) > 0) && (
            <div className="mt-14 grid gap-10 border-t border-rule pt-8 sm:grid-cols-2">
              {(profile.achievements?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-[0.9375rem] font-semibold">Hackathons</h4>
                  <ul className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2">
                    {profile.achievements!.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(profile.certifications?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-[0.9375rem] font-semibold">Certifications</h4>
                  <ul className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2">
                    {profile.certifications!.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Contact */

export function Contact({ profile, settings }: { profile: IProfile; settings: ISettings }) {
  const open = settings.hero?.showAvailabilityBadge && profile.availability;

  return (
    <section id="contact" className="scroll-mt-20 border-t border-rule py-24 md:py-36">
      <div className={container}>
        <h2 className={h2}>{open ? 'Hiring for a GenAI role?' : 'Get in touch'}</h2>
        <p className={lead}>{open ? `${profile.availability}. ` : ''}Tell me about the team and the problem.</p>

        <Note arrow="down-right" className="ml-1 mt-10">fastest way to reach me</Note>
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={`mailto:${profile.email}`}
            className="break-all text-[clamp(1.5rem,0.9rem+2.6vw,3.25rem)] font-bold tracking-[-0.03em] underline decoration-rule-strong decoration-2 underline-offset-[0.18em] transition-colors hover:decoration-ink"
          >
            {profile.email}
          </a>
          <CopyEmail email={profile.email} />
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[1rem]">
          {profile.socials?.linkedin && (
            <li>
              <ExternalLink href={profile.socials.linkedin}>LinkedIn</ExternalLink>
            </li>
          )}
          {profile.socials?.github && (
            <li>
              <ExternalLink href={profile.socials.github}>GitHub</ExternalLink>
            </li>
          )}
          {profile.resumeUrl && (
            <li>
              <ExternalLink href={profile.resumeUrl}>Résumé (PDF)</ExternalLink>
            </li>
          )}
          {profile.phone && (
            <li>
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="num text-[0.9375rem] font-medium text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                {profile.phone}
              </a>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Line card */

/** A commuter card for the About section: photo slot, the four line colours, a signature. */
function LineCard({ profile }: { profile: IProfile }) {
  const first = profile.name.split(' ').slice(-2, -1)[0] || profile.name;
  const initials = profile.name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('');
  const since = profile.education?.[0]?.period.match(/\d{4}/)?.[0];
  const handle = profile.socials?.github?.split('/').filter(Boolean).pop();

  return (
    <figure className="line-card mt-10" aria-label={`Card for ${profile.name}`}>
      <div className="flex h-2 overflow-hidden rounded-t-[16px]" aria-hidden>
        <span className="flex-1 bg-line-red" />
        <span className="flex-1 bg-line-blue" />
        <span className="flex-1 bg-line-green" />
        <span className="flex-1 bg-line-amber" />
        <span className="flex-1 bg-line-violet" />
      </div>
      <div className="flex gap-5 p-5">
        <div className="relative grid h-[7.5rem] w-[6rem] shrink-0 place-items-center overflow-hidden rounded-[10px] bg-ink/[0.06]">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={`Portrait of ${profile.name}`} fill sizes="6rem" className="object-cover" />
          ) : (
            <span className="font-hand text-[2rem] text-ink-3" aria-hidden>
              {initials}
            </span>
          )}
        </div>
        <dl className="grid content-start gap-2.5 text-[0.9375rem]">
          <div>
            <dt className="text-[0.75rem] text-ink-3">Holder</dt>
            <dd className="font-semibold leading-snug">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-[0.75rem] text-ink-3">Line</dt>
            <dd className="leading-snug">{profile.role}</dd>
          </div>
          <div className="flex gap-6">
            <div>
              <dt className="text-[0.75rem] text-ink-3">Base</dt>
              <dd>{profile.location.split(',')[0]}</dd>
            </div>
            {since && (
              <div>
                <dt className="text-[0.75rem] text-ink-3">Since</dt>
                <dd className="num">{since}</dd>
              </div>
            )}
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-rule-strong px-5 py-2.5">
        {handle && <span className="font-mono text-[0.75rem] text-ink-3">No. {handle}</span>}
        <span className="font-hand text-[1.625rem] leading-none text-ink" aria-hidden>
          {first}
        </span>
      </div>
    </figure>
  );
}
