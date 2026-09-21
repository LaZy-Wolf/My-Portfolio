import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Profile } from '@/models/Profile';
import { Project } from '@/models/Project';
import { Skill } from '@/models/Skill';
import { Settings } from '@/models/Settings';
import { requireAdminSession } from '@/lib/checkAuth';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    await connectDB();

    const [profile, projects, skills, settings] = await Promise.all([
      Profile.findById('main').lean(),
      Project.find().lean(),
      Skill.find().lean(),
      Settings.findById('main').lean(),
    ]);

    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile: profile || null,
      projects: projects || [],
      skills: skills || [],
      settings: settings || null,
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="portfolio-telemetry-backup-${Date.now()}.json"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Export failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
