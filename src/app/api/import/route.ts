import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Profile } from '@/models/Profile';
import { Project } from '@/models/Project';
import { Skill } from '@/models/Skill';
import { Settings } from '@/models/Settings';
import { requireAdminSession } from '@/lib/checkAuth';

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    const payload = await req.json();

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    await connectDB();

    // 1. Restore Profile if provided
    if (payload.profile) {
      const { _id, ...rest } = payload.profile;
      await Profile.findByIdAndUpdate(
        'main',
        { ...rest, _id: 'main', updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    // 2. Restore Projects if provided
    if (Array.isArray(payload.projects) && payload.projects.length > 0) {
      await Project.deleteMany({});
      const cleanProjects = payload.projects.map((p: Record<string, unknown>) => {
        // Strip _id to allow clean new ObjectIds or preserve if valid
        const { _id, ...rest } = p;
        return rest;
      });
      await Project.insertMany(cleanProjects);
    }

    // 3. Restore Skills if provided
    if (Array.isArray(payload.skills) && payload.skills.length > 0) {
      await Skill.deleteMany({});
      const cleanSkills = payload.skills.map((s: Record<string, unknown>) => {
        const { _id, ...rest } = s;
        return rest;
      });
      await Skill.insertMany(cleanSkills);
    }

    // 4. Restore Settings if provided
    if (payload.settings) {
      const { _id, ...rest } = payload.settings;
      await Settings.findByIdAndUpdate(
        'main',
        { ...rest, _id: 'main', updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({
      message: 'PORTFOLIO TELEMETRY RESTORED SUCCESSFULLY',
      restoredAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Restore failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
