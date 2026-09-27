import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Skill } from '@/models/Skill';
import { fallbackSkills } from '@/lib/fallbackData';
import { requireAdminSession } from '@/lib/checkAuth';

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ order: 1 }).lean();
    if (!skills || skills.length === 0) {
      return NextResponse.json(fallbackSkills);
    }
    return NextResponse.json(skills);
  } catch (error) {
    console.warn('MongoDB query failed in /api/skills GET, using fallback:', error);
    return NextResponse.json(fallbackSkills);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    await connectDB();
    const body = await req.json();

    if (!body.category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const highest = await Skill.findOne().sort({ order: -1 }).select('order').lean();
    const order = (highest?.order ?? 0) + 1;

    const skill = await Skill.create({
      ...body,
      order: body.order ?? order,
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(skill, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create skill';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
