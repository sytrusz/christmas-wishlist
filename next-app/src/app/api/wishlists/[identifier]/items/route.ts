import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { isDemoMode, isProtectedDemoWishlist } from '@/lib/demo';

export async function POST(
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
    const { itemName, description, shopLink, groupNumber } = body;

    if (!itemName || !itemName.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

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
        { error: 'Cannot add items to default demo wishlists in demo mode.' },
        { status: 403 }
      );
    }

    const item = await db.wishlistItem.create({
      data: {
        itemName: itemName.trim(),
        description: description ? description.trim() : null,
        shopLink: shopLink ? shopLink.trim() : null,
        groupNumber: groupNumber ? Number(groupNumber) : 1,
        wishlistId: wishlist.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}
