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
    const wishlists = await db.wishlist.findMany({
      where: { category: category.toUpperCase() },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(wishlists);
  } catch (error) {
    console.error('Error fetching wishlists by category:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlists' }, { status: 500 });
  }
}
