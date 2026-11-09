import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { purgeOldDemoData } from '@/lib/demo';
import { randomBytes } from 'crypto';

function generateSlug(ownerName: string): string {
  const base = ownerName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const suffix = randomBytes(3).toString('hex');
  return `${base || 'wishlist'}-${suffix}`;
}

export async function GET(request: Request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    await purgeOldDemoData();
    const wishlists = await db.wishlist.findMany({
      include: {
        items: {
          orderBy: [
            { groupNumber: 'asc' },
            { id: 'asc' },
          ],
        },
      },
      orderBy: [
        { category: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(wishlists);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlists' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    await purgeOldDemoData();
    const body = await request.json();
    const { ownerName, note, category, items, groupNotes } = body;

    if (!ownerName || !ownerName.trim()) {
      return NextResponse.json({ message: 'Owner name is required' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ message: 'Category is required' }, { status: 400 });
    }

    // Generate unique slug
    let uniqueSlug = generateSlug(ownerName);
    while (await db.wishlist.findUnique({ where: { uniqueSlug } })) {
      uniqueSlug = generateSlug(ownerName);
    }

    const validItems = Array.isArray(items)
      ? items
          .filter((item: { itemName?: string }) => item.itemName && item.itemName.trim())
          .map((item: { itemName: string; description?: string; shopLink?: string; groupNumber?: number }) => ({
            itemName: item.itemName.trim(),
            description: item.description ? item.description.trim() : null,
            shopLink: item.shopLink ? item.shopLink.trim() : null,
            groupNumber: item.groupNumber ? Number(item.groupNumber) : 1,
          }))
      : [];

    const wishlist = await db.wishlist.create({
      data: {
        ownerName: ownerName.trim(),
        note: note ? note.trim() : null,
        category: category,
        groupNotes: groupNotes ? (typeof groupNotes === 'string' ? groupNotes : JSON.stringify(groupNotes)) : null,
        uniqueSlug,
        items: {
          create: validItems,
        },
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

    return NextResponse.json(wishlist, { status: 201 });
  } catch (error) {
    console.error('Error creating wishlist:', error);
    return NextResponse.json({ error: 'Failed to create wishlist' }, { status: 500 });
  }
}
