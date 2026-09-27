import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { requireAdminSession } from '@/lib/checkAuth';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    const { projectIds } = await req.json();

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: 'projectIds array is required' }, { status: 400 });
    }

    await connectDB();

    const bulkOps = projectIds.map((id: string, index: number) => {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      return {
        updateOne: {
          filter: isObjectId ? { _id: id } : { slug: id },
          update: { $set: { order: index + 1 } },
        },
      };
    });

    await Project.bulkWrite(bulkOps);

    const updatedProjects = await Project.find().sort({ order: 1 }).lean();
    revalidatePath('/', 'layout');
    return NextResponse.json({
      message: 'Projects reordered successfully',
      projects: updatedProjects,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Reordering failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
