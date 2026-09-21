import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      ),
    };
  }
  return { authorized: true, session };
}
