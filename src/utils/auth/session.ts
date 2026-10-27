'use server';

import { cookies } from 'next/headers';

export async function setSessionToken(token: string | null) {
  const cookieStore = await cookies();
  if (!token) {
    cookieStore.delete('token');
    return;
  }
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
}
