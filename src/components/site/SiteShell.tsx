import Link from 'next/link';
import type { ReactNode } from 'react';
import type { IProfile } from '@/models/Profile';
import type { IProject } from '@/models/Project';
import type { ISettings } from '@/models/Settings';
import { lineColorFor } from '@/lib/lines';
import { SiteHeader } from './SiteHeader';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AssistantOrb } from '@/components/ai/AssistantOrb';
import { TransitionDone } from './TransitionLink';

export const container = 'mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-10';

interface SiteShellProps {
  profile: IProfile;
  settings: ISettings;
  projects: IProject[];
  children: ReactNode;
}

/** Header, footer, search palette and AI chat shared by every public page. */
export function SiteShell({ profile, settings, projects, children }: SiteShellProps) {
  const aiOn = Boolean(settings.ai?.enabled);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-palette rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-lg focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-[4.75rem]"
      >
        Skip to content
      </a>
      <TransitionDone />
      <SiteHeader name={profile.name} />
      <main id="main">{children}</main>
      <footer className="border-t border-rule">
        <div className={`${container} flex flex-col gap-4 py-10 text-[0.875rem] text-ink-2 md:flex-row md:items-center md:justify-between`}>
          <p className="max-w-[40rem] leading-relaxed">
            &copy; {new Date().getFullYear()} {profile.name}. Designed and built in {profile.location.split(',')[0] || 'Hyderabad'}, set in
            Archivo with notes in Kalam.{' '}
            {settings.footer?.text && <span className="text-ink-3">{settings.footer.text}</span>}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {profile.socials?.github && (
              <li>
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  GitHub
                </a>
              </li>
            )}
            {profile.socials?.linkedin && (
              <li>
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  LinkedIn
                </a>
              </li>
            )}
            <li className="text-ink-3">Next.js and MongoDB</li>
            {settings.footer?.showAdminLink && (
              <li>
                <Link href="/admin" className="hover:text-ink">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </footer>

      <CommandPalette
        projects={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          keywords: [...(p.techStack || []), ...(p.tags || [])].join(' '),
          color: lineColorFor(p.slug, projects),
        }))}
        email={profile.email}
        github={profile.socials?.github}
        linkedin={profile.socials?.linkedin}
        resumeUrl={profile.resumeUrl}
        assistantEnabled={aiOn}
      />
      {aiOn && (
        <AssistantOrb greeting={settings.ai.greeting} fallbackMessage={settings.ai.fallbackMessage} />
      )}
    </>
  );
}
