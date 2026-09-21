import { connectDB } from '@/lib/db';
import { Skill } from '@/models/Skill';
import { fallbackSkills } from '@/lib/fallbackData';
import { SkillsManager } from '@/components/admin/SkillsManager';

export default async function AdminSkillsPage() {
  let skills = fallbackSkills;

  try {
    await connectDB();
    const docs = await Skill.find().sort({ order: 1 }).lean();
    if (docs && docs.length > 0) {
      skills = JSON.parse(JSON.stringify(docs));
    }
  } catch (error) {
    console.warn('Failed to load skills from DB, using fallback:', error);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-telemetry-border pb-4">
        <span className="telemetry-tag text-signal">
          [ TECHNICAL TAXONOMY // SKILLS ]
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Skills & Core Competencies
        </h1>
        <p className="text-xs font-mono text-telemetry-muted">
          Manage categorized technical stacks, engineering methodologies, and the public moving marquee items.
        </p>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
