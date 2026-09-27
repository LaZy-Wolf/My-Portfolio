import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Settings } from '@/models/Settings';
import { fallbackSettings } from '@/lib/fallbackData';
import { requireAdminSession } from '@/lib/checkAuth';

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findById('main').lean();
    if (!settings) {
      return NextResponse.json(fallbackSettings);
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.warn('MongoDB query failed in /api/settings GET, using fallback:', error);
    return NextResponse.json(fallbackSettings);
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    await connectDB();
    const body = await req.json();

    const updated = await Settings.findByIdAndUpdate(
      'main',
      { ...body, _id: 'main', updatedAt: new Date() },
      { new: true, upsert: true }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
