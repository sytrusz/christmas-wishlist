import { NextResponse } from 'next/server';

export interface AuthUser {
  username: string;
  role: 'ADMIN' | 'USER';
}

export function verifyAuth(request: Request): AuthUser | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, ...passwordParts] = decoded.split(':');
    const password = passwordParts.join(':');

    const expectedUserPassword = process.env.USER_PASSWORD || 'user';
    const expectedAdminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (username === 'admin' && password === expectedAdminPassword) {
      return { username: 'admin', role: 'ADMIN' };
    }
    if (username === 'user' && password === expectedUserPassword) {
      return { username: 'user', role: 'USER' };
    }
    return null;
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Christmas Wishlist"',
      },
    }
  );
}
