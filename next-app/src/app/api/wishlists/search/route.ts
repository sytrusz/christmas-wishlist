import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: Request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';

    const wishlists = await db.wishlist.findMany({
      where: {
        ownerName: {
          contains: name,
        },
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(wishlists);
  } catch (error) {
    console.error('Error searching wishlists:', error);
    return NextResponse.json({ error: 'Failed to search wishlists' }, { status: 500 });
  }
}
