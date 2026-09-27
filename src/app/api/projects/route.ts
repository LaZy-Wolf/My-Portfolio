import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { fallbackProjects } from '@/lib/fallbackData';
import { requireAdminSession } from '@/lib/checkAuth';
import { slugify } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    let query = {};
    if (!includeAll || !session) {
      query = { status: 'published' };
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
    if (!projects || projects.length === 0) {
      return NextResponse.json(fallbackProjects);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.warn('MongoDB query failed in /api/projects GET, using fallback:', error);
    return NextResponse.json(fallbackProjects);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    await connectDB();
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let slug = body.slug ? slugify(body.slug) : slugify(body.title);
    // Ensure slug uniqueness
    const existing = await Project.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const highestOrder = await Project.findOne().sort({ order: -1 }).select('order').lean();
    const newOrder = (highestOrder?.order ?? 0) + 1;

    const project = await Project.create({
      ...body,
      slug,
      order: body.order ?? newOrder,
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
