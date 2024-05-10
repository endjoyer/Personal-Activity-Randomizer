import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

export async function loader(request: NextRequest) {
  const cookies = request.headers.get('Cookie');
  if (!cookies) {
    throw redirect('/login');
  }

  const token = cookies.split(';').find((c) => c.trim().startsWith('token='));
  if (!token) {
    throw redirect('/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token.split('=')[1], secret);
    return new Response(null);
  } catch (error) {
    throw redirect('/login');
  }
}
