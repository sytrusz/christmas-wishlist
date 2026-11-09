import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { isDemoMode, isProtectedDemoWishlist } from '@/lib/demo';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    if (isDemoMode()) {
      const existing = await db.wishlistItem.findUnique({
        where: { id: itemId },
        include: { wishlist: true },
      });
      if (existing && isProtectedDemoWishlist(existing.wishlist.uniqueSlug)) {
        return NextResponse.json(
          { error: 'Default demo items cannot be modified in demo mode.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { itemName, description, shopLink, groupNumber } = body;

    const updated = await db.wishlistItem.update({
      where: { id: itemId },
      data: {
        ...(itemName ? { itemName: itemName.trim() } : {}),
        ...(description !== undefined ? { description: description ? description.trim() : null } : {}),
        ...(shopLink !== undefined ? { shopLink: shopLink ? shopLink.trim() : null } : {}),
        ...(groupNumber !== undefined ? { groupNumber: Number(groupNumber) || 1 } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    if (isDemoMode()) {
      const existing = await db.wishlistItem.findUnique({
        where: { id: itemId },
        include: { wishlist: true },
      });
      if (existing && isProtectedDemoWishlist(existing.wishlist.uniqueSlug)) {
        return NextResponse.json(
          { error: 'Default demo items cannot be deleted in demo mode.' },
          { status: 403 }
        );
      }
    }

    await db.wishlistItem.delete({
      where: { id: itemId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
