import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { requireAdminSession } from '@/lib/checkAuth';

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response!;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File exceeds maximum free-tier limit of 5MB' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF, SVG' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    // Check if Cloudinary is configured with real credentials
    if (!cloudName || !apiKey || cloudName === 'demo' || apiKey === '123456789012345') {
      // In local dev without Cloudinary keys, return data URL or placeholder notice
      console.warn('Cloudinary not configured with real API keys. Returning data URL for local preview.');
      return NextResponse.json({
        secure_url: base64Data,
        public_id: `local-${Date.now()}`,
        notice: 'Using local buffer preview. Configure real Cloudinary keys in .env.local for permanent CDN hosting.',
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: 'portfolionow',
      resource_type: 'image',
    });

    return NextResponse.json({
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Image upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
