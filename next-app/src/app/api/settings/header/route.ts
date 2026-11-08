import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

const HEADER_KEY = 'header_title';
const DEFAULT_HEADER = 'Christmas Wishlist 2026';

export async function GET(request: Request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: HEADER_KEY },
    });

    return NextResponse.json({
      value: setting ? setting.value : DEFAULT_HEADER,
    });
  } catch (error) {
    console.error('Error fetching header setting:', error);
    return NextResponse.json({ value: DEFAULT_HEADER });
  }
}

export async function PUT(request: Request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { value } = body;

    const setting = await db.siteSetting.upsert({
      where: { key: HEADER_KEY },
      update: { value: value || DEFAULT_HEADER },
      create: { key: HEADER_KEY, value: value || DEFAULT_HEADER },
    });

    return NextResponse.json({ value: setting.value });
  } catch (error) {
    console.error('Error updating header setting:', error);
    return NextResponse.json({ error: 'Failed to update header setting' }, { status: 500 });
  }
}
