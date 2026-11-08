import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { category } = await params;
    const users = await db.user.findMany({
      where: { category: category.toUpperCase() },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users by category:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
