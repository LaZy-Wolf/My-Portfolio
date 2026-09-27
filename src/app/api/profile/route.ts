import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Profile } from '@/models/Profile';
import { fallbackProfile } from '@/lib/fallbackData';
import { requireAdminSession } from '@/lib/checkAuth';

export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findById('main').lean();
    if (!profile) {
      return NextResponse.json(fallbackProfile);
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.warn('MongoDB connection failed in /api/profile GET, using fallback:', error);
    return NextResponse.json(fallbackProfile);
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    await connectDB();
    const body = await req.json();
    const updated = await Profile.findByIdAndUpdate(
      'main',
      { ...body, _id: 'main', updatedAt: new Date() },
      { new: true, upsert: true }
    );
    revalidatePath('/', 'layout');
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
