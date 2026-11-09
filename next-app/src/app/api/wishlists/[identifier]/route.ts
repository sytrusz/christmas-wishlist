import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { isDemoMode, isProtectedDemoWishlist } from '@/lib/demo';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { identifier } = await params;

    let wishlist = await db.wishlist.findUnique({
      where: { uniqueSlug: identifier },
      include: {
        items: {
          orderBy: [
            { groupNumber: 'asc' },
            { id: 'asc' },
          ],
        },
      },
    });

    if (!wishlist && !isNaN(Number(identifier))) {
      wishlist = await db.wishlist.findUnique({
        where: { id: parseInt(identifier, 10) },
        include: {
          items: {
            orderBy: [
              { groupNumber: 'asc' },
              { id: 'asc' },
            ],
          },
        },
      });
    }

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { identifier } = await params;
    const body = await request.json();
    const { note, groupNotes } = body;

    let wishlist = await db.wishlist.findUnique({
      where: { uniqueSlug: identifier },
    });

    if (!wishlist && !isNaN(Number(identifier))) {
      wishlist = await db.wishlist.findUnique({
        where: { id: parseInt(identifier, 10) },
      });
    }

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    if (isDemoMode() && isProtectedDemoWishlist(wishlist.uniqueSlug)) {
      return NextResponse.json(
        { error: 'Default demo wishlists cannot be modified in demo mode.' },
        { status: 403 }
      );
    }

    const updated = await db.wishlist.update({
      where: { id: wishlist.id },
      data: {
        ...(note !== undefined ? { note: note ? note.trim() : null } : {}),
        ...(groupNotes !== undefined
          ? { groupNotes: typeof groupNotes === 'string' ? groupNotes : JSON.stringify(groupNotes) }
          : {}),
      },
      include: {
        items: {
          orderBy: [
            { groupNumber: 'asc' },
            { id: 'asc' },
          ],
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { identifier } = await params;

    let wishlist = await db.wishlist.findUnique({
      where: { uniqueSlug: identifier },
    });

    if (!wishlist && !isNaN(Number(identifier))) {
      wishlist = await db.wishlist.findUnique({
        where: { id: parseInt(identifier, 10) },
      });
    }

    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    if (isDemoMode() && isProtectedDemoWishlist(wishlist.uniqueSlug)) {
      return NextResponse.json(
        { error: 'Default demo wishlists cannot be deleted in demo mode.' },
        { status: 403 }
      );
    }

    await db.wishlist.delete({
      where: { id: wishlist.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    return NextResponse.json({ error: 'Failed to delete wishlist' }, { status: 500 });
  }
}
