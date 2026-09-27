import type { Metadata } from 'next';
import { Fragment, type ReactNode } from 'react';
import { connectDB } from '@/lib/db';
import { Profile, type IProfile } from '@/models/Profile';
import { Project, type IProject } from '@/models/Project';
import { Skill, type ISkill } from '@/models/Skill';
import { Settings, type ISettings } from '@/models/Settings';
import { fallbackProfile, fallbackProjects, fallbackSkills, fallbackSettings } from '@/lib/fallbackData';
import { SiteShell } from '@/components/site/SiteShell';
import { About, Approach, Builds, Contact, Hero, Industry, Stack, Work } from '@/components/site/HomeSections';

export const revalidate = 60;

async function getData() {
  let profile: IProfile = fallbackProfile;
  let projects: IProject[] = fallbackProjects;
  let skills: ISkill[] = fallbackSkills;
  let settings: ISettings = fallbackSettings;

  try {
    await connectDB();
    const [dbProfile, dbProjects, dbSkills, dbSettings] = await Promise.all([
      Profile.findById('main').lean(),
      Project.find({ status: 'published' }).sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Settings.findById('main').lean(),
    ]);
    if (dbProfile) profile = JSON.parse(JSON.stringify(dbProfile));
    if (dbProjects?.length) projects = JSON.parse(JSON.stringify(dbProjects));
    if (dbSkills?.length) skills = JSON.parse(JSON.stringify(dbSkills));
    if (dbSettings) settings = JSON.parse(JSON.stringify(dbSettings));
  } catch (err) {
    console.warn('Home page is using the bundled content; database unavailable:', err);
  }

  return { profile, projects, skills, settings };
}

export async function generateMetadata(): Promise<Metadata> {
  const { profile, settings } = await getData();
  const title = settings.seo?.title || `${profile.name}, ${profile.role}`;
  const description = settings.seo?.description || profile.shortBio;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      ...(settings.seo?.ogImageUrl ? { images: [settings.seo.ogImageUrl] } : {}),
    },
  };
}

export default async function HomePage() {
  const { profile, projects, skills, settings } = await getData();

  const sections: Record<string, ReactNode> = {
    hero: <Hero profile={profile} settings={settings} projects={projects} />,
    industry: <Industry profile={profile} />,
    approach: <Approach settings={settings} projects={projects} />,
    'featured-projects': <Work projects={projects} />,
    projects: <Builds projects={projects} />,
    skills: <Stack skills={skills} />,
    about: <About profile={profile} />,
    contact: <Contact profile={profile} settings={settings} />,
  };

  // Admin controls which sections show and in what order.
  const configured = [...(settings.sections || [])].sort((a, b) => a.order - b.order);
  const order = configured.length ? configured : Object.keys(sections).map((id) => ({ id, visible: true }));

  return (
    <SiteShell profile={profile} settings={settings} projects={projects}>
      {order.filter((s) => s.visible && sections[s.id]).map((s) => (
        <Fragment key={s.id}>{sections[s.id]}</Fragment>
      ))}
    </SiteShell>
  );
}
