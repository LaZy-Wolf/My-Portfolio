import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { fallbackProjects } from '@/lib/fallbackData';
import { requireAdminSession } from '@/lib/checkAuth';
import mongoose from 'mongoose';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;

  try {
    await connectDB();

    let project = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id).lean();
    }
    if (!project) {
      project = await Project.findOne({ slug: id }).lean();
    }

    if (!project) {
      const fallback = fallbackProjects.find((p) => p.slug === id || p._id === id);
      if (fallback) return NextResponse.json(fallback);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    const fallback = fallbackProjects.find((p) => p.slug === id || p._id === id);
    if (fallback) return NextResponse.json(fallback);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();

    let query: Record<string, unknown> = { slug: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    }

    const updated = await Project.findOneAndUpdate(
      query,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  const { id } = await params;

  try {
    await connectDB();

    let query: Record<string, unknown> = { slug: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    }

    const deleted = await Project.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
