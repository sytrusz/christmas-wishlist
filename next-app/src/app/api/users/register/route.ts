import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { purgeOldDemoData } from '@/lib/demo';

export async function POST(request: Request) {
  try {
    await purgeOldDemoData();
    const body = await request.json();
    const { fullName, category } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ message: 'Full name is required' }, { status: 400 });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ message: 'Valid category is required' }, { status: 400 });
    }

    const trimmedName = fullName.trim();

    const existing = await db.user.findUnique({
      where: { fullName: trimmedName },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'User with this name already exists' },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        fullName: trimmedName,
        category: category,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
