import { db } from '@/lib/db';

export const PROTECTED_DEMO_SLUGS = [
  'alex-doe-demo',
  'charlie-demo',
  'buddy-demo',
];

export const PROTECTED_DEMO_USERS = [
  'Alex Doe',
  'Sam Smith',
  'Charlie',
  'Buddy',
];

export function isDemoMode(): boolean {
  return process.env.IS_DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_IS_DEMO_MODE === 'true';
}

export function isProtectedDemoWishlist(slugOrId: string | number): boolean {
  if (!isDemoMode()) return false;
  if (typeof slugOrId === 'string') {
    return PROTECTED_DEMO_SLUGS.includes(slugOrId) || slugOrId.endsWith('-demo');
  }
  return false;
}

export function isProtectedDemoUser(name: string): boolean {
  if (!isDemoMode()) return false;
  return PROTECTED_DEMO_USERS.includes(name);
}

// Throttle auto-purge to run at most once every 60 seconds
let lastCleanupTime = 0;
const CLEANUP_THROTTLE_MS = 60 * 1000;
const TTL_MINUTES = 5;

export async function purgeOldDemoData(): Promise<void> {
  if (!isDemoMode()) return;

  const now = Date.now();
  if (now - lastCleanupTime < CLEANUP_THROTTLE_MS) {
    return;
  }
  lastCleanupTime = now;

  try {
    const cutoffDate = new Date(now - TTL_MINUTES * 60 * 1000);

    // 1. Delete user-created wishlists older than TTL_MINUTES (cascade deletes their items)
    await db.wishlist.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        uniqueSlug: {
          notIn: PROTECTED_DEMO_SLUGS,
        },
      },
    });

    // 2. Delete user-created users older than TTL_MINUTES
    await db.user.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        fullName: {
          notIn: PROTECTED_DEMO_USERS,
        },
      },
    });
  } catch (error) {
    console.error('Demo auto-purge error:', error);
  }
}
