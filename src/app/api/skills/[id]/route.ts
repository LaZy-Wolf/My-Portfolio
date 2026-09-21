import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Skill } from '@/models/Skill';
import { requireAdminSession } from '@/lib/checkAuth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();

    const updated = await Skill.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Skill category not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update skill';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  const { id } = await params;

  try {
    await connectDB();
    const deleted = await Skill.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Skill category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Skill category deleted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete skill';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
