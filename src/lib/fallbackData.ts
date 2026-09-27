import type { IProfile } from '@/models/Profile';
import type { IProject } from '@/models/Project';
import type { ISkill } from '@/models/Skill';
import type { ISettings } from '@/models/Settings';
import content from '@/content/portfolio.json';

// Same file the seed script writes to MongoDB, so the offline fallback never drifts from the DB seed.
export const fallbackProfile = content.profile as IProfile;
export const fallbackProjects = content.projects as IProject[];
export const fallbackSkills = content.skills as ISkill[];
export const fallbackSettings = content.settings as ISettings;
