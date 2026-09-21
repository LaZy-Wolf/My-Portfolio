import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import { Profile, type IProfile } from '@/models/Profile';
import { Project, type IProject } from '@/models/Project';
import { Skill, type ISkill } from '@/models/Skill';
import { Settings, type ISettings } from '@/models/Settings';
import {
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
  fallbackSettings,
} from '@/lib/fallbackData';
import { HomeClient } from '@/components/home/HomeClient';

export async function generateMetadata(): Promise<Metadata> {
  let settings = fallbackSettings;
  let profile = fallbackProfile;

  try {
    await connectDB();
    const [dbSettings, dbProfile] = await Promise.all([
      Settings.findById('main').lean(),
      Profile.findById('main').lean(),
    ]);
    if (dbSettings) settings = dbSettings as unknown as ISettings;
    if (dbProfile) profile = dbProfile as unknown as IProfile;
  } catch (err) {
    console.warn('Metadata generation using fallback:', err);
  }

  const title = settings?.seo?.title || `${profile.name} // Systems Architecture & Design`;
  const description = settings?.seo?.description || profile.shortBio;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: settings?.seo?.ogImageUrl ? [settings.seo.ogImageUrl] : [],
    },
  };
}

export default async function HomePage() {
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
    if (dbProjects && dbProjects.length > 0)
      projects = JSON.parse(JSON.stringify(dbProjects));
    if (dbSkills && dbSkills.length > 0)
      skills = JSON.parse(JSON.stringify(dbSkills));
    if (dbSettings) settings = JSON.parse(JSON.stringify(dbSettings));
  } catch (err) {
    console.warn('Failed to query DB for HomePage, using fallback dataset:', err);
  }

  return (
    <HomeClient
      profile={profile}
      projects={projects}
      skills={skills}
      settings={settings}
    />
  );
}
